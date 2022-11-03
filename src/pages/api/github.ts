import {
  GetRepositoriesAndLabelsResponse,
  RemoveRepositoryLabelResponse,
} from './../../types/github';
import {
  DeleteRepositoriesResponse,
  ErrorResponse,
  GetRepositoriesResponse,
  Labels,
  Repositories,
  Repository,
} from '@/types/github';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import {
  DeletedRecord,
  UpdatedRecord,
  UpdateRepositoryResponse,
} from '../../types/github';
import { RepoOptionValue, Action } from '../../types/select';
import { supabase } from './supabase';

const getRepos = async (octokit: Octokit): Promise<Repositories> => {
  const fetchedRepos: Repositories = [];
  let currentPage = 1;
  let continueFetching = true;

  while (continueFetching) {
    const currentPageFetched =
      await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
        page: currentPage,
      });

    const currentFetchedData: Repositories = currentPageFetched.data;

    fetchedRepos.push(...currentFetchedData);

    if (currentFetchedData.length === 100) {
      currentPage += 1;
    } else {
      continueFetching = false;
    }
  }

  return fetchedRepos;
};
const getLabels = async (
  octokit: Octokit,
  repo: { owner: string; name: string },
): Promise<Labels> => {
  const fetchedLabels: Labels = [];
  let currentPage = 1;
  let continueFetching = true;

  while (continueFetching) {
    const currentPageFetched = await octokit.rest.issues.listLabelsForRepo({
      owner: repo.owner,
      repo: repo.name,
      per_page: 100,
      page: currentPage,
    });
    const currentFetchedData = currentPageFetched.data;

    fetchedLabels.push(...currentFetchedData);

    if (currentFetchedData.length === 100) {
      currentPage += 1;
    } else {
      continueFetching = false;
    }
  }

  return fetchedLabels;
};
const updateReposWithTopics = async (
  octokit: Octokit,
  userId: string,
  topics: string[],
  repos: RepoOptionValue[],
  action: Action,
): Promise<UpdateRepositoryResponse> => {
  const repoTopicDict: UpdateRepositoryResponse = {};
  try {
    for (const { owner, repo } of repos) {
      const { data } = await octokit.rest.repos.getAllTopics({
        repo,
        owner,
      });
      repoTopicDict[repo] = {
        prevTopics: [...data.names],
        topics:
          action == `add`
            ? [...new Set(data.names.concat(topics))]
            : data.names.filter((name) => !topics.includes(name)),
        owner,
      };
    }

    const toReplaceTopics = Object.entries(repoTopicDict).map(
      ([repo, { owner, topics: names, prevTopics }]) =>
        new Promise(async (resolve) => {
          const finishGitHubUpdate = await octokit.rest.repos.replaceAllTopics({
            repo,
            owner,
            names,
          });

          const addedUpdatedRecordToDB = await supabase
            .from<UpdatedRecord>(`UpdatedRecords`)
            .insert({
              repo,
              userId,
              initialRepoDetails: { prevTopics },
              updatedFields: { topics },
            });

          resolve({
            finishGitHubUpdate,
            addedUpdatedRecordToDB,
          });
        }),
    );

    const replacedTopics = await Promise.all(toReplaceTopics);
    console.debug(JSON.stringify(replacedTopics, null, 4));
  } catch (err) {
    console.error(JSON.stringify(err));
    const error = `Error updating topics of ${
      repos.length
    } repos, due to ${JSON.stringify(err)}`;
    throw new Error(error);
  }

  return repoTopicDict;
};
const updateReposWithLabels = async (
  octokit: Octokit,
  userId: string,
  labels: string[],
  repos: RepoOptionValue[],
): Promise<RemoveRepositoryLabelResponse> => {
  const repoDict: RemoveRepositoryLabelResponse = {};
  try {
    for (const { owner, repo } of repos) {
      const repoLabels = await getLabels(octokit, { name: repo, owner });
      const labelNames = repoLabels.map((l) => l.name);
      const newLabels = labelNames.filter(
        (name) => !labels.find((label) => label === name),
      );
      if (newLabels.length !== labelNames.length)
        repoDict[repo] = {
          prevLabels: labelNames,
          labels: newLabels,
          owner,
        };
    }
    const updatePromises = Object.entries(repoDict).map(
      ([repo, { owner, labels: newLabels, prevLabels }]) =>
        new Promise(async (resolve) => {
          const filteredLabels = labels.filter((label) =>
            prevLabels.includes(label),
          );
          const finishGitHubUpdate = await Promise.all(
            filteredLabels.map((name) =>
              octokit.rest.issues.deleteLabel({
                repo,
                owner,
                name,
              }),
            ),
          );
          const addedUpdatedRecordToDB = await supabase
            .from<UpdatedRecord>(`UpdatedRecords`)
            .insert({
              repo,
              userId,
              initialRepoDetails: { prevLabels },
              updatedFields: { labels: newLabels },
            });

          resolve({
            finishGitHubUpdate,
            addedUpdatedRecordToDB,
          });
        }),
    );

    const replacedLabels = await Promise.all(updatePromises);
    console.debug(JSON.stringify(replacedLabels, null, 4));
  } catch (err) {
    console.error(JSON.stringify(err));
    throw new Error((err as Error).message);
  }

  return repoDict;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | ErrorResponse
    | GetRepositoriesResponse
    | GetRepositoriesAndLabelsResponse
    | DeleteRepositoriesResponse
    | UpdateRepositoryResponse
    | RemoveRepositoryLabelResponse
  >,
) {
  const { provider_token } = req.query;

  if (!provider_token) {
    return res.status(400).json({ message: `Provider Token invalid` });
  }

  const octokit = new Octokit({
    auth: provider_token,
  });

  if (req.method === `GET`) {
    if (req.query[`labels`]) {
      const repos: { owner: string; name: string }[] = JSON.parse(
        req.query[`repos`] as string,
      );
      const promises = repos.map((repo) => getLabels(octokit, repo));
      const labelsAndRepos = (await Promise.all(promises)).map(
        (labels, index) => ({ labels, repo: repos[index] }),
      );

      return res.status(200).json({ labelsAndRepos });
    }

    const repos = await getRepos(octokit);

    return res.status(200).json({
      repos,
    });
  } else if (req.method === `PATCH`) {
    const { repos, topics, userId, labels, action } = req.query;

    if (!repos || !userId || (!topics && !labels)) {
      return res.status(400).json({ message: `query parameters missing` });
    }

    try {
      let result;
      if (labels) {
        result = await updateReposWithLabels(
          octokit,
          userId as string,
          Array.isArray(labels) ? labels : labels.split(`,`),
          JSON.parse(repos as string),
        );
      } else {
        if (!action) {
          return res.status(400).json({ message: `action is missing` });
        }

        result = await updateReposWithTopics(
          octokit,
          userId as string,
          JSON.parse(topics as string),
          JSON.parse(repos as string),
          action as Action,
        );
      }
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        message: (err as Error).message,
      });
    }
  } else if (req.method === `DELETE`) {
    const { repos, userId } = req.query;
    if (!repos || !userId) {
      return res.status(400).json({ message: `query parameters missing` });
    }

    const parsedRepos = JSON.parse(repos as string);
    const finalResponseData: DeletedRecord[] = [];
    for (const { owner, repo } of parsedRepos) {
      try {
        const getRepoResponse = await octokit.rest.repos.get({ owner, repo });
        const repoDetails: Repository = getRepoResponse.data;
        const response = await octokit.rest.repos.delete({ owner, repo });

        if (response.status != 204) {
          return res.status(400).json({ message: `Error deleting ${repo}` });
        }

        const { data, error } = await supabase
          .from<DeletedRecord>(`DeletedRecords`)
          .insert([
            {
              repo,
              repoDetails,
              sourceRepo: repoDetails.source?.full_name,
              isFork: repoDetails.fork,
              userId: userId as string,
            },
          ]);

        if (error) {
          console.error(error);
          return res.status(400).json({ message: `Error deleting ${repo}` });
        } else {
          finalResponseData.push(...data);
        }
      } catch (err) {
        console.error(err);
        return res.status(400).json({ message: `Error deleting ${repo}` });
      }
    }

    return res.status(200).json({ data: finalResponseData });
  }
}

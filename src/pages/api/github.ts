import {
  DeleteRepositoriesResponse,
  ErrorResponse,
  GetRepositoriesResponse,
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
import { RepoOptionValue } from '../../types/select';
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

const updateReposWithTopics = async (
  octokit: Octokit,
  userId: string,
  topics: string[],
  repos: RepoOptionValue[],
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
        topics: [...new Set(topics.concat(data.names))], // new topics may overlap with prev topics, so we ensure it to be unique
        owner,
      };
    }

    const toReplaceTopics = Object.entries(repoTopicDict).map(
      ([repo, { owner, topics: names, prevTopics }]) =>
        new Promise(async (resolve, reject) => {
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
    throw new Error(JSON.stringify(err));
  }

  return repoTopicDict;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | ErrorResponse
    | GetRepositoriesResponse
    | DeleteRepositoriesResponse
    | UpdateRepositoryResponse
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
    const repos = await getRepos(octokit);

    return res.status(200).json({
      repos,
    });
  } else if (req.method === `PATCH`) {
    const { repos, topics, userId } = req.query;

    if (!repos || !userId || !topics) {
      return res.status(400).json({ message: `query parameters missing` });
    }

    try {
      const result = await updateReposWithTopics(
        octokit,
        userId as string,
        JSON.parse(topics as string),
        JSON.parse(repos as string),
      );
      return res.status(200).json(result);
    } catch (err) {
      return res.status(400).json({
        message: `Error updating topics of ${
          repos.length
        } repos, due to ${JSON.stringify(err)}`,
      });
    }
  } else if (req.method === `DELETE`) {
    const { selectedRepos, userId } = req.query;
    if (!selectedRepos || !userId) {
      return res.status(400).json({ message: `query parameters missing` });
    }

    const repos = JSON.parse(selectedRepos as string);
    const finalResponseData: DeletedRecord[] = [];

    for (const { owner, repo } of repos) {
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

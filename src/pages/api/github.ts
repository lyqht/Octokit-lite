import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import { definitions } from '../../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ``;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SECRET || ``;
const supabase = createClient(supabaseUrl, supabaseKey);

export type DeletedRecord = definitions['DeletedRecords'];

export type Repository =
  RestEndpointMethodTypes['repos']['get']['response']['data'];

export type Repositories =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'];

export interface GetRepositoriesResponse {
  repos: Repositories;
  forks: Repositories;
  notForks: Repositories;
}

export interface DeleteRepositoriesResponse {
  data: DeletedRecord[];
}

export interface ErrorResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    GetRepositoriesResponse | ErrorResponse | DeleteRepositoriesResponse
  >,
) {
  const { provider_token } = req.query;
  if (!provider_token) {
    return res.status(400);
  }

  const octokit = new Octokit({
    auth: provider_token,
  });

  if (req.method === `GET`) {
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

    const notForks = fetchedRepos.filter((repo) => !repo.fork);
    const forks = fetchedRepos.filter((repo) => repo.fork);

    return res.status(200).json({
      repos: fetchedRepos,
      forks,
      notForks,
    });
  }

  if (req.method === `DELETE`) {
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

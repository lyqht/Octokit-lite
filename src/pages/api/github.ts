import {
  HistoryRecord,
  DeleteRepositoriesResponse,
  GetRepositoriesResponse,
  Repositories,
  Repository,
} from '@/types/github';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';
import { ErrorResponse, supabase } from './supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    GetRepositoriesResponse | ErrorResponse | DeleteRepositoriesResponse
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

    return res.status(200).json({
      repos: fetchedRepos,
    });
  }

  if (req.method === `DELETE`) {
    const { selectedRepos, userId } = req.query;
    if (!selectedRepos || !userId) {
      return res.status(400).json({ message: `query parameters missing` });
    }

    const repos = JSON.parse(selectedRepos as string);
    const finalResponseData: HistoryRecord[] = [];

    for (const { owner, repo } of repos) {
      try {
        const getRepoResponse = await octokit.rest.repos.get({ owner, repo });
        const repoDetails: Repository = getRepoResponse.data;
        const response = await octokit.rest.repos.delete({ owner, repo });

        if (response.status != 204) {
          return res.status(400).json({ message: `Error deleting ${repo}` });
        }

        const { data, error } = await supabase
          .from<HistoryRecord>(`DeletedRecords`)
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

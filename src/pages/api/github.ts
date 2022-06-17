import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

export type Repository =
  RestEndpointMethodTypes['repos']['get']['response']['data'];

export type Repositories =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'];

export interface GetRepositoriesResponse {
  repos: Repositories;
  forks: Repositories;
  notForks: Repositories;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetRepositoriesResponse>,
) {
  const { provider_token } = req.query;
  if (!provider_token) {
    return res.status(400);
  }

  const octokit = new Octokit({
    auth: provider_token,
  });

  const fetchedRepos: Repositories = [];

  let currentPage = 1;
  let continueFetching = true;

  if (req.method === `GET`) {
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
    const { selectedRepos } = req.query;
    if (!selectedRepos) {
      return res.status(400);
    }

    const repos = JSON.parse(selectedRepos as string);

    for await (const { owner, repo } of repos) {
      try {
        const response = await octokit.rest.repos.delete({ owner, repo });
        if (response.status != 204) {
          return res.status(400);
        }
      } catch (err) {
        console.log(err);
      }
    }

    return res.status(204);
  }
}

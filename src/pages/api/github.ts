import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

export type Repository =
  RestEndpointMethodTypes['repos']['get']['response']['data'];

type Repositories =
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

  if (req.method === `GET`) {
    const fetched = await octokit.rest.repos.listForAuthenticatedUser();

    const repos = fetched.data;
    const notForks = repos.filter((repo) => !repo.fork);
    const forks = repos.filter((repo) => repo.fork);

    return res.status(200).json({
      repos,
      forks,
      notForks,
    });
  }

  if (req.method === `DELETE`) {
    console.debug(`DELETING`);
    const { selectedRepos } = req.query;
    if (!selectedRepos) {
      return res.status(400);
    }

    const repos = JSON.parse(selectedRepos as string);
    console.debug({ repos });

    for await (const { owner, repo } of repos) {
      const response = await octokit.rest.repos.delete({ owner, repo });
      if (response.status != 204) {
        console.error({ response });
        return res.status(400);
      }
    }
    return res.status(204);
  }
}

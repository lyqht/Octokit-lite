import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { definitions } from './supabase';

export type HistoryRecord = definitions['DeletedRecords'];

export type Repository =
  RestEndpointMethodTypes['repos']['get']['response']['data'];

export type Repositories =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'];

export interface GetRepositoriesResponse {
  repos: Repositories;
}

export interface DeleteRepositoriesResponse {
  data: HistoryRecord[];
}

export interface ErrorResponse {
  message: string;
}

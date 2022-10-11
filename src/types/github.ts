import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { definitions } from './supabase';

export type DeletedRecord = definitions['DeletedRecords'];
export type UpdatedRecord = definitions['UpdatedRecords'];
export type HistoryRecord = DeletedRecord | UpdatedRecord;

export type Repository =
  RestEndpointMethodTypes['repos']['get']['response']['data'];

export type Repositories =
  RestEndpointMethodTypes['repos']['listForAuthenticatedUser']['response']['data'];

export type Labels =
  RestEndpointMethodTypes['issues']['listLabelsForRepo']['response']['data'];

export interface GetRepositoriesResponse {
  repos: Repositories;
}
export interface GetRepositoriesAndLabelsResponse {
  labelsAndRepos: { repo: { owner: string; name: string }; labels: Labels }[];
}
export interface DeleteRepositoriesResponse {
  data: DeletedRecord[];
}

export type UpdateRepositoryResponse = Record<
  string,
  { prevTopics: string[]; topics: string[]; owner: string }
>;

export type RemoveRepositoryLabelResponse = Record<
  string,
  { prevLabels: string[]; labels: string[]; owner: string }
>;

export interface ErrorResponse {
  message: string;
}

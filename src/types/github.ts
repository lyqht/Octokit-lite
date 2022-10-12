import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods';
import { Database } from './supabase';

export type DeletedRecord =
  Database['public']['Tables']['DeletedRecords']['Row'];

export type InitialRepoDetails = {
  prevTopics?: string[];
  prevLabels?: string[];
};
export type UpdatedFields = {
  topics?: string[];
  labels?: string[];
};

export type UpdatedRecord =
  Database['public']['Tables']['UpdatedRecords']['Row'] & {
    initialRepoDetails: InitialRepoDetails;
    updatedFields: UpdatedFields;
  };
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

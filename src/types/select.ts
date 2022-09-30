export type RepoOptionValue = {
  owner: string;
  repo: string;
};

export interface RepoMetadata {
  topics?: string[];
  lastPushDate?: string;
  fork: boolean;
}

export interface RepoOption extends Option {
  readonly value: RepoOptionValue;
  readonly metadata?: RepoMetadata;
  readonly label: string;
  readonly index?: number;
}

export interface Option {
  readonly value: any;
  readonly label: string;
  readonly metadata?: any;
}

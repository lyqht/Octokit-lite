export type RepoOptionValue = {
  owner: string;
  repo: string;
};

export interface RepoMetadata {
  topics?: string[];
  labels?: string[];
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

export interface GroupedOption {
  readonly label: string;
  readonly options: RepoOption[];
}

export enum SortOrder {
  'descending',
  'ascending',
}
export type Filters = Partial<Record<keyof RepoMetadata, SortOrder | null>>;
export type GroupFilters = Record<number, Filters>;

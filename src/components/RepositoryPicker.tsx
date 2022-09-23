import { Repository } from '@/types/github';
import { ReactElement } from 'react';
import Select, { ActionMeta, GroupBase, MultiValue } from 'react-select';

type OptionValue = {
  owner: string;
  repo: string;
};

export interface Option {
  readonly value: OptionValue;
  readonly label: string;
}

export interface GroupedOption {
  readonly label: string;
  readonly options: Option[];
}

interface Props {
  options: GroupedOption[];
  onChange: (value: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
}

const formatGroupLabel = (data: GroupBase<Option>): ReactElement => (
  <div className="flex items-center justify-between">
    <span>{data.label}</span>
    <span className="inline-block bg-gray-200 text-center font-normal leading-none text-gray-800">
      {data.options.length}
    </span>
  </div>
);

const formatOptionLabel = (data: Option): ReactElement => (
  <div className="prose-base text-zinc-600">
    <span>{data.label}</span>
  </div>
);

export const createGroupedOptions = (data: Repository[]) => [
  {
    label: `Forked`,
    options: data
      .filter((repo) => repo.fork)
      .map((repo) => ({
        value: { owner: repo.owner.login, repo: repo.name },
        label: repo.name,
      })),
  },
  {
    label: `Original`,
    options: data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        value: { owner: repo.owner.login, repo: repo.name },
        label: repo.name,
      })),
  },
];

const RepositoryPicker: React.FC<Props> = ({ options, onChange }) => (
  <Select<Option, true>
    className="dropdown w-full"
    isClearable
    isMulti
    defaultMenuIsOpen
    name="selected-repositories"
    options={options}
    onChange={onChange}
    formatGroupLabel={formatGroupLabel}
    formatOptionLabel={formatOptionLabel}
  />
);

export default RepositoryPicker;

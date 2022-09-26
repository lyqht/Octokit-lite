import RepositoryPicker, {GroupedOption, Option} from '@/components/RepositoryPicker';
import { Repository } from '@/types/github';
import { ReactElement } from 'react';
import { ActionMeta, GroupBase, MultiValue } from 'react-select';

const formatGroupLabel = (data: GroupBase<Option>): ReactElement => (
  <div className="flex flex-row items-center justify-between text-gray-400">
    <span>{data.label}</span>
    <span className="inline-block rounded-sm bg-gray-200 p-1 px-3 text-center font-normal leading-none">
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
    label: `Repos you created`,
    options: data
      .filter((repo) => !repo.fork)
      .map((repo) => ({
        value: { owner: repo.owner.login, repo: repo.name },
        label: repo.name,
      })),
  },
  {
    label: `Repos you forked`,
    options: data
      .filter((repo) => repo.fork)
      .map((repo) => ({
        value: { owner: repo.owner.login, repo: repo.name },
        label: repo.name,
      })),
  },
];

interface Props {
  options: GroupedOption[];
  onChange: (value: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
}


const TopicSpaceRepositoryPicker: React.FC<Props> = ({ options, onChange }) => (
  <RepositoryPicker
    options={options}
    onChange={onChange}
    formatGroupLabel={formatGroupLabel}
    formatOptionLabel={formatOptionLabel}
  />
);

export default TopicSpaceRepositoryPicker;

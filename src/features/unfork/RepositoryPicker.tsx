import RepositoryPicker, {
  DownshiftSelectProps,
  GroupedOption,
} from '@/components/RepositoryPicker';
import { Repository } from '@/types/github';
import { RepoOption } from '@/types/select';
import { UseSelectGetItemPropsOptions } from 'downshift';

export const renderGroupedOptions = (
  groupedOptions: GroupedOption[],
  getItemProps: (options: UseSelectGetItemPropsOptions<RepoOption>) => any,
  selectedItems: RepoOption[] | null,
) => {
  const options = groupedOptions
    .map((groupedOption) => groupedOption.options)
    .flat();
  return groupedOptions.map((group) => (
    <div key={`group-${group.label}`}>
      <div className="flew-row flex items-center  bg-slate-600 px-4 py-2 text-white">
        <span className="w-1/2">
          {group.label}
          <p className="badge-slate-700 badge m-1">{group.options.length}</p>
        </span>
        <p className="w-1/2">| Last Push</p>
      </div>
      {group.options.map((item, index) => (
        <li
          className={`
          ${
            selectedItems?.findIndex(
              (selectedItem) => selectedItem.label === item.label,
            ) != -1
              ? `bg-slate-700 hover:bg-slate-800`
              : `bg-zinc-700 hover:bg-zinc-800`
          }
           prose-base flex
          cursor-pointer flex-row
          items-center justify-between py-2
          px-3
          shadow-sm
          `}
          key={`option-${item.label}-${index}`}
          {...getItemProps({
            item,
            index: options.findIndex((a) => a.label === item.label),
          })}
        >
          <span className="w-1/2 text-sm text-white">{item.label}</span>
          <div className="w-1/2">
            {item.metadata?.lastPushDate && (
              <p className="text-sm text-white">{item.metadata.lastPushDate}</p>
            )}
          </div>
        </li>
      ))}
    </div>
  ));
};

export const createGroupedOptions = (
  options: RepoOption[],
): GroupedOption[] => [
  {
    label: `Repos you forked`,
    options: options.filter((option) => option.metadata?.fork),
  },
  {
    label: `Repos you created`,
    options: options.filter((option) => !option.metadata?.fork),
  },
];

export const createOptions = (data: Repository[]): RepoOption[] =>
  data.map((repo) => ({
    value: { owner: repo.owner.login, repo: repo.name },
    label: repo.name,
    metadata: {
      fork: repo.fork,
      ...(repo.pushed_at && { lastPushDate: repo.pushed_at }),
    },
  }));

interface Props extends DownshiftSelectProps {
  data: Repository[];
}

const UnforkRepositoryPicker: React.FC<Props> = ({ data, ...props }) => (
  <RepositoryPicker
    options={createOptions(data)}
    createGroupedOptions={createGroupedOptions}
    renderGroupedOptions={renderGroupedOptions}
    {...props}
  />
);

export default UnforkRepositoryPicker;

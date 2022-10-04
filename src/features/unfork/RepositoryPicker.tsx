import RepositoryPicker, {
  DownshiftSelectProps,
} from '@/components/RepositoryPicker';
import { Repository } from '@/types/github';
import { GroupedOption, RepoOption, SortOrder } from '@/types/select';
import { UseSelectGetItemPropsOptions } from 'downshift';
import React from 'react';
import { GroupFilters } from '../../types/select';

export const renderGroupedOptions = (
  groupedOptions: GroupedOption[],
  getItemProps: (options: UseSelectGetItemPropsOptions<RepoOption>) => any,
  selectedItems: RepoOption[] | null,
  setSortFilters?: (filters: GroupFilters) => void,
  sortFilters?: GroupFilters,
) => {
  const options = groupedOptions
    .map((groupedOption) => groupedOption.options)
    .flat();
  return groupedOptions.map((group, groupIndex) => (
    <div key={`group-${group.label}`}>
      <div className="flew-row flex  h-16 items-center overflow-hidden bg-slate-600 px-4 py-2 text-white">
        <span className="w-1/2">
          {group.label}
          <p className="badge-slate-700 badge m-1">{group.options.length}</p>
        </span>
        <div className="-ml-2 flex w-1/2 flex-row items-center border-l-2 border-white px-2">
          <p>Last Push</p>
          <div className="mx-4 flex flex-col">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className={`-mb-1 w-4 cursor-pointer fill-white hover:fill-slate-500 ${
                sortFilters &&
                sortFilters[groupIndex]?.lastPushDate == 0 &&
                `fill-slate-800`
              }`}
              onClick={() =>
                setSortFilters?.({
                  [groupIndex]: { lastPushDate: SortOrder.ascending },
                })
              }
            >
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              className={`-mt-1 w-4 rotate-180 cursor-pointer fill-white hover:fill-slate-500 ${
                sortFilters &&
                sortFilters[groupIndex]?.lastPushDate == 1 &&
                `fill-slate-800`
              }`}
              onClick={() =>
                setSortFilters?.({
                  [groupIndex]: { lastPushDate: SortOrder.descending },
                })
              }
            >
              <path d="M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z" />
            </svg>
          </div>
        </div>
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

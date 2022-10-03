import RepositoryPicker, {
  DownshiftSelectProps,
  GroupedOption,
} from '@/components/RepositoryPicker';
import { Repository } from '@/types/github';
import { RepoOption } from '@/types/select';
import { group } from 'console';
import { UseSelectGetItemPropsOptions } from 'downshift';
import React from 'react';


export const renderGroupedOptions = (
  groupedOptions: GroupedOption[],
  getItemProps: (options: UseSelectGetItemPropsOptions<RepoOption>) => any,
  selectedItems: RepoOption[] | null,
) => {
  const options = groupedOptions
    .map((groupedOption) => groupedOption.options)
    .flat();
  function sortGroupAscending(groupLabel: string) {
    if (groupLabel === `Repos you forked`) {
      groupedOptions[0].options.sort((a, b) => {
        const x = a.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        const y = b.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        return (x.localeCompare(y))
      });
    }
    else if(groupLabel === `Repos you created`) {
      groupedOptions[1].options.sort((a, b) => {
        const x:string = a.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        const y = b.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        return (x.localeCompare(y))
      });
    }
  }
  function sortGroupDescending(groupLabel: string) {
    if (groupLabel === `Repos you forked`) {
      groupedOptions[0].options.sort((a, b) => {
        const x = a.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        const y = b.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        return (y.localeCompare(x))
      });
    }
    else if(groupLabel === `Repos you created`) {
      groupedOptions[1].options.sort((a, b) => {
        const x = a.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        const y = b.metadata?.lastPushDate || `1900-04-10T10:20:30Z`;
        return (y.localeCompare(x))
      });
    }
  }
  return groupedOptions.map((group) => (
    <div key={`group-${group.label}`}>
      <div className="flew-row overflow-hidden  flex h-16 items-center bg-slate-600 px-4 py-2 text-white">
        <span className="w-1/2">
          {group.label}
          <p className="badge-slate-700 badge m-1">{group.options.length}</p>
        </span>
        <p className="w-1/2">| Last Push</p>
        <div className='... peer -ml-16 -mr-8'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className=" -ml-12 w-4 cursor-pointer hover:fill-slate-900"
            fill="white"
            viewBox="0 0 320 512"
          >
            <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
          </svg>
        </div>
        <div className="z-10  rounded-md bg-white text-slate-800 invisible hover:visible transition peer-hover:visible">
          <div className='hover:bg-slate-500 px-2 hover:text-white rounded-t-md cursor-pointer' onClick={()=>sortGroupAscending(group.label)}>
            <p>Ascending</p>
          </div>
          <div className='h-0.5  bg-slate-700'></div>
          <div className='hover:bg-slate-500 px-2 hover:text-white rounded-b-md cursor-pointer' onClick={()=>sortGroupDescending(group.label)}>
            <p>Descending</p>
          </div>
        </div>
      </div>
      {group.options.map((item, index) => (
        <li
          className={`
          ${selectedItems?.findIndex(
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

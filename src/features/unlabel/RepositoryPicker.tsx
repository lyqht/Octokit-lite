import RepositoryPicker, {
  DownshiftSelectProps,
} from '@/components/RepositoryPicker';
import { server } from '@/config';
import {
  GetRepositoriesAndLabelsResponse,
  Labels,
  Repositories,
} from '@/types/github';
import { GroupedOption, RepoOption } from '@/types/select';
import { UseSelectGetItemPropsOptions } from 'downshift';
import { useEffect, useRef, useState } from 'react';

export const renderGroupedOptions = (
  groupedOptions: GroupedOption[],
  getItemProps: (options: UseSelectGetItemPropsOptions<RepoOption>) => any,
  selectedItems: RepoOption[] | null,
) => {
  const options = groupedOptions
    .map((groupedOption) => groupedOption.options)
    .flat();
  return groupedOptions.map((group, groupIndex) =>
    group.options.length > 0 ? (
      <div key={`group-${group.label}-${groupIndex}`}>
        <div className="flew-row flex items-center bg-slate-600 px-4 py-2 text-white">
          <span className="w-1/2">
            {group.label}
            <p className="badge-slate-500 badge m-1">{group.options.length}</p>
          </span>
          <p className="w-1/2">| Labels</p>
        </div>
        {group.options.map((item, index) => (
          <li
            key={`option-${item.label}-${index}`}
            className={`prose-base flex cursor-pointer flex-row items-center justify-between py-2 px-3 shadow-sm 
            ${
              selectedItems?.findIndex(
                (selectedItem) => selectedItem.label === item.label,
              ) != -1
                ? `bg-slate-700 hover:bg-slate-800`
                : `bg-zinc-700 hover:bg-zinc-800`
            }`}
            {...getItemProps({
              item,
              index: options.findIndex((a) => a.label === item.label),
            })}
          >
            <span className="w-1/2 text-sm text-white">{item.label}</span>
            <div className="w-1/2">
              {item.metadata?.labels && item.metadata?.labels.length > 0 ? (
                item.metadata?.labels.map((label, i) => (
                  <p
                    key={`label-${label}-${i}`}
                    className="badge-neutral-content badge badge-outline m-0 mr-1"
                  >
                    {label}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white">
                  {!item.metadata?.labels
                    ? `Loading labels...`
                    : `No labels found for this repo`}
                </p>
              )}
            </div>
          </li>
        ))}
      </div>
    ) : (
      <></>
    ),
  );
};

type RepoLabelOption = {
  repo: Repositories[number];
  labels: Labels | null;
};
export const createGroupedOptions = (
  options: RepoOption[],
): GroupedOption[] => [
  {
    label: `Repos you created`,
    options: options.filter((option) => !option.metadata?.fork),
  },
  {
    label: `Repos you forked`,
    options: options.filter((option) => option.metadata?.fork),
  },
];

export const createOptions = (data: RepoLabelOption[]): RepoOption[] =>
  data.map(({ repo, labels }) => ({
    value: { owner: repo.owner.login, repo: repo.name },
    label: repo.name,
    metadata: {
      labels: labels?.map((label) => label.name),
      fork: repo.fork,
      ...(repo.topics && { topics: repo.topics }),
    },
  }));

interface Props extends DownshiftSelectProps {
  data: Repositories;
  providerToken: string;
}

const UnlabelRepositoryPicker: React.FC<Props> = ({
  data,
  providerToken,
  ...props
}) => {
  const fetching = useRef(false);
  const [optionsData, setOptionsData] = useState<RepoLabelOption[]>(
    data.map((repo) => ({ repo, labels: null })),
  );
  useEffect(() => {
    if (fetching.current) return;
    (async () => {
      fetching.current = true;
      const labelsFromRepos = await fetch(
        `${server}/api/github?provider_token=${providerToken}&repos=${JSON.stringify(
          data.map((repo) => ({ owner: repo.owner.login, name: repo.name })),
        )}&labels=true`,
      );
      const { labelsAndRepos }: GetRepositoriesAndLabelsResponse =
        await labelsFromRepos.json();
      setOptionsData((prev) => {
        const newState = prev.map((item) => {
          const foundLabelsToRepo = labelsAndRepos.find(
            (labelRepo) =>
              labelRepo.repo.name === item.repo.name &&
              labelRepo.repo.owner === item.repo.owner.login,
          );
          if (foundLabelsToRepo)
            return { labels: foundLabelsToRepo.labels, repo: item.repo };
          return item;
        });
        return newState;
      });
      fetching.current = false;
    })();
  }, [data, providerToken]);

  return (
    <RepositoryPicker
      options={createOptions(optionsData)}
      createGroupedOptions={createGroupedOptions}
      renderGroupedOptions={renderGroupedOptions}
      {...props}
    />
  );
};

export default UnlabelRepositoryPicker;

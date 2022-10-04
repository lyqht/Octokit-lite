import RepositoryPicker, {
  DownshiftSelectProps,
} from '@/components/RepositoryPicker';
import { Repository } from '@/types/github';
import { GroupedOption, RepoOption } from '@/types/select';
import { UseSelectGetItemPropsOptions } from 'downshift';

const sortCount = { fork: 0, create: 0 };

export const renderGroupedOptions = (
  groupedOptions: GroupedOption[],
  getItemProps: (options: UseSelectGetItemPropsOptions<RepoOption>) => any,
  selectedItems: RepoOption[] | null,
) => {
  const sortGroup = (groupLabel: string) => {
    console.log(`sorting`);
    console.log(sortCount.create);
    if (groupLabel === `Repos you forked`) {
      sortCount.fork++;
      groupedOptions[1].options.sort((a, b) => {
        const issueA = a.metadata?.issues ? a.metadata?.issues : 0;
        const issueB = b.metadata?.issues ? b.metadata?.issues : 0;
        if (sortCount.fork % 2 == 0) return issueA - issueB;
        else return issueB - issueA;
      });
    }
    if (groupLabel == `Repos you created`) {
      sortCount.create++;
      groupedOptions[0].options.sort((a, b) => {
        const issueA = a.metadata?.issues ? a.metadata?.issues : 0;
        const issueB = b.metadata?.issues ? b.metadata?.issues : 0;
        if (sortCount.create % 2 == 0) return issueA - issueB;
        else return issueB - issueA;
      });
    }
  };
  // console.log(groupedOptions)
  const options = groupedOptions
    .map((groupedOption) => groupedOption.options)
    .flat();
  return groupedOptions.map((group, groupIndex) =>
    group.options.length > 0 ? (
      <div key={`group-${group.label}-${groupIndex}`}>
        <div className="flew-row z-1 flex items-center bg-slate-600 px-4 py-2 text-white">
          <span className="w-1/2">
            {group.label}
            <p className="badge-slate-500 badge m-1">{group.options.length}</p>
          </span>
          <p className="w-1/4">| Topics</p>
          <p className="w-1/4">| Issues</p>
          {/* <div className='relative'> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="... peer ml-auto mr-2 w-4 cursor-pointer hover:fill-slate-900"
            fill="white"
            viewBox="0 0 320 512"
            onClick={() => sortGroup(group.label)}
          >
            <path d="M137.4 41.4c12.5-12.5 32.8-12.5 45.3 0l128 128c9.2 9.2 11.9 22.9 6.9 34.9s-16.6 19.8-29.6 19.8H32c-12.9 0-24.6-7.8-29.6-19.8s-2.2-25.7 6.9-34.9l128-128zm0 429.3l-128-128c-9.2-9.2-11.9-22.9-6.9-34.9s16.6-19.8 29.6-19.8H288c12.9 0 24.6 7.8 29.6 19.8s2.2 25.7-6.9 34.9l-128 128c-12.5 12.5-32.8 12.5-45.3 0z" />
          </svg>
        </div>
        {/* </div> */}
        {/* </div> */}
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
            <div className="w-1/4">
              {item.metadata?.topics && item.metadata?.topics.length > 0 ? (
                item.metadata?.topics.map((topic, i) => (
                  <p
                    key={`topic-${topic}-${i}`}
                    className="badge-neutral-content badge badge-outline m-0 mr-1"
                  >
                    {topic}
                  </p>
                ))
              ) : (
                <p className="text-sm text-white">
                  No topics found for this repo
                </p>
              )}
            </div>
            <div className="w-1/4">
              {item.metadata?.issues ? (
                <p>{item.metadata.issues}</p>
              ) : (
                <p className="text-sm text-white">
                  No issues found for this repo
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

export const createOptions = (data: Repository[]): RepoOption[] =>
  data.map((repo) => ({
    value: { owner: repo.owner.login, repo: repo.name },
    label: repo.name,
    metadata: {
      fork: repo.fork,
      ...(repo.topics && { topics: repo.topics }),
      ...(repo.has_issues && { issues: repo.open_issues_count }),
    },
  }));

interface Props extends DownshiftSelectProps {
  data: Repository[];
}

const TopicSpaceRepositoryPicker: React.FC<Props> = ({ data, ...props }) => (
  <RepositoryPicker
    options={createOptions(data)}
    createGroupedOptions={createGroupedOptions}
    renderGroupedOptions={renderGroupedOptions}
    {...props}
  />
);

export default TopicSpaceRepositoryPicker;

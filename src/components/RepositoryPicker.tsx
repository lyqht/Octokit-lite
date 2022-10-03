import {
  GroupedOption,
  GroupFilters,
  Option,
  RepoMetadata,
  RepoOption,
  SortOrder,
} from '@/types/select';
import {
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
  UseMultipleSelectionGetDropdownProps,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import OptionPicker, { getFilteredItems } from './OptionPicker';

const RepositoryPicker: React.FC<Props> = ({
  options,
  createGroupedOptions,
  renderGroupedOptions,
  getSelectedItemProps,
  getDropdownProps,
  removeSelectedItem,
  selectedItems,
  setSelectedItems,
}) => {
  const [inputValue, setInputValue] = useState<string>(``);
  const [sortFilters, setSortFilters] = useState<GroupFilters>({});
  const createFilteredGroupedOptions = () =>
    createGroupedOptions(options).map((groupedOption) => ({
      ...groupedOption,
      options: getFilteredItems(
        groupedOption.options,
        selectedItems,
        inputValue,
      ),
    }));

  const [groupedOptions, setGroupedOptions] = useState(
    createFilteredGroupedOptions(),
  );

  const sortGroup = (
    index: number,
    filterType: keyof RepoMetadata,
    filterValue: SortOrder | null,
  ) => {
    const updatedGroupOptions = [...groupedOptions];
    updatedGroupOptions[index].options.sort((a: RepoOption, b: RepoOption) => {
      if (filterType == `lastPushDate`) {
        const x = a.metadata?.[filterType] || `1900-04-10T10:20:30Z`;
        const y = b.metadata?.[filterType] || `1900-04-10T10:20:30Z`;

        if (filterValue == SortOrder.ascending) {
          return x.localeCompare(y);
        } else if (filterValue == SortOrder.descending) {
          return y.localeCompare(x);
        }
      }

      // for future filter types
      return 0;
    });

    setGroupedOptions(updatedGroupOptions);
  };
  const updateFilters = (filters: GroupFilters) => {
    setSortFilters({ ...sortFilters, ...filters });
  };

  useEffect(() => {
    setGroupedOptions(createFilteredGroupedOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options), inputValue, JSON.stringify(selectedItems)]);

  useEffect(() => {
    Object.entries(sortFilters).forEach(([groupIndex, filters]) => {
      Object.entries(filters).forEach(([filterType, filterValue]) => {
        sortGroup(
          parseInt(groupIndex),
          filterType as keyof RepoMetadata,
          filterValue,
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(sortFilters)]);

  const items = useMemo(
    () =>
      getFilteredItems(
        groupedOptions.map((groupedOption) => groupedOption.options).flat(),
        selectedItems,
        inputValue,
      ),
    [selectedItems, inputValue, groupedOptions],
  );

  const props = {
    options: items,
    inputValue,
    setInputValue,
    groupedOptions,
    renderGroupedOptions,
    setSortFilters: updateFilters,
    sortFilters,
    getSelectedItemProps,
    getDropdownProps,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
  };

  return <OptionPicker {...props} />;
};

export interface DownshiftSelectProps {
  getSelectedItemProps: (
    options: UseMultipleSelectionGetSelectedItemPropsOptions<Option>,
  ) => any;
  getDropdownProps: (
    options?: UseMultipleSelectionGetDropdownProps,
    extraOptions?: GetPropsCommonOptions,
  ) => any;
  removeSelectedItem: (item: Option) => void;
  selectedItems: Option[];
  setSelectedItems: (options: Option[]) => void;
}

interface Props extends DownshiftSelectProps {
  options: Option[];
  createGroupedOptions: (options: Option[]) => GroupedOption[];
  renderGroupedOptions: (
    groupedOptions: GroupedOption[],
    getItemProps: (options: UseComboboxGetItemPropsOptions<Option>) => any,
    selectedItems: Option[] | null,
  ) => ReactElement[];
}

export default RepositoryPicker;

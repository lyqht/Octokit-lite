import { Option } from '@/types/select';
import {
  GetPropsCommonOptions,
  UseComboboxGetItemPropsOptions,
  UseMultipleSelectionGetDropdownProps,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';
import { ReactElement, useMemo, useState, useEffect } from 'react';
import { RepoOption } from '../types/select';
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

  useEffect(() => {
    setGroupedOptions(createFilteredGroupedOptions());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(options), inputValue, JSON.stringify(selectedItems)]);

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
    setGroupedOptions,
    getSelectedItemProps,
    getDropdownProps,
    removeSelectedItem,
    selectedItems,
    setSelectedItems,
  };

  return <OptionPicker {...props} />;
};

export interface GroupedOption {
  readonly label: string;
  readonly options: RepoOption[];
}

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
    setGroupedOptions: (options: GroupedOption[]) => void,
  ) => ReactElement[];
}

export default RepositoryPicker;

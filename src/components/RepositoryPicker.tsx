import {
  GetPropsCommonOptions,
  useCombobox,
  UseComboboxGetItemPropsOptions,
  UseMultipleSelectionGetDropdownProps,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';
import { ReactElement, useMemo, useState } from 'react';

function getFilteredItems(
  options: Option[],
  selectedItems: Option[],
  inputValue: string,
) {
  return options.filter(
    (option) =>
      !selectedItems.includes(option) &&
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
}

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
  const groupedOptions = createGroupedOptions(options).map((groupedOption) => ({
    ...groupedOption,
    options: getFilteredItems(groupedOption.options, selectedItems, inputValue),
  }));
  const items = useMemo(
    () =>
      getFilteredItems(
        groupedOptions.map((groupedOption) => groupedOption.options).flat(),
        selectedItems,
        inputValue,
      ),
    [selectedItems, inputValue],
  );

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    setHighlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items,
    itemToString(item) {
      return item ? item.label : ``;
    },
    defaultHighlightedIndex: 0,
    selectedItem: null,
    stateReducer(state, actionAndChanges) {
      const { changes, type } = actionAndChanges;

      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            ...(changes.selectedItem && { isOpen: true }),
          };
        default:
          return changes;
      }
    },
    onStateChange({
      inputValue: newInputValue,
      type,
      selectedItem: newSelectedItem,
    }) {
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (newSelectedItem) {
            const indexOfSelectedItem = selectedItems.findIndex(
              (item) => item.label === newSelectedItem.label,
            );
            if (indexOfSelectedItem == -1) {
              setSelectedItems([...selectedItems, newSelectedItem]);
            } else {
              const updatedItems = [...selectedItems];
              updatedItems.splice(indexOfSelectedItem, 1);
              setSelectedItems(updatedItems);
            }
            setHighlightedIndex(
              items.findIndex((item) => item.label === newSelectedItem.label),
            );
          }
          break;

        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(newInputValue!);
          break;

        default:
          break;
      }
    },
  });

  return (
    <div className="relative w-full">
      <div
        className="flex w-full grow flex-row flex-wrap items-center gap-1 rounded-lg border-2 bg-white p-1.5 shadow-sm"
        {...getToggleButtonProps()}
      >
        {selectedItems.map((selectedItem, index) => {
          return (
            <span
              className="rounded-full bg-slate-500 p-1 px-2 text-sm text-white shadow-md"
              key={`selected-item-${index}-${selectedItem.label}`}
              {...getSelectedItemProps({
                selectedItem,
                index,
              })}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {selectedItem.label}
              <button
                className="cursor-pointer px-1"
                onClick={() => {
                  removeSelectedItem(selectedItem);
                }}
              >
                &#10005;
              </button>
            </span>
          );
        })}
        <div className="w-full" {...getComboboxProps()}>
          <input
            placeholder="Type a repository name"
            className="input m-1 w-full bg-white"
            {...getInputProps({
              ...getDropdownProps({ preventKeyAction: isOpen }),
            })}
          />
        </div>
      </div>
      <ul
        {...getMenuProps({ onMouseLeave: () => setHighlightedIndex(0) })}
        className={`
        ${!isOpen && `hidden`} 
        absolute max-h-80 w-full overflow-scroll rounded-lg bg-white 
        shadow-lg scrollbar scrollbar-track-slate-700
         scrollbar-thumb-white scrollbar-track-rounded  scrollbar-thumb-rounded-lg`}
      >
        {isOpen &&
          renderGroupedOptions(groupedOptions, getItemProps, selectedItems)}
      </ul>
    </div>
  );
};

export type OptionValue = {
  owner: string;
  repo: string;
};

export interface Metadata {
  topics?: string[];
  lastPushDate?: string;
  fork: boolean;
}

export interface Option {
  readonly value: OptionValue;
  readonly label: string;
  readonly metadata?: Metadata;
  readonly index?: number;
}

export interface GroupedOption {
  readonly label: string;
  readonly options: Option[];
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
  ) => ReactElement[];
}

export default RepositoryPicker;

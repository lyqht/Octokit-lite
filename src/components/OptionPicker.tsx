import { Option } from '@/types/select';
import {
  GetPropsCommonOptions,
  useCombobox,
  UseComboboxGetItemPropsOptions,
  UseMultipleSelectionGetDropdownProps,
  UseMultipleSelectionGetSelectedItemPropsOptions,
} from 'downshift';
import { ReactElement } from 'react';
import { GroupedOption } from './RepositoryPicker';

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

export interface GroupedOptionPickerProps extends DownshiftSelectProps {
  groupedOptions?: GroupedOption[];
  renderGroupedOptions?: (
    groupedOptions: GroupedOption[],
    getItemProps: (options: UseComboboxGetItemPropsOptions<Option>) => any,
    selectedItems: Option[] | null,
  ) => ReactElement[];
}

export interface UngroupedOptionPickerProps extends DownshiftSelectProps {
  renderOptions?: (
    options: Option[],
    getItemProps: (options: UseComboboxGetItemPropsOptions<Option>) => any,
    selectedItems: Option[] | null,
  ) => ReactElement;
}

export interface OptionPickerProps
  extends GroupedOptionPickerProps,
    UngroupedOptionPickerProps {
  inputValue: string;
  options: Option[];
  setInputValue: (s: string) => void;
  inputPlaceholderText?: string;
}

const OptionPicker: React.FC<OptionPickerProps> = ({
  options,
  renderOptions,
  groupedOptions,
  renderGroupedOptions,
  setInputValue,
  inputPlaceholderText = `Type a repository name`,
  getSelectedItemProps,
  getDropdownProps,
  removeSelectedItem,
  selectedItems,
  setSelectedItems,
}) => {
  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    setHighlightedIndex,
    getItemProps,
  } = useCombobox({
    items: options,
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
              options.findIndex((item) => item.label === newSelectedItem.label),
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

  const renderItems = () => {
    if (renderGroupedOptions && groupedOptions) {
      return renderGroupedOptions(groupedOptions, getItemProps, selectedItems);
    } else {
      return renderOptions?.(options, getItemProps, selectedItems);
    }
  };

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
            placeholder={inputPlaceholderText}
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
          absolute z-20 max-h-60 w-full overflow-scroll rounded-lg bg-white
          shadow-lg scrollbar scrollbar-track-slate-700
           scrollbar-thumb-white scrollbar-track-rounded  scrollbar-thumb-rounded-lg`}
      >
        {isOpen && renderItems()}
      </ul>
    </div>
  );
};

export default OptionPicker;

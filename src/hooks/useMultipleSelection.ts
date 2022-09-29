import { useMultipleSelection as useDownshiftMultipleSelection } from 'downshift';
import { RepoOption } from '@/components/OptionPicker';

interface Props {
  selectedItems: any[];
  setSelectedItems: (items: any[]) => void;
}

export const useMultipleSelection = ({
  selectedItems,
  setSelectedItems,
}: Props) =>
  useDownshiftMultipleSelection<RepoOption>({
    selectedItems,
    onStateChange({ selectedItems: newSelectedItems, type }) {
      switch (type) {
        case useDownshiftMultipleSelection.stateChangeTypes
          .SelectedItemKeyDownBackspace:
        case useDownshiftMultipleSelection.stateChangeTypes
          .SelectedItemKeyDownDelete:
        case useDownshiftMultipleSelection.stateChangeTypes
          .DropdownKeyDownBackspace:
        case useDownshiftMultipleSelection.stateChangeTypes
          .FunctionRemoveSelectedItem:
          setSelectedItems(newSelectedItems!);
          break;
        default:
          break;
      }
    },
  });

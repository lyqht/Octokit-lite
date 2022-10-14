import OptionPicker, { OptionPickerProps } from '@/components/OptionPicker';
import { UseComboboxGetItemPropsOptions } from 'downshift';
import { Option } from '@/types/select';

const renderOptions = (
  options: Option[],
  getItemProps: (options: UseComboboxGetItemPropsOptions<Option>) => any,
  selectedItems: Option[] | null,
) => {
  return (
    <div>
      {options.map((item, index) => (
        <li
          className={`prose-base flex cursor-pointer flex-row items-center justify-between py-2 px-3 shadow-sm
          ${
            selectedItems?.findIndex(
              (selectedItem) => selectedItem.label === item.label,
            ) != -1
              ? `bg-slate-700 hover:bg-slate-800`
              : `bg-zinc-700 hover:bg-zinc-800`
          }`}
          key={`option-${item.label}-${index}`}
          {...getItemProps({
            item,
            index: options.findIndex((a) => a.label === item.label),
          })}
        >
          <span className="text-sm text-white">{item.label}</span>
        </li>
      ))}
    </div>
  );
};

export const defaultLabels = [
  `hacktoberfest`,
  `best-first-issue`,
  `css3`,
  `bug`,
  `design`,
  `html`,
  `javascript`,
  `python`,
  `challenge`,
];
export const defaultLabelOptions = defaultLabels.map((item) => ({
  label: item,
  value: item,
}));

const LabelPicker: React.FC<OptionPickerProps> = ({ ...props }) => (
  <OptionPicker
    isCreateable={true}
    renderOptions={renderOptions}
    inputPlaceholderText={`Type a label`}
    {...props}
  />
);

export default LabelPicker;

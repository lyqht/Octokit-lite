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
          <span className="text-sm text-white">{item.label}</span>
        </li>
      ))}
    </div>
  );
};

export const defaultTopics = [
  `hacktoberfest`,
  `react`,
  `vue`,
  `typescript`,
  `html`,
  `css3`,
  `javascript`,
  `python`,
  `challenge`,
].sort();
export const defaultTopicOptions = defaultTopics.map((item) => ({
  label: item,
  value: item,
}));

const TopicPicker: React.FC<OptionPickerProps> = ({ ...props }) => (
  <OptionPicker
    renderOptions={renderOptions}
    inputPlaceholderText={`Type a topic`}
    {...props}
  />
);

export default TopicPicker;

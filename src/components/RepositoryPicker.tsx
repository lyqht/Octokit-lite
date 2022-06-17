import { CSSProperties, ReactNode } from 'react';
import Select, { ActionMeta, GroupBase, MultiValue } from 'react-select';

const groupStyles = {
  display: `flex`,
  alignItems: `center`,
  justifyContent: `space-between`,
};
const groupBadgeStyles: CSSProperties = {
  backgroundColor: `#EBECF0`,
  borderRadius: `2em`,
  color: `#172B4D`,
  display: `inline-block`,
  fontSize: 12,
  fontWeight: `normal`,
  lineHeight: `1`,
  minWidth: 1,
  padding: `0.16666666666667em 0.5em`,
  textAlign: `center`,
};

type OptionValue = {
  owner: string;
  repo: string;
};

export interface Option {
  readonly value: OptionValue;
  readonly label: string;
}

export interface GroupedOption {
  readonly label: string;
  readonly options: Option[];
}

interface Props {
  options: GroupedOption[];
  onChange: (value: MultiValue<Option>, actionMeta: ActionMeta<Option>) => void;
}

const formatGroupLabel = (data: GroupBase<Option>): ReactNode => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const RepositoryPicker: React.FC<Props> = ({ options, onChange }) => (
  <Select<Option, true>
    isClearable
    isMulti
    defaultMenuIsOpen
    name="selected-repositories"
    options={options}
    onChange={onChange}
    formatGroupLabel={formatGroupLabel}
  />
);

export default RepositoryPicker;

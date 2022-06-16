import { CSSProperties } from 'react';
import Select from 'react-select';

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

export interface Option {
  readonly value: string;
  readonly label: string;
}

export type ForkedRepoOption = Option;

export type OriginalRepoOption = Option;

export interface GroupedOption {
  readonly label: string;
  readonly options: readonly ForkedRepoOption[] | readonly OriginalRepoOption[];
}

const formatGroupLabel = (data: GroupedOption) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);
const RepositoryPicker = ({ options, onChange }) => (
  <Select
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

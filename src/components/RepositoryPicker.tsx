import { ReactElement } from 'react';
import Select, { ActionMeta, GroupBase, MultiValue } from 'react-select';

export type OptionValue = {
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
  formatGroupLabel: (data: GroupBase<Option>) => ReactElement
  formatOptionLabel: (data: Option) => ReactElement
}


const RepositoryPicker: React.FC<Props> = ({ options, onChange, formatGroupLabel, formatOptionLabel }) => (
  <Select<Option, true>
    className="dropdown w-full"
    isClearable
    isMulti
    name="selected-repositories"
    options={options}
    onChange={onChange}
    formatGroupLabel={formatGroupLabel}
    formatOptionLabel={formatOptionLabel}
    instanceId={`repository-picker`}
  />
);

export default RepositoryPicker;

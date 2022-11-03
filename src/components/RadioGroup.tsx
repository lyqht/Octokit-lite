import { Dispatch, SetStateAction } from 'react';

interface Props {
  states: string[];
  selectedState: string;
  onChange: Dispatch<SetStateAction<string>>;
}

const RadioGroup: React.FC<Props> = ({ states, selectedState, onChange }) => {
  return (
    <div className="flex flex-row gap-8">
      {states.map((state) => (
        <div key={`radio-option-${state}`} className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">{state}</span>
            <input
              type="radio"
              name="radio-10"
              className="radio mx-2 checked:bg-slate-500"
              onChange={() => {
                onChange(state);
              }}
              checked={selectedState === state}
            />
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;

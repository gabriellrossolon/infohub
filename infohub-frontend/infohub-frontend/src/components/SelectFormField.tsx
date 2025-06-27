import React from "react";

interface SelectFormFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

const SelectFormField: React.FC<SelectFormFieldProps> = ({
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <label className="flex flex-col items-start">
      <span className="text-gray-300">{name}</span>
      <select
        value={value}
        onChange={onChange}
        className="text-white/80 py-1 px-2 border-1 rounded-md border-white/50 min-w-[25vw]"
        required
      >
        
        {options.map((option) => (
          <option className="text-black" key={option} value={option}>
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SelectFormField;

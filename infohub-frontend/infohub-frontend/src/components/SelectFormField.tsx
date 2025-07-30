import React from "react";

interface SelectFormFieldProps {
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: (string | { id: number; label: string })[];
}

const SelectFormField: React.FC<SelectFormFieldProps> = ({
  name,
  value,
  onChange,
  options,
}) => {
  return (
    <label className="flex flex-col items-start w-full">
      <span className="text-gray-300">{name}</span>
      <select
        value={value}
        onChange={onChange}
        className="text-white/80 py-1 px-2 border-1 rounded-md border-white/50 w-full bg-black/30"
        required
      >
        <option disabled value="">
          Selecione
        </option>
        {options.map((option, index) => {
          if (typeof option === "string") {
            return (
              <option className="text-black" key={index} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            );
          } else {
            return (
              <option className="text-black" key={option.id} value={option.id}>
                {option.label}
              </option>
            );
          }
        })}
      </select>
    </label>
  );
};

export default SelectFormField;

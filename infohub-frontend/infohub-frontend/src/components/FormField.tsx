interface FormFieldProps {
name: string;
type: string;
placeholder: string;
onChangeFunc?: (e: React.ChangeEvent<HTMLInputElement>) => void;
value: string;
}

const FormField: React.FC<FormFieldProps> = ( { name, type, placeholder, onChangeFunc, value } ) => {
  return (
    <label className="flex flex-col items-start">
      <span className="text-gray-300">{name}:</span>
      <input
        type={type}
        placeholder={placeholder}
        onChange={onChangeFunc}
        value={value}
        required
        className="text-white/80 py-1 px-2 border-1 rounded-md border-white/50 min-w-[25vw]"
      />
    </label>
  );
};

export default FormField;

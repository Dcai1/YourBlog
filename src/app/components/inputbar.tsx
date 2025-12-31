type InputProps = {
  type: string;
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputBar = ({
  type,
  value,
  placeholder,
  onChange,
}: InputProps) => {
  return (
    <input
      className="form-control my-2 shadow"
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
    />
  );
};

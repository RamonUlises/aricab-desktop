export const InputBottom = ({
  placeholder,
  value,
  name,
  type = "text",
  change,
}: {
  placeholder: string;
  value: string;
  name: string;
  type?: string;
  change: (name: string, value: string, type: string) => void;
}) => {
  return (
    <div className="flex flex-col">
      <input
        type="text"
        className="bg-transparent border-b border-black pl-1 outline-none w-52"
        value={value}
        name={name}
        onChange={(e) => change(name, e.target.value, type)}
      />
      <label>{placeholder}</label>
    </div>
  );
};

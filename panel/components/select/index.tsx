import React, { ChangeEventHandler } from "react";

interface IOptions {
  id: string;
  name: string;
}

type InputProps = {
  placeholder?: string;
  label: string;
  value: string;
  name: string;
  helpText?: string | null;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: IOptions[];
  errorMessage?: string;
  initial: IOptions;
};

const SelectForm = ({
  placeholder = "",
  label,
  value,
  name,
  helpText = null,
  onChange,
  options = [],
  errorMessage,
  initial,
}: InputProps) => {
  return (
    <div className="flex flex-wrap -mx-3 mb-6">
      <div className="w-full px-3">
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor={`id-${name}`}
        >
          {label}
        </label>

        <select
          className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id={`id-${name}`}
          placeholder={placeholder}
          value={value}
          name={name}
          onChange={onChange}
        >
          {initial && <option value={initial.id}>{initial.name}</option>}

          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        {errorMessage && (
          <p className="text-red-500 text-xs italic">{errorMessage}</p>
        )}

        {helpText && (
          <p className="text-gray-600 text-xs italic mb-4">{helpText}</p>
        )}
      </div>
    </div>
  );
};

export { SelectForm };

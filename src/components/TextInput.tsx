import type { InputHTMLAttributes } from "react";

const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className="p-2 border rounded w-full"
    {...props}
  />
);

export default TextInput;

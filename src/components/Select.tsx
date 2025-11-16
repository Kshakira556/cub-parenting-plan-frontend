import type { SelectHTMLAttributes, ReactNode } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

const Select = ({ children, ...props }: SelectProps) => (
  <select className="p-2 border rounded w-full" {...props}>
    {children}
  </select>
);

export default Select;

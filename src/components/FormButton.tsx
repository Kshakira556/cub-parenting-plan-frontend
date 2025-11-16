import type { ButtonHTMLAttributes } from "react";

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

const FormButton = ({ loading, children, ...props }: FormButtonProps) => (
  <button
    className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
    disabled={loading}
    {...props}
  >
    {loading ? "Saving..." : children}
  </button>
);

export default FormButton;

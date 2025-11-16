import type { TextareaHTMLAttributes } from "react";

const TextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className="p-2 border rounded w-full" {...props} />
);

export default TextArea;

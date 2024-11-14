import React from "react";

const InputField = ({
  label,
  id,
  type,
  value,
  onChange,
  error,
  placeholder,
}) => (
  <div>
    <label htmlFor={id}>{label}</label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <span className="error-message">{error}</span>}
  </div>
);

export default InputField;

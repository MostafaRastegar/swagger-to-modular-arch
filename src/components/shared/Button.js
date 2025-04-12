// dashboard/src/components/shared/Button.js
import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  icon = null,
  disabled = false,
  onClick,
  className = "",
  ...rest
}) => {
  const baseStyles =
    "rounded-lg flex items-center justify-center font-medium transition-colors";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-green-600 text-white hover:bg-green-700",
  };

  const sizeStyles = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed hover:bg-none";

  const buttonStyles = `
    ${baseStyles} 
    ${variantStyles[variant]} 
    ${sizeStyles[size]} 
    ${disabled ? disabledStyles : ""} 
    ${className}
  `;

  return (
    <button
      className={buttonStyles}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

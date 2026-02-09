import React from "react";

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  full = false,
  icon
}) {
  const baseStyle =
    "rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-1";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  const isDisabled = loading || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${full ? "w-full" : ""}
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98]"}
      `}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}

export default Button;

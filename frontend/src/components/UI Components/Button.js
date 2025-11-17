export default function Button({ 
  children, 
  variant = "primary", 
  size = "medium", 
  onClick, 
  type = "button",
  disabled = false,
  className = ""
}) {
  const baseStyles = "font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-gradient-to-r from-[#6C5CE7] to-[#5B4BCF] text-white hover:shadow-lg hover:scale-105",
    tertiary: "bg-gradient-to-r from-[#00D9C0] to-[#00C4AC] text-white hover:shadow-lg hover:scale-105",
    outline: "border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white",
    danger: "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg",
    success: "bg-green-600 text-white hover:bg-green-700 hover:shadow-lg",
    cancel: "bg-red-600 text-white hover:shadow-lg hover:scale-105"
  };

  const sizes = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}

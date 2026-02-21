const Input = ({ className = '', type = 'text', ...props }) => {
  // Add class to hide number spinners
  const inputType = type === 'number' ? 'text' : type; // Use text for number but handle with pattern? Better to keep type number and style.
  // We'll use CSS to hide spinners globally.
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-chubby border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${className}`}
      {...props}
    />
  );
};

export default Input;
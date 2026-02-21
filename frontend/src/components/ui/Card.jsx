const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-card text-card-foreground rounded-chubby border shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
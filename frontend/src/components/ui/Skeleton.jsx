const Skeleton = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  );
};

export default Skeleton;
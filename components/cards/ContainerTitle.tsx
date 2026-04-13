const ContainerTitleDosen: React.FC<{
  title: string;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, children, className }) => {
  return (
    <div className={`w-full ${className}`}>
      <h1 className="text-primary font-bold text-2xl">{title}</h1>
      {children}
    </div>
  );
};

export default ContainerTitleDosen;

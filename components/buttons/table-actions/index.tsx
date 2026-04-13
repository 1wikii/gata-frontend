interface Props {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
}

export default function tableActions({ onClick, children, className }: Props) {
  return (
    <button
      onClick={onClick}
      className={`${className} p-2 rounded-md bg-secondary border border-black-300 hover:bg-gray-background hover:text-black cursor-pointer`}
    >
      {children}
    </button>
  );
}

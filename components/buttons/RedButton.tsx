import { Button } from "@/components/ui/button";

const RedButton: React.FC<{
  children: React.ReactNode;
  url?: string;
  className?: string;
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}> = ({ children, url, className, props }) => {
  return (
    <>
      {url ? (
        <a href={url}>
          <Button
            className={`px-10 bg-red-500 text-white hover:bg-red-500/80 ${className}`}
            {...props}
          >
            {children}
          </Button>
        </a>
      ) : (
        <Button
          className={`px-10 bg-red-500 text-white hover:bg-red-500/80 ${className}`}
          {...props}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default RedButton;

import { Button } from "@/components/ui/button";

const GreenButton: React.FC<{
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
            className={`px-10 bg-green text-white hover:bg-green/80 ${className}`}
            {...props}
          >
            {children}
          </Button>
        </a>
      ) : (
        <Button
          className={`px-10 bg-green text-white hover:bg-green/80 ${className}`}
          {...props}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default GreenButton;

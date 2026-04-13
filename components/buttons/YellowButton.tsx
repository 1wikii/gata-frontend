import { Button } from "@/components/ui/button";

const YellowButton: React.FC<{
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
            className={`px-10 bg-yellow-500 text-white hover:bg-yellow-500/80 ${className}`}
            {...props}
          >
            {children}
          </Button>
        </a>
      ) : (
        <Button
          className={`px-10 bg-yellow-500 text-white hover:bg-yellow-500/80 ${className}`}
          {...props}
        >
          {children}
        </Button>
      )}
    </>
  );
};

export default YellowButton;

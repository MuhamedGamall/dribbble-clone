import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
className?: string
}

const Container: React.FC<ContainerProps> = ({ children ,className}) => {
  return (
    <div className={cn("max-w-[2520px] mx-auto md:px-5 sm:px-2 px-4",className)}>
      {children}
    </div>
  );
};

export default Container;

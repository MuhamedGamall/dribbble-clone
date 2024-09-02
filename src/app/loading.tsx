import { Spinner } from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner size="lg" />
    </div>
  );
}

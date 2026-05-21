import { Alert, AlertDescription, AlertTitle } from "@/app/_components/ui/alert";

type Props = {
  error: unknown;
};

export function JobDetailsErrorAlert({ error }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 16,
        zIndex: 20,
        maxWidth: 480,
      }}
    >
      <Alert variant="destructive">
        <AlertTitle>Failed to load details</AlertTitle>
        <AlertDescription>{JSON.stringify(error)}</AlertDescription>
      </Alert>
    </div>
  );
}

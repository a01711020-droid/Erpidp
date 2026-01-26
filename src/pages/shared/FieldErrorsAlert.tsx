import { Alert, AlertDescription, AlertTitle } from "../../ui/primitives/alert";

interface FieldErrorsAlertProps {
  title: string;
  fieldErrors?: Record<string, string[]>;
}

export default function FieldErrorsAlert({ title, fieldErrors }: FieldErrorsAlertProps) {
  if (!fieldErrors || Object.keys(fieldErrors).length === 0) {
    return null;
  }

  return (
    <Alert variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4 space-y-1">
          {Object.entries(fieldErrors).map(([field, messages]) => (
            <li key={field}>
              <span className="font-semibold">{field}:</span> {messages.join(", ")}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
}

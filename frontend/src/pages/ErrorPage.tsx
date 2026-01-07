import type { JSX } from "react/jsx-runtime";
import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  console.error(error);

  // Handle React Router error responses (404, etc.)
  if (isRouteErrorResponse(error)) {
    if (error.status === 401) {
      return (
        <div>
          <h1>Unauthorized Access</h1>
          <p>
            You do not have permission to view this page. Please log in with
            appropriate credentials.
          </p>
        </div>
      );
    }
    return (
      <div>
        <h1>Error {error.status}</h1>
        <p>{error.statusText}</p>
        {error.data && <p>{error.data}</p>}
      </div>
    );
  }

  // Handle regular Error objects
  if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        {error.stack && <pre>{error.stack}</pre>}
      </div>
    );
  }

  // Fallback for unknown error types
  return (
    <div>
      <h1>Error</h1>
      <p>Unknown error occurred</p>
    </div>
  );
}

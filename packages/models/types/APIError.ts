export type APIError = {
  status: number;
  message: string;
  error: string;
};

export function isAPIError(error: unknown): error is APIError {
  return (
    (error as any).error !== undefined &&
    (error as any).message !== undefined &&
    (error as any).status !== undefined &&
    (error as any).error === "error"
  );
}

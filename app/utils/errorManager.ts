import { ErrorType, getErrorType } from '@/app/utils/errorHandler';

interface ErrorState {
  message: string;
  type: ErrorType;
  line?: number;
}

let currentError: ErrorState | null = null;

export function setError(error: ErrorState | null) {
  currentError = error;
}

export function getError() {
  return currentError;
}

export function parseError(errorMessage: string): ErrorState {
  const lineMatch = errorMessage.match(/line (\d+)/);
  return {
    message: errorMessage,
    type: getErrorType(errorMessage),
    line: lineMatch ? parseInt(lineMatch[1], 10) : undefined,
  };
}

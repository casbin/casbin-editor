export enum ErrorType {
  MODEL = 'model',
  POLICY = 'policy',
  REQUEST = 'request',
  UNKNOWN = 'unknown',
}

interface ErrorDetector {
  type: ErrorType;
  detect: (error: string) => boolean;
}

// Request
const REQUEST_ERROR_PATTERNS = [] as const;

// Policy
const POLICY_ERROR_PATTERNS = [] as const;

// Model
const MODEL_ERROR_PATTERNS = ['missing required sections'] as const;

export const errorDetectors: ErrorDetector[] = [
  {
    type: ErrorType.REQUEST,
    detect: (error: string) => {
      return (
        REQUEST_ERROR_PATTERNS.some((pattern) => {
          return error.toLowerCase().includes(pattern);
        }) || error.toLowerCase().includes('rvals:')
      );
    },
  },
  {
    type: ErrorType.POLICY,
    detect: (error: string) => {
      return POLICY_ERROR_PATTERNS.some((pattern) => {
        return error.toLowerCase().includes(pattern);
      });
    },
  },
  {
    type: ErrorType.MODEL,
    detect: (error: string) => {
      return (
        MODEL_ERROR_PATTERNS.some((pattern) => {
          return error.toLowerCase().includes(pattern);
        }) ||
        (!error.toLowerCase().includes('request') && !error.toLowerCase().includes('policy') && !error.toLowerCase().includes('rvals:'))
      );
    },
  },
];

export function getErrorType(error: string): ErrorType {
  for (const detector of errorDetectors) {
    if (detector.detect(error)) {
      return detector.type;
    }
  }
  return ErrorType.UNKNOWN;
}

export interface ErrorHandlers {
  onModelError?: (error: string) => void;
  onPolicyError?: (error: string) => void;
  onRequestError?: (error: string) => void;
  onUnknownError?: (error: string) => void;
}

export function handleError(error: string, handlers: ErrorHandlers): void {
  const errorType = getErrorType(error);

  switch (errorType) {
    case ErrorType.MODEL:
      handlers.onModelError?.(error);
      break;
    case ErrorType.POLICY:
      handlers.onPolicyError?.(error);
      break;
    case ErrorType.REQUEST:
      handlers.onRequestError?.(error);
      break;
    case ErrorType.UNKNOWN:
      handlers.onUnknownError?.(error);
      break;
  }
}

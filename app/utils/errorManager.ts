let currentError: string | null = null;

export const setError = (error: string | null) => {
  currentError = error;
};

export const getError = () => {return currentError};
import React, { createContext, useContext, useState, useCallback } from 'react';

interface UserInteractionContextType {
  isUserInteracting: boolean;
  incrementInteractionCount: () => void;
  decrementInteractionCount: () => void;
}

const UserInteractionContext = createContext<UserInteractionContextType | undefined>(undefined);

export const UserInteractionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interactionCount, setInteractionCount] = useState(0);

  const incrementInteractionCount = useCallback(() => {
    setInteractionCount((prev) => {
      return prev + 1;
    });
  }, []);

  const decrementInteractionCount = useCallback(() => {
    setInteractionCount((prev) => {
      return Math.max(0, prev - 1);
    });
  }, []);

  return (
    <UserInteractionContext.Provider
      value={{
        isUserInteracting: interactionCount > 0,
        incrementInteractionCount,
        decrementInteractionCount,
      }}
    >
      {children}
    </UserInteractionContext.Provider>
  );
};

export const useUserInteraction = () => {
  const context = useContext(UserInteractionContext);
  if (context === undefined) {
    throw new Error('useUserInteraction must be used within a UserInteractionProvider');
  }
  return context;
};

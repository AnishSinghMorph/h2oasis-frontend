import React, { createContext, useContext, useState } from "react";

type SetupProgressContextType = {
  currentStep: number;
  totalSteps: number;
  stepProgress: number;
  updateStepProgress: (progress: number) => void;
  updateCurrentStep: (step: number) => void;
  getProgressPercentage: () => number;
};

const SetupProgressContext = createContext<
  SetupProgressContextType | undefined
>(undefined);

export const SetupProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [stepProgress, setStepProgress] = useState(0);
  const totalSteps = 3;

  const updateStepProgress = (progress: number) => {
    setStepProgress(Math.min(1, Math.max(0, progress)));
  };

  const updateCurrentStep = (step: number) => {
    setCurrentStep(step);
    setStepProgress(0);
  };

  const getProgressPercentage = () => {
    const baseProgress = ((currentStep - 1) / totalSteps) * 100;
    const currentStepProgress = (stepProgress / totalSteps) * 100;
    return baseProgress + currentStepProgress;
  };

  return (
    <SetupProgressContext.Provider
      value={{
        currentStep,
        totalSteps,
        stepProgress,
        updateStepProgress,
        updateCurrentStep,
        getProgressPercentage,
      }}
    >
      {children}
    </SetupProgressContext.Provider>
  );
};

export const useSetupProgress = () => {
  const context = useContext(SetupProgressContext);
  if (context === undefined) {
    throw new Error(
      "useSetupProgress must be used within a SetupProgressProvider",
    );
  }
  return context;
};

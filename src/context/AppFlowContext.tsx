import React, { createContext, useContext, useState, ReactNode } from "react";

// All views that share the same background wallpaper
export type AppFlowView =
  // Auth views
  | "signup"
  | "login"
  | "forgotPassword"
  | "resetPassword"
  | "otpVerification"
  // Onboarding views
  | "choosePersona"
  | "connectWearables"
  | "selectProduct"
  | "focusGoal";

// OTP params type for passing email and firebaseUID
export interface OTPParams {
  email: string;
  firebaseUID?: string;
}

interface AppFlowContextType {
  currentView: AppFlowView;
  viewHistory: AppFlowView[];
  navigateTo: (view: AppFlowView, params?: Partial<OTPParams>) => void;
  goBack: () => void;
  canGoBack: boolean;
  otpParams: OTPParams | null;
  setOtpParams: (params: OTPParams | null) => void;
}

const AppFlowContext = createContext<AppFlowContextType | undefined>(undefined);

export const useAppFlow = () => {
  const context = useContext(AppFlowContext);
  if (!context) {
    throw new Error("useAppFlow must be used within AppFlowProvider");
  }
  return context;
};

// For backwards compatibility with existing auth screens
export const useAuthNavigation = () => {
  const context = useContext(AppFlowContext);
  if (!context) {
    // If not inside AppFlowScreen, return dummy functions (for standalone use)
    return {
      currentView: "signup" as AppFlowView,
      navigateTo: () => {},
      isInsideAuthScreen: false,
    };
  }
  return {
    currentView: context.currentView,
    navigateTo: context.navigateTo,
    isInsideAuthScreen: true,
  };
};

// For backwards compatibility with existing onboarding screens
export const useOnboardingNavigation = () => {
  const context = useContext(AppFlowContext);
  if (!context) {
    throw new Error(
      "useOnboardingNavigation must be used within AppFlowProvider",
    );
  }
  return {
    currentView: context.currentView,
    navigateTo: context.navigateTo,
    goBack: context.goBack,
    viewHistory: context.viewHistory,
  };
};

interface AppFlowProviderProps {
  children: ReactNode;
  initialView?: AppFlowView;
}

export const AppFlowProvider: React.FC<AppFlowProviderProps> = ({
  children,
  initialView = "signup",
}) => {
  const [currentView, setCurrentView] = useState<AppFlowView>(initialView);
  const [viewHistory, setViewHistory] = useState<AppFlowView[]>([initialView]);
  const [otpParams, setOtpParams] = useState<OTPParams | null>(null);

  const navigateTo = (view: AppFlowView, params?: Partial<OTPParams>) => {
    if (params) {
      setOtpParams((prev) => ({ ...prev, ...params } as OTPParams));
    }
    setViewHistory((prev) => [...prev, view]);
    setCurrentView(view);
  };

  const goBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setViewHistory(newHistory);
      setCurrentView(previousView);
    }
  };

  const canGoBack = viewHistory.length > 1;

  return (
    <AppFlowContext.Provider
      value={{
        currentView,
        viewHistory,
        navigateTo,
        goBack,
        canGoBack,
        otpParams,
        setOtpParams,
      }}
    >
      {children}
    </AppFlowContext.Provider>
  );
};

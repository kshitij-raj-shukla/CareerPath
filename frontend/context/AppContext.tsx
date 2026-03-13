"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import type {
  AssessmentRequest,
  AssessmentResponse,
  UserProfile,
} from "@/lib/api";

interface AppContextType {
  user: UserProfile | null;
  token: string | null;
  isLoggedIn: boolean;
  progress: number;
  assessmentData: AssessmentRequest | null;
  predictionResults: AssessmentResponse | null;
  login: (userData: UserProfile, token: string) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  updateProgress: (newProgress: number) => void;
  setAssessmentData: (data: AssessmentRequest | null) => void;
  setPredictionResults: (results: AssessmentResponse | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  token: "careerai.token",
  user: "careerai.user",
  progress: "careerai.progress",
  assessment: "careerai.assessment",
  prediction: "careerai.prediction",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [assessmentData, setAssessmentDataState] = useState<AssessmentRequest | null>(null);
  const [predictionResults, setPredictionResultsState] = useState<AssessmentResponse | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem(STORAGE_KEYS.token);
      const storedUser = localStorage.getItem(STORAGE_KEYS.user);
      const storedProgress = localStorage.getItem(STORAGE_KEYS.progress);
      const storedAssessment = localStorage.getItem(STORAGE_KEYS.assessment);
      const storedPrediction = localStorage.getItem(STORAGE_KEYS.prediction);
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      }
      if (storedProgress) {
        setProgress(Number(storedProgress));
      }
      if (storedAssessment) {
        setAssessmentDataState(JSON.parse(storedAssessment));
      }
      if (storedPrediction) {
        setPredictionResultsState(JSON.parse(storedPrediction));
      }
      setIsHydrated(true);
    }
  }, []);

  const login = (userData: UserProfile, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.token, authToken);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    setProgress(0);
    setAssessmentDataState(null);
    setPredictionResultsState(null);
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((previous) => {
      if (!previous) {
        return previous;
      }

      const merged = { ...previous, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(merged));
      }
      return merged;
    });
  };

  const updateProgress = (newProgress: number) => {
    setProgress(newProgress);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.progress, String(newProgress));
    }
  };

  const setAssessmentData = (data: AssessmentRequest | null) => {
    setAssessmentDataState(data);
    if (typeof window !== "undefined") {
      if (data) {
        localStorage.setItem(STORAGE_KEYS.assessment, JSON.stringify(data));
      } else {
        localStorage.removeItem(STORAGE_KEYS.assessment);
      }
    }
  };

  const setPredictionResults = (results: AssessmentResponse | null) => {
    setPredictionResultsState(results);
    if (typeof window !== "undefined") {
      if (results) {
        localStorage.setItem(STORAGE_KEYS.prediction, JSON.stringify(results));
      } else {
        localStorage.removeItem(STORAGE_KEYS.prediction);
      }
    }
  };

  // Prevent rendering children until hydration is complete to avoid hydration mismatches
  if (!isHydrated) return null;

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        isLoggedIn,
        progress,
        assessmentData,
        predictionResults,
        login,
        logout,
        updateUserProfile,
        updateProgress,
        setAssessmentData,
        setPredictionResults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

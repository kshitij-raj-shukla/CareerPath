import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { AssessmentRequest, AssessmentResponse, UserProfile } from "../api/client";

type AppContextType = {
  user: UserProfile | null;
  token: string | null;
  isLoggedIn: boolean;
  progress: number;
  assessmentData: AssessmentRequest | null;
  predictionResults: AssessmentResponse | null;
  isHydrated: boolean;
  login: (userData: UserProfile, authToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProgress: (newProgress: number) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setAssessmentData: (data: AssessmentRequest | null) => Promise<void>;
  setPredictionResults: (results: AssessmentResponse | null) => Promise<void>;
};

const STORAGE_KEYS = {
  token: "careerai.mobile.token",
  user: "careerai.mobile.user",
  progress: "careerai.mobile.progress",
  assessment: "careerai.mobile.assessment",
  prediction: "careerai.mobile.prediction",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [assessmentData, setAssessmentDataState] = useState<AssessmentRequest | null>(null);
  const [predictionResults, setPredictionResultsState] = useState<AssessmentResponse | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const [storedToken, storedUser, storedProgress, storedAssessment, storedPrediction] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.token),
            AsyncStorage.getItem(STORAGE_KEYS.user),
            AsyncStorage.getItem(STORAGE_KEYS.progress),
            AsyncStorage.getItem(STORAGE_KEYS.assessment),
            AsyncStorage.getItem(STORAGE_KEYS.prediction),
          ]);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
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
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  const login = async (userData: UserProfile, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData)),
      AsyncStorage.setItem(STORAGE_KEYS.token, authToken),
    ]);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setProgress(0);
    setAssessmentDataState(null);
    setPredictionResultsState(null);
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  };

  const updateProgress = async (newProgress: number) => {
    setProgress(newProgress);
    await AsyncStorage.setItem(STORAGE_KEYS.progress, String(newProgress));
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    setUser((previous) => {
      if (!previous) {
        return previous;
      }
      return { ...previous, ...updates };
    });

    const current = await AsyncStorage.getItem(STORAGE_KEYS.user);
    if (!current) {
      return;
    }

    const merged = { ...(JSON.parse(current) as UserProfile), ...updates };
    await AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(merged));
  };

  const setAssessmentData = async (data: AssessmentRequest | null) => {
    setAssessmentDataState(data);
    if (data) {
      await AsyncStorage.setItem(STORAGE_KEYS.assessment, JSON.stringify(data));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.assessment);
    }
  };

  const setPredictionResults = async (results: AssessmentResponse | null) => {
    setPredictionResultsState(results);
    if (results) {
      await AsyncStorage.setItem(STORAGE_KEYS.prediction, JSON.stringify(results));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEYS.prediction);
    }
  };

  const value = useMemo<AppContextType>(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(user && token),
      progress,
      assessmentData,
      predictionResults,
      isHydrated,
      login,
      logout,
      updateProgress,
      updateUserProfile,
      setAssessmentData,
      setPredictionResults,
    }),
    [user, token, progress, assessmentData, predictionResults, isHydrated],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}

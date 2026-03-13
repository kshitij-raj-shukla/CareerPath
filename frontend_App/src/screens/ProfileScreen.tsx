import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";

import { updateProfile } from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, AppInput, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

export function ProfileScreen() {
  const { user, token, updateUserProfile } = useAppContext();

  const [currentStage, setCurrentStage] = useState("");
  const [achievingStage, setAchievingStage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setCurrentStage(user?.current_stage ?? "");
    setAchievingStage(user?.target_career ?? "");
  }, [user?.current_stage, user?.target_career]);

  const handleSave = async () => {
    const stage = currentStage.trim();
    const target = achievingStage.trim();

    if (!stage || !target) {
      setError("Please fill in both fields.");
      setSuccess("");
      return;
    }

    if (!token) {
      setError("Session expired. Please login again.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateProfile(token, {
        current_stage: stage,
        target_career: target,
      });

      await updateUserProfile({
        current_stage: updated.current_stage,
        target_career: updated.target_career,
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.pageTitle}>Profile</Text>
      <Text style={styles.subtitle}>Update your current stage and achieving stage.</Text>

      <Card>
        <AppInput
          label="Current Stage"
          value={currentStage}
          onChangeText={setCurrentStage}
          placeholder="e.g. Working Professional - Software Engineer"
        />
        <AppInput
          label="Achieving Stage"
          value={achievingStage}
          onChangeText={setAchievingStage}
          placeholder="e.g. AI Engineer"
        />

        {!!error && <Text style={styles.error}>{error}</Text>}
        {!!success && <Text style={styles.success}>{success}</Text>}

        <AppButton title={saving ? "Saving..." : "Save Profile"} onPress={handleSave} disabled={saving} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    color: "#64748b",
    fontSize: 14,
    marginBottom: 12,
  },
  error: {
    color: "#dc2626",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
  },
  success: {
    color: "#16a34a",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
  },
});

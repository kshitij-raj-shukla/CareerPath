import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";

import { getProfile, loginUser, signupUser } from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, AppInput, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

export function SignupScreen() {
  const { login } = useAppContext();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStage, setCurrentStage] = useState("Undergraduate");
  const [achievingStage, setAchievingStage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !currentStage.trim() || !achievingStage.trim()) {
      setError("Please fill all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
        current_stage: currentStage.trim(),
        target_career: achievingStage.trim(),
      });

      const auth = await loginUser({ email: email.trim(), password });
      const profile = await getProfile(auth.access_token);
      await login(profile, auth.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start your AI career journey today.</Text>

        <AppInput label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
        <AppInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <AppInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
        />
        <AppInput
          label="Current Stage"
          value={currentStage}
          onChangeText={setCurrentStage}
          placeholder="e.g. Working Professional - Data Analyst"
        />
        <AppInput
          label="Achieving Stage"
          value={achievingStage}
          onChangeText={setAchievingStage}
          placeholder="e.g. AI Engineer"
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <AppButton title={loading ? "Creating account..." : "Sign Up"} onPress={handleSignup} disabled={loading} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  error: {
    color: "#dc2626",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
  },
});

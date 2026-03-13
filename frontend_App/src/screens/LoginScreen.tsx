import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getProfile, loginUser } from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, AppInput, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const { login } = useAppContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const auth = await loginUser({ email: email.trim(), password });
      const profile = await getProfile(auth.access_token);
      await login(profile, auth.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue your career journey.</Text>

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

        {!!error && <Text style={styles.error}>{error}</Text>}

        <AppButton title={loading ? "Logging in..." : "Login"} onPress={handleLogin} disabled={loading} />

        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>No account yet?</Text>
          <AppButton title="Sign Up" variant="ghost" onPress={() => navigation.navigate("Signup")} />
        </View>
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
  bottomRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bottomText: {
    color: "#64748b",
    fontSize: 13,
  },
});

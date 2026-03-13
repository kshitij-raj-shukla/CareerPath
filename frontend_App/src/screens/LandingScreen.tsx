import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Screen } from "../components/screen";
import { AppButton, Card } from "../components/ui";

const features = [
  "AI Career Prediction",
  "Personalized Roadmaps",
  "Skill Gap Analysis",
  "Learning Resources",
  "Progress Tracking",
];

export function LandingScreen() {
  const navigation = useNavigation<any>();

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.title}>Discover Your Career Path With AI</Text>
        <Text style={styles.subtitle}>
          Your complete assistant for assessment, prediction, roadmap generation, and progress tracking.
        </Text>
      </View>

      <Card style={styles.featuresCard}>
        <Text style={styles.sectionTitle}>Platform Features</Text>
        {features.map((feature) => (
          <Text key={feature} style={styles.featureItem}>
            • {feature}
          </Text>
        ))}
      </Card>

      <View style={styles.actions}>
        <AppButton title="Login" onPress={() => navigation.navigate("Login")} />
        <AppButton title="Create Account" variant="secondary" onPress={() => navigation.navigate("Signup")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    lineHeight: 38,
    color: "#0f172a",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#475569",
  },
  featuresCard: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
  },
  actions: {
    gap: 10,
  },
});

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { humanizeKey } from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

export function PredictionScreen() {
  const navigation = useNavigation<any>();
  const { predictionResults } = useAppContext();

  if (!predictionResults) {
    return (
      <Screen>
        <Card>
          <Text style={styles.title}>No Prediction Data</Text>
          <Text style={styles.subtitle}>Complete the assessment first to generate your prediction.</Text>
          <AppButton title="Go To Assessment" onPress={() => navigation.navigate("Assessment")} />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.pageTitle}>AI Prediction Results</Text>

      <Card style={styles.scoreCard}>
        <Text style={styles.cardTitle}>Career Readiness Score</Text>
        <Text style={styles.scoreText}>{Math.round(predictionResults.readiness_score)}/100</Text>
        <Text style={styles.subtitle}>Current Level: {predictionResults.career_level}</Text>
      </Card>

      <Card style={styles.listCard}>
        <Text style={styles.cardTitle}>Key Strengths</Text>
        {predictionResults.strengths.map((item) => (
          <Text key={item} style={styles.bullet}>• {humanizeKey(item)}</Text>
        ))}
      </Card>

      <Card style={styles.listCard}>
        <Text style={styles.cardTitle}>Primary Skill Gaps</Text>
        {predictionResults.skill_gaps.map((gap, index) => (
          <Text key={`${gap.skill}-${index}`} style={styles.bullet}>
            • {humanizeKey(gap.skill)}: {gap.recommendation}
          </Text>
        ))}
      </Card>

      <Card style={styles.listCard}>
        <Text style={styles.cardTitle}>Recommended Focus Areas</Text>
        {predictionResults.recommended_focus_areas.map((item, index) => (
          <Text key={`${item}-${index}`} style={styles.bullet}>• {item}</Text>
        ))}
      </Card>

      <View style={styles.actions}>
        <AppButton title="Generate My Custom Roadmap" onPress={() => navigation.navigate("Roadmap")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 12,
  },
  scoreCard: {
    marginBottom: 10,
  },
  listCard: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: "900",
    color: "#2563eb",
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: "#64748b",
  },
  bullet: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 6,
    lineHeight: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 6,
  },
  actions: {
    marginTop: 4,
  },
});

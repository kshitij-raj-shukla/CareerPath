import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { getProgress, ProgressEntry } from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

export function DashboardScreen() {
  const navigation = useNavigation<any>();
  const { user, token, progress, updateProgress, predictionResults } = useAppContext();
  const [latestPlan, setLatestPlan] = useState<ProgressEntry | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        return;
      }

      try {
        const progressData = await getProgress(token);
        const newest = progressData.entries[0] ?? null;
        setLatestPlan(newest);

        if (newest?.tasks.length) {
          const completed = newest.tasks.filter((task) => task.done).length;
          await updateProgress(Math.round((completed / newest.tasks.length) * 100));
        }
      } catch {
        setLatestPlan(null);
      }
    };

    load();
  }, [token]);

  const completedTasks = latestPlan?.tasks.filter((task) => task.done).length ?? 0;
  const totalTasks = latestPlan?.tasks.length ?? 0;
  const pendingTasks = Math.max(totalTasks - completedTasks, 0);

  return (
    <Screen>
      <Text style={styles.heading}>Welcome back, {user?.name || "Explorer"}</Text>
      <Text style={styles.subheading}>Continue your AI engineering journey.</Text>

      <Card style={styles.progressCard}>
        <Text style={styles.cardTitle}>Career Progress</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.caption}>
          {totalTasks > 0
            ? `${completedTasks} of ${totalTasks} roadmap tasks completed`
            : "No roadmap tasks yet"}
        </Text>
      </Card>

      <Card style={styles.actionsCard}>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.actionList}>
          <AppButton title="Take Assessment" onPress={() => navigation.navigate("Assessment")} />
          <AppButton title="View Prediction" variant="secondary" onPress={() => navigation.navigate("Prediction")} />
          <AppButton
            title={pendingTasks > 0 ? `Continue Roadmap (${pendingTasks} pending)` : "Generate/View Roadmap"}
            variant="ghost"
            onPress={() => navigation.navigate("Roadmap")}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Prediction Summary</Text>
        {predictionResults ? (
          <>
            <Text style={styles.summaryValue}>
              Readiness Score: {Math.round(predictionResults.readiness_score)}/100
            </Text>
            <Text style={styles.caption}>{predictionResults.summary}</Text>
          </>
        ) : (
          <Text style={styles.caption}>Complete the assessment to generate your prediction.</Text>
        )}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 14,
  },
  progressCard: {
    marginBottom: 12,
  },
  actionsCard: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2563eb",
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 10,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#dbeafe",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  caption: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
  },
  actionList: {
    gap: 8,
  },
  summaryValue: {
    color: "#1d4ed8",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
});

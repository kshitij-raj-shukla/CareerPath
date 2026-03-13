import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  buildCareerPlanPayload,
  createCareerPlan,
  getProgress,
  ProgressEntry,
  updateProgressTask,
} from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

type StudyResource = {
  label: string;
  href: string;
};

function getStudyResources(phase: string, action: string, targetCareer?: string | null): StudyResource[] {
  const cleanedAction = action.replace(/^\[[^\]]+\]\s*/, "").trim();
  const phaseHint = phase.toLowerCase().includes("skill gap")
    ? "fundamentals"
    : phase.toLowerCase().includes("current")
      ? "practice"
      : phase.toLowerCase().includes("next")
        ? "advanced"
        : "career growth";

  const query = [targetCareer, cleanedAction, phaseHint].filter(Boolean).join(" ");
  const encodedQuery = encodeURIComponent(query);

  return [
    { label: "Course", href: `https://www.coursera.org/search?query=${encodedQuery}` },
    { label: "Videos", href: `https://www.youtube.com/results?search_query=${encodedQuery}` },
    {
      label: "Articles",
      href: `https://www.google.com/search?q=${encodeURIComponent(`${query} tutorial`)}`,
    },
  ];
}

export function RoadmapScreen() {
  const { user, token, predictionResults, updateProgress } = useAppContext();

  const [plan, setPlan] = useState<ProgressEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!token) {
        setError("You need to login first.");
        setLoading(false);
        return;
      }

      try {
        let progressData = await getProgress(token);
        let latestPlan = progressData.entries[0] ?? null;

        const targetCareer = user?.target_career?.trim().toLowerCase();
        const needsGeneration =
          !latestPlan ||
          (targetCareer && latestPlan.target_career.trim().toLowerCase() !== targetCareer);

        if (needsGeneration) {
          await createCareerPlan(buildCareerPlanPayload(user, predictionResults), token);
          progressData = await getProgress(token);
          latestPlan = progressData.entries[0] ?? null;
        }

        if (!latestPlan) {
          throw new Error("No roadmap data available.");
        }

        setPlan(latestPlan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [token, user?.target_career, predictionResults]);

  const completedCount = useMemo(
    () => plan?.tasks.filter((task) => task.done).length ?? 0,
    [plan],
  );
  const totalCount = plan?.tasks.length ?? 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    void updateProgress(progressPercent);
  }, [progressPercent]);

  const toggleStep = async (taskId: number, done: boolean) => {
    if (!plan || !token) {
      return;
    }

    const nextDoneState = !done;
    const nextPlan = {
      ...plan,
      tasks: plan.tasks.map((task) =>
        task.id === taskId ? { ...task, done: nextDoneState } : task,
      ),
    };
    setPlan(nextPlan);

    try {
      await updateProgressTask(plan.id, taskId, nextDoneState, token);
    } catch (err) {
      setPlan(plan);
      setError(err instanceof Error ? err.message : "Unable to update task progress.");
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.centerText}>Generating roadmap...</Text>
        </View>
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Card>
          <Text style={styles.errorTitle}>Roadmap Error</Text>
          <Text style={styles.errorText}>{error}</Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.pageTitle}>Your AI Learning Roadmap</Text>
      <Text style={styles.subtitle}>Customized path for: {plan?.target_career || user?.target_career}</Text>

      <Card style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Overall Progress</Text>
        <Text style={styles.progressText}>{progressPercent}%</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        {!!plan?.roadmap_summary && <Text style={styles.caption}>{plan.roadmap_summary}</Text>}
      </Card>

      {plan?.tasks.map((step) => (
        <Card key={step.id} style={styles.taskCard}>
          <Pressable onPress={() => toggleStep(step.id, step.done)} style={styles.taskHeader}>
            <Text style={[styles.check, step.done ? styles.done : undefined]}>{step.done ? "✓" : "○"}</Text>
            <View style={styles.taskContent}>
              <Text style={[styles.taskAction, step.done ? styles.doneText : undefined]}>{step.action}</Text>
              <Text style={styles.taskMeta}>{step.phase} • {step.estimated_days} day(s)</Text>
            </View>
          </Pressable>

          <View style={styles.resourceWrap}>
            <Text style={styles.resourceHeading}>Study resources</Text>
            <View style={styles.resourceRow}>
              {getStudyResources(step.phase, step.action, plan?.target_career || user?.target_career).map((resource) => (
                <AppButton
                  key={`${step.id}-${resource.label}`}
                  title={resource.label}
                  variant="secondary"
                  onPress={() => void Linking.openURL(resource.href)}
                  style={styles.resourceBtn}
                />
              ))}
            </View>
          </View>
        </Card>
      ))}

      {plan?.tasks.length === 0 && (
        <Card>
          <Text style={styles.caption}>No tasks available yet.</Text>
          <AppButton
            title="Generate Roadmap Again"
            onPress={() => {
              setLoading(true);
              setError("");
              setPlan(null);
            }}
          />
        </Card>
      )}
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
  summaryCard: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },
  progressText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#2563eb",
    marginBottom: 8,
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: "#dbeafe",
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#2563eb",
  },
  caption: {
    color: "#475569",
    fontSize: 13,
    lineHeight: 18,
  },
  taskCard: {
    marginBottom: 10,
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  check: {
    fontSize: 22,
    color: "#64748b",
    width: 24,
    textAlign: "center",
  },
  done: {
    color: "#16a34a",
  },
  taskContent: {
    flex: 1,
  },
  taskAction: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  doneText: {
    textDecorationLine: "line-through",
    color: "#64748b",
  },
  taskMeta: {
    color: "#475569",
    fontSize: 12,
  },
  resourceWrap: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 10,
  },
  resourceHeading: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  resourceRow: {
    flexDirection: "row",
    gap: 8,
  },
  resourceBtn: {
    flex: 1,
    paddingVertical: 9,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    marginTop: 10,
    color: "#334155",
    fontWeight: "600",
  },
  errorTitle: {
    color: "#b91c1c",
    fontWeight: "800",
    fontSize: 18,
    marginBottom: 4,
  },
  errorText: {
    color: "#7f1d1d",
    fontSize: 13,
  },
});

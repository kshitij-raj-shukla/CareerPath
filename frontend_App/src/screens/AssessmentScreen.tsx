import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AssessmentRequest, submitAssessment } from "../api/client";
import { Screen } from "../components/screen";
import { AppButton, AppInput, Card } from "../components/ui";
import { useAppContext } from "../context/AppContext";

function clampSkill(value: number): number {
  return Math.max(1, Math.min(5, value));
}

function SkillStepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.stepperRow}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <AppButton title="-" variant="ghost" onPress={() => onChange(clampSkill(value - 1))} style={styles.stepperBtn} />
        <Text style={styles.stepperValue}>{value}/5</Text>
        <AppButton title="+" variant="ghost" onPress={() => onChange(clampSkill(value + 1))} style={styles.stepperBtn} />
      </View>
    </View>
  );
}

export function AssessmentScreen() {
  const navigation = useNavigation<any>();
  const { user, token, setAssessmentData, setPredictionResults } = useAppContext();

  const [educationLevel, setEducationLevel] = useState("Bachelor's");
  const [programming, setProgramming] = useState(3);
  const [math, setMath] = useState(3);
  const [problemSolving, setProblemSolving] = useState(3);
  const [projects, setProjects] = useState("0");
  const [experience, setExperience] = useState("0");
  const [systemDesign, setSystemDesign] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [aiKnowledge, setAiKnowledge] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const payload: AssessmentRequest = {
        education_level: educationLevel,
        programming_skill: programming,
        math_skill: math,
        problem_solving: problemSolving,
        projects: Math.max(0, Number(projects) || 0),
        experience: Math.max(0, Number(experience) || 0),
        system_design: systemDesign,
        communication,
        ai_knowledge: aiKnowledge,
        target_role: user?.target_career || "AI Engineer",
      };

      const result = await submitAssessment(payload, token);
      await setAssessmentData(payload);
      await setPredictionResults(result);
      navigation.navigate("Prediction");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Skill Assessment</Text>
      <Text style={styles.subtitle}>
        Help us assess your readiness for {user?.target_career || "your target role"}.
      </Text>

      <Card>
        <AppInput
          label="Education Level"
          value={educationLevel}
          onChangeText={setEducationLevel}
          placeholder="High School / Bachelor's / Master's / PhD"
        />
        <AppInput
          label="Projects Completed"
          value={projects}
          onChangeText={setProjects}
          keyboardType="numeric"
          placeholder="0"
        />
        <AppInput
          label="Years of Experience"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          placeholder="0"
        />

        <SkillStepper label="Programming & Syntax" value={programming} onChange={setProgramming} />
        <SkillStepper label="Mathematics & Statistics" value={math} onChange={setMath} />
        <SkillStepper label="Logic & Problem Solving" value={problemSolving} onChange={setProblemSolving} />
        <SkillStepper label="Software System Design" value={systemDesign} onChange={setSystemDesign} />
        <SkillStepper label="AI & ML Knowledge" value={aiKnowledge} onChange={setAiKnowledge} />
        <SkillStepper label="Communication & Teamwork" value={communication} onChange={setCommunication} />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <AppButton
          title={loading ? "Analyzing..." : "Submit & Get Prediction"}
          onPress={handleSubmit}
          disabled={loading}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
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
  stepperRow: {
    marginBottom: 10,
  },
  stepperLabel: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 6,
  },
  stepperControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  stepperBtn: {
    flex: 1,
  },
  stepperValue: {
    width: 64,
    textAlign: "center",
    color: "#1e293b",
    fontWeight: "700",
  },
  error: {
    color: "#dc2626",
    marginBottom: 10,
    fontSize: 13,
    fontWeight: "600",
  },
});

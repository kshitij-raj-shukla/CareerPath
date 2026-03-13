"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { submitAssessment, type AssessmentRequest } from "@/lib/api";
import { motion } from "framer-motion";

export default function AssessmentPage() {
  const router = useRouter();
  const { user, token, isLoggedIn, setAssessmentData, setPredictionResults } = useAppContext();
  
  const [educationLevel, setEducationLevel] = useState("Bachelor's");
  const [programming, setProgramming] = useState(3);
  const [math, setMath] = useState(3);
  const [problemSolving, setProblemSolving] = useState(3);
  const [projects, setProjects] = useState(0);
  const [experience, setExperience] = useState(0);
  const [systemDesign, setSystemDesign] = useState(3);
  const [communication, setCommunication] = useState(3);
  const [aiKnowledge, setAiKnowledge] = useState(3);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload: AssessmentRequest = {
        education_level: educationLevel,
        programming_skill: programming,
        math_skill: math,
        problem_solving: problemSolving,
        projects: projects,
        experience: experience,
        system_design: systemDesign,
        communication: communication,
        ai_knowledge: aiKnowledge,
        target_role: user?.target_career || "AI Engineer"
      };

      const data = await submitAssessment(payload, token);
      setAssessmentData(payload);
      setPredictionResults(data);
      router.push("/prediction");

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const renderSlider = (label: string, value: number, setter: (val: number) => void) => (
    <div className="mb-6">
      <label className="block text-lg font-semibold mb-2">
        {label}: <span className="text-blue-500">{value}/5</span>
      </label>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => setter(Number(e.target.value))}
        className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <div className="flex justify-between text-xs text-neutral-500 mt-2 font-medium">
        <span>Beginner</span>
        <span>Expert</span>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-4">Skill Assessment</h1>
        <p className="text-neutral-500 mb-8">
          Help us understand your current knowledge level so our AI can predict your career readiness for <span className="font-bold text-blue-500">{user?.target_career || "your target role"}</span>.
        </p>

        {error && (
          <div className="w-full p-4 mb-6 text-sm text-red-600 bg-red-100/50 dark:bg-red-900/20 dark:text-red-400 rounded-lg font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <GlowingEffect glowColor="rgba(59, 130, 246, 0.2)">
            <div className="space-y-6">
              
              {/* Education Level */}
              <div>
                <label className="block text-lg font-semibold mb-3">Highest Education Level</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="High School">High School</option>
                  <option value="Bachelor's">Bachelor's Degree</option>
                  <option value="Master's">Master's Degree</option>
                  <option value="PhD">PhD</option>
                </select>
              </div>

              {/* Number Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-semibold mb-3">Projects Completed</label>
                  <input
                    type="number"
                    min="0"
                    value={projects}
                    onChange={(e) => setProjects(Number(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    value={experience}
                    onChange={(e) => setExperience(Number(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <hr className="border-neutral-200 dark:border-neutral-800 my-6" />

              {/* Sliders */}
              <h3 className="text-xl font-bold mb-4">Self-Rate Core Skills</h3>
              
              {renderSlider("Programming & Syntax", programming, setProgramming)}
              {renderSlider("Mathematics & Statistics", math, setMath)}
              {renderSlider("Logic & Problem Solving", problemSolving, setProblemSolving)}
              {renderSlider("Software System Design", systemDesign, setSystemDesign)}
              {renderSlider("AI & Machine Learning Knowledge", aiKnowledge, setAiKnowledge)}
              {renderSlider("Communication & Teamwork", communication, setCommunication)}

            </div>
          </GlowingEffect>

          <div className="flex justify-end pt-4">
            <Button disabled={loading} type="submit" size="lg" className="w-full md:w-auto px-10 py-6 text-lg rounded-xl shadow-lg hover:scale-105 transition-transform">
              {loading ? "Analyzing Profile..." : "Submit & Get Prediction"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

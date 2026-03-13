"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion, AnimatePresence } from "framer-motion";
import { buildCareerPlanPayload, createCareerPlan, getProgress, type ProgressEntry, updateProgressTask } from "@/lib/api";
import { BookOpen, CheckCircle2, Circle, Clock3, ExternalLink, Layers3 } from "lucide-react";

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
    {
      label: "Course",
      href: `https://www.coursera.org/search?query=${encodedQuery}`,
    },
    {
      label: "Videos",
      href: `https://www.youtube.com/results?search_query=${encodedQuery}`,
    },
    {
      label: "Articles",
      href: `https://www.google.com/search?q=${encodeURIComponent(`${query} tutorial`)}`,
    },
  ];
}

export default function RoadmapPage() {
  const router = useRouter();
  const { user, token, predictionResults, isLoggedIn, updateProgress } = useAppContext();

  const [plan, setPlan] = useState<ProgressEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const fetchRoadmap = async () => {
      try {
        if (!token) {
          throw new Error("You need to log in before generating a roadmap.");
        }

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
          throw new Error("No roadmap data is available yet.");
        }

        setPlan(latestPlan);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to generate roadmap.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [user, predictionResults, token, isLoggedIn, router]);

  const completedCount = plan?.tasks.filter((task) => task.done).length ?? 0;
  const totalCount = plan?.tasks.length ?? 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  useEffect(() => {
    updateProgress(progressPercent);
  }, [progressPercent, updateProgress]);

  if (!isLoggedIn) {
    router.push("/login");
    return null;
  }

  const toggleStep = async (taskId: number, done: boolean) => {
    if (!plan || !token) {
      return;
    }

    const nextDoneState = !done;
    setPlan({
      ...plan,
      tasks: plan.tasks.map((task) =>
        task.id === taskId ? { ...task, done: nextDoneState } : task,
      ),
    });

    try {
      await updateProgressTask(plan.id, taskId, nextDoneState, token);
    } catch (err) {
      setPlan({
        ...plan,
        tasks: plan.tasks.map((task) =>
          task.id === taskId ? { ...task, done } : task,
        ),
      });
      setError(err instanceof Error ? err.message : "Unable to update task progress.");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          Generating Roadmap...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-center p-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-neutral-600 dark:text-neutral-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
          Your AI Learning Roadmap
        </h1>
        <p className="text-neutral-500 mb-6 text-lg">
          Customized path for: <span className="font-bold text-neutral-900 dark:text-white capitalize">{plan?.target_career || user?.target_career}</span>
        </p>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-3">
            <h2 className="text-xl font-bold">Overall Progress</h2>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{progressPercent}%</div>
          </div>
          <Progress value={progressPercent} className="h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 transition-all duration-500" />
          {plan?.roadmap_summary && (
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-300">{plan.roadmap_summary}</p>
          )}
        </div>
      </div>

      <div className="relative pl-4 md:pl-8 space-y-6 before:absolute before:inset-0 before:ml-5 md:before:ml-9 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-neutral-300 dark:before:via-neutral-700 before:to-transparent">
        <AnimatePresence>
          {plan?.tasks.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              {/* Timeline marker */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-neutral-950 absolute left-0 md:left-1/2 -translate-x-1/2 shrink-0 z-10 transition-colors duration-300 ${
                  step.done ? "bg-blue-600 text-white" : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500"
                }`}
              >
                {step.done ? <CheckCircle2 className="w-5 h-5" /> : <span>{index + 1}</span>}
              </div>

              {/* Card Container - Alternate side for desktop */}
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] ml-auto md:ml-0 md:group-odd:pl-8 md:group-even:pr-8">
                <GlowingEffect glowColor={step.done ? "rgba(34, 197, 94, 0.2)" : "rgba(59, 130, 246, 0.2)"}>
                  <div
                    className={`cursor-pointer transition-colors duration-300 ${
                      step.done ? "opacity-75" : "opacity-100"
                    }`}
                    onClick={() => toggleStep(step.id, step.done)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <button className="focus:outline-none hover:scale-110 transition-transform">
                          {step.done ? (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                          ) : (
                            <Circle className="w-8 h-8 text-neutral-300 dark:text-neutral-600" />
                          )}
                        </button>
                        <h3 className={`text-xl font-bold transition-all ${step.done ? 'line-through text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>
                          {step.action}
                        </h3>
                      </div>
                      <span className="px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1 text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400">
                        <Clock3 className="w-3 h-3" />
                        {step.estimated_days} days
                      </span>
                    </div>

                    <div className="pl-11 pr-2 pb-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                        <Layers3 className="h-3.5 w-3.5" />
                        {step.phase}
                      </div>

                      <div
                        className="mt-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900/70"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                          <BookOpen className="h-4 w-4" />
                          Study resources for this step
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {getStudyResources(step.phase, step.action, plan?.target_career || user?.target_career).map((resource) => (
                            <a
                              key={`${step.id}-${resource.label}`}
                              href={resource.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-900/60 dark:bg-neutral-950 dark:text-blue-300 dark:hover:bg-blue-950/30"
                            >
                              {resource.label}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowingEffect>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

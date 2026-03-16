"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Progress } from "@/components/ui/progress";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@/components/ui/button";
import { getProgress, type ProgressEntry } from "@/lib/api";
import Link from "next/link";
import { ArrowRight, CheckCircle, Target, Award } from "lucide-react";

export default function DashboardPage() {
  
  const { user, isLoggedIn, progress, predictionResults, token, updateProgress } = useAppContext();
  const router = useRouter();
  const [latestPlan, setLatestPlan] = useState<ProgressEntry | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!token) {
      return;
    }

    let isActive = true;

    const loadProgress = async () => {
      try {
        const progressData = await getProgress(token);
        if (!isActive) {
          return;
        }
        const newest = progressData.entries[0] ?? null;
        setLatestPlan(newest);
        if (newest?.tasks.length) {
          const completed = newest.tasks.filter((task) => task.done).length;
          updateProgress(Math.round((completed / newest.tasks.length) * 100));
        }
      } catch {
        if (isActive) {
          setLatestPlan(null);
        }
      }
    };

    loadProgress();

    return () => {
      isActive = false;
    };
  }, [isLoggedIn, router, token, updateProgress]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  const completedTasks = latestPlan?.tasks.filter((task) => task.done).length ?? 0;
  const totalTasks = latestPlan?.tasks.length ?? 0;
  const pendingTasks = Math.max(totalTasks - completedTasks, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
          Welcome back, {user?.name || "Explorer"}
        </h1>
        <p className="text-lg text-neutral-500 dark:text-neutral-400">
          Ready to continue your AI engineering journey?
        </p>
      </div>

      {/* Progress Section */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Career Progress
            </h2>
            <p className="text-neutral-500 text-sm mt-1">Based on completed roadmap items</p>
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{progress}%</div>
        </div>
        <Progress value={progress} className="h-4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </section>

      {/* Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <GlowingEffect glowColor="rgba(236, 72, 153, 0.3)">
          <div className="flex flex-col h-full bg-white dark:bg-neutral-900 p-2 rounded-xl">
            <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg w-fit mb-4">
              <Target className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Skill Assessment</h3>
            <p className="text-neutral-500 mb-6 flex-1">
              Test your current knowledge level across different domains to update your AI predictions.
            </p>
            <Link href="/assessment">
              <Button className="w-full justify-between group">
                Take Assessment
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </GlowingEffect>

        <GlowingEffect glowColor="rgba(16, 185, 129, 0.3)">
          <div className="flex flex-col h-full bg-white dark:bg-neutral-900 p-2 rounded-xl">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg w-fit mb-4">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Your Roadmap</h3>
            <p className="text-neutral-500 mb-6 flex-1">
              {latestPlan
                ? `Resume your structured learning path. ${pendingTasks} roadmap task${pendingTasks === 1 ? "" : "s"} remain.`
                : "Generate your first roadmap from the assessment results and start tracking progress."}
            </p>
            <Link href="/roadmap">
              <Button variant="secondary" className="w-full justify-between group">
                View Roadmap
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </GlowingEffect>
      </div>

      {/* Predictions Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Skill Prediction Summary</h2>
          <Link href="/prediction" className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:underline">
            Full Details <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex flex-col items-center text-center">
          <Award className="w-16 h-16 text-yellow-500 mb-4" />
          {predictionResults ? (
            <>
              <h3 className="text-xl font-bold mb-2">
                Readiness Score: <span className="text-blue-600">{Math.round(predictionResults.readiness_score)}/100</span>
              </h3>
              <p className="text-neutral-500 max-w-md">
                {predictionResults.summary}
              </p>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">Readiness Score: <span className="text-blue-600">Awaiting assessment</span></h3>
              <p className="text-neutral-500 max-w-md">
                Complete the assessment to generate a detailed skill profile and career readiness score.
              </p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

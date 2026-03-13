"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { humanizeKey } from "@/lib/api";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ArrowRight, Download, Share2 } from "lucide-react";
import Link from "next/link";

export default function PredictionPage() {
  const router = useRouter();
  const { predictionResults, isLoggedIn } = useAppContext();

  const radarData = predictionResults?.radar_chart 
    ? Object.entries(predictionResults.radar_chart).map(([key, val]) => ({
        subject: humanizeKey(key),
        A: val,
        fullMark: 100
      }))
    : [];

  const barData = predictionResults?.skill_graph
    ? Object.entries(predictionResults.skill_graph).map(([key, val]) => ({
        name: humanizeKey(key),
        Score: val
      }))
    : [];

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    router.push("/login");
    return null;
  }

  if (!predictionResults) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          No Prediction Data Found
        </h2>
        <p className="text-neutral-500 text-sm mt-2 mb-6">Please complete the assessment first.</p>
        <Link href="/assessment">
          <Button>Take Assessment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">
            AI Prediction Results
          </h1>
          <p className="text-neutral-500">
            Based on your assessment, here is your predicted career readiness profile.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" /> Share
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Score Card */}
        <GlowingEffect glowColor="rgba(59, 130, 246, 0.3)" className="col-span-1">
          <div className="flex flex-col items-center justify-center p-6 h-full text-center">
            <h3 className="text-lg font-semibold text-neutral-500 mb-2">Career Readiness Score</h3>
            <div className="text-6xl font-black text-blue-600 dark:text-blue-400 mb-4">{Math.round(predictionResults.readiness_score)}<span className="text-3xl text-neutral-400">/100</span></div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 mb-4">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${predictionResults.readiness_score}%` }}></div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium">
              Current Level: <span className="text-indigo-600 dark:text-indigo-400 capitalize">{predictionResults.career_level}</span>
            </p>
          </div>
        </GlowingEffect>

        {/* Strengths & Weaknesses */}
        <GlowingEffect glowColor="rgba(16, 185, 129, 0.3)" className="col-span-1 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-4">
            <div>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Key Strengths
              </h3>
              <ul className="space-y-3">
                {predictionResults.strengths.map((str: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300 text-sm">
                    <span className="font-bold text-neutral-900 dark:text-white capitalize whitespace-nowrap">{humanizeKey(str)}:</span>
                    Strong signal from your assessment profile.
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Primary Skill Gaps
              </h3>
              <ul className="space-y-3">
                {predictionResults.skill_gaps.map((gap: any, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300 text-sm">
                    <span className="font-bold text-neutral-900 dark:text-white capitalize whitespace-nowrap">{humanizeKey(gap.skill)}:</span>
                    Currently {gap.current_level}, but {gap.required_level} is recommended. {gap.recommendation}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlowingEffect>
      </div>

      {/* Visualizations row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <GlowingEffect glowColor="rgba(139, 92, 246, 0.2)">
          <h3 className="text-xl font-bold mb-6 text-center">Skill Distribution</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" className="dark:stroke-neutral-800" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Skill Level"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.5}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#818cf8' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlowingEffect>

        <GlowingEffect glowColor="rgba(245, 158, 11, 0.2)">
          <h3 className="text-xl font-bold mb-6 text-center">Category Analysis</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="Score" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlowingEffect>
      </div>

      <GlowingEffect glowColor="rgba(16, 185, 129, 0.2)" className="mb-10">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Recommended Focus Areas</h3>
          <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            {predictionResults.recommended_focus_areas.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </GlowingEffect>

      <div className="flex justify-center">
        <Link href="/roadmap">
          <Button size="lg" className="text-lg px-10 py-8 rounded-2xl shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 group">
            <span className="flex items-center gap-3">
              Generate My Custom Roadmap
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

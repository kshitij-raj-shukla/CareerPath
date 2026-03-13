"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { getProfile, loginUser, signupUser } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

const STAGE_OPTIONS = [
  "Class 10",
  "Class 11-12",
  "Undergraduate",
  "Graduate",
  "Working Professional",
];

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStage, setCurrentStage] = useState("Undergraduate");
  const [targetCareer, setTargetCareer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password && currentStage && targetCareer) {
      setLoading(true);
      setError("");
      try {
        await signupUser({
          name,
          email,
          password,
          current_stage: currentStage,
          target_career: targetCareer,
        });

        const auth = await loginUser({ email, password });
        const profile = await getProfile(auth.access_token);
        login(profile, auth.access_token);
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred during signup");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please fill in all fields.");
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-neutral-50 dark:bg-black w-full min-h-[calc(100vh-64px)] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlowingEffect glowColor="rgba(59, 130, 246, 0.4)">
          <div className="p-4 sm:p-8 flex flex-col items-center">
            <h1 className="text-3xl font-bold mb-2 text-center text-neutral-900 dark:text-white">
              Create an Account
            </h1>
            <p className="text-neutral-500 mb-6 text-center text-sm">
              Start your AI career journey today.
            </p>
            
            {error && (
              <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-100/50 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-center font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSignup} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Current Stage
                </label>
                <input
                  type="text"
                  value={currentStage}
                  onChange={(e) => setCurrentStage(e.target.value)}
                  list="current-stage-options"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
                  placeholder="e.g. Working Professional - Data Analyst"
                />
                <datalist id="current-stage-options">
                  {STAGE_OPTIONS.map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Target Career
                </label>
                <input
                  type="text"
                  required
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-sm"
                  placeholder="e.g. AI Engineer"
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full mt-6 py-6 text-base font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>

            <p className="mt-8 text-sm text-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </p>
          </div>
        </GlowingEffect>
      </motion.div>
    </div>
  );
}

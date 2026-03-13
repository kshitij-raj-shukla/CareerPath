"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { useAppContext } from "@/context/AppContext";
import { updateProfile } from "@/lib/api";

const STAGE_SUGGESTIONS = [
  "Class 10",
  "Class 11-12",
  "Undergraduate",
  "Graduate",
  "Working Professional",
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, isLoggedIn, updateUserProfile } = useAppContext();

  const [currentStage, setCurrentStage] = useState("");
  const [achievingStage, setAchievingStage] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    setCurrentStage(user?.current_stage ?? "");
    setAchievingStage(user?.target_career ?? "");
  }, [user]);

  if (!isLoggedIn) {
    return null;
  }

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedCurrentStage = currentStage.trim();
    const trimmedAchievingStage = achievingStage.trim();

    if (!trimmedCurrentStage || !trimmedAchievingStage) {
      setError("Please fill in both Current Stage and Achieving Stage.");
      setSuccess("");
      return;
    }

    if (!token) {
      setError("Session expired. Please login again.");
      setSuccess("");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateProfile(token, {
        current_stage: trimmedCurrentStage,
        target_career: trimmedAchievingStage,
      });

      updateUserProfile({
        current_stage: updated.current_stage,
        target_career: updated.target_career,
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">Profile</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          Update your Current Stage and Achieving Stage anytime.
        </p>
      </div>

      <GlowingEffect glowColor="rgba(59, 130, 246, 0.28)">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Current Stage
              </label>
              <input
                type="text"
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value)}
                list="profile-stage-options"
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. Working Professional - Software Engineer"
                required
              />
              <datalist id="profile-stage-options">
                {STAGE_SUGGESTIONS.map((stage) => (
                  <option key={stage} value={stage} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Achieving Stage
              </label>
              <input
                type="text"
                value={achievingStage}
                onChange={(e) => setAchievingStage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="e.g. AI Engineer"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            {success && (
              <p className="text-sm text-emerald-600 dark:text-emerald-400">{success}</p>
            )}

            <Button type="submit" disabled={saving} className="w-full md:w-auto px-8 py-6 text-base rounded-xl">
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </div>
      </GlowingEffect>
    </div>
  );
}

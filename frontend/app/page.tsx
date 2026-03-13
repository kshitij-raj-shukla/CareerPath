"use client";

import { useAppContext } from "@/context/AppContext";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Button } from "@/components/ui/button";
import { Sparkles, Settings, Lock, Box, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Bitcount_Prop_Double_Ink } from "next/font/google";

const bitcountPropDoubleInk = Bitcount_Prop_Double_Ink({
  subsets: ["latin"],
});

export default function LandingPage() {
  const { isLoggedIn } = useAppContext();
  const router = useRouter();

  const handleCtaClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  const features = [
    {
      title: "AI Career Prediction",
      description: "Predict your career readiness using machine learning.",
      icon: <Sparkles className="w-8 h-8 text-blue-500" />,
      href: "/prediction",
      ctaLabel: "Open Prediction",
    },
    {
      title: "Personalized Roadmaps",
      description: "Receive custom learning paths tailored to your career goals.",
      icon: <Settings className="w-8 h-8 text-green-500" />,
      href: "/roadmap",
      ctaLabel: "View Roadmap",
    },
    {
      title: "Skill Gap Analysis",
      description: "Identify the missing skills required to reach your dream role.",
      icon: <Lock className="w-8 h-8 text-purple-500" />,
      href: "/prediction",
      ctaLabel: "View Analysis",
    },
    {
      title: "Learning Resources",
      description: "Access curated tutorials, courses and projects.",
      icon: <Box className="w-8 h-8 text-orange-500" />,
      href: "/roadmap",
      ctaLabel: "Browse Resources",
    },
    {
      title: "Progress Tracking",
      description: "Track roadmap progress with interactive checklists.",
      icon: <Search className="w-8 h-8 text-pink-500" />,
      href: "/dashboard",
      ctaLabel: "Track Progress",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <BackgroundPaths>
        <div className="flex flex-col items-center max-w-4xl px-4 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <motion.h1 
            className={`${bitcountPropDoubleInk.className} text-5xl md:text-7xl font-bold tracking-tight text-center bg-clip-text text-transparent bg-linear-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Discover Your Career Path With AI
          </motion.h1>
          <motion.p 
            className="text-xl text-neutral-600 dark:text-neutral-300 text-center max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Leverage advanced machine learning to predict your readiness, identify skill gaps, and get a personalized roadmap to your dream career.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform" onClick={handleCtaClick}>
              {isLoggedIn ? "Continue Journey \u2192" : "Login to Start"}
            </Button>
          </motion.div>
        </div>
      </BackgroundPaths>

      {/* Feature Section */}
      <section className="py-24 bg-neutral-50 dark:bg-black/95">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400">Platform Features</h2>
            <p className="text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">Everything you need to accelerate your career transition and achieve your goals with confidence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <GlowingEffect key={i} className="flex h-full flex-col items-start gap-4">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mt-2">{feature.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-300">{feature.description}</p>
                <div className="mt-auto pt-2">
                  <Link href={isLoggedIn ? feature.href : "/login"}>
                    <Button variant="outline" className="rounded-full px-5">
                      {feature.ctaLabel}
                    </Button>
                  </Link>
                </div>
              </GlowingEffect>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 mt-auto">
        <div className="container mx-auto px-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
          <p>\u00A9 {new Date().getFullYear()} CareerAI Platform. Empowering careers.</p>
        </div>
      </footer>
    </div>
  );
}

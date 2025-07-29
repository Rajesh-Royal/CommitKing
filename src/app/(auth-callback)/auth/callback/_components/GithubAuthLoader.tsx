"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Github, CheckCircle } from "lucide-react"

export default function GithubAuthLoader() {
  const [stage, setStage] = useState<"authenticating" | "verifying" | "complete">("authenticating")
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage("verifying")
      setProgress(60)
    }, 2000)

    const timer2 = setTimeout(() => {
      setStage("complete")
      setProgress(100)
    }, 4000)

    // Simulate progress
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 50) return prev + Math.random() * 10
        if (prev < 90) return prev + Math.random() * 5
        return prev
      })
    }, 200)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearInterval(progressTimer)
    }
  }, [])

  const getStageText = () => {
    switch (stage) {
      case "authenticating":
        return {
          title: "Authenticating with GitHub",
          subtitle: "Securely connecting to your GitHub account...",
        }
      case "verifying":
        return {
          title: "Verifying Credentials",
          subtitle: "Confirming your identity and permissions...",
        }
      case "complete":
        return {
          title: "Authentication Complete",
          subtitle: "Welcome back! Redirecting you now...",
        }
    }
  }

  const stageText = getStageText()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Content Card */}
        <motion.div
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Icon Section */}
          <div className="relative mb-8">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center relative overflow-hidden"
              animate={{
                scale: stage === "complete" ? 1.1 : 1,
                rotate: stage === "authenticating" ? 360 : 0,
              }}
              transition={{
                scale: { duration: 0.3 },
                rotate: {
                  duration: 2,
                  repeat: stage === "authenticating" ? Number.POSITIVE_INFINITY : 0,
                  ease: "linear",
                },
              }}
            >
              <AnimatePresence mode="wait">
                {stage === "complete" ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="github"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Github className="w-10 h-10 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Animated ring */}
              {stage !== "complete" && (
                <motion.div
                  className="absolute inset-0 border-4 border-transparent border-t-white/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              )}
            </motion.div>

            {/* Floating particles */}
            {stage === "complete" && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-purple-400 rounded-full"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                      y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Text Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <h1 className="text-2xl font-bold text-white mb-3">{stageText.title}</h1>
              <p className="text-gray-400 text-sm leading-relaxed">{stageText.subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-500">Progress</span>
              <span className="text-xs text-gray-400">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${stage === "authenticating" ? "bg-blue-500" : "bg-green-500"}`}
                animate={{ scale: stage === "authenticating" ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: stage === "authenticating" ? Number.POSITIVE_INFINITY : 0 }}
              />
              <span className={stage === "authenticating" ? "text-blue-400" : "text-green-400"}>Connect</span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${
                  stage === "verifying" ? "bg-blue-500" : stage === "complete" ? "bg-green-500" : "bg-gray-600"
                }`}
                animate={{ scale: stage === "verifying" ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: stage === "verifying" ? Number.POSITIVE_INFINITY : 0 }}
              />
              <span
                className={
                  stage === "verifying" ? "text-blue-400" : stage === "complete" ? "text-green-400" : "text-gray-500"
                }
              >
                Verify
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <motion.div
                className={`w-2 h-2 rounded-full ${stage === "complete" ? "bg-green-500" : "bg-gray-600"}`}
                animate={{ scale: stage === "complete" ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: stage === "complete" ? Number.POSITIVE_INFINITY : 0 }}
              />
              <span className={stage === "complete" ? "text-green-400" : "text-gray-500"}>Complete</span>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-gray-500 text-xs">Secured by GitHub OAuth • This may take a few moments</p>
        </motion.div>
      </div>
    </div>
  )
}

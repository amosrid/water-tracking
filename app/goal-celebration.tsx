"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Droplets } from "lucide-react"

interface GoalCelebrationProps {
  show: boolean
  target: number
}

export function GoalCelebration({ show, target }: GoalCelebrationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [show])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="bg-blue-500/90 text-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ repeat: 2, duration: 1 }}
              className="mx-auto mb-4 bg-white rounded-full p-3 w-16 h-16 flex items-center justify-center"
            >
              <Droplets className="h-10 w-10 text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-bold mb-2">Goal Achieved! 🎉</h3>
            <p>
              Congratulations! You've reached your daily water intake goal of {target}ml. Stay hydrated and keep up the
              good work!
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}


'use client'

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
            animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f43a09]/10 rounded-full blur-3xl"
        />
        <motion.div
            animate={{
                x: [0, -100, 0],
                y: [0, 100, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#68d388]/10 rounded-full blur-3xl"
        />
        <motion.div
            animate={{
                x: [0, 50, 0],
                y: [0, -50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-[#c2edda]/10 rounded-full blur-3xl"
        />
    </div>

}
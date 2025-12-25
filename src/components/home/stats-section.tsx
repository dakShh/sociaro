'use client'

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isVisible) return;

        const duration = 2000;
        const steps = 60;
        const increment = end / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isVisible, end]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            onViewportEnter={() => setIsVisible(true)}
            viewport={{ once: true }}
            className="text-5xl font-bold bg-gradient-to-r from-[#ffb766] to-[#f43a09] bg-clip-text text-transparent"
        >
            {count.toLocaleString()}{suffix}
        </motion.div>
    );
};

export default function StatsSection() {
    return <section className="py-20 px-6 relative">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { end: 50, suffix: 'K+', label: 'Active Users' },
                    { end: 1, suffix: 'M+', label: 'Posts Scheduled' },
                    { end: 99, suffix: '%', label: 'Uptime' },
                    { end: 24, suffix: '/7', label: 'Support' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                        <p className="text-gray-600 mt-2 text-lg">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>

}
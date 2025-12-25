'use client';

// Core
import { useState } from "react";

// Motion
import { motion } from "framer-motion";

// Icons
import { Check, Clock, LucideIcon, TrendingUp, Zap } from "lucide-react";

export default function FeaturesSection() {
    return <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-5xl font-bold mb-4">
                    Powerful Features for{' '}
                    <span className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] bg-clip-text text-transparent">
                        Modern Teams
                    </span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Everything you need to manage and grow your social media presence
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={Zap}
                    title="AI-Powered Content"
                    description="Generate engaging captions and images instantly with our advanced AI technology"
                    delay={0}
                />
                <FeatureCard
                    icon={Clock}
                    title="Smart Scheduling"
                    description="Schedule posts across all platforms and reach your audience at the perfect time"
                    delay={0.1}
                />
                <FeatureCard
                    icon={TrendingUp}
                    title="Analytics & Insights"
                    description="Track performance metrics and optimize your strategy with real-time data"
                    delay={0.2}
                />
            </div>
        </div>
    </section>
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { icon: LucideIcon, title: string, description: string, delay?: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6 }}
            viewport={{ once: true }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -10, scale: 1.02 }}
            className="relative group"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-[#ffb766]/10 to-[#f43a09]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white border border-gray-100 rounded-2xl p-8 h-full hover:border-[#f43a09]/50 hover:shadow-xl transition-all duration-300">
                <motion.div
                    animate={{ rotate: isHovered ? 360 : 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ffb766] to-[#f43a09] flex items-center justify-center mb-6"
                >
                    <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
                <ul className="mt-6 space-y-3">
                    {['Smart automation', 'Real-time analytics', 'Team collaboration'].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-700">
                            <Check className="w-4 h-4 text-[#68d388]" />
                            {item}
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};
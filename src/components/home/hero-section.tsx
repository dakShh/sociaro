'use client';

// core
import { useEffect, useState } from "react";
import Image from "next/image";

// motion
import { motion } from "framer-motion";

// icons
import { Heart, MessageSquare, MoreHorizontal, Share2, Shield, Sparkles, Star, TrendingUp, Users } from "lucide-react";

// components
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function HeroSection() {

    const words = ['Automate', 'Schedule', 'Analyze', 'Grow'];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [words.length]);
    return <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-8"
            >
                <motion.h1 className="text-7xl md:text-8xl font-extrabold mb-6 leading-tight">
                    <span className="block">Your Social Media,</span>
                    <motion.span
                        key={currentWord}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="block bg-gradient-to-r from-[#ffb766] via-[#f43a09] to-[#68d388] bg-clip-text text-transparent"
                    >
                        {words[currentWord]}
                    </motion.span>
                </motion.h1>
                <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    The all-in-one platform to manage, schedule, and grow your social media presence with AI-powered insights
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 max-w-lg mx-auto"
            >
                <div className="flex w-full max-w-md items-center space-x-2 bg-white p-2 rounded-full shadow-2xl border border-gray-100/50 backdrop-blur-sm">
                    <Input
                        type="email"
                        placeholder="Enter your email address..."
                        className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-base h-12 flex-grow pl-4"
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            size="lg"
                            className="rounded-full px-8 bg-gradient-to-r from-[#ffb766] to-[#f43a09] hover:from-[#ffc980] hover:to-[#ff4d1a] text-white shadow-lg h-12"
                        >
                            Join Waitlist
                        </Button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center justify-center gap-8 text-gray-600"
            >
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span>4.9/5 on G2</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#68d388]" />
                    <span>50K+ Active Users</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#68d388]" />
                    <span>Enterprise Security</span>
                </div>
            </motion.div>

            {/* Floating UI Stack */}
            <div className="mt-20 relative max-w-5xl mx-auto h-[600px] flex items-center justify-center">
                {/* Center Piece: The Main Dashboard Fragment */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="relative z-20 w-full max-w-3xl"
                >
                    <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 overflow-hidden">
                        <div className="bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100">
                            <div className="h-8 bg-gray-100/50 flex items-center gap-2 px-4 border-b border-gray-200/50">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/50" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/50" />
                                </div>
                            </div>
                            <Image
                                src="/home/analytics-page-1.png"
                                alt="Dashboard"
                                width={1200}
                                height={800}
                                className="w-full opacity-90 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>

                    {/* Decorative Background Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#ffb766]/20 to-[#f43a09]/20 blur-3xl -z-10" />
                </motion.div>

                {/* Floating Card 1: Social Post Mockup */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -20, 0],
                        rotate: [-1, 1, -1]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        opacity: { duration: 0.8, repeat: 0 },
                        scale: { duration: 0.8, repeat: 0 }
                    }}
                    className="absolute top-10 -left-10 z-30 w-64 hidden lg:block"
                >
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#ffb766] to-[#f43a09]" />
                            <div>
                                <p className="text-sm font-bold">New Campaign</p>
                                <p className="text-[10px] text-gray-400">Scheduled for 10:00 AM</p>
                            </div>
                            <MoreHorizontal className="ml-auto w-4 h-4 text-gray-300" />
                        </div>
                        <div className="aspect-square rounded-xl bg-gray-50 mb-3 flex items-center justify-center overflow-hidden">
                            <Image src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" alt="Preview" width={400} height={400} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-3 text-gray-400">
                            <Heart className="w-4 h-4" />
                            <MessageSquare className="w-4 h-4" />
                            <Share2 className="w-4 h-4" />
                        </div>
                    </div>
                </motion.div>

                {/* Floating Card 2: Analytics Bubble */}
                <motion.div
                    initial={{
                        opacity: 0,
                    }}
                    animate={{
                        opacity: 1,
                        y: [0, 10, 0],
                        rotate: [1, -1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                        opacity: { duration: 0.8, repeat: 0 }
                    }}
                    className="absolute -bottom-10 -right-10 z-30 w-72 hidden lg:block"
                >
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-[#68d388]" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Monthly Engagement</p>
                                <p className="text-2xl font-bold">+124.5%</p>
                            </div>
                        </div>
                        <div className="flex items-end gap-1.5 h-16">
                            {[30, 45, 25, 60, 75, 50, 90].map((h, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ delay: 1.5 + (i * 0.1), duration: 1 }}
                                    className="flex-1 bg-gradient-to-t from-[#ffb766]/20 to-[#f43a09] rounded-t-sm"
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Floating Card 3: AI Assistant */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: [0, -20, 0],
                        rotate: [-1, 1, -1]
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        opacity: { duration: 0.8, repeat: 0 },
                        scale: { duration: 0.8, repeat: 0 }
                    }}
                    className="absolute top-[20%] -right-20 -translate-y-1/2 z-40 hidden xl:block"
                >
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl p-5 border border-gray-700/50 w-64">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-[#ffb766]" />
                            <span className="text-xs font-semibold uppercase tracking-wider">AI Content Assistant</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed italic">
                            &ldquo;Looks like Tuesday at 6 PM is the best time to post this photo for maximum reach.&rdquo;
                        </p>
                        <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-between items-center">
                            <span className="text-[10px] text-gray-500">Confidence: 98%</span>
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#68d388]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#68d388] opacity-50" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#68d388] opacity-20" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    </section>

}
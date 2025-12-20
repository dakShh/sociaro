'use client'

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Sparkles, Zap, TrendingUp, Shield, Clock,
    Users, ArrowRight, Check, Star, ChevronDown,
    Twitter, Instagram, Facebook, Linkedin, MessageSquare,
    Play, LucideIcon, BarChart3, Heart, Share2, MoreHorizontal,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

export default function Homepage() {
    const [scrollY, setScrollY] = useState(0);
    const { scrollYProgress } = useScroll();

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerOpacity = scrollY > 50 ? 1 : 0;
    const headerBlur = scrollY > 50 ? 'blur(20px)' : 'blur(0px)';

    const words = ['Automate', 'Schedule', 'Analyze', 'Grow'];
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % words.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#fafafa] text-gray-900 overflow-hidden">
            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

            {/* Sticky Navigation */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                style={{
                    backgroundColor: `rgba(255, 255, 255, ${headerOpacity})`,
                    backdropFilter: headerBlur,
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f43a09] flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">SocialFlow</span>
                    </div>
                    {/* <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-[#f43a09] transition-colors">Features</a>
                        <a href="#benefits" className="text-gray-600 hover:text-[#f43a09] transition-colors">Benefits</a>
                        <a href="#pricing" className="text-gray-600 hover:text-[#f43a09] transition-colors">Pricing</a>
                    </nav> */}
                    <div className="flex items-center gap-4">
                        {/* <Link href={'/login'}>
                            <Button variant="ghost" className="text-gray-900 hover:text-[#f43a09]">
                                Log In
                            </Button>
                        </Link> */}
                        <Link href={'/register'}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] hover:from-[#ffc980] hover:to-[#ff4d1a] text-white shadow-lg shadow-[#f43a09]/30">
                                    Join Waitlist
                                </Button>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
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
                                    <img
                                        src="home/analytics-page-1.png"
                                        alt="Dashboard"
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
                                    <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" alt="Preview" className="w-full h-full object-cover" />
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
                                    "Looks like Tuesday at 6 PM is the best time to post this photo for maximum reach."
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

            {/* Stats Section */}
            <section className="py-20 px-6 relative">
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

            {/* Features Section */}
            <section id="features" className="py-20 px-6">
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

            {/* Benefits Section */}
            <section id="benefits" className="py-20 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    {[
                        {
                            title: 'Unified Inbox',
                            description: 'Manage all your conversations from one place',
                            features: ['Multi-platform messaging', 'Smart filters', 'Auto-replies'],
                            image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
                            gradient: 'from-[#ffb766] to-[#f43a09]'
                        },
                        {
                            title: 'Content Calendar',
                            description: 'Visualize and plan your content strategy',
                            features: ['Drag & drop scheduling', 'Team collaboration', 'Content templates'],
                            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80',
                            gradient: 'from-[#68d388] to-[#c2edda]'
                        },
                    ].map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className={cn(
                                "grid md:grid-cols-2 gap-12 items-center",
                                i % 2 === 1 && "md:grid-flow-dense"
                            )}
                        >
                            <div className={i % 2 === 1 ? "md:col-start-2" : ""}>
                                <h3 className="text-4xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                <p className="text-xl text-gray-600 mb-6">{benefit.description}</p>
                                <ul className="space-y-3 mb-8">
                                    {benefit.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-3">
                                            <div className={cn("w-6 h-6 rounded-full bg-gradient-to-r flex items-center justify-center", benefit.gradient)}>
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={'/register'}>
                                    <Button className={cn("bg-gradient-to-r shadow-xl", benefit.gradient)}>
                                        Learn More <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className={i % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}
                            >
                                <div className="relative">
                                    <div className={cn("absolute inset-0 bg-gradient-to-r blur-2xl opacity-50", benefit.gradient)} />
                                    <img
                                        src={benefit.image}
                                        alt={benefit.title}
                                        className="relative rounded-2xl shadow-2xl border border-gray-200"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Loved by{' '}
                        <span className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] bg-clip-text text-transparent">
                            Thousands
                        </span>
                    </motion.h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah Johnson', role: 'Marketing Manager', content: 'SocialFlow has completely transformed how we manage our social media. The AI features are incredible!', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' },
                            { name: 'Michael Chen', role: 'Content Creator', content: 'Best scheduling tool I\'ve used. The analytics help me understand what works and what doesn\'t.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80' },
                            { name: 'Emily Rodriguez', role: 'Social Media Director', content: 'The unified inbox is a game-changer. Managing multiple accounts has never been easier.', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80' },
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-[#f43a09]/50 hover:shadow-xl transition-all"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
                                <div className="flex items-center gap-4">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            {/* <section id="pricing" className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl font-bold mb-4">
                            Simple,{' '}
                            <span className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] bg-clip-text text-transparent">
                                Transparent Pricing
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600">Choose the plan that fits your needs</p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { name: 'Starter', price: '$19', features: ['5 Social Accounts', '100 Posts/month', 'Basic Analytics', 'Email Support'], popular: false },
                            { name: 'Pro', price: '$49', features: ['15 Social Accounts', 'Unlimited Posts', 'Advanced Analytics', 'Priority Support', 'AI Features'], popular: true },
                            { name: 'Enterprise', price: 'Custom', features: ['Unlimited Accounts', 'Unlimited Posts', 'Custom Analytics', '24/7 Support', 'API Access', 'White Label'], popular: false },
                        ].map((plan, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className={cn(
                                    "relative bg-white border rounded-2xl p-8",
                                    plan.popular ? "border-[#f43a09] shadow-2xl shadow-[#f43a09]/20" : "border-gray-100"
                                )}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] px-4 py-1 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-center gap-3">
                                            <Check className="w-5 h-5 text-[#68d388]" />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={'/register'}>
                                    <Button
                                        className={cn(
                                            "w-full",
                                            plan.popular
                                                ? "bg-gradient-to-r from-[#ffb766] to-[#f43a09] hover:from-[#ffc980] hover:to-[#ff4d1a] text-white"
                                                : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                                        )}
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section> */}

            {/* FAQ */}
            <section className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl font-bold text-center mb-16"
                    >
                        Frequently Asked{' '}
                        <span className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] bg-clip-text text-transparent">
                            Questions
                        </span>
                    </motion.h2>

                    <div className="space-y-4">
                        {[
                            { q: 'How does the free trial work?', a: 'Start with a 14-day free trial, no credit card required. Cancel anytime.' },
                            { q: 'Can I change my plan later?', a: 'Yes! Upgrade or downgrade your plan at any time from your account settings.' },
                            { q: 'Which platforms do you support?', a: 'We support Twitter, Instagram, Facebook, LinkedIn, and TikTok.' },
                            { q: 'Is my data secure?', a: 'Absolutely. We use enterprise-grade encryption and comply with all data protection regulations.' },
                        ].map((faq, i) => (
                            <motion.details
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white border border-gray-100 rounded-xl p-6 hover:border-[#f43a09]/50 hover:shadow-lg transition-all group"
                            >
                                <summary className="text-lg font-semibold cursor-pointer list-none flex items-center justify-between">
                                    {faq.q}
                                    <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
                                </summary>
                                <p className="mt-4 text-gray-600">{faq.a}</p>
                            </motion.details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ffb766]/10 to-[#f43a09]/10 rounded-3xl blur-3xl" />
                    <div className="relative bg-white border border-gray-100 rounded-3xl p-12 shadow-2xl">
                        <h2 className="text-5xl font-bold mb-6">
                            Ready to{' '}
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                                Transform
                            </span>{' '}
                            Your Social Media?
                        </h2>
                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Join thousands of teams already using SocialFlow to grow their presence
                        </p>
                        {/* <Link href={'/register'}>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    size="lg"
                                    className="text-lg px-8 py-6 bg-gradient-to-r from-[#ffb766] to-[#f43a09] hover:from-[#ffc980] hover:to-[#ff4d1a] shadow-2xl shadow-[#f43a09]/50"
                                >
                                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </motion.div>
                        </Link> */}
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="border-t border-gray-200 py-12 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 rounded-lg bg-[#f43a09] flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold">SocialFlow</span>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Empowering teams to manage and grow their social media presence with AI-powered tools.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#features" className="hover:text-[#f43a09] transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-[#f43a09] transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-[#f43a09] transition-colors">Integrations</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li><a href="#" className="hover:text-[#f43a09] transition-colors">About</a></li>
                                <li><a href="#" className="hover:text-[#f43a09] transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-[#f43a09] transition-colors">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Newsletter</h4>
                            <p className="text-gray-600 text-sm mb-3">Get the latest updates</p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter email"
                                    className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400"
                                />
                                <Button className="bg-gradient-to-r from-[#ffb766] to-[#f43a09]">
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200">
                        <p className="text-gray-600 text-sm">© 2024 SocialFlow. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-600 hover:text-[#f43a09] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </motion.a>
                            <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-600 hover:text-[#f43a09] transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </motion.a>
                            <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-600 hover:text-[#f43a09] transition-colors">
                                <Instagram className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
'use client';

// Core
import Link from "next/link";
import Image from "next/image";

// UI
import { motion } from "framer-motion";

// Icons
import { ArrowRight, Check } from 'lucide-react';

// Components
import { Button } from "@/components/ui/button";

// Utils
import { cn } from "@/lib/utils";

export default function BenefitsSection() {
    return <section id="benefits" className="py-20 px-6">
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
                            <Image
                                src={benefit.image}
                                alt={benefit.title}
                                width={800}
                                height={600}
                                className="relative rounded-2xl shadow-2xl border border-gray-200"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            ))}
        </div>
    </section>

}
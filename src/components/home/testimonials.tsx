'use client';

// Core
import Image from "next/image";

// Motion
import { motion } from "framer-motion";

// Icons
import { Star } from "lucide-react";

export default function Testimonials() {
    return <section className="py-20 px-6">
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
                            <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="w-12 h-12 rounded-full" />
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

}
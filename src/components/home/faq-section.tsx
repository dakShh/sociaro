'use client';

// Motion
import { motion } from "framer-motion";

// Icons
import { ChevronDown } from "lucide-react";

export default function FaqSection() {
    return <section className="py-20 px-6">
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

}
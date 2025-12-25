'use client';
// Core
import Link from 'next/link';

// Motion
import { motion } from 'framer-motion';

// Utils
import { cn } from '@/lib/utils';

// Components
import { Button } from '@/components/ui/button';

// Icons
import { Check } from 'lucide-react';
export default function Pricing() {
    return <section id="pricing" className="py-20 px-6">
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
    </section>
}
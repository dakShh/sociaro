'use client';

// Motion
import { motion } from "framer-motion";

export function Cta1() {
    return <section className="py-32 px-6">
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

}
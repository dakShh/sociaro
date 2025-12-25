'use client';

// Motion
import { motion } from "framer-motion";

// Icons
import { Zap, ArrowRight, Twitter, Instagram, Linkedin } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
    return <footer className="border-t border-gray-200 py-12 px-6 bg-white">
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
}
'use client'

// core
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'

// ui components
import { Button } from '@/components/ui/button';

// icons
import { Zap } from 'lucide-react';

// animations
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { signInWithGoogle } from '@/actions/auth/signin';

export default function Header() {
    const { data: session, status } = useSession()
    const isLoading = status === 'loading';
    const router = useRouter()

    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const headerOpacity = scrollY > 50 ? 1 : 0;
    const headerBlur = scrollY > 50 ? 'blur(20px)' : 'blur(0px)';

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <motion.header
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

                {session?.user ?
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => router.push('/dashboard')} className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] hover:from-[#ffc980] hover:to-[#ff4d1a] text-white shadow-lg shadow-[#f43a09]/30">
                            View Dashboard
                        </Button>
                    </motion.div>
                    : <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button onClick={() => signInWithGoogle()} className="bg-gradient-to-r from-[#ffb766] to-[#f43a09] hover:from-[#ffc980] hover:to-[#ff4d1a] text-white shadow-lg shadow-[#f43a09]/30">
                            Sign Up
                        </Button>
                    </motion.div>
                }
            </div>
        </div>
    </motion.header>
}
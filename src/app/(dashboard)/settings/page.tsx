'use client'

import { useEffect, useState } from 'react';
import {
    Link2, Plus, Loader2, Check,

    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const platformIcons: { [key: string]: string } = {
    threads: '@',
    instagram: '📷',
    facebook: 'f',
    linkedin: 'in',
    tiktok: '♪'
};

const platformColors: { [key: string]: string } = {
    threads: 'bg-black',
    instagram: 'bg-gradient-to-br from-purple-600 to-pink-500',
    facebook: 'bg-blue-600',
    linkedin: 'bg-blue-700',
    tiktok: 'bg-black'
};

interface Platform {
    platform_id: string;
    name: string;
    display_name: string;
    connected: boolean;
    account: Account | null;
}

interface Account {
    account_id: string;
    platform_id: string;
    platform_specific_id: string;
    account_name: string;
    handle: string;
    token_expires_at?: Date;
    profile_picture_url?: string;
    account_type?: string;
    followers_count?: number;
    follows_count?: number;
}

export default function SettingsPage() {
    const [platforms, setPlatforms] = useState<Platform[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        setIsLoading(true)
        fetch('/api/platforms')
            .then((r) => {
                return r.json();
            })
            .then((data) => setPlatforms(data))
            .finally(() => setIsLoading(false))
    }, []);

    function handleConnect(platform: string) {
        if (platform === 'instagram') {
            window.location.href = '/api/integrations/meta/connect'
        }
    }

    return (
        <div className="max-w-3xl w-full space-y-8">
            <div className="w-full">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your connected accounts and preferences</p>
            </div>

            {/* Connected Accounts */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#c2edda] flex items-center justify-center">
                            <Link2 className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Connected Accounts</h2>
                            <p className="text-sm text-gray-500">Manage your social media accounts</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-32">
                            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : (
                        platforms?.map((platform, index) => (
                            <motion.div
                                key={platform.platform_id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex gap-4">
                                    <div className={cn(
                                        "w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold",
                                        platformColors[platform.name]
                                    )}>
                                        {platformIcons[platform.name]}
                                    </div>
                                    <div>
                                        <div className="flex flex-col  ">
                                            <p className={cn(platform.connected ? 'text-gray-900' : 'text-gray-500', "font-medium ")}>{platform.display_name}</p>
                                            {platform.connected ?
                                                <Badge className="bg-[#68d388]/20 text-[#2d8a50] text-xs">
                                                    <Check className="w-3 h-3 mr-1" />
                                                    Connected
                                                </Badge>
                                                : <Badge className="bg-muted text-muted-foreground text-xs">
                                                    <X className="w-3 h-3 mr-1" />
                                                    Not Connected
                                                </Badge>
                                            }
                                        </div>

                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    {!platform.connected &&
                                        <Button
                                            onClick={() => handleConnect(platform.name)}
                                            className={cn('bg-[#ff967e] border border-[#ff967e] gap-2',
                                                'hover:bg-primary/90 hover:text-white hover:shadow-md',
                                                'transition-all hover:-translate-x-1 translate-x-0 duration-400 cursor-pointer')}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Connect
                                        </Button>

                                    }
                                    {/* Commenting it out since the follower count is not a live count.. its a static count */}
                                    {platform.account?.handle && (
                                        <>
                                            <p className="text-sm text-gray-500">@{platform.account.handle}</p>
                                            {/*    <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {platform.account?.followers_count || 0} followers
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {platform.account?.follows_count || 0} following
                                                </p>
                                            </div>*/}
                                        </>
                                    )}
                                </div>
                            </motion.div>)
                        ))}

                </div>
            </div>
        </div>
    );
}
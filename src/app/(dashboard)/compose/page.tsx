'use client';

import React, { useState, useRef } from 'react';
import {
    Image as ImageIcon, Calendar, Clock, Send, Loader2, X, Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Image from 'next/image';

// const charLimits = {
//     twitter: 280,
//     instagram: 2200,
//     facebook: 63206,
//     linkedin: 3000,
//     tiktok: 2200
// };

export default function Compose() {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [caption, setCaption] = useState('');
    const [scheduledDate, setScheduledDate] = useState(null);
    const [scheduledTime, setScheduledTime] = useState('12:00');
    const [isUploading, setIsUploading] = useState(false);
    const [editingDraft, setEditingDraft] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [postType, setPostType] = useState('single');

    const charLimit = 2200;
    const charCount = caption.length;
    const isOverLimit = charCount > charLimit;

    const [mediaFilesPreview, setMediaFilesPreview] = useState<{ file: File; previewUrl: string; type: string; id: string }[]>([]);

    const resetForm = () => {
        setCaption('');
        setMediaFilesPreview([]);
        setScheduledDate(null);
        setEditingDraft(null);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        if (selectedFiles.length === 0) return;

        setIsUploading(true);
        try {

            const newFiles = selectedFiles.map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
                type: file.type?.split('/')[0],
                id: Math.random().toString(36).substr(2, 9),
            }));

            if (postType === 'single') {
                setMediaFilesPreview(newFiles)
            } else {
                setMediaFilesPreview(prev => [...prev, ...newFiles]);
            }
        } catch (error) {
            console.error('Upload failed:', error);
        }
        setIsUploading(false);
    };

    const removeFile = (id: string, url: string) => {
        setMediaFilesPreview((prev) => prev.filter((f) => f.id !== id));
        URL.revokeObjectURL(url); // Clean up memory
    };

    const handleSubmit = async () => {
        setIsLoading(true);

        try {

            // uploading the file to cloudflare
            const formData = new FormData();
            // Append each file individually
            mediaFilesPreview.forEach((fileObj) => {
                if (fileObj?.file) {
                    formData.append('files', fileObj.file);
                }
            });

            const response = await fetch(`/api/cloudflare/upload`, {
                method: 'POST',
                body: formData
            })

            console.log("[Post] Uploading to cloudflare")
            const cloudflareResponse = await response.json();
            console.log("[Post] Cloudflare response: ", cloudflareResponse)
            if (cloudflareResponse.failed.length > 1 || cloudflareResponse.data.length === 0) {
                throw new Error("Failed to upload a media")
            }



            console.log("[Post] Uploaded to cloudflare...")

            const mediaType = mediaFilesPreview.map((item) => item.type);
            const mediaUrls = cloudflareResponse?.data || [];

            console.log("[Post] Creating a instagram image container and publishing....")
            const mediaContainer = await fetch('/api/platforms/instagram/publish-content', {
                method: 'POST',
                body: JSON.stringify({ mediaType, mediaUrls, caption, postType })
            })

            const mediaContainerResponse = await mediaContainer.json();
            console.log("[Post] Published to instagram...", mediaContainerResponse)

            resetForm();
        } catch (error) {
            console.log("error uploading file/ client: ", error)
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Compose</h1>
                    <p className="text-gray-500 mt-1">Create and manage your posts</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Composer */}
                <div className="col-span-2 gap-y-2 flex flex-col">
                    <div className=' '>
                        <Select value={postType} onValueChange={setPostType}>
                            <SelectTrigger className="w-full bg-card">
                                <SelectValue placeholder="Select Post Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Type of Post</SelectLabel>
                                    <SelectItem value="single" >Single <span className="text-xs text-gray-500">Image / Video</span></SelectItem>
                                    <SelectItem value="carousel">Carousel <span className="text-xs text-gray-500">Multiple Images / Videos</span></SelectItem>
                                    <SelectItem value="reel">Reel <span className="text-xs text-gray-500">Video</span></SelectItem>
                                    <SelectItem value="story">Story <span className="text-xs text-gray-500">Image / Video</span></SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        {/* {selectedAccount && (
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-12 h-12 rounded-full bg-[#c2edda] flex items-center justify-center">
                                    <span className="font-bold text-gray-700">{selectedAccount.account_name[0]}</span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{selectedAccount.account_name}</p>
                                    <p className="text-sm text-gray-500">@{selectedAccount.handle} • {platform}</p>
                                </div>
                                {editingDraft && (
                                    <Badge className="ml-auto bg-[#ffb766] text-gray-900">Editing Draft</Badge>
                                )}
                            </div>
                        )} */}

                        <Textarea
                            placeholder="Write a caption..."
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            className="border-0 p-0 shadow-none text-lg focus-visible:ring-0 placeholder:text-gray-400 resize-none"
                        />

                        {/* AI Caption & Hashtag Buttons */}
                        {/*    <div className="flex items-center gap-2 mt-3">
                          <AICaptionGenerator
                                platform={platform}
                                currentContent={content}
                                onApply={(caption) => setContent(caption)}
                            />
                            <AIHashtagGenerator
                                platform={platform}
                                content={content}
                                onApply={(hashtags) => setContent(prev => prev + '\n\n' + hashtags)}
                            /> 
                        </div>*/}

                        {/* Media Preview */}
                        <AnimatePresence>
                            {mediaFilesPreview.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-3 gap-3 mt-6"
                                >
                                    {mediaFilesPreview.map((file, index) => (
                                        <div key={index} className="relative group rounded-xl overflow-hidden aspect-square">
                                            {file.type === 'video' ? (
                                                <video
                                                    src={file.previewUrl}
                                                    className="w-full h-full object-cover"
                                                    controls
                                                    muted
                                                />
                                            ) : (
                                                <Image src={file.previewUrl} alt="" className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                onClick={() => removeFile(file.id, file.previewUrl)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Actions */}
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    accept="image/*,video/*"
                                    multiple={postType === 'carousel'} // multiple files for carousel
                                    className="hidden"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => fileInputRef?.current?.click()}
                                    disabled={isUploading}
                                    className="rounded-xl"
                                    title="Upload media"
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <ImageIcon className="w-5 h-5 text-gray-600" />
                                    )}
                                </Button>

                                {/* <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setAiImageOpen(true)}
                                    className="rounded-xl"
                                    title="Generate with AI"
                                >
                                    <Sparkles className="w-5 h-5 text-[#f43a09]" />
                                </Button> */}

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="ghost" size="icon" className="rounded-xl">
                                            <Calendar className="w-5 h-5 text-gray-600" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        {/* <CalendarComponent
                                            mode="single"
                                            selected={scheduledDate}
                                            onSelect={setScheduledDate}
                                            disabled={(date) => date < new Date()}
                                        /> */}
                                        <div className="p-3 border-t">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-500" />
                                                <Input
                                                    type="time"
                                                    value={scheduledTime}
                                                    onChange={(e) => setScheduledTime(e.target.value)}
                                                    className="w-32"
                                                />
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>

                                {scheduledDate && (
                                    <Badge className="bg-[#ffb766]/20 text-[#b37a30] gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {/* {format(scheduledDate, 'MMM d')} at {scheduledTime} */}
                                        <button onClick={() => setScheduledDate(null)}>
                                            <X className="w-3 h-3 ml-1" />
                                        </button>
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={cn(
                                    "text-sm font-medium",
                                    isOverLimit ? "text-red-500" : "text-gray-400"
                                )}>
                                    {charCount}/{charLimit}
                                </span>

                                <div className="flex gap-2">
                                    {editingDraft && (
                                        <Button
                                            variant="outline"
                                            onClick={resetForm}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        onClick={() => handleSubmit()}
                                        disabled={isLoading || !caption.trim()}
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Draft
                                    </Button>

                                    {scheduledDate ? (
                                        <Button
                                            className="bg-[#ffb766] hover:bg-[#f5a54d] text-gray-900"
                                            onClick={() => handleSubmit()}
                                            disabled={isLoading || !caption.trim() || isOverLimit}
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Schedule
                                        </Button>
                                    ) : (
                                        <Button
                                            className="bg-[#f43a09] hover:bg-[#d93308]"
                                            onClick={() => handleSubmit()}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                                            Post Now
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drafts Sidebar */}
                {/* <div className="col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Drafts
                            </h3>
                        </div>
                         <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                            {draftsLoading ? (
                                <div className="flex items-center justify-center h-32">
                                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                </div>
                            ) : drafts.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No drafts saved
                                </div>
                            ) : (
                                drafts.map((draft) => (
                                    <div
                                        key={draft.id}
                                        className={cn(
                                            "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                                            editingDraft?.id === draft.id && "bg-[#c2edda]/20"
                                        )}
                                        onClick={() => loadDraft(draft)}
                                    >
                                        <p className="text-sm text-gray-700 line-clamp-2 mb-2">{draft.content}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                {format(new Date(draft.created_date), 'MMM d')}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteMutation.mutate(draft.id);
                                                }}
                                                className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div> 
                    </div>
                </div>*/}
            </div>

            {/* AI Image Generator Modal */}
            {/* <AIImageGenerator
                open={aiImageOpen}
                onClose={() => setAiImageOpen(false)}
                onImageGenerated={(url) => setMediaUrls(prev => [...prev, url])}
            /> */}
        </div>
    );
}
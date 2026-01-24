import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, RefreshCw, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

const models = [
  { id: 'dalle', name: 'DALL-E' },
  { id: 'stable-diffusion', name: 'Stable Diffusion' },
  { id: 'midjourney', name: 'Midjourney Style' }
];

const aspectRatios = [
  { id: '1:1', name: 'Square (1:1)', desc: 'Instagram, Facebook' },
  { id: '4:5', name: 'Portrait (4:5)', desc: 'Instagram Feed' },
  { id: '9:16', name: 'Story (9:16)', desc: 'Instagram Stories, TikTok' }
];

const styles = [
  'Professional', 'Casual', 'Minimalist', 'Vibrant', 
  'Cinematic', 'Artistic', 'Corporate', 'Playful'
];

export default function AIImageGenerator({ open, onClose, onImageGenerated }) {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('dalle');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [style, setStyle] = useState('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const enhancedPrompt = `${prompt}, ${style.toLowerCase()} style, high quality, ${aspectRatio} aspect ratio`;
      const result = await base44.integrations.Core.GenerateImage({
        prompt: enhancedPrompt
      });
      setGeneratedImage(result.url);
    } catch (error) {
      console.error('Failed to generate image:', error);
    }
    setIsGenerating(false);
  };

  const handleUseImage = () => {
    if (generatedImage) {
      onImageGenerated(generatedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedImage(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#f43a09]" />
            AI Image Generator
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-4">
          {/* Left: Controls */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Describe your image</Label>
              <Textarea
                placeholder="A modern office workspace with natural lighting..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map(m => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <Select value={aspectRatio} onValueChange={setAspectRatio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aspectRatios.map(ar => (
                    <SelectItem key={ar.id} value={ar.id}>
                      <div>
                        <div className="font-medium">{ar.name}</div>
                        <div className="text-xs text-gray-500">{ar.desc}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-[#f43a09] hover:bg-[#d93308]"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Image
                </>
              )}
            </Button>
          </div>

          {/* Right: Preview */}
          <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center"
                >
                  <Loader2 className="w-12 h-12 animate-spin text-[#f43a09] mx-auto mb-4" />
                  <p className="text-sm text-gray-500">Creating your image...</p>
                </motion.div>
              ) : generatedImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full"
                >
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-lg shadow-lg"
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={handleGenerate}
                      className="flex-1"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      onClick={handleUseImage}
                      className="flex-1 bg-[#68d388] hover:bg-[#5bc278]"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Use Image
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Your generated image will appear here</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
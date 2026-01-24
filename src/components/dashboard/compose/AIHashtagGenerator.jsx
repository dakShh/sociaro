import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Hash, Loader2, Plus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { motion } from 'framer-motion';

export default function AIHashtagGenerator({ platform, content, onApply }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hashtags, setHashtags] = useState([]);
  const [selectedHashtags, setSelectedHashtags] = useState([]);
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate relevant hashtags for a ${platform || 'social media'} post.
      ${content ? `Post content: ${content}` : ''}
      
      Return a JSON object with:
      - trending: array of 3-5 currently trending hashtags
      - niche: array of 3-5 niche-specific hashtags
      - general: array of 3-5 general engagement hashtags
      
      Mix high competition and low competition tags. Return only hashtag text without # symbol.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            trending: { type: 'array', items: { type: 'string' } },
            niche: { type: 'array', items: { type: 'string' } },
            general: { type: 'array', items: { type: 'string' } }
          }
        }
      });

      const allHashtags = [
        ...(result.trending || []).map(h => ({ text: h, type: 'trending' })),
        ...(result.niche || []).map(h => ({ text: h, type: 'niche' })),
        ...(result.general || []).map(h => ({ text: h, type: 'general' }))
      ];
      
      setHashtags(allHashtags);
      setSelectedHashtags([]);
    } catch (error) {
      console.error('Failed to generate hashtags:', error);
    }
    setIsGenerating(false);
  };

  const toggleHashtag = (hashtag) => {
    setSelectedHashtags(prev => {
      const exists = prev.find(h => h.text === hashtag.text);
      if (exists) {
        return prev.filter(h => h.text !== hashtag.text);
      }
      return [...prev, hashtag];
    });
  };

  const handleApply = () => {
    const hashtagText = selectedHashtags.map(h => `#${h.text}`).join(' ');
    onApply(hashtagText);
    setOpen(false);
  };

  const typeColors = {
    trending: 'bg-[#f43a09]/10 text-[#f43a09] border-[#f43a09]/20',
    niche: 'bg-[#68d388]/10 text-[#2d8a50] border-[#68d388]/20',
    general: 'bg-[#ffb766]/10 text-[#b37a30] border-[#ffb766]/20'
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Hash className="w-4 h-4" />
          Generate Hashtags
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">AI Hashtag Generator</h3>
            <Hash className="w-4 h-4 text-[#f43a09]" />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-[#f43a09] hover:bg-[#d93308]"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Hashtags
              </>
            )}
          </Button>

          {hashtags.length > 0 && (
            <>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Trending</Label>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.filter(h => h.type === 'trending').map((hashtag, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => toggleHashtag(hashtag)}
                        className={`px-3 py-1 rounded-full text-xs border-2 transition-all ${
                          selectedHashtags.find(h => h.text === hashtag.text)
                            ? 'bg-[#f43a09] text-white border-[#f43a09]'
                            : typeColors[hashtag.type]
                        }`}
                      >
                        #{hashtag.text}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">Niche</Label>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.filter(h => h.type === 'niche').map((hashtag, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => toggleHashtag(hashtag)}
                        className={`px-3 py-1 rounded-full text-xs border-2 transition-all ${
                          selectedHashtags.find(h => h.text === hashtag.text)
                            ? 'bg-[#68d388] text-white border-[#68d388]'
                            : typeColors[hashtag.type]
                        }`}
                      >
                        #{hashtag.text}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-gray-500 mb-2 block">General</Label>
                  <div className="flex flex-wrap gap-2">
                    {hashtags.filter(h => h.type === 'general').map((hashtag, idx) => (
                      <motion.button
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => toggleHashtag(hashtag)}
                        className={`px-3 py-1 rounded-full text-xs border-2 transition-all ${
                          selectedHashtags.find(h => h.text === hashtag.text)
                            ? 'bg-[#ffb766] text-gray-900 border-[#ffb766]'
                            : typeColors[hashtag.type]
                        }`}
                      >
                        #{hashtag.text}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {selectedHashtags.length > 0 && (
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">Selected ({selectedHashtags.length})</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedHashtags([])}
                      className="h-6 text-xs"
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedHashtags.map((hashtag, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        #{hashtag.text}
                        <button onClick={() => toggleHashtag(hashtag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={handleApply}
                    className="w-full bg-[#68d388] hover:bg-[#5bc278]"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Caption
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
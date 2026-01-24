import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

const tones = ['Professional', 'Casual', 'Funny', 'Inspirational', 'Educational'];
const objectives = ['Engagement', 'Awareness', 'Sales', 'Community', 'Information'];

export default function AICaptionGenerator({ platform, currentContent, onApply }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [tone, setTone] = useState('Professional');
  const [objective, setObjective] = useState('Engagement');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const prompt = `Generate 3 different ${tone.toLowerCase()} social media captions for ${platform || 'social media'}. 
      The objective is ${objective.toLowerCase()}.
      ${currentContent ? `Current content context: ${currentContent}` : ''}
      
      Return a JSON array with 3 caption objects, each having "text" field.
      Keep captions concise and engaging, appropriate for ${platform || 'social media'}.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            captions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  text: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setCaptions(result.captions || []);
    } catch (error) {
      console.error('Failed to generate captions:', error);
    }
    setIsGenerating(false);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleApply = (caption) => {
    onApply(caption.text);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Suggest Caption
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">AI Caption Generator</h3>
            <Sparkles className="w-4 h-4 text-[#f43a09]" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs">Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Objective</Label>
              <Select value={objective} onValueChange={setObjective}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {objectives.map(o => (
                    <SelectItem key={o} value={o}>{o}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              'Generate Captions'
            )}
          </Button>

          {captions.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {captions.map((caption, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm text-gray-700 mb-2">{caption.text}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(caption.text, index)}
                      className="h-7 text-xs"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApply(caption)}
                      className="h-7 text-xs bg-[#68d388] hover:bg-[#5bc278]"
                    >
                      Use This
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
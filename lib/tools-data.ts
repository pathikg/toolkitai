import {
  Users,
  Eraser,
  FileImage,
  Camera,
  PenTool,
  Video,
  Wand2,
  Music,
  Type,
  Shirt,
  Mic,
  Scissors,
  Film,
} from "lucide-react";

// Available Tools - Ready to use
export const availableTools = [
  {
    id: "virtual-try-on",
    name: "Virtual Try-On",
    description:
      "See how clothes look on you instantly with AI virtual try-on.",
    icon: Shirt,
    href: "/tools/virtual-try-on",
    category: "image" as const,
  },
  {
    id: "bg-removal",
    name: "Background Removal",
    description:
      "Remove backgrounds from images instantly with AI-powered precision.",
    icon: Eraser,
    href: "/tools/bg-removal",
    category: "image" as const,
  },
  {
    id: "face-swap",
    name: "Face Swap",
    description:
      "Swap faces in photos with AI precision. Perfect for creative projects and fun edits.",
    icon: Users,
    href: "/tools/face-swap",
    category: "image" as const,
  },
  {
    id: "podcast-creator",
    name: "AI Podcast Creator",
    description:
      "Generate grounded podcast dialogues between Emily and Mark on any topic.",
    icon: Mic,
    href: "/tools/podcast-creator",
    category: "audio" as const,
  },
  {
    id: "celebrity-selfie",
    name: "Selfie with Celebrity",
    description:
      "Create amazing selfies with your favorite celebrities using AI face swap.",
    icon: Camera,
    href: "/tools/celebrity-selfie",
    category: "image" as const,
  },
  {
    id: "hairstyle-grid",
    name: "Hairstyle Grid",
    description:
      "See yourself with 9 different hairstyles in a beautiful 3x3 grid using AI.",
    icon: Scissors,
    href: "/tools/hairstyle-grid",
    category: "image" as const,
  },
  {
    id: "hand-drawn-portrait",
    name: "Hand-Drawn Portrait",
    description:
      "Transform photos into hand-drawn portrait illustrations in black and red pen on notebook paper style.",
    icon: PenTool,
    href: "/tools/hand-drawn-portrait",
    category: "image" as const,
  },
  {
    id: "cinematic-storyboard",
    name: "Cinematic Storyboard",
    description:
      "Transform a single image into a 6-shot storyboard with different camera angles.",
    icon: Film,
    href: "/tools/cinematic-storyboard",
    category: "image" as const,
  },
];

// Coming Soon - Tools in development
export const upcomingTools = [
  {
    id: "gif-maker",
    name: "GIF Maker",
    description:
      "Create animated GIFs from videos or images with custom settings.",
    icon: FileImage,
    category: "video" as const,
  },
  {
    id: "mugshot-maker",
    name: "Mugshot Generator",
    description: "Generate realistic mugshot-style photos with AI technology.",
    icon: Camera,
    category: "image" as const,
  },
  {
    id: "poem-generator",
    name: "Poem Generator",
    description:
      "Create beautiful poems instantly using advanced AI language models.",
    icon: PenTool,
    category: "text" as const,
  },
  {
    id: "video-enhance",
    name: "Video Enhancer",
    description: "Enhance video quality with AI upscaling and restoration.",
    icon: Video,
    category: "video" as const,
  },
  {
    id: "image-upscale",
    name: "Image Upscaler",
    description: "Upscale images without quality loss using AI enhancement.",
    icon: Wand2,
    category: "image" as const,
  },
  {
    id: "voice-clone",
    name: "Voice Cloner",
    description: "Clone and synthesize voices with AI technology.",
    icon: Music,
    category: "audio" as const,
  },
  {
    id: "text-summarize",
    name: "Text Summarizer",
    description: "Summarize long texts intelligently with AI.",
    icon: Type,
    category: "text" as const,
  },
];

// All tools combined (for when you need everything)
export const allTools = [...availableTools, ...upcomingTools];

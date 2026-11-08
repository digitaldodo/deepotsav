// Core Experience Configuration Schema for Deepotsav
// This schema drives the entire recipient experience renderer

export type TemplateId =
  | 'royal-gold'
  | 'traditional-rangoli'
  | 'minimal-luxe'
  | 'midnight-celebration'
  | 'marigold-glow'
  | 'festive-fun';

export type ModuleId =
  | 'welcome'
  | 'diya-lighting'
  | 'rangoli'
  | 'fireworks'
  | 'gift-reveal'
  | 'memory-gallery'
  | 'personal-wishes'
  | 'finale';

export type Language = 'english' | 'hindi' | 'hinglish';
export type Tone = 'traditional' | 'emotional' | 'warm' | 'funny' | 'professional';
export type AnimationIntensity = 'minimal' | 'moderate' | 'full';

export interface PhotoItem {
  id: string;
  url: string; // object URL (local) or Supabase storage URL
  caption?: string;
  order: number;
}

export interface ModuleConfig {
  id: ModuleId;
  enabled: boolean;
  order: number;
}

export interface PersonalizationConfig {
  senderName: string;
  recipientName: string;
  greeting: string;
  mainMessage: string;
  additionalWishes?: string;
  signature?: string;
  language: Language;
  tone: Tone;
}

export interface AppearanceConfig {
  templateId: TemplateId;
  animationIntensity: AnimationIntensity;
  ambientEffects: boolean;
  customAccentColor?: string;
}

export interface MediaConfig {
  photos: PhotoItem[];
  voiceMessageUrl?: string;
  backgroundMusicUrl?: string;
  musicDefaultOff: boolean;
}

export interface AdvancedConfig {
  passwordProtected: boolean;
  password?: string;
  scheduledOpenAt?: string; // ISO date string
  expiresAt?: string;       // ISO date string
  allowReplies: boolean;
  allowReactions: boolean;
}

export interface ExperienceConfig {
  id?: string;
  slug?: string;
  personalization: PersonalizationConfig;
  appearance: AppearanceConfig;
  modules: ModuleConfig[];
  media: MediaConfig;
  advanced: AdvancedConfig;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  isPublished?: boolean;
  creatorId?: string;
}

// Default module order for new experiences
export const DEFAULT_MODULES: ModuleConfig[] = [
  { id: 'welcome', enabled: true, order: 0 },
  { id: 'diya-lighting', enabled: true, order: 1 },
  { id: 'rangoli', enabled: true, order: 2 },
  { id: 'fireworks', enabled: true, order: 3 },
  { id: 'gift-reveal', enabled: true, order: 4 },
  { id: 'memory-gallery', enabled: true, order: 5 },
  { id: 'personal-wishes', enabled: true, order: 6 },
  { id: 'finale', enabled: true, order: 7 },
];

export const DEFAULT_EXPERIENCE: ExperienceConfig = {
  personalization: {
    senderName: '',
    recipientName: '',
    greeting: 'Wishing you a Happy Diwali!',
    mainMessage: 'May this Diwali bring joy, prosperity and happiness to your home.',
    language: 'english',
    tone: 'warm',
  },
  appearance: {
    templateId: 'royal-gold',
    animationIntensity: 'full',
    ambientEffects: true,
  },
  modules: DEFAULT_MODULES,
  media: {
    photos: [],
    musicDefaultOff: true,
  },
  advanced: {
    passwordProtected: false,
    allowReplies: false,
    allowReactions: true,
  },
};

// Template metadata for the template picker
export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  tagline: string;
  description: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  previewGradient: string;
}

export const TEMPLATES: TemplateMetadata[] = [
  {
    id: 'royal-gold',
    name: 'Royal Gold',
    tagline: 'Regal & Timeless',
    description: 'Midnight dark background with gold decorations, traditional motifs, elegant typography, and glowing diyas.',
    palette: {
      primary: '#D4AF37',
      secondary: '#B8860B',
      accent: '#FF6B35',
      background: '#0A0A1A',
      text: '#FFF8E7',
    },
    previewGradient: 'from-[#0A0A1A] via-[#1a1a2e] to-[#16213e]',
  },
  {
    id: 'traditional-rangoli',
    name: 'Traditional Rangoli',
    tagline: 'Vibrant & Cultural',
    description: 'Colourful rangoli compositions, marigold decorations, festive traditional patterns, and warm Indian visuals.',
    palette: {
      primary: '#FF6B35',
      secondary: '#FFC107',
      accent: '#E91E63',
      background: '#FFF3E0',
      text: '#1A0A00',
    },
    previewGradient: 'from-[#FF6B35] via-[#FF8E53] to-[#FFC107]',
  },
  {
    id: 'minimal-luxe',
    name: 'Minimal Luxe',
    tagline: 'Sophisticated & Elegant',
    description: 'Ivory and muted gold palette with minimal decorative elements, elegant spacing, and sophisticated typography.',
    palette: {
      primary: '#C9A84C',
      secondary: '#8B7355',
      accent: '#D4AF37',
      background: '#FAFAF5',
      text: '#2C2416',
    },
    previewGradient: 'from-[#FAFAF5] via-[#F5F0E8] to-[#EDE8DC]',
  },
  {
    id: 'midnight-celebration',
    name: 'Midnight Celebration',
    tagline: 'Dramatic & Spectacular',
    description: 'Dark night sky with fireworks, glowing lights, and dramatic transitions for an unforgettable celebration.',
    palette: {
      primary: '#7C3AED',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#020617',
      text: '#F1F5F9',
    },
    previewGradient: 'from-[#020617] via-[#0f172a] to-[#1e1b4b]',
  },
  {
    id: 'marigold-glow',
    name: 'Marigold Glow',
    tagline: 'Warm & Floral',
    description: 'Marigold flowers, floral decorations, traditional festive illustrations, and warm golden lighting.',
    palette: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#10B981',
      background: '#1C0A00',
      text: '#FEF3C7',
    },
    previewGradient: 'from-[#1C0A00] via-[#2D1600] to-[#3D2000]',
  },
  {
    id: 'festive-fun',
    name: 'Festive Fun',
    tagline: 'Playful & Joyful',
    description: 'Vibrant colours, interactive surprises, playful illustrations, and family-friendly interactions for all ages.',
    palette: {
      primary: '#EF4444',
      secondary: '#3B82F6',
      accent: '#22C55E',
      background: '#FFF7ED',
      text: '#1C1917',
    },
    previewGradient: 'from-[#EF4444] via-[#F97316] to-[#EAB308]',
  },
];

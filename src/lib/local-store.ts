import { ExperienceConfig, DEFAULT_EXPERIENCE, TemplateId } from '@/types/experience';
import { nanoid } from 'nanoid';

const STORAGE_KEY = 'deepotsav_experiences';
const DRAFTS_KEY = 'deepotsav_drafts';

// Curated preset sample experiences for instantaneous testing and previewing
export const DEMO_EXPERIENCES: Record<string, ExperienceConfig> = {
  'demo-royal-gold': {
    id: 'demo-royal-gold',
    slug: 'demo-royal-gold',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    personalization: {
      senderName: 'Priya & Vikram',
      recipientName: 'Sharma Family',
      greeting: 'Shubh Deepawali & Prosperous New Year!',
      mainMessage: 'May the divine light of diyas illuminate your home with boundless peace, health, joy, and prosperity. Warmest festive greetings to all of you!',
      additionalWishes: 'May Maa Lakshmi bestow her eternal blessings upon you.',
      signature: 'With all our love, Priya & Vikram 🪔',
      language: 'english',
      tone: 'traditional',
    },
    appearance: {
      templateId: 'royal-gold',
      animationIntensity: 'full',
      ambientEffects: true,
    },
    modules: DEFAULT_EXPERIENCE.modules.map(m => ({ ...m })),
    media: {
      photos: [
        {
          id: 'demo-p1',
          url: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&w=800&q=80',
          caption: 'Lighting the path with happiness and hope 🪔',
          order: 0,
        },
        {
          id: 'demo-p2',
          url: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=800&q=80',
          caption: 'Rangoli colors spreading warmth and joy 🌸',
          order: 1,
        },
      ],
      musicDefaultOff: true,
    },
    advanced: {
      passwordProtected: false,
      allowReplies: true,
      allowReactions: true,
    },
  },
  'demo-rangoli': {
    id: 'demo-rangoli',
    slug: 'demo-rangoli',
    isPublished: true,
    publishedAt: new Date().toISOString(),
    personalization: {
      senderName: 'Aarav',
      recipientName: 'Diya & Rohit',
      greeting: 'Happy Diwali Yaar!',
      mainMessage: 'Diwali ki dher saari shubhkamnayein! May this year bring unlimited mithai, laughing memories, and success in everything you touch!',
      additionalWishes: 'Badi wali jhappi and lots of love!',
      signature: 'Dil se, Aarav ✨',
      language: 'hinglish',
      tone: 'warm',
    },
    appearance: {
      templateId: 'traditional-rangoli',
      animationIntensity: 'full',
      ambientEffects: true,
    },
    modules: DEFAULT_EXPERIENCE.modules.map(m => ({ ...m })),
    media: {
      photos: [],
      musicDefaultOff: true,
    },
    advanced: {
      passwordProtected: false,
      allowReplies: true,
      allowReactions: true,
    },
  },
};

function getExperiences(): Record<string, ExperienceConfig> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveExperiences(experiences: Record<string, ExperienceConfig>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(experiences));
}

function getDrafts(): Record<string, ExperienceConfig> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveDrafts(drafts: Record<string, ExperienceConfig>) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function createExperience(initialTemplate: TemplateId = 'royal-gold'): ExperienceConfig {
  const id = nanoid(10);
  const slug = nanoid(12);
  const now = new Date().toISOString();
  return {
    ...DEFAULT_EXPERIENCE,
    id,
    slug,
    createdAt: now,
    updatedAt: now,
    isPublished: false,
    personalization: { ...DEFAULT_EXPERIENCE.personalization },
    appearance: {
      ...DEFAULT_EXPERIENCE.appearance,
      templateId: initialTemplate,
    },
    modules: DEFAULT_EXPERIENCE.modules.map(m => ({ ...m })),
    media: { ...DEFAULT_EXPERIENCE.media, photos: [] },
    advanced: { ...DEFAULT_EXPERIENCE.advanced },
  };
}

export function saveDraft(experience: ExperienceConfig): void {
  const drafts = getDrafts();
  if (!experience.id) return;
  drafts[experience.id] = {
    ...experience,
    updatedAt: new Date().toISOString(),
  };
  saveDrafts(drafts);
}

export function getDraft(id: string): ExperienceConfig | null {
  const drafts = getDrafts();
  return drafts[id] || null;
}

export function listDrafts(): ExperienceConfig[] {
  return Object.values(getDrafts()).sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
}

export function publishExperience(experience: ExperienceConfig): ExperienceConfig {
  const experiences = getExperiences();
  const published: ExperienceConfig = {
    ...experience,
    isPublished: true,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (!published.id) return published;
  experiences[published.slug || published.id] = published;
  saveExperiences(experiences);

  // Remove from drafts
  const drafts = getDrafts();
  if (published.id) delete drafts[published.id];
  saveDrafts(drafts);

  return published;
}

export function unpublishExperience(slug: string): void {
  const experiences = getExperiences();
  if (experiences[slug]) {
    experiences[slug].isPublished = false;
    saveExperiences(experiences);
  }
}

export function getPublishedExperience(slug: string): ExperienceConfig | null {
  // Check demo presets first
  if (DEMO_EXPERIENCES[slug]) {
    return DEMO_EXPERIENCES[slug];
  }

  const experiences = getExperiences();
  const exp = experiences[slug];
  if (!exp) return null;

  // Check expiry
  if (exp.advanced.expiresAt && new Date(exp.advanced.expiresAt) < new Date()) {
    return null;
  }

  // Check scheduled open
  if (exp.advanced.scheduledOpenAt && new Date(exp.advanced.scheduledOpenAt) > new Date()) {
    return null;
  }

  return exp;
}

export function listPublished(): ExperienceConfig[] {
  return Object.values(getExperiences())
    .filter(e => e.isPublished)
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());
}

export function deleteExperience(id: string, slug?: string): void {
  const drafts = getDrafts();
  delete drafts[id];
  saveDrafts(drafts);

  if (slug) {
    const experiences = getExperiences();
    delete experiences[slug];
    saveExperiences(experiences);
  }
}

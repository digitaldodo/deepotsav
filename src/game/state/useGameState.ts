import { create } from 'zustand';

export type LocationName =
  | 'Front Gate & Courtyard'
  | 'Living Room'
  | 'Puja Corner'
  | 'Dining & Sweets'
  | 'Neighbourhood Pathway'
  | 'Community Park';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export type HandItemType = 'none' | 'sweet' | 'powder' | 'diya_stick' | 'sparkler';
export type HandAnimationState =
  | 'idle'
  | 'reach'
  | 'holding'
  | 'eating'
  | 'sprinkling'
  | 'lighting'
  | 'ringing_bell';

export type SweetType = 'laddoo' | 'kajuKatli' | 'gulabJamun' | 'barfi' | 'modak';

export interface PromptAction {
  id: string;
  label: string;
  subtext?: string;
  action: () => void;
}

export interface GameState {
  // Game Flow
  gameStarted: boolean;
  isPaused: boolean;
  showJournal: boolean;
  graphicsQuality: GraphicsQuality;
  soundEnabled: boolean;
  soundVolume: number;
  mobileControlMode: 'joystick' | 'tap';

  // Navigation
  playerPosition: [number, number, number];
  currentLocationName: LocationName;

  // Contextual Interaction
  activePrompt: PromptAction | null;

  // First-Person Hand Interaction System
  handItem: HandItemType;
  handAnim: HandAnimationState;
  heldSweetType: SweetType | null;
  heldPowderColor: string | null;
  heldPowderName: string | null;

  // House & Doors
  houseDoorOpen: boolean;
  giftBoxOpened: boolean;

  // Sweets
  sweetsRemaining: Record<SweetType, number>;
  sweetsEatenTotal: number;
  lastSweetEaten: SweetType | null;

  // Puja Corner
  pujaBellRangCount: number;
  flowersOfferedCount: number;

  // Diyas
  litDiyas: Record<string, boolean>;

  // 3D Physical Rangoli (Courtyard)
  rangoliSections: Record<string, string>; // sectionKey -> hex color
  rangoliCompleted: boolean;
  targetedRangoliSection: string | null;

  // Sparklers (Phuljhadi in Park)
  sparklerHolding: boolean;
  sparklerIgnited: boolean;
  sparklerBurnTime: number; // in seconds
  sparklerColor: string;
  sparklerTrails: Array<{ x: number; y: number; z: number; color: string; life: number }>;

  // Fireworks
  fireworksLaunchCount: number;

  // Actions
  setGameStarted: (started: boolean) => void;
  setPaused: (paused: boolean) => void;
  setShowJournal: (show: boolean) => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setCurrentLocationName: (name: LocationName) => void;
  setActivePrompt: (prompt: PromptAction | null) => void;

  toggleHouseDoor: () => void;
  openGiftBox: () => void;

  // Hand Actions
  pickUpSweet: (type: SweetType) => void;
  consumeHeldSweet: () => void;
  pickUpPowder: (color: string, name: string) => void;
  sprinklePowderOnRangoli: (sectionKey: string) => void;
  pickUpDiyaStick: () => void;
  lightTargetDiya: (diyaId: string) => void;
  ringBellWithHand: () => void;
  clearHand: () => void;

  offerFlowers: () => void;

  // Sparklers
  pickupSparkler: () => void;
  igniteSparkler: () => void;
  dropSparkler: () => void;
  addSparklerTrailPoint: (pt: { x: number; y: number; z: number; color: string }) => void;
  updateSparklerTrails: (delta: number) => void;

  triggerFirework: () => void;
  resetGameProgress: () => void;
}

const DEFAULT_SWEETS: Record<SweetType, number> = {
  laddoo: 4,
  kajuKatli: 4,
  gulabJamun: 3,
  barfi: 4,
  modak: 3,
};

// Default rangoli starts with outline chalk / sandstone colors, waiting to be colored
const INITIAL_RANGOLI_SECTIONS: Record<string, string> = {
  center: '#D4AF37', // Gold center bindu
  'inner-0': '#E8DCC4',
  'inner-1': '#E8DCC4',
  'inner-2': '#E8DCC4',
  'inner-3': '#E8DCC4',
  'inner-4': '#E8DCC4',
  'inner-5': '#E8DCC4',
  'outer-0': '#DDD0B8',
  'outer-1': '#DDD0B8',
  'outer-2': '#DDD0B8',
  'outer-3': '#DDD0B8',
  'outer-4': '#DDD0B8',
  'outer-5': '#DDD0B8',
  border: '#C2A36B',
};

export const useGameState = create<GameState>((set, get) => ({
  // Defaults
  gameStarted: false,
  isPaused: false,
  showJournal: false,
  graphicsQuality: 'medium',
  soundEnabled: false,
  soundVolume: 0.7,
  mobileControlMode: 'joystick',

  playerPosition: [0, 1.6, 9],
  currentLocationName: 'Front Gate & Courtyard',
  activePrompt: null,

  // Hand state
  handItem: 'none',
  handAnim: 'idle',
  heldSweetType: null,
  heldPowderColor: null,
  heldPowderName: null,

  houseDoorOpen: false,
  giftBoxOpened: false,

  sweetsRemaining: { ...DEFAULT_SWEETS },
  sweetsEatenTotal: 0,
  lastSweetEaten: null,

  pujaBellRangCount: 0,
  flowersOfferedCount: 0,

  litDiyas: {
    'exterior-porch-1': true,
    'puja-samai-left': true,
  },

  rangoliSections: { ...INITIAL_RANGOLI_SECTIONS },
  rangoliCompleted: false,
  targetedRangoliSection: null,

  sparklerHolding: false,
  sparklerIgnited: false,
  sparklerBurnTime: 0,
  sparklerColor: '#FFD700',
  sparklerTrails: [],

  fireworksLaunchCount: 0,

  // Setters
  setGameStarted: started => set({ gameStarted: started }),
  setPaused: paused => set({ isPaused: paused }),
  setShowJournal: show => set({ showJournal: show }),
  setGraphicsQuality: quality => set({ graphicsQuality: quality }),
  setSoundEnabled: enabled => set({ soundEnabled: enabled }),
  setSoundVolume: volume => set({ soundVolume: volume }),
  setPlayerPosition: pos => set({ playerPosition: pos }),
  setCurrentLocationName: name => set({ currentLocationName: name }),
  setActivePrompt: prompt => set({ activePrompt: prompt }),

  toggleHouseDoor: () => set(state => ({ houseDoorOpen: !state.houseDoorOpen })),
  openGiftBox: () => set({ giftBoxOpened: true }),

  // Hand Interactions
  pickUpSweet: (type: SweetType) => {
    const current = get().sweetsRemaining[type];
    if (current > 0) {
      set({
        handItem: 'sweet',
        handAnim: 'holding',
        heldSweetType: type,
        activePrompt: null,
      });
    }
  },

  consumeHeldSweet: () => {
    const state = get();
    const sweetType = state.heldSweetType;
    if (!sweetType) return;

    set({ handAnim: 'eating' });

    // Decrement sweet count after eating animation
    setTimeout(() => {
      const remaining = get().sweetsRemaining[sweetType];
      set({
        sweetsRemaining: {
          ...get().sweetsRemaining,
          [sweetType]: Math.max(0, remaining - 1),
        },
        sweetsEatenTotal: get().sweetsEatenTotal + 1,
        lastSweetEaten: sweetType,
        handItem: 'none',
        handAnim: 'idle',
        heldSweetType: null,
      });
    }, 600);
  },

  pickUpPowder: (color: string, name: string) => {
    set({
      handItem: 'powder',
      handAnim: 'holding',
      heldPowderColor: color,
      heldPowderName: name,
    });
  },

  sprinklePowderOnRangoli: (sectionKey: string) => {
    const state = get();
    const color = state.heldPowderColor;
    if (!color) return;

    set({ handAnim: 'sprinkling' });

    setTimeout(() => {
      const updated = {
        ...get().rangoliSections,
        [sectionKey]: color,
      };

      // Check if all petals are filled with vibrant color (not default chalk)
      const coloredCount = Object.values(updated).filter(
        c => c !== '#E8DCC4' && c !== '#DDD0B8'
      ).length;
      const isComplete = coloredCount >= 10;

      set({
        rangoliSections: updated,
        rangoliCompleted: isComplete,
        handAnim: 'holding',
      });
    }, 400);
  },

  pickUpDiyaStick: () => {
    set({
      handItem: 'diya_stick',
      handAnim: 'holding',
    });
  },

  lightTargetDiya: (diyaId: string) => {
    set({
      handItem: 'diya_stick',
      handAnim: 'lighting',
    });

    setTimeout(() => {
      set(state => ({
        litDiyas: { ...state.litDiyas, [diyaId]: true },
        handAnim: 'idle',
        handItem: 'none',
      }));
    }, 500);
  },

  ringBellWithHand: () => {
    set({
      handAnim: 'ringing_bell',
      pujaBellRangCount: get().pujaBellRangCount + 1,
    });

    setTimeout(() => {
      set({ handAnim: 'idle' });
    }, 600);
  },

  clearHand: () => {
    set({
      handItem: 'none',
      handAnim: 'idle',
      heldSweetType: null,
      heldPowderColor: null,
      heldPowderName: null,
    });
  },

  offerFlowers: () => set(state => ({ flowersOfferedCount: state.flowersOfferedCount + 1 })),

  pickupSparkler: () => set({
    sparklerHolding: true,
    sparklerBurnTime: 0,
    handItem: 'sparkler',
    handAnim: 'holding',
  }),

  igniteSparkler: () => set({ sparklerIgnited: true }),

  dropSparkler: () => set({
    sparklerHolding: false,
    sparklerIgnited: false,
    sparklerTrails: [],
    handItem: 'none',
    handAnim: 'idle',
  }),

  addSparklerTrailPoint: pt => set(state => ({
    sparklerTrails: [...state.sparklerTrails.slice(-120), { ...pt, life: 1 }],
  })),

  updateSparklerTrails: delta => set(state => ({
    sparklerTrails: state.sparklerTrails
      .map(pt => ({ ...pt, life: pt.life - delta * 0.9 }))
      .filter(pt => pt.life > 0),
    sparklerBurnTime: state.sparklerIgnited ? state.sparklerBurnTime + delta : state.sparklerBurnTime,
  })),

  triggerFirework: () => set(state => ({ fireworksLaunchCount: state.fireworksLaunchCount + 1 })),

  resetGameProgress: () => set({
    sweetsRemaining: { ...DEFAULT_SWEETS },
    sweetsEatenTotal: 0,
    pujaBellRangCount: 0,
    flowersOfferedCount: 0,
    litDiyas: {
      'exterior-porch-1': true,
      'puja-samai-left': true,
    },
    rangoliSections: { ...INITIAL_RANGOLI_SECTIONS },
    rangoliCompleted: false,
    giftBoxOpened: false,
    fireworksLaunchCount: 0,
    sparklerHolding: false,
    sparklerIgnited: false,
    sparklerTrails: [],
    handItem: 'none',
    handAnim: 'idle',
    heldSweetType: null,
    heldPowderColor: null,
    heldPowderName: null,
  }),
}));

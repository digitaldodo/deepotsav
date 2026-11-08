import { create } from 'zustand';

export type LocationName =
  | 'Front Gate & Courtyard'
  | 'Living Room'
  | 'Puja Corner'
  | 'Dining & Sweets'
  | 'Neighbourhood Pathway'
  | 'Community Park';

export type GraphicsQuality = 'low' | 'medium' | 'high';

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
  showTutorial: boolean;
  graphicsQuality: GraphicsQuality;
  soundEnabled: boolean;
  soundVolume: number;
  mobileControlMode: 'joystick' | 'tap';

  // Navigation
  playerPosition: [number, number, number];
  currentLocationName: LocationName;

  // Contextual Interaction
  activePrompt: PromptAction | null;

  // House & Doors
  houseDoorOpen: boolean;
  giftBoxOpened: boolean;
  inspectedPhoto: string | null;

  // Sweets
  sweetsRemaining: {
    laddoo: number;
    kajuKatli: number;
    gulabJamun: number;
    barfi: number;
    modak: number;
  };
  sweetsEatenTotal: number;
  lastSweetEaten: string | null;

  // Puja Corner
  pujaBellRangCount: number;
  flowersOfferedCount: number;

  // Diyas
  litDiyas: Record<string, boolean>;

  // Rangoli Studio (Courtyard)
  rangoliOverlayOpen: boolean;
  rangoliCompleted: boolean;
  rangoliColors: Record<number, string>;

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
  setShowTutorial: (show: boolean) => void;
  setGraphicsQuality: (quality: GraphicsQuality) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  setCurrentLocationName: (name: LocationName) => void;
  setActivePrompt: (prompt: PromptAction | null) => void;

  toggleHouseDoor: () => void;
  openGiftBox: () => void;
  setInspectedPhoto: (photo: string | null) => void;

  eatSweet: (type: 'laddoo' | 'kajuKatli' | 'gulabJamun' | 'barfi' | 'modak') => void;
  ringPujaBell: () => void;
  offerFlowers: () => void;

  lightDiya: (diyaId: string) => void;

  setRangoliOverlayOpen: (open: boolean) => void;
  setRangoliColor: (petalId: number, color: string) => void;
  setRangoliCompleted: (completed: boolean) => void;
  resetRangoli: () => void;

  pickupSparkler: () => void;
  igniteSparkler: () => void;
  dropSparkler: () => void;
  addSparklerTrailPoint: (pt: { x: number; y: number; z: number; color: string }) => void;
  updateSparklerTrails: (delta: number) => void;

  triggerFirework: () => void;
  resetGameProgress: () => void;
}

const DEFAULT_SWEETS = {
  laddoo: 4,
  kajuKatli: 4,
  gulabJamun: 3,
  barfi: 4,
  modak: 3,
};

export const useGameState = create<GameState>((set, get) => ({
  // Defaults
  gameStarted: false,
  isPaused: false,
  showTutorial: false,
  graphicsQuality: 'medium',
  soundEnabled: false,
  soundVolume: 0.7,
  mobileControlMode: 'joystick',

  playerPosition: [0, 1.6, 12],
  currentLocationName: 'Front Gate & Courtyard',
  activePrompt: null,

  houseDoorOpen: false,
  giftBoxOpened: false,
  inspectedPhoto: null,

  sweetsRemaining: { ...DEFAULT_SWEETS },
  sweetsEatenTotal: 0,
  lastSweetEaten: null,

  pujaBellRangCount: 0,
  flowersOfferedCount: 0,

  litDiyas: {},

  rangoliOverlayOpen: false,
  rangoliCompleted: false,
  rangoliColors: {
    0: '#FF6B35',
    1: '#FFC107',
    2: '#E91E63',
    3: '#22C55E',
  },

  sparklerHolding: false,
  sparklerIgnited: false,
  sparklerBurnTime: 0,
  sparklerColor: '#FFD700',
  sparklerTrails: [],

  fireworksLaunchCount: 0,

  // Setters
  setGameStarted: started => set({ gameStarted: started }),
  setPaused: paused => set({ isPaused: paused }),
  setShowTutorial: show => set({ showTutorial: show }),
  setGraphicsQuality: quality => set({ graphicsQuality: quality }),
  setSoundEnabled: enabled => set({ soundEnabled: enabled }),
  setSoundVolume: volume => set({ soundVolume: volume }),
  setPlayerPosition: pos => set({ playerPosition: pos }),
  setCurrentLocationName: name => set({ currentLocationName: name }),
  setActivePrompt: prompt => set({ activePrompt: prompt }),

  toggleHouseDoor: () => set(state => ({ houseDoorOpen: !state.houseDoorOpen })),
  openGiftBox: () => set({ giftBoxOpened: true }),
  setInspectedPhoto: photo => set({ inspectedPhoto: photo }),

  eatSweet: type => {
    const current = get().sweetsRemaining[type];
    if (current > 0) {
      set(state => ({
        sweetsRemaining: {
          ...state.sweetsRemaining,
          [type]: current - 1,
        },
        sweetsEatenTotal: state.sweetsEatenTotal + 1,
        lastSweetEaten: type,
      }));
    }
  },

  ringPujaBell: () => set(state => ({ pujaBellRangCount: state.pujaBellRangCount + 1 })),
  offerFlowers: () => set(state => ({ flowersOfferedCount: state.flowersOfferedCount + 1 })),

  lightDiya: diyaId => set(state => ({
    litDiyas: { ...state.litDiyas, [diyaId]: true },
  })),

  setRangoliOverlayOpen: open => set({ rangoliOverlayOpen: open }),
  setRangoliColor: (petalId, color) => set(state => {
    const updated = { ...state.rangoliColors, [petalId]: color };
    const allFilled = Object.keys(updated).length >= 8;
    return {
      rangoliColors: updated,
      rangoliCompleted: allFilled,
    };
  }),
  setRangoliCompleted: completed => set({ rangoliCompleted: completed }),
  resetRangoli: () => set({ rangoliColors: {}, rangoliCompleted: false }),

  pickupSparkler: () => set({ sparklerHolding: true, sparklerBurnTime: 0 }),
  igniteSparkler: () => set({ sparklerIgnited: true }),
  dropSparkler: () => set({ sparklerHolding: false, sparklerIgnited: false, sparklerTrails: [] }),
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
    litDiyas: {},
    rangoliCompleted: false,
    rangoliColors: {},
    giftBoxOpened: false,
    fireworksLaunchCount: 0,
    sparklerHolding: false,
    sparklerIgnited: false,
    sparklerTrails: [],
  }),
}));

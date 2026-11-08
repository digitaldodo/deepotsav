import { create } from 'zustand';

export type LocationName =
  | 'Front Gate & Courtyard'
  | 'Living Room'
  | 'Puja Corner'
  | 'Dining & Sweets'
  | 'Neighbourhood Pathway'
  | 'Community Park';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export type HandItemType = 'none' | 'sweet' | 'powder' | 'diya_stick' | 'sparkler' | 'firework';
export type HandAnimationState =
  | 'idle'
  | 'reach'
  | 'holding'
  | 'eating'
  | 'sprinkling'
  | 'lighting'
  | 'ringing_bell';

export type SweetType = 'laddoo' | 'kajuKatli' | 'gulabJamun' | 'barfi' | 'modak';

export type RangoliDesignType =
  | 'mandala'
  | 'lotus'
  | 'peacock'
  | 'diya'
  | 'geometric'
  | 'floral'
  | 'symmetry'
  | 'freehand';

export type FireworkType =
  | 'phuljhari'
  | 'chakri'
  | 'anar'
  | 'rocket'
  | 'ladi'
  | 'pencil'
  | 'sita_geeta'
  | 'ganga_jamuna';

export interface PromptAction {
  id: string;
  label: string;
  subtext?: string;
  action: () => void;
}

export interface FreehandPoint {
  id: string;
  x: number;
  z: number;
  color: string;
  size: number;
}

export interface PlacedFirework {
  id: string;
  type: FireworkType;
  pos: [number, number, number];
  state: 'placed' | 'ignited' | 'active' | 'burnt';
  timer: number;
  duration: number;
  color: string;
}

export interface GameState {
  // Game Flow
  gameStarted: boolean;
  cinematicActive: boolean;
  cinematicPhase: number; // 1 to 6
  isPaused: boolean;
  showJournal: boolean;
  graphicsQuality: GraphicsQuality;
  soundEnabled: boolean;
  soundVolume: number;
  mobileControlMode: 'joystick' | 'tap';
  mouseSensitivity: number;
  touchSensitivity: number;
  reducedMotion: boolean;

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
  heldFireworkType: FireworkType | null;

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

  // ==============================================================
  // 3D CUSTOMIZABLE RANGOLI SYSTEM (Courtyard)
  // ==============================================================
  rangoliDesign: RangoliDesignType;
  rangoliMode: 'stencil' | 'freehand';
  rangoliSymmetry: 1 | 4 | 6 | 8;
  rangoliSections: Record<string, string>; // stencil petal key -> hex color
  freehandPoints: FreehandPoint[];
  placedRangoliDiyas: Array<{ id: string; x: number; z: number; lit: boolean }>;
  placedRangoliPetals: Array<{ id: string; x: number; z: number; color: string }>;
  rangoliCompleted: boolean;

  // ==============================================================
  // INDIAN DIWALI FIREWORKS EXPERIENCE (Park)
  // ==============================================================
  sparklerHolding: boolean;
  sparklerIgnited: boolean;
  sparklerBurnTime: number;
  sparklerColor: string;
  sparklerTrails: Array<{ x: number; y: number; z: number; color: string; life: number }>;

  placedFireworks: PlacedFirework[];
  grandFinaleActive: boolean;
  fireworksLaunchCount: number;

  // ==============================================================
  // ACTIONS
  // ==============================================================
  setGameStarted: (started: boolean) => void;
  setCinematicActive: (active: boolean) => void;
  setCinematicPhase: (phase: number) => void;
  skipCinematic: () => void;
  enterCelebration: () => void;
  replayCinematic: () => void;
  setMouseSensitivity: (val: number) => void;
  setTouchSensitivity: (val: number) => void;
  setReducedMotion: (val: boolean) => void;
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
  pickUpDiyaStick: () => void;
  lightTargetDiya: (diyaId: string) => void;
  ringBellWithHand: () => void;
  clearHand: () => void;
  offerFlowers: () => void;

  // Rangoli Actions
  setRangoliDesign: (design: RangoliDesignType) => void;
  setRangoliMode: (mode: 'stencil' | 'freehand') => void;
  setRangoliSymmetry: (symmetry: 1 | 4 | 6 | 8) => void;
  sprinklePowderOnRangoli: (sectionKey: string) => void;
  addFreehandPowder: (x: number, z: number) => void;
  placeRangoliDecorationDiya: (x: number, z: number) => void;
  placeRangoliFlowerPetals: (x: number, z: number, color: string) => void;
  undoLastRangoliAction: () => void;
  resetRangoliComplete: () => void;

  // Fireworks Actions
  pickupFirework: (type: FireworkType) => void;
  placeFireworkOnGround: (pos: [number, number, number]) => void;
  igniteFirework: (id: string) => void;
  updatePlacedFireworks: (delta: number) => void;
  triggerGrandFinale: () => void;
  stopGrandFinale: () => void;
  triggerFirework: () => void;

  // Sparklers
  pickupSparkler: () => void;
  igniteSparkler: () => void;
  dropSparkler: () => void;
  addSparklerTrailPoint: (pt: { x: number; y: number; z: number; color: string }) => void;
  updateSparklerTrails: (delta: number) => void;

  resetGameProgress: () => void;
}

const DEFAULT_SWEETS: Record<SweetType, number> = {
  laddoo: 4,
  kajuKatli: 4,
  gulabJamun: 3,
  barfi: 4,
  modak: 3,
};

// Storage keys
const STORAGE_RANGOLI_SECTIONS = 'deepotsav_rangoli_sections';
const STORAGE_RANGOLI_DESIGN = 'deepotsav_rangoli_design';
const STORAGE_RANGOLI_FREEHAND = 'deepotsav_rangoli_freehand';

function getStoredDesign(): RangoliDesignType {
  try {
    const val = localStorage.getItem(STORAGE_RANGOLI_DESIGN);
    if (val) return val as RangoliDesignType;
  } catch {}
  return 'mandala';
}

function getStoredSections(): Record<string, string> {
  try {
    const val = localStorage.getItem(STORAGE_RANGOLI_SECTIONS);
    if (val) return JSON.parse(val);
  } catch {}
  return {
    center: '#D4AF37',
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
}

function getStoredFreehand(): FreehandPoint[] {
  try {
    const val = localStorage.getItem(STORAGE_RANGOLI_FREEHAND);
    if (val) return JSON.parse(val);
  } catch {}
  return [];
}

export const useGameState = create<GameState>((set, get) => ({
  // Defaults
  gameStarted: false,
  cinematicActive: true,
  cinematicPhase: 1,
  isPaused: false,
  showJournal: false,
  graphicsQuality: 'medium',
  soundEnabled: false,
  soundVolume: 0.7,
  mobileControlMode: 'joystick',
  mouseSensitivity: 1.0,
  touchSensitivity: 1.0,
  reducedMotion: false,

  playerPosition: [0, 1.6, 9],
  currentLocationName: 'Front Gate & Courtyard',
  activePrompt: null,

  // Hand state
  handItem: 'none',
  handAnim: 'idle',
  heldSweetType: null,
  heldPowderColor: '#FFD54F',
  heldPowderName: 'Marigold Yellow',
  heldFireworkType: null,

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

  // Rangoli state
  rangoliDesign: getStoredDesign(),
  rangoliMode: 'stencil',
  rangoliSymmetry: 6,
  rangoliSections: getStoredSections(),
  freehandPoints: getStoredFreehand(),
  placedRangoliDiyas: [],
  placedRangoliPetals: [],
  rangoliCompleted: false,

  // Fireworks state
  sparklerHolding: false,
  sparklerIgnited: false,
  sparklerBurnTime: 0,
  sparklerColor: '#FFD700',
  sparklerTrails: [],

  placedFireworks: [],
  grandFinaleActive: false,
  fireworksLaunchCount: 0,

  // Setters
  setGameStarted: started => set({ gameStarted: started }),
  setCinematicActive: active => set({ cinematicActive: active }),
  setCinematicPhase: phase => set({ cinematicPhase: phase }),
  skipCinematic: () => {
    set({ cinematicActive: false, gameStarted: true, cinematicPhase: 6 });
  },
  enterCelebration: () => {
    set({ cinematicActive: false, gameStarted: true, cinematicPhase: 6 });
  },
  replayCinematic: () => {
    set({ cinematicActive: true, isPaused: false, cinematicPhase: 1 });
  },
  setMouseSensitivity: val => set({ mouseSensitivity: val }),
  setTouchSensitivity: val => set({ touchSensitivity: val }),
  setReducedMotion: val => set({ reducedMotion: val }),
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
      heldFireworkType: null,
    });
  },

  offerFlowers: () => set(state => ({ flowersOfferedCount: state.flowersOfferedCount + 1 })),

  // ==============================================================
  // RANGOLI ACTIONS
  // ==============================================================
  setRangoliDesign: (design: RangoliDesignType) => {
    try {
      localStorage.setItem(STORAGE_RANGOLI_DESIGN, design);
    } catch {}
    set({
      rangoliDesign: design,
      rangoliMode: design === 'freehand' ? 'freehand' : 'stencil',
    });
  },

  setRangoliMode: (mode: 'stencil' | 'freehand') => set({ rangoliMode: mode }),
  setRangoliSymmetry: (symmetry: 1 | 4 | 6 | 8) => set({ rangoliSymmetry: symmetry }),

  sprinklePowderOnRangoli: (sectionKey: string) => {
    const state = get();
    const color = state.heldPowderColor || '#FFD54F';

    set({ handAnim: 'sprinkling' });

    setTimeout(() => {
      const updated = {
        ...get().rangoliSections,
        [sectionKey]: color,
      };

      try {
        localStorage.setItem(STORAGE_RANGOLI_SECTIONS, JSON.stringify(updated));
      } catch {}

      const coloredCount = Object.values(updated).filter(
        c => c !== '#E8DCC4' && c !== '#DDD0B8'
      ).length;

      set({
        rangoliSections: updated,
        rangoliCompleted: coloredCount >= 8,
        handAnim: 'holding',
      });
    }, 380);
  },

  addFreehandPowder: (x: number, z: number) => {
    const state = get();
    const color = state.heldPowderColor || '#FFD54F';
    const symmetry = state.rangoliSymmetry;

    const newPoints: FreehandPoint[] = [];
    const rangoliCenter = { x: 0, z: 5 };
    const relX = x - rangoliCenter.x;
    const relZ = z - rangoliCenter.z;

    for (let i = 0; i < symmetry; i++) {
      const angle = (i * Math.PI * 2) / symmetry;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const rotX = relX * cosA - relZ * sinA + rangoliCenter.x;
      const rotZ = relX * sinA + relZ * cosA + rangoliCenter.z;

      newPoints.push({
        id: Math.random().toString(36).substring(2, 9),
        x: rotX,
        z: rotZ,
        color,
        size: 0.05 + Math.random() * 0.02,
      });
    }

    const updated = [...state.freehandPoints, ...newPoints].slice(-600);
    try {
      localStorage.setItem(STORAGE_RANGOLI_FREEHAND, JSON.stringify(updated));
    } catch {}

    set({
      freehandPoints: updated,
      handAnim: 'sprinkling',
      rangoliCompleted: updated.length > 50,
    });
  },

  placeRangoliDecorationDiya: (x: number, z: number) => {
    const updated = [
      ...get().placedRangoliDiyas,
      { id: Math.random().toString(), x, z, lit: true },
    ].slice(-16);
    set({ placedRangoliDiyas: updated });
  },

  placeRangoliFlowerPetals: (x: number, z: number, color: string) => {
    const updated = [
      ...get().placedRangoliPetals,
      { id: Math.random().toString(), x, z, color },
    ].slice(-40);
    set({ placedRangoliPetals: updated });
  },

  undoLastRangoliAction: () => {
    const state = get();
    if (state.rangoliMode === 'freehand' && state.freehandPoints.length > 0) {
      const countToRemove = state.rangoliSymmetry;
      const updated = state.freehandPoints.slice(0, -countToRemove);
      try {
        localStorage.setItem(STORAGE_RANGOLI_FREEHAND, JSON.stringify(updated));
      } catch {}
      set({ freehandPoints: updated });
    } else {
      // Revert last stencil section to chalk
      const keys = Object.keys(state.rangoliSections);
      if (keys.length > 0) {
        const lastKey = keys[keys.length - 1];
        const updated = { ...state.rangoliSections, [lastKey]: '#E8DCC4' };
        set({ rangoliSections: updated });
      }
    }
  },

  resetRangoliComplete: () => {
    const emptySections = {
      center: '#D4AF37',
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
    try {
      localStorage.removeItem(STORAGE_RANGOLI_SECTIONS);
      localStorage.removeItem(STORAGE_RANGOLI_FREEHAND);
    } catch {}
    set({
      rangoliSections: emptySections,
      freehandPoints: [],
      placedRangoliDiyas: [],
      placedRangoliPetals: [],
      rangoliCompleted: false,
    });
  },

  // ==============================================================
  // FIREWORKS ACTIONS
  // ==============================================================
  pickupFirework: (type: FireworkType) => {
    set({
      handItem: 'firework',
      handAnim: 'holding',
      heldFireworkType: type,
    });
  },

  placeFireworkOnGround: (pos: [number, number, number]) => {
    const state = get();
    const type = state.heldFireworkType;
    if (!type) return;

    const durations: Record<FireworkType, number> = {
      phuljhari: 12,
      chakri: 5.5,
      anar: 6.0,
      rocket: 2.5,
      ladi: 4.5,
      pencil: 4.0,
      sita_geeta: 6.0,
      ganga_jamuna: 6.0,
    };

    const newFirework: PlacedFirework = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      pos,
      state: 'placed',
      timer: 0,
      duration: durations[type],
      color: type === 'chakri' ? '#FF5722' : type === 'anar' ? '#FFD700' : '#FF4081',
    };

    set({
      placedFireworks: [...state.placedFireworks, newFirework],
      handItem: 'none',
      handAnim: 'idle',
      heldFireworkType: null,
    });
  },

  igniteFirework: (id: string) => {
    set(state => ({
      placedFireworks: state.placedFireworks.map(f =>
        f.id === id ? { ...f, state: 'active', timer: 0 } : f
      ),
      fireworksLaunchCount: state.fireworksLaunchCount + 1,
    }));
  },

  updatePlacedFireworks: (delta: number) => {
    set(state => ({
      placedFireworks: state.placedFireworks
        .map((f): PlacedFirework => {
          if (f.state === 'active') {
            const nextTimer = f.timer + delta;
            const nextState: 'active' | 'burnt' = nextTimer >= f.duration ? 'burnt' : 'active';
            return {
              ...f,
              timer: nextTimer,
              state: nextState,
            };
          }
          return f;
        })
        .filter(f => f.state !== 'burnt' || f.timer < f.duration + 4),
    }));
  },

  triggerFirework: () => {
    set(state => ({
      fireworksLaunchCount: state.fireworksLaunchCount + 1,
    }));
  },

  triggerGrandFinale: () => {
    set(state => ({
      grandFinaleActive: true,
      fireworksLaunchCount: state.fireworksLaunchCount + 10,
    }));

    setTimeout(() => {
      set({ grandFinaleActive: false });
    }, 15000);
  },

  stopGrandFinale: () => set({ grandFinaleActive: false }),

  // Sparklers
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

  resetGameProgress: () => set({
    sweetsRemaining: { ...DEFAULT_SWEETS },
    sweetsEatenTotal: 0,
    pujaBellRangCount: 0,
    flowersOfferedCount: 0,
    litDiyas: {
      'exterior-porch-1': true,
      'puja-samai-left': true,
    },
    rangoliDesign: 'mandala',
    rangoliMode: 'stencil',
    rangoliSymmetry: 6,
    freehandPoints: [],
    placedRangoliDiyas: [],
    placedRangoliPetals: [],
    rangoliCompleted: false,
    giftBoxOpened: false,
    fireworksLaunchCount: 0,
    sparklerHolding: false,
    sparklerIgnited: false,
    sparklerTrails: [],
    placedFireworks: [],
    grandFinaleActive: false,
    handItem: 'none',
    handAnim: 'idle',
    heldSweetType: null,
    heldPowderColor: '#FFD54F',
    heldPowderName: 'Marigold Yellow',
    heldFireworkType: null,
  }),
}));

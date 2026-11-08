import React from 'react';
import { useGameState } from '../../game/state/useGameState';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityJournal: React.FC<Props> = ({ isOpen, onClose }) => {
  const houseDoorOpen = useGameState(s => s.houseDoorOpen);
  const sweetsEatenTotal = useGameState(s => s.sweetsEatenTotal);
  const pujaBellRangCount = useGameState(s => s.pujaBellRangCount);
  const litDiyas = useGameState(s => s.litDiyas);
  const rangoliCompleted = useGameState(s => s.rangoliCompleted);
  const sparklerHolding = useGameState(s => s.sparklerHolding);
  const fireworksLaunchCount = useGameState(s => s.fireworksLaunchCount);

  if (!isOpen) return null;

  const activities = [
    {
      title: 'Enter the Indian Home',
      desc: 'Open the carved wooden front door and explore the living room',
      done: houseDoorOpen,
      icon: '🚪',
    },
    {
      title: 'Light the Sacred Diyas',
      desc: 'Illuminate traditional brass and clay lamps around the house & courtyard',
      done: Object.keys(litDiyas).length >= 2,
      icon: '🪔',
    },
    {
      title: 'Savor Festive Sweets',
      desc: `Enjoy delicacies from the thali (Laddoo, Kaju Katli, Gulab Jamun, Barfi, Modak) — ${sweetsEatenTotal} eaten`,
      done: sweetsEatenTotal > 0,
      icon: '🍬',
    },
    {
      title: 'Puja Corner Blessings',
      desc: `Ring the sacred temple bell & offer flowers at the mandir — rung ${pujaBellRangCount} times`,
      done: pujaBellRangCount > 0,
      icon: '🔔',
    },
    {
      title: 'Courtyard Rangoli Studio',
      desc: 'Fill festive colors in the traditional floral rangoli in the courtyard',
      done: rangoliCompleted,
      icon: '🎨',
    },
    {
      title: 'Play with Virtual Sparklers',
      desc: 'Pick up a phuljhadi from the stand in the park and draw glowing spark trails in the air',
      done: sparklerHolding,
      icon: '🪄',
    },
    {
      title: 'Sky of Lights Fireworks',
      desc: `Launch the community fireworks display in the park — ${fireworksLaunchCount} launches`,
      done: fireworksLaunchCount > 0,
      icon: '🎆',
    },
  ];

  const completedCount = activities.filter(a => a.done).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-[reveal-up_0.3s_ease-out]">
      <div className="w-full max-w-md p-6 rounded-3xl bg-gradient-to-b from-[#1C142B] to-[#0A0A1A] border border-[#D4AF37]/40 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-lg font-bold text-[#D4AF37]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Diwali Exploration Journal
              </h2>
              <p className="text-[11px] text-white/60">
                {completedCount} of {activities.length} Festive Traditions Completed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Journal"
            title="Close Journal"
            className="w-8 h-8 rounded-full bg-white/10 text-white/70 hover:bg-white/20 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FF6B35] transition-all duration-500"
            style={{ width: `${(completedCount / activities.length) * 100}%` }}
          />
        </div>

        {/* Activity List */}
        <div className="space-y-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {activities.map((act, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                act.done
                  ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 text-white'
                  : 'bg-white/5 border-white/5 text-white/60'
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5">{act.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xs font-bold ${act.done ? 'text-[#D4AF37]' : 'text-white/80'}`}>
                    {act.title}
                  </h3>
                  {act.done && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37] text-black">
                      ✓ Done
                    </span>
                  )}
                </div>
                <p className="text-[11px] leading-tight text-white/60 mt-0.5">{act.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-full bg-[#D4AF37] text-black font-bold text-xs shadow-lg active:scale-95 transition-all"
        >
          Resume Exploring ✨
        </button>
      </div>
    </div>
  );
};

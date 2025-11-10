"use client"
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PartyPopper, MapPin, Music, CalendarDays } from 'lucide-react';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const countdown = () => {
      const target: any = new Date('2025-12-31T23:59:59');
      const now: any = new Date();
      const diff = target - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    };

    const timer = setInterval(countdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#003049] text-[#fdf0d5] flex flex-col items-center justify-center p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-bold text-center mb-4 text-[#fdf0d5]"
      >
        Soirée du Nouvel An 2025 🎉
      </motion.h1>

      <p className="text-lg md:text-xl text-[#fdf0d5]/80 mb-10 text-center max-w-2xl">
        Rejoins-nous pour célébrer la nouvelle année dans une ambiance alcoolique ! 💫
      </p>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <CountdownItem label="Jours" value={timeLeft.days} />
        <CountdownItem label="Heures" value={timeLeft.hours} />
        <CountdownItem label="Minutes" value={timeLeft.minutes} />
        <CountdownItem label="Secondes" value={timeLeft.seconds} />
      </section>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="grid md:grid-cols-3 gap-6 w-full max-w-5xl"
      >
        <InfoCard icon={<MapPin className="w-8 h-8 text-[#669bbc]" />} title="Lieu" text="Salle des fêtes de villechaud, 2 Rue de l'École, 58200 Cosne-Cours-sur-Loire" />
        <InfoCard icon={<CalendarDays className="w-8 h-8 text-[#669bbc]" />} title="Date" text="31 décembre 2025 à partir de 19h00" />
        <InfoCard icon={<Music className="w-8 h-8 text-[#669bbc]" />} title="Ambiance" text="[Programme]" />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        className="mt-12 px-8 py-3 rounded-full bg-[#c1121f] text-[#fdf0d5] font-semibold shadow-lg hover:bg-[#780000] transition"
      >
        Je viens à la soirée 🎆 [On peut payer ici]
      </motion.button>
    </main>
  );
}

function CountdownItem({ label, value }: any) {
  return (
    <div className="flex flex-col items-center justify-center bg-[#669bbc]/20 rounded-2xl p-4 backdrop-blur-md border border-[#669bbc]/40">
      <span className="text-4xl md:text-5xl font-bold text-[#fdf0d5]">{value}</span>
      <span className="text-sm md:text-base text-[#fdf0d5]/70">{label}</span>
    </div>
  );
}

function InfoCard({ icon, title, text }: any) {
  return (
    <div className="bg-[#669bbc]/10 p-6 rounded-2xl text-center backdrop-blur-md border border-[#669bbc]/30">
      <div className="flex justify-center mb-3">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#fdf0d5]">{title}</h3>
      <p className="text-[#fdf0d5]/80 text-sm md:text-base">{text}</p>
    </div>
  );
}
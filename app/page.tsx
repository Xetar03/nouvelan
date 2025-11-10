"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, MapPin, Music, CalendarDays, X } from "lucide-react";

export default function Home() {
  const [selectedGuest, setSelectedGuest] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedGuestData = guests.find((g) => g.nom === selectedGuest);

  // --- Compte à rebours ---
  useEffect(() => {
    const countdown = () => {
      const target: any = new Date("2025-12-31T23:59:59");
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

  // --- Récupération des invités depuis Google Sheets ---
  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://docs.google.com/spreadsheets/d/1KNNAlAeqHysG_w0zpzHsvTtbQe--c7_AO6g5z0VZBIc/gviz/tq?tqx=out:json"
      );
      const text = await res.text();
      const json = JSON.parse(text.substring(47).slice(0, -2)); // Google renvoie un JSON encapsulé
      const rows = json.table.rows
        .slice(1) // ⬅️ Ignore la première ligne
        .map((r: any) => ({
          nom: r.c[0]?.v || "",
          moyen: r.c[1]?.v || "",
          paye: r.c[2]?.v || "",
        }));
      setGuests(rows);
    } catch (err) {
      console.error("Erreur de chargement Google Sheet:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async () => {
    setShowModal(true);
    await fetchGuests();
  };

  return (
    <main
  className="min-h-screen bg-[url('https://cdn.discordapp.com/attachments/741002572260704257/1437390643067490405/6d3636d6-2355-4594-8c4a-139768dd78a4.png?ex=691311da&is=6911c05a&hm=2f05421e779a8bc0c2d0b8cb790070242d9e5f023a735f9f8f1f4c24115d4d3a&')]
             bg-cover bg-center bg-no-repeat
             text-[#fdf0d5] flex flex-col items-center justify-center p-6 relative"
  >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl md:text-7xl font-bold text-center mb-4"
      >
        Soirée du Nouvel An 2025 🎉
      </motion.h1>

      <p className="text-lg md:text-xl text-[#fdf0d5]/80 mb-10 text-center max-w-2xl">
        Rejoins-nous pour célébrer la nouvelle année dans une ambiance alcoolique.
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
        <InfoCard
          icon={<MapPin className="w-8 h-8 text-[#669bbc]" />}
          title="Lieu"
          text="Salle des Fêtes de Villechaud, 2 Rue de l'École, Cosne Cours Sur Loire 58200"
        />
        <InfoCard
          icon={<CalendarDays className="w-8 h-8 text-[#669bbc]" />}
          title="Date"
          text="31 décembre 2025 à partir 19h00"
        />
        <InfoCard
          icon={<Music className="w-8 h-8 text-[#669bbc]" />}
          title="Ambiance"
          text="DJ, cocktails, jeux et surprises toute la nuit !"
        />
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={openModal}
        className="mt-12 px-8 py-3 rounded-full bg-[#c1121f] text-[#fdf0d5] font-semibold shadow-lg hover:bg-[#780000] transition"
      >
        Je viens à la soirée 🎆
      </motion.button>

      {/* --- MODAL INVITÉS --- */}
<AnimatePresence>
  {showModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#fdf0d5] text-[#003049] rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative"
      >
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-3 right-3 text-[#780000] hover:text-[#c1121f]"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-[#c1121f]">
          Vérifie ton statut 🎟️
        </h2>

        {loading ? (
          <p className="text-center text-[#003049]">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full">
              <label className="block mb-2 text-sm font-semibold text-[#003049]">
                Sélectionne ton nom :
              </label>
              <select
                onChange={(e) => setSelectedGuest(e.target.value)}
                className="w-full p-2 rounded-md border border-[#669bbc] bg-white text-[#003049] focus:ring-2 focus:ring-[#669bbc]"
              >
                <option value="">-- Choisir un nom --</option>
                {guests.map((g, i) => (
                  <option key={i} value={g.nom}>
                    {g.nom}
                  </option>
                ))}
              </select>
            </div>

            {selectedGuestData ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#669bbc]/10 border border-[#669bbc]/30 rounded-xl p-4 w-full text-center"
              >
                <p className="text-lg font-semibold text-[#003049] mb-2">
                  {selectedGuestData.nom}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Moyen de paiement :</span>{" "}
                  {selectedGuestData.moyen || "—"}
                </p>
                <p
                  className={`mt-2 text-base font-bold ${
                    selectedGuestData.paye?.toLowerCase() === "oui"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {selectedGuestData.paye?.toLowerCase() === "oui"
                    ? "✅ Payé"
                    : "❌ Non payé"}
                </p>
              </motion.div>
            ) : (
              <p className="text-sm text-[#003049]/70">
                Choisis ton nom pour voir ton statut
              </p>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

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

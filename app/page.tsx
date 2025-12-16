"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, MapPin, Music, CalendarDays, X, Check, Disc } from "lucide-react";

export default function Home() {
  // --- ÉTATS ---
  const [selectedGuest, setSelectedGuest] = useState("");
  const [guests, setGuests] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [musics, setMusics] = useState<any[]>([]);
  const [musicForm, setMusicForm] = useState({ artiste: "", titre: "" });
  const [submittingMusic, setSubmittingMusic] = useState(false);

  const SHEET_GID_MUSIQUE = 274399493; 
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

  // --- Fetch Données ---
  const fetchGuests = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://docs.google.com/spreadsheets/d/1KNNAlAeqHysG_w0zpzHsvTtbQe--c7_AO6g5z0VZBIc/gviz/tq?tqx=out:json");
      const text = await res.text();
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
      if (jsonMatch) {
        const json = JSON.parse(jsonMatch[1]);
        const rows = json.table.rows.slice(1).map((r: any) => ({
          nom: r.c[0]?.v || "",
          moyen: r.c[1]?.v || "",
          paye: r.c[2]?.v || "",
        }));
        setGuests(rows);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchMusics = async () => {
    try {
      const res = await fetch(`https://docs.google.com/spreadsheets/d/1KNNAlAeqHysG_w0zpzHsvTtbQe--c7_AO6g5z0VZBIc/gviz/tq?tqx=out:json&gid=${SHEET_GID_MUSIQUE}`);
      const text = await res.text();
      const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
      if (jsonMatch) {
        const json = JSON.parse(jsonMatch[1]);
        const rows = json.table.rows.map((r: any) => ({
          proposePar: r.c[0]?.v || "",
          artiste: r.c[1]?.v || "",
          titre: r.c[2]?.v || "",
          accepte: r.c[3]?.v || "",
        }));
        setMusics(rows);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchGuests(); fetchMusics(); }, []);

  const acceptedMusics = musics.filter(m => m.accepte?.toLowerCase() === "oui");
  const pendingMusics = musics.filter(m => m.accepte?.toLowerCase() !== "oui");

  return (
    <main className="min-h-screen bg-[url('https://media.discordapp.net/attachments/741002572260704257/1437390643067490405/6d3636d6-2355-4594-8c4a-139768dd78a4.png?ex=694287da&is=6941365a&hm=8849d8e71e586b98bc4a7cea1cd7df4aa5f1e7984f70d0682b0608faebc2af34&=&format=webp&quality=lossless&width=656&height=438')] bg-cover bg-center bg-no-repeat text-[#fdf0d5] flex flex-col items-center justify-center p-6 relative">
      
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-5xl md:text-7xl font-bold text-center mb-4">
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

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2 }} className="grid md:grid-cols-3 gap-6 w-full max-w-5xl">
        <InfoCard icon={<MapPin className="w-8 h-8 text-[#669bbc]" />} title="Lieu" text="Salle des Fêtes de Villechaud, 2 Rue de l'École, Cosne Cours Sur Loire 58200" />
        <InfoCard icon={<CalendarDays className="w-8 h-8 text-[#669bbc]" />} title="Date" text="31 décembre 2025 à partir 19h00" />
        <InfoCard icon={<Music className="w-8 h-8 text-[#669bbc]" />} title="Informations diverses" text="Copains, Alcool, Clopes pas chère et happening. Voir plus!" />
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mt-12">
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowModal(true)} className="px-8 py-3 rounded-full bg-[#c1121f] text-[#fdf0d5] font-semibold shadow-lg hover:bg-[#780000] transition">
          Je viens à la soirée 🎆
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowMusicModal(true)} className="px-8 py-3 rounded-full bg-[#669bbc] text-[#003049] font-semibold shadow-lg hover:bg-[#457b9d] transition flex items-center gap-2">
          <Disc className="w-5 h-5" /> Proposer une musique 🎵
        </motion.button>
      </div>

      {/* --- MODAL 1 : INVITÉS (REMISE À NEUF) --- */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#fdf0d5] text-[#003049] rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative">
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-[#780000] hover:text-[#c1121f]"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-bold mb-4 text-center text-[#c1121f]">Vérifie ton statut 🎟️</h2>
              {loading ? <p className="text-center text-[#003049]">Chargement...</p> : (
                <div className="flex flex-col items-center gap-6">
                  <div className="w-full">
                    <label className="block mb-2 text-sm font-semibold text-[#003049]">Sélectionne ton nom :</label>
                    <select onChange={(e) => setSelectedGuest(e.target.value)} value={selectedGuest} className="w-full p-2 rounded-md border border-[#669bbc] bg-white text-[#003049]">
                      <option value="">-- Choisir un nom --</option>
                      {guests.map((g, i) => <option key={i} value={g.nom}>{g.nom}</option>)}
                    </select>
                  </div>
                  {selectedGuestData ? (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#669bbc]/10 border border-[#669bbc]/30 rounded-xl p-4 w-full text-center">
                      <label className="block mb-2 text-sm font-semibold text-[#003049]">Moyen de paiement :</label>
                      <select value={selectedGuestData.moyen || ""} onChange={async (e) => {
                          const newValue = e.target.value;
                          setGuests(guests.map((g) => g.nom === selectedGuest ? { ...g, moyen: newValue } : g));
                          await fetch("/api/updateMoyen", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "updateMoyen", nom: selectedGuest, moyen: newValue }),
                          });
                        }} className="w-full p-2 rounded-md border border-[#669bbc] bg-white text-[#003049]">
                        <option value="">Ne sais pas</option>
                        <option value="Liquide">Liquide</option>
                        <option value="Virement">Virement</option>
                      </select>
                      <p className={`mt-2 text-base font-bold ${selectedGuestData.paye?.toLowerCase() === "oui" ? "text-green-700" : "text-red-700"}`}>
                        {selectedGuestData.paye?.toLowerCase() === "oui" ? "✅ Payé" : "❌ Non payé"}
                      </p>
                      {selectedGuestData.moyen === "Virement" && <p className="mt-2 text-xs font-bold text-[#003049]/70 italic">Virement instantané (Wero) au 06 68 68 13 84</p>}
                    </motion.div>
                  ) : <p className="text-sm text-[#003049]/70 text-center">Ton nom n'est pas dans la liste ? Envoie-nous un message :)</p>}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MODAL 2 : MUSIQUE --- */}
      <AnimatePresence>
        {showMusicModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#fdf0d5] text-[#003049] rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setShowMusicModal(false)} className="absolute top-3 right-3 text-[#780000] hover:text-[#c1121f]"><X className="w-6 h-6" /></button>
              <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2"><Music className="w-6 h-6" /> DJ de la Soirée</h2>
              <div className="mb-6 bg-white/50 p-4 rounded-xl border border-[#669bbc]/30">
                <label className="block mb-2 text-sm font-bold">Qui es-tu ?</label>
                <select onChange={(e) => setSelectedGuest(e.target.value)} value={selectedGuest} className="w-full p-2 rounded-md border border-[#669bbc] bg-white text-[#003049]">
                  <option value="">-- Choisir ton nom --</option>
                  {guests.map((g, i) => <option key={i} value={g.nom}>{g.nom}</option>)}
                </select>
                {selectedGuestData ? (
                   selectedGuestData.paye?.toLowerCase() === "oui" ? (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmittingMusic(true);
                      await fetch("/api/updateMoyen", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "addMusic", nom: selectedGuest, artiste: musicForm.artiste, titre: musicForm.titre }),
                      });
                      setMusicForm({ artiste: "", titre: "" });
                      fetchMusics();
                      setSubmittingMusic(false);
                    }} className="mt-4 flex flex-col md:flex-row gap-3">
                      <input type="text" placeholder="Artiste" required value={musicForm.artiste} onChange={(e) => setMusicForm({...musicForm, artiste: e.target.value})} className="flex-1 p-2 rounded border border-[#669bbc]" />
                      <input type="text" placeholder="Titre" required value={musicForm.titre} onChange={(e) => setMusicForm({...musicForm, titre: e.target.value})} className="flex-1 p-2 rounded border border-[#669bbc]" />
                      <button disabled={submittingMusic} className="bg-[#669bbc] text-white px-4 py-2 rounded hover:bg-[#457b9d]">{submittingMusic ? "..." : "Proposer"}</button>
                    </form>
                   ) : <p className="mt-2 text-red-600 font-semibold text-sm">⚠️ Paye d'abord pour proposer un son !</p>
                ) : <p className="mt-2 text-sm text-gray-500">Sélectionne ton nom pour proposer un son.</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-100/50 p-4 rounded-xl border border-green-200">
                   <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2"><Check className="w-4 h-4" /> Validée</h3>
                   <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                     {acceptedMusics.map((m, i) => <div key={i} className="bg-white p-2 rounded shadow-sm text-sm"><span className="font-bold">{m.titre}</span> - {m.artiste}</div>)}
                   </div>
                </div>
                <div className="bg-gray-100/50 p-4 rounded-xl border border-gray-200">
                   <h3 className="font-bold text-gray-700 mb-3">En attente</h3>
                   <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                     {pendingMusics.map((m, i) => (
                       <div key={i} className="bg-white/60 p-2 rounded text-sm flex justify-between">
                         <span className="truncate mr-2">{m.titre} - {m.artiste}</span>
                         <span className="text-xs text-gray-500 whitespace-nowrap">({m.proposePar})</span>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

// --- SOUS-COMPOSANTS AVEC TES STYLES ORIGINAUX ---
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
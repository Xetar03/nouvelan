//app/api/updateMoyen/route.ts

export async function POST(req: Request) {
  // 1. On récupère TOUT le corps de la requête (action, nom, artiste, moyen, etc.)
  const body = await req.json();

  const URLscript = "https://script.google.com/macros/s/AKfycbxShYh94DdLkxAl_0FA1vzfrZTD6abNaGvIwDm2IUYc9y19_DWyigW2d2w-K-6ya78v/exec";

  try {
    const res = await fetch(URLscript, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), // 2. On renvoie tout au Google Script
    });

    // Optionnel : On peut lire la réponse du script pour être sûr
    // const scriptResponse = await res.json(); 

    return new Response(JSON.stringify({ success: true }), { 
      status: 200,
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
}
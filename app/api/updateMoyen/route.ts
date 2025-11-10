export async function POST(req: Request) {
  const { nom, moyen } = await req.json();

    const URLscript = "https://script.google.com/macros/s/AKfycbxV_T-aOtINlAgVlym1Gl4DWuujCmkaX4w2_qzJqw5_yCLCXyqfqdhypkIiw1GHllvp/exec"

  try {
    const res = await fetch(URLscript, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, moyen }),
    });

    return new Response("OK");
  } catch (err) {
    return new Response("ERR", { status: 500 });
  }
}

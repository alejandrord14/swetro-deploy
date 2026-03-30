import { useState, useRef, useEffect } from "react";

const G = "#C9F400";
const DARK = "#111111";
const CARD = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED = "#888888";
const WHITE = "#f0f0f0";
const W = 1080;
const H = 1080;

const POST_SYSTEM = `Eres el experto en social media de Swetro. Swetro es el compañero de entrenamiento inteligente que te ayuda a entrenar mejor, conocer tus métricas, evitar lesiones y cumplir tus metas deportivas.

Swetro NO es una app de retos ni de competencias. Es un acompañante que cuida tu progreso: analiza tu carga de entrenamiento, te avisa cuando estás al límite antes de que tu cuerpo te lo diga, y te ayuda a construir el hábito deportivo de forma sostenible. Le habla a cualquier persona activa, desde quien empieza hasta quien lleva años entrenando.

Los tres pilares que deben sentirse en el contenido:
1. Constancia y hábito — el progreso real viene de la consistencia, no de los picos
2. Prevención de lesiones y sobreentrenamiento — entrenar inteligente es más valioso que entrenar duro
3. Progresión hacia metas personales — cada persona tiene su ritmo y su meta; Swetro las respeta

Tono: cercano, honesto, como ese amigo que sabe de entrenamiento y te habla sin rodeos. Nunca corporativo, nunca motivacional vacío. Español latinoamericano.

Responde SOLO en JSON válido. Sin markdown, sin backticks, sin texto antes ni después del JSON:
{
  "instagram": {
    "caption": "caption completo listo para publicar, con emojis y saltos de línea",
    "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5"],
    "cta": "call to action concreto"
  },
  "tiktok": {
    "hook": "frase gancho para los primeros 3 segundos del video",
    "script": "guion completo del video de 20-30 segundos con indicaciones de acción entre corchetes",
    "caption": "caption del video en TikTok",
    "hashtags": ["hashtag1","hashtag2","hashtag3"]
  },
  "visual": {
    "concept": "descripción concreta del concepto visual para el diseñador: composición, plano, acción",
    "mood": "estilo visual (ej: minimalista deportivo, alto contraste, lifestyle urbano)",
    "elements": ["elemento visual 1","elemento visual 2","elemento visual 3"]
  }
}`;

const REPORT_SYSTEM = `Eres el experto en social media de Swetro. Swetro es el compañero de entrenamiento inteligente: analiza métricas, cuida la carga de entrenamiento, previene lesiones y acompaña a cada persona hacia sus metas deportivas.

Transformas datos de rendimiento de atletas en contenido que celebra el progreso real — no los récords, sino la constancia, la mejora gradual y el hecho de cuidarse para seguir entrenando.

Los tres pilares:
1. Constancia y hábito — resalta la regularidad, no solo los picos de rendimiento
2. Progresión sostenible — cada dato muestra que va en la dirección correcta, a su ritmo
3. Entrenamiento inteligente — usa los datos de carga para mostrar que Swetro lo protegió

Tono: cercano, honesto y emotivo sin ser cursi. Español latinoamericano.

Responde SOLO en JSON válido. Sin markdown, sin backticks, sin texto antes ni después:
{
  "instagram": {
    "caption_intro": "intro del caption principal que acompañará el carrusel",
    "slides": [
      {"title": "título del slide","copy": "texto del slide"},
      {"title": "título del slide","copy": "texto del slide"},
      {"title": "título del slide","copy": "texto del slide"},
      {"title": "título del slide","copy": "texto del slide"}
    ],
    "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4"]
  },
  "tiktok": {
    "hook": "gancho verbal o de acción para los primeros 3 segundos",
    "structure": "estructura completa del video con timecodes y acciones descritas",
    "caption": "caption del video",
    "hashtags": ["hashtag1","hashtag2","hashtag3"]
  },
  "visual": {
    "concept": "concepto visual concreto: qué se ve, cómo está compuesto, qué transmite",
    "mood": "estilo visual del carrusel o video",
    "elements": ["elemento1","elemento2","elemento3"]
  }
}`;

const CAROUSEL_SYSTEM = `Eres el experto en contenido de Swetro. Swetro es el compañero de entrenamiento inteligente: analiza métricas, previene lesiones por sobreentrenamiento y acompaña a cualquier persona hacia sus metas deportivas.

Crea el contenido de un carrusel de Instagram. El número de slides (entre 3 y 6) lo defines tú según la complejidad del tema. Siempre incluye un slide de tipo "portada" al inicio y uno de tipo "cierre" al final. Los del medio son de tipo "contenido".

Responde SOLO en JSON válido, sin markdown, sin backticks, sin texto antes ni después:
{
  "slides": [
    {
      "tipo": "portada",
      "titulo": "título corto e impactante (máx 6 palabras)",
      "subtitulo": "frase de apoyo opcional (máx 10 palabras)"
    },
    {
      "tipo": "contenido",
      "tag": "etiqueta corta (2-3 palabras)",
      "titulo": "título del slide (máx 8 palabras)",
      "cuerpo": "texto explicativo de 2-3 líneas, concreto y útil"
    },
    {
      "tipo": "cierre",
      "titulo": "frase de cierre poderosa (máx 8 palabras)",
      "cta": "llamado a la acción corto (máx 6 palabras)"
    }
  ],
  "caption": "caption completo para Instagram con emojis y saltos de línea",
  "hashtags": ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5"]
}`;

// ── Canvas helpers ──
const wrapText = (ctx, text, x, y, maxW, lineH, maxLines) => {
  const words = text.split(" ");
  let line = "", lines = [];
  for (let w of words) {
    const test = line + w + " ";
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line.trim()); line = w + " ";
      if (maxLines && lines.length >= maxLines) break;
    } else line = test;
  }
  if (line.trim()) lines.push(line.trim());
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineH));
  return lines.length * lineH;
};

const drawDecor = (ctx, variant) => {
  ctx.save(); ctx.strokeStyle = G; ctx.lineWidth = 2; ctx.globalAlpha = 0.12;
  if (variant === 0) { for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(W - 300 + i * 40, 0); ctx.lineTo(W, 300 - i * 40); ctx.stroke(); } }
  else if (variant === 1) { for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(W - 100, H - 100, 80 + i * 60, 0, Math.PI * 2); ctx.stroke(); } }
  else if (variant === 2) { for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, 200 + i * 80); ctx.lineTo(200, 200 + i * 80); ctx.stroke(); ctx.beginPath(); ctx.moveTo(200 + i * 80, 0); ctx.lineTo(200 + i * 80, 200); ctx.stroke(); } }
  else { for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, H - i * 120); ctx.lineTo(i * 120, H); ctx.stroke(); } }
  ctx.globalAlpha = 1; ctx.restore();
};

const drawLogo = (ctx, small) => {
  const sz = small ? 36 : 52;
  ctx.font = `italic bold ${sz}px 'Arial Black', Arial`;
  ctx.fillStyle = G; ctx.textAlign = "left";
  ctx.fillText("SWETRO", 72, 72 + sz * 0.8);
};

const drawMeta = (ctx, idx, total) => {
  ctx.font = `500 28px Arial`; ctx.fillStyle = MUTED; ctx.textAlign = "right";
  ctx.fillText(`${String(idx+1).padStart(2,"0")} / ${String(total).padStart(2,"0")}`, W - 72, H - 72);
  ctx.textAlign = "left";
  ctx.fillStyle = "#222"; ctx.fillRect(0, H - 14, W, 14);
  ctx.fillStyle = G; ctx.fillRect(0, H - 14, W * ((idx + 1) / total), 14);
};

const drawSlide = (canvas, slide, idx, total) => {
  const ctx = canvas.getContext("2d");
  canvas.width = W; canvas.height = H; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = DARK; ctx.fillRect(0, 0, W, H);

  if (slide.tipo === "portada") {
    drawDecor(ctx, 0);
    ctx.fillStyle = G; ctx.fillRect(0, 0, 10, H);
    drawLogo(ctx, false);
    ctx.font = `bold 96px 'Arial Black', Arial`; ctx.fillStyle = WHITE;
    const tH = wrapText(ctx, slide.titulo.toUpperCase(), 72, 380, W - 144, 110, 4);
    if (slide.subtitulo) { ctx.font = `400 40px Arial`; ctx.fillStyle = G; wrapText(ctx, slide.subtitulo, 72, 380 + tH + 24, W - 200, 52, 3); }
  } else if (slide.tipo === "cierre") {
    ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = G;
    ctx.beginPath(); ctx.moveTo(W * 0.3, 0); ctx.lineTo(W, 0); ctx.lineTo(W, H * 0.7); ctx.closePath(); ctx.fill();
    ctx.globalAlpha = 1; ctx.restore();
    drawDecor(ctx, 0);
    const cY = H / 2 - 80;
    ctx.font = `italic bold 100px 'Arial Black', Arial`; ctx.fillStyle = G; ctx.textAlign = "center";
    ctx.fillText("SWETRO", W / 2, cY - 30);
    ctx.font = `bold 64px 'Arial Black', Arial`; ctx.fillStyle = WHITE;
    const words = slide.titulo.split(" "); const half = Math.ceil(words.length / 2);
    ctx.fillText(words.slice(0, half).join(" "), W / 2, cY + 80);
    if (words.length > 1) ctx.fillText(words.slice(half).join(" "), W / 2, cY + 160);
    if (slide.cta) {
      const ctaY = cY + 250; const t = slide.cta.toUpperCase(); ctx.font = `bold 34px Arial`;
      const ctaW = ctx.measureText(t).width + 80;
      ctx.fillStyle = G; ctx.beginPath(); ctx.roundRect(W / 2 - ctaW / 2, ctaY, ctaW, 68, 34); ctx.fill();
      ctx.fillStyle = "#000"; ctx.fillText(t, W / 2, ctaY + 45);
    }
    ctx.textAlign = "left";
  } else {
    drawDecor(ctx, (idx % 3) + 1);
    drawLogo(ctx, true);
    if (slide.tag) {
      ctx.font = `bold 26px Arial`;
      const tagW = ctx.measureText(slide.tag.toUpperCase()).width + 48;
      ctx.fillStyle = "rgba(201,244,0,0.12)"; ctx.beginPath(); ctx.roundRect(72, 160, tagW, 48, 24); ctx.fill();
      ctx.fillStyle = G; ctx.fillText(slide.tag.toUpperCase(), 96, 193);
    }
    const tY = slide.tag ? 280 : 240;
    ctx.font = `bold 80px 'Arial Black', Arial`; ctx.fillStyle = WHITE;
    const tH = wrapText(ctx, slide.titulo, 72, tY, W - 144, 96, 3);
    const dY = tY + tH + 32;
    ctx.fillStyle = G; ctx.fillRect(72, dY, 80, 6);
    ctx.font = `400 42px Arial`; ctx.fillStyle = "#cccccc";
    wrapText(ctx, slide.cuerpo, 72, dY + 56, W - 200, 60, 5);
  }
  drawMeta(ctx, idx, total);
};

// ── Shared styles & components ──
const sh = {
  wrap: { fontFamily: "system-ui, sans-serif", padding: "24px", maxWidth: 1100, margin: "0 auto", background: "#0a0a0a", minHeight: "100vh" },
  topNav: { background: DARK, borderRadius: 12, padding: "14px 22px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" },
  logo: { fontSize: 26, fontWeight: 700, fontStyle: "italic", color: G, letterSpacing: "-1px", lineHeight: 1 },
  sub: { fontSize: 11, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 },
  tabBar: { display: "flex", background: DARK, borderRadius: 10, padding: 4, gap: 4, marginBottom: 10 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 12, alignItems: "start" },
  panel: { background: DARK, borderRadius: 12, padding: "20px" },
  lbl: { display: "block", fontSize: 11, fontWeight: 500, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
  inp: { width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 13, padding: "10px 12px", boxSizing: "border-box", outline: "none", fontFamily: "system-ui, sans-serif" },
  btn: { width: "100%", marginTop: 16, padding: "12px", background: G, color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontStyle: "italic", cursor: "pointer" },
  hint: { marginTop: 10, padding: "10px 12px", background: CARD, borderRadius: 8, fontSize: 12, color: MUTED, lineHeight: 1.6, borderLeft: `2px solid ${BORDER}` },
  card: { background: DARK, borderRadius: 12, padding: "18px 20px", marginBottom: 10 },
  cardHdr: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${BORDER}` },
  secLbl: { fontSize: 11, fontWeight: 500, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 6px" },
  body: { fontSize: 13, color: WHITE, lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0 },
  hash: { fontSize: 12, color: G, margin: "8px 0 0", opacity: 0.85 },
  hook: { fontSize: 15, fontWeight: 700, fontStyle: "italic", color: WHITE, margin: 0, lineHeight: 1.4 },
  divider: { border: "none", borderTop: `1px solid ${BORDER}`, margin: "14px 0" },
  empty: { background: DARK, borderRadius: 12, padding: "44px 20px", textAlign: "center" },
  loading: { background: DARK, borderRadius: 12, padding: "44px 20px", textAlign: "center" },
};

const Spinner = () => (
  <div style={sh.loading}>
    <div style={{ width: 26, height: 26, border: `2px solid ${BORDER}`, borderTopColor: G, borderRadius: "50%", margin: "0 auto 12px", animation: "sw-spin 0.8s linear infinite" }} />
    <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Generando contenido Swetro...</p>
  </div>
);

const Empty = ({ msg }) => (
  <div style={sh.empty}>
    <p style={{ fontSize: 32, margin: "0 0 10px", color: G }}>◈</p>
    <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>{msg}</p>
  </div>
);

const Badge = ({ label, variant }) => {
  const st = { ig: { background: "rgba(201,244,0,0.1)", color: G, border: "1px solid rgba(201,244,0,0.2)" }, tt: { background: "rgba(255,255,255,0.07)", color: WHITE, border: `1px solid ${BORDER}` }, vis: { background: "rgba(136,136,136,0.1)", color: MUTED, border: `1px solid ${BORDER}` } };
  return <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, ...st[variant] }}>{label}</span>;
};

const CopyBtn = ({ text }) => {
  const [ok, setOk] = useState(false);
  return <button onClick={() => { navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 2000); }} style={{ fontSize: 11, padding: "4px 10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, color: ok ? G : MUTED, cursor: "pointer" }}>{ok ? "Copiado ✓" : "Copiar"}</button>;
};

const Sel = ({ label, value, onChange, opts, first }) => (
  <>
    <label style={{ ...sh.lbl, marginTop: first ? 0 : 16 }}>{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...sh.inp, appearance: "none" }}>
      {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
    </select>
  </>
);

const pilarOpts = [["habito","Constancia y hábito deportivo"],["lesiones","Prevención de lesiones"],["metas","Progresión hacia metas"],["metricas","Métricas de entrenamiento"],["educativo","Tip educativo"],["lanzamiento","Nueva función de Swetro"]];
const tonoOpts = [["energetico","Energético y motivador"],["inspiracional","Inspiracional"],["humor","Con humor"],["serio","Serio / profesional"]];
const idiomaOpts = [["es","Español"],["en","English"]];

const apiFetch = (system, userMsg) =>
  fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system, messages: [{ role: "user", content: userMsg }] }) });

// ── Content Agent ──
function ContentAgent() {
  const [mode, setMode] = useState("post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [pf, setPf] = useState({ brief: "", tipo: "habito", tono: "energetico", idioma: "es" });
  const [rf, setRf] = useState({ atleta: "", deporte: "", periodo: "", metricas: "", logro: "", idioma: "es" });
  const up = (set) => (k, v) => set(f => ({ ...f, [k]: v }));

  const buildMsg = () => {
    const tipos = { habito: "constancia y hábito deportivo", lesiones: "prevención de lesiones y sobreentrenamiento", metas: "progresión hacia metas personales", metricas: "métricas y análisis de entrenamiento", educativo: "tip educativo de entrenamiento inteligente", lanzamiento: "nueva función de Swetro" };
    const tonos = { energetico: "energético y motivador", inspiracional: "inspiracional y emotivo", humor: "con humor y cercanía", serio: "serio y profesional" };
    if (mode === "post") return `Pilar: ${tipos[pf.tipo]}\nTono: ${tonos[pf.tono]}\nBrief: ${pf.brief}\nIdioma: ${pf.idioma === "en" ? "inglés americano natural" : "español latinoamericano"}`;
    return `Atleta: ${rf.atleta}\nDeporte: ${rf.deporte}\nPeríodo: ${rf.periodo || "no especificado"}\nMétricas: ${rf.metricas}\nLogro: ${rf.logro || "N/A"}\nIdioma: ${rf.idioma === "en" ? "inglés americano natural" : "español latinoamericano"}`;
  };

  const generate = async () => {
    const valid = mode === "post" ? pf.brief.trim().length > 5 : rf.atleta.trim() && rf.deporte.trim() && rf.metricas.trim();
    if (!valid) { setError(mode === "post" ? "Describe el contenido que quieres crear." : "Completa atleta, deporte y métricas."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await apiFetch(mode === "post" ? POST_SYSTEM : REPORT_SYSTEM, buildMsg());
      const data = await res.json();
      if (data.error) { setError(`Error: ${data.error.message}`); return; }
      const raw = (data.content || []).map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      try { setResult(JSON.parse(raw)); } catch { setError("No se pudo procesar la respuesta. Intenta de nuevo."); }
    } catch (e) { setError(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  const hs = (arr = []) => arr.map(h => h.startsWith("#") ? h : `#${h}`).join(" ");

  return (
    <div style={sh.grid}>
      <div style={sh.panel}>
        <div style={sh.tabBar}>
          {[["post","Crear post"],["reporte","Reporte de atleta"]].map(([k,l]) => (
            <button key={k} onClick={() => { setMode(k); setResult(null); setError(null); }} style={{ flex:1, padding:"8px 12px", borderRadius:8, border:"none", fontSize:13, fontWeight:500, cursor:"pointer", background: mode===k ? G : "transparent", color: mode===k ? "#000" : MUTED }}>{l}</button>
          ))}
        </div>
        {mode === "post" ? (
          <>
            <Sel label="Pilar de contenido" value={pf.tipo} onChange={v => up(setPf)("tipo",v)} opts={pilarOpts} first />
            <Sel label="Tono" value={pf.tono} onChange={v => up(setPf)("tono",v)} opts={tonoOpts} />
            <Sel label="Idioma del resultado" value={pf.idioma} onChange={v => up(setPf)("idioma",v)} opts={idiomaOpts} />
            <label style={sh.lbl}>Brief del contenido *</label>
            <textarea rows={6} placeholder="Describe qué quieres comunicar. Ej: Un corredor llevaba meses lesionándose al subir kilometraje. Con Swetro vio su carga y lleva 3 meses sin lesiones." value={pf.brief} onChange={e => up(setPf)("brief", e.target.value)} style={{ ...sh.inp, resize:"vertical", lineHeight:1.6 }} />
          </>
        ) : (
          <>
            <label style={{ ...sh.lbl, marginTop:0 }}>Nombre del atleta *</label>
            <input type="text" placeholder="Ej: Carlos Mora" value={rf.atleta} onChange={e => up(setRf)("atleta",e.target.value)} style={sh.inp} />
            <label style={sh.lbl}>Deporte / disciplina *</label>
            <input type="text" placeholder="Ej: Running, Ciclismo, Natación..." value={rf.deporte} onChange={e => up(setRf)("deporte",e.target.value)} style={sh.inp} />
            <label style={sh.lbl}>Período</label>
            <input type="text" placeholder="Ej: Marzo 2026" value={rf.periodo} onChange={e => up(setRf)("periodo",e.target.value)} style={sh.inp} />
            <label style={sh.lbl}>Métricas y datos clave *</label>
            <textarea rows={4} placeholder="Ej: 142 km, 8 actividades, ritmo 5:10/km..." value={rf.metricas} onChange={e => up(setRf)("metricas",e.target.value)} style={{ ...sh.inp, resize:"vertical", lineHeight:1.6 }} />
            <label style={sh.lbl}>Logro o hito destacado</label>
            <input type="text" placeholder="Ej: 3 meses sin lesiones, nuevo récord personal..." value={rf.logro} onChange={e => up(setRf)("logro",e.target.value)} style={sh.inp} />
            <Sel label="Idioma del resultado" value={rf.idioma} onChange={v => up(setRf)("idioma",v)} opts={idiomaOpts} />
          </>
        )}
        {error && <p style={{ fontSize:12, color:"#ff5555", marginTop:8 }}>{error}</p>}
        <button onClick={generate} disabled={loading} style={{ ...sh.btn, opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Generando..." : "Generar contenido ↗"}</button>
        <div style={sh.hint}>Copy listo para Instagram y TikTok + concepto visual para el diseñador.</div>
      </div>

      <div>
        {loading && <Spinner />}
        {!loading && !result && <Empty msg={mode==="post" ? "Completa el brief y genera contenido listo para publicar." : "Ingresa los datos del atleta y genera su reporte para redes."} />}
        {result && (
          <>
            <div style={sh.card}>
              <div style={sh.cardHdr}>
                <Badge label="Instagram" variant="ig" />
                {mode==="post" ? <CopyBtn text={`${result.instagram.caption}\n\n${hs(result.instagram.hashtags)}`} /> : <CopyBtn text={result.instagram.caption_intro} />}
              </div>
              {mode==="post" ? (
                <>
                  <p style={sh.secLbl}>Caption</p>
                  <p style={sh.body}>{result.instagram.caption}</p>
                  <p style={sh.hash}>{hs(result.instagram.hashtags)}</p>
                  {result.instagram.cta && <div style={{ marginTop:10, padding:"8px 12px", background:CARD, borderRadius:8, borderLeft:`2px solid ${G}`, fontSize:12, color:WHITE }}><span style={{ color:G, fontSize:11, fontWeight:500 }}>CTA · </span>{result.instagram.cta}</div>}
                </>
              ) : (
                <>
                  <p style={{ ...sh.body, marginBottom:12 }}>{result.instagram.caption_intro}</p>
                  <p style={sh.secLbl}>Slides del carrusel</p>
                  {(result.instagram.slides||[]).map((sl,i) => (
                    <div key={i} style={{ padding:"10px 12px", background:CARD, borderRadius:8, marginBottom:6, border:`1px solid ${BORDER}` }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                        <p style={{ fontSize:12, fontWeight:500, color:WHITE, margin:0 }}>Slide {i+1} · {sl.title}</p>
                        <CopyBtn text={sl.copy} />
                      </div>
                      <p style={{ fontSize:12, color:MUTED, margin:0, lineHeight:1.55 }}>{sl.copy}</p>
                    </div>
                  ))}
                  <p style={sh.hash}>{hs(result.instagram.hashtags)}</p>
                </>
              )}
            </div>

            <div style={sh.card}>
              <div style={sh.cardHdr}><Badge label="TikTok" variant="tt" /><CopyBtn text={result.tiktok.script || result.tiktok.structure} /></div>
              <p style={sh.secLbl}>Hook · primeros 3s</p>
              <p style={sh.hook}>"{result.tiktok.hook}"</p>
              <hr style={sh.divider} />
              <p style={sh.secLbl}>{mode==="post" ? "Guion del video" : "Estructura del video"}</p>
              <p style={sh.body}>{result.tiktok.script || result.tiktok.structure}</p>
              <hr style={sh.divider} />
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
                <div style={{ flex:1 }}>
                  <p style={sh.secLbl}>Caption</p>
                  <p style={{ ...sh.body, fontSize:12 }}>{result.tiktok.caption}</p>
                  <p style={sh.hash}>{hs(result.tiktok.hashtags)}</p>
                </div>
                <CopyBtn text={`${result.tiktok.caption}\n\n${hs(result.tiktok.hashtags)}`} />
              </div>
            </div>

            <div style={sh.card}>
              <div style={sh.cardHdr}><Badge label="Concepto visual" variant="vis" /></div>
              <p style={sh.body}>{result.visual.concept}</p>
              {result.visual.mood && <p style={{ fontSize:12, color:MUTED, margin:"8px 0 0" }}><span style={{ color:G, fontWeight:500 }}>Estilo</span> · {result.visual.mood}</p>}
              {(result.visual.elements||[]).length > 0 && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginTop:10 }}>
                  {result.visual.elements.map((e,i) => <span key={i} style={{ fontSize:12, padding:"3px 9px", background:CARD, border:`1px solid ${BORDER}`, borderRadius:20, color:MUTED }}>{e}</span>)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Carousel Generator ──
function CarouselGenerator() {
  const [form, setForm] = useState({ tema:"", pilar:"habito", tono:"energetico", idioma:"es" });
  const [slides, setSlides] = useState(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const canvasRefs = useRef([]);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const buildMsg = () => {
    const p = { habito:"constancia y hábito deportivo", lesiones:"prevención de lesiones y sobreentrenamiento", metas:"progresión hacia metas personales", metricas:"métricas y análisis de entrenamiento", educativo:"tip educativo de entrenamiento" };
    const t = { energetico:"energético y motivador", inspiracional:"inspiracional", humor:"con humor y cercanía", serio:"serio y profesional" };
    return `Pilar: ${p[form.pilar]}\nTono: ${t[form.tono]}\nTema: ${form.tema}\nIdioma: ${form.idioma === "en" ? "inglés americano natural" : "español latinoamericano"}`;
  };

  const generate = async () => {
    if (!form.tema.trim() || form.tema.trim().length < 5) { setError("Describe el tema del carrusel."); return; }
    setLoading(true); setError(null); setSlides(null);
    try {
      const res = await apiFetch(CAROUSEL_SYSTEM, buildMsg());
      const data = await res.json();
      if (data.error) { setError(`Error: ${data.error.message}`); return; }
      const raw = (data.content || []).map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(raw);
      setSlides(parsed.slides || []); setCaption(parsed.caption || ""); setHashtags(parsed.hashtags || []);
    } catch (e) { setError(`Error: ${e.message}`); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (slides && slides.length > 0) slides.forEach((slide, i) => { const c = canvasRefs.current[i]; if (c) drawSlide(c, slide, i, slides.length); });
  }, [slides]);

  const dlSlide = (i) => { const c = canvasRefs.current[i]; if (!c) return; const a = document.createElement("a"); a.download = `swetro-slide-${String(i+1).padStart(2,"0")}.png`; a.href = c.toDataURL("image/png"); a.click(); };
  const dlAll = () => slides.forEach((_, i) => setTimeout(() => dlSlide(i), i * 200));
  const hs = hashtags.map(h => h.startsWith("#") ? h : `#${h}`).join(" ");

  return (
    <div style={sh.grid}>
      <div style={sh.panel}>
        <Sel label="Pilar de contenido" value={form.pilar} onChange={v => up("pilar",v)} opts={pilarOpts.slice(0,5)} first />
        <Sel label="Tono" value={form.tono} onChange={v => up("tono",v)} opts={tonoOpts} />
        <Sel label="Idioma" value={form.idioma} onChange={v => up("idioma",v)} opts={idiomaOpts} />
        <label style={sh.lbl}>Tema del carrusel *</label>
        <textarea rows={6} placeholder="Describe el tema. Ej: Por qué aumentar el kilometraje demasiado rápido es la causa más común de lesiones en corredores, y cómo Swetro te ayuda a evitarlo." value={form.tema} onChange={e => up("tema", e.target.value)} style={{ ...sh.inp, resize:"vertical", lineHeight:1.6 }} />
        {error && <p style={{ fontSize:12, color:"#ff5555", marginTop:8 }}>{error}</p>}
        <button onClick={generate} disabled={loading} style={{ ...sh.btn, opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>{loading ? "Generando..." : "Generar carrusel ↗"}</button>
        <div style={sh.hint}>El agente decide cuántos slides necesita el tema (3–6). Cada slide se exporta como PNG 1080×1080 listo para Instagram.</div>
      </div>

      <div>
        {loading && <Spinner />}
        {!loading && !slides && <Empty msg="Describe el tema y genera los slides listos para descargar." />}
        {slides && slides.length > 0 && (
          <>
            <div style={{ ...sh.card, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <p style={{ ...sh.secLbl, margin:0 }}>{slides.length} slides generados</p>
                <p style={{ fontSize:12, color:MUTED, margin:"4px 0 0" }}>PNG 1080×1080 · listos para Instagram</p>
              </div>
              <button onClick={dlAll} style={{ padding:"8px 16px", background:G, color:"#000", border:"none", borderRadius:8, fontSize:13, fontWeight:700, fontStyle:"italic", cursor:"pointer" }}>Descargar todos ↓</button>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(150px, 1fr))", gap:8, marginBottom:10 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ background:CARD, borderRadius:10, overflow:"hidden", border:`1px solid ${BORDER}` }}>
                  <canvas ref={el => canvasRefs.current[i] = el} style={{ width:"100%", height:"auto", display:"block" }} />
                  <div style={{ padding:"8px 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:11, color:MUTED, textTransform:"uppercase", letterSpacing:"0.06em" }}>{slide.tipo}</span>
                    <button onClick={() => dlSlide(i)} style={{ fontSize:11, padding:"3px 8px", background:DARK, border:`1px solid ${BORDER}`, borderRadius:6, color:G, cursor:"pointer" }}>↓ PNG</button>
                  </div>
                </div>
              ))}
            </div>

            {caption && (
              <div style={sh.card}>
                <div style={sh.cardHdr}><Badge label="Caption de Instagram" variant="ig" /><CopyBtn text={`${caption}\n\n${hs}`} /></div>
                <p style={sh.body}>{caption}</p>
                <p style={sh.hash}>{hs}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Root ──
export default function App() {
  const [tool, setTool] = useState("content");
  return (
    <div style={sh.wrap}>
      <style>{`@keyframes sw-spin{to{transform:rotate(360deg)}}*{box-sizing:border-box}body{margin:0;background:#0a0a0a}select option{background:#1a1a1a}input::placeholder,textarea::placeholder{color:#444}`}</style>

      <div style={sh.topNav}>
        <div>
          <div style={sh.logo}>SWETRO</div>
          <div style={sh.sub}>Agente de contenido · IA</div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:G, display:"inline-block" }} />
          <span style={{ fontSize:11, color:MUTED }}>Instagram · TikTok</span>
        </div>
      </div>

      <div style={sh.tabBar}>
        {[["content","Agente de contenido"],["carousel","Generador de carruseles"]].map(([k,l]) => (
          <button key={k} onClick={() => setTool(k)} style={{ flex:1, padding:"9px 12px", borderRadius:8, border:"none", fontSize:13, fontWeight:500, cursor:"pointer", background: tool===k ? G : "transparent", color: tool===k ? "#000" : MUTED }}>{l}</button>
        ))}
      </div>

      {tool === "content" ? <ContentAgent /> : <CarouselGenerator />}
    </div>
  );
}

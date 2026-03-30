import { useState } from "react";

const G = "#C9F400";
const DARK = "#111111";
const CARD = "#1a1a1a";
const BORDER = "#2a2a2a";
const MUTED = "#888888";
const WHITE = "#f0f0f0";

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

Transformas datos de rendimiento de atletas en contenido que celebra el progreso real — no los récords, sino la constancia, la mejora gradual y el hecho de cuidarse para seguir entrenando. El atleta debe sentir que sus datos cuentan una historia de disciplina inteligente, no solo de esfuerzo.

Los tres pilares que deben sentirse en el contenido:
1. Constancia y hábito — resalta la regularidad, no solo los picos de rendimiento
2. Progresión sostenible — cada dato muestra que va en la dirección correcta, a su ritmo
3. Entrenamiento inteligente — si hay datos de carga o recuperación, úsalos para mostrar que Swetro lo protegió

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
    "structure": "estructura completa del video con timecodes y acciones descritas (ej: [0-3s] Muestra el dato en pantalla...)",
    "caption": "caption del video",
    "hashtags": ["hashtag1","hashtag2","hashtag3"]
  },
  "visual": {
    "concept": "concepto visual concreto: qué se ve, cómo está compuesto, qué transmite",
    "mood": "estilo visual del carrusel o video",
    "elements": ["elemento1","elemento2","elemento3"]
  }
}`;

export default function SwetroAgent() {
  const [mode, setMode] = useState("post");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(null);
  const [postForm, setPostForm] = useState({ brief: "", tipo: "habito", tono: "energetico", idioma: "es" });
  const [reportForm, setReportForm] = useState({ atleta: "", deporte: "", periodo: "", metricas: "", logro: "", idioma: "es" });

  const upPost = (k, v) => setPostForm(f => ({ ...f, [k]: v }));
  const upReport = (k, v) => setReportForm(f => ({ ...f, [k]: v }));

  const buildMsg = () => {
    if (mode === "post") {
      const tipos = {
        habito: "constancia y hábito deportivo — el progreso sostenido en el tiempo",
        lesiones: "prevención de lesiones y sobreentrenamiento — entrenar inteligente",
        metas: "progresión hacia metas personales — cada persona a su ritmo",
        metricas: "métricas y análisis de entrenamiento — conocer tus datos para mejorar",
        educativo: "tip educativo de entrenamiento inteligente",
        lanzamiento: "nueva función de Swetro — compañero de entrenamiento"
      };
      const tonos = { energetico: "energético y motivador", inspiracional: "inspiracional y emotivo", humor: "con humor y cercanía", serio: "serio y profesional" };
      return `Pilar de contenido: ${tipos[postForm.tipo] || postForm.tipo}\nTono: ${tonos[postForm.tono] || postForm.tono}\nBrief: ${postForm.brief}\n\nRecuerda: Swetro es el compañero de entrenamiento inteligente. No es una app de retos ni de competencias.

Idioma de salida: ${postForm.idioma === 'en' ? 'responde TODO en inglés (inglés americano natural, no traducción literal)' : 'responde en español latinoamericano'}.`;
    } else {
      return `Atleta: ${reportForm.atleta}\nDeporte: ${reportForm.deporte}\nPeríodo: ${reportForm.periodo || "no especificado"}\nMétricas: ${reportForm.metricas}\nLogro: ${reportForm.logro || "N/A"}\n\nCelebra la constancia y el progreso inteligente. Swetro acompañó para entrenar mejor, no solo más.

Idioma de salida: ${reportForm.idioma === 'en' ? 'responde TODO en inglés (inglés americano natural, no traducción literal)' : 'responde en español latinoamericano'}.`;
    }
  };

  const generate = async () => {
    const valid = mode === "post"
      ? postForm.brief.trim().length > 5
      : reportForm.atleta.trim() && reportForm.deporte.trim() && reportForm.metricas.trim();
    if (!valid) { setError(mode === "post" ? "Describe el contenido que quieres crear." : "Completa atleta, deporte y métricas."); return; }
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1500, system: mode === "post" ? POST_SYSTEM : REPORT_SYSTEM, messages: [{ role: "user", content: buildMsg() }] })
      });
      const data = await res.json();
      if (data.error) { setError(`Error de API: ${data.error.message || JSON.stringify(data.error)}`); return; }
      const raw = (data.content || []).map(i => i.text || "").join("").replace(/```json|```/g, "").trim();
      if (!raw) { setError("Respuesta vacía. Intenta de nuevo."); return; }
      try { setResult(JSON.parse(raw)); }
      catch { setError("No se pudo procesar la respuesta. Intenta de nuevo."); }
    } catch (e) {
      setError(`Error: ${e.message || e.name}`);
    } finally { setLoading(false); }
  };

  const copy = (text, key) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(null), 2000); };
  const hashStr = (arr = []) => arr.map(h => h.startsWith("#") ? h : `#${h}`).join(" ");

  const s = {
    wrap: { fontFamily: "var(--font-sans)", padding: "0" },
    header: { background: DARK, borderRadius: 12, padding: "18px 22px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontSize: 26, fontWeight: 700, fontStyle: "italic", color: G, letterSpacing: "-1px", lineHeight: 1 },
    sub: { fontSize: 11, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 3 },
    tabBar: { display: "flex", background: DARK, borderRadius: 10, padding: 4, gap: 4, marginBottom: 10 },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, alignItems: "start" },
    formPanel: { background: DARK, borderRadius: 12, padding: "20px 20px" },
    lbl: { display: "block", fontSize: 11, fontWeight: 500, color: MUTED, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6, marginTop: 16 },
    inp: { width: "100%", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, color: WHITE, fontSize: 13, padding: "10px 12px", boxSizing: "border-box", outline: "none", fontFamily: "var(--font-sans)" },
    btn: { width: "100%", marginTop: 16, padding: "12px", background: G, color: "#000", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, fontStyle: "italic", cursor: "pointer", letterSpacing: "0.02em" },
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

  const Tab = ({ k, label }) => (
    <button onClick={() => { setMode(k); setResult(null); setError(null); }} style={{
      flex: 1, padding: "8px 12px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500,
      cursor: "pointer", background: mode === k ? G : "transparent", color: mode === k ? "#000" : MUTED,
    }}>{label}</button>
  );

  const Badge = ({ label, variant }) => {
    const styles = {
      ig: { background: "rgba(201,244,0,0.1)", color: G, border: `1px solid rgba(201,244,0,0.2)` },
      tt: { background: "rgba(255,255,255,0.07)", color: WHITE, border: `1px solid ${BORDER}` },
      vis: { background: "rgba(136,136,136,0.1)", color: MUTED, border: `1px solid ${BORDER}` },
    };
    return <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 20, ...styles[variant] }}>{label}</span>;
  };

  const CopyBtn = ({ text, k }) => (
    <button onClick={() => copy(text, k)} style={{ fontSize: 11, padding: "4px 10px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, color: copied === k ? G : MUTED, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
      {copied === k ? "Copiado ✓" : "Copiar"}
    </button>
  );

  const Slide = ({ s, i }) => (
    <div style={{ padding: "10px 12px", background: CARD, borderRadius: 8, marginBottom: 6, border: `1px solid ${BORDER}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: WHITE, margin: 0 }}>Slide {i + 1} · {s.title}</p>
        <CopyBtn text={s.copy} k={`slide-${i}`} />
      </div>
      <p style={{ fontSize: 12, color: MUTED, margin: 0, lineHeight: 1.55 }}>{s.copy}</p>
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div>
          <div style={s.logo}>SWETRO</div>
          <div style={s.sub}>Agente de contenido · IA</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: G, display: "inline-block" }} />
          <span style={{ fontSize: 11, color: MUTED }}>Instagram · TikTok</span>
        </div>
      </div>

      <div style={s.tabBar}>
        <Tab k="post" label="Crear post" />
        <Tab k="reporte" label="Reporte de atleta" />
      </div>

      <div style={s.grid}>
        {/* FORM */}
        <div style={s.formPanel}>
          {mode === "post" ? (
            <>
              <label style={{ ...s.lbl, marginTop: 0 }}>Pilar de contenido</label>
              <select value={postForm.tipo} onChange={e => upPost("tipo", e.target.value)} style={{ ...s.inp, appearance: "none" }}>
                <option value="habito">Constancia y hábito deportivo</option>
                <option value="lesiones">Prevención de lesiones</option>
                <option value="metas">Progresión hacia metas</option>
                <option value="metricas">Métricas de entrenamiento</option>
                <option value="educativo">Tip educativo</option>
                <option value="lanzamiento">Nueva función de Swetro</option>
              </select>
              <label style={s.lbl}>Tono</label>
              <select value={postForm.tono} onChange={e => upPost("tono", e.target.value)} style={{ ...s.inp, appearance: "none" }}>
                <option value="energetico">Energético y motivador</option>
                <option value="inspiracional">Inspiracional</option>
                <option value="humor">Con humor</option>
                <option value="serio">Serio / profesional</option>
              </select>
              <label style={s.lbl}>Idioma del resultado</label>
              <select value={postForm.idioma} onChange={e => upPost("idioma", e.target.value)} style={{ ...s.inp, appearance: "none" }}>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
              <label style={s.lbl}>Brief del contenido *</label>
              <textarea rows={6} placeholder="Describe qué quieres comunicar. Ej: Un corredor llevaba meses lesionándose al subir km. Con Swetro empezó a ver su carga y lleva 3 meses sin lesiones, cumpliendo su plan." value={postForm.brief} onChange={e => upPost("brief", e.target.value)} style={{ ...s.inp, resize: "vertical", lineHeight: 1.6 }} />
            </>
          ) : (
            <>
              <label style={{ ...s.lbl, marginTop: 0 }}>Nombre del atleta *</label>
              <input type="text" placeholder="Ej: Carlos Mora" value={reportForm.atleta} onChange={e => upReport("atleta", e.target.value)} style={s.inp} />
              <label style={s.lbl}>Deporte / disciplina *</label>
              <input type="text" placeholder="Ej: Running, Ciclismo, Natación..." value={reportForm.deporte} onChange={e => upReport("deporte", e.target.value)} style={s.inp} />
              <label style={s.lbl}>Período</label>
              <input type="text" placeholder="Ej: Marzo 2026, Q1 2026..." value={reportForm.periodo} onChange={e => upReport("periodo", e.target.value)} style={s.inp} />
              <label style={s.lbl}>Métricas y datos clave *</label>
              <textarea rows={4} placeholder="Ej: 142 km, 8 actividades, ritmo 5:10/km, mejor 10K en 48:30..." value={reportForm.metricas} onChange={e => upReport("metricas", e.target.value)} style={{ ...s.inp, resize: "vertical", lineHeight: 1.6 }} />
              <label style={s.lbl}>Logro o hito destacado</label>
              <input type="text" placeholder="Ej: 3 meses sin lesiones, nuevo récord personal..." value={reportForm.logro} onChange={e => upReport("logro", e.target.value)} style={s.inp} />
              <label style={s.lbl}>Idioma del resultado</label>
              <select value={reportForm.idioma} onChange={e => upReport("idioma", e.target.value)} style={{ ...s.inp, appearance: "none" }}>
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </>
          )}

          {error && <p style={{ fontSize: 12, color: "#ff5555", marginTop: 8 }}>{error}</p>}

          <button onClick={generate} disabled={loading} style={{ ...s.btn, opacity: loading ? 0.5 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Generando..." : "Generar contenido ↗"}
          </button>

          <div style={s.hint}>Copy listo para publicar en Instagram y TikTok + concepto visual para el diseñador. Español latinoamericano con el tono Swetro.</div>
        </div>

        {/* RESULTS */}
        <div>
          {loading && (
            <div style={s.loading}>
              <div style={{ width: 26, height: 26, border: `2px solid ${BORDER}`, borderTopColor: G, borderRadius: "50%", margin: "0 auto 12px", animation: "sw-spin 0.8s linear infinite" }} />
              <style>{`@keyframes sw-spin { to { transform: rotate(360deg); } }`}</style>
              <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>Creando contenido Swetro...</p>
            </div>
          )}

          {!loading && !result && (
            <div style={s.empty}>
              <p style={{ fontSize: 32, margin: "0 0 10px", color: G }}>◈</p>
              <p style={{ fontSize: 13, color: MUTED, margin: 0, lineHeight: 1.6 }}>
                {mode === "post" ? "Completa el brief y genera contenido listo para publicar." : "Ingresa los datos del atleta y genera su reporte para redes."}
              </p>
            </div>
          )}

          {result && (
            <>
              {/* INSTAGRAM */}
              <div style={s.card}>
                <div style={s.cardHdr}>
                  <Badge label="Instagram" variant="ig" />
                  {mode === "post"
                    ? <CopyBtn text={`${result.instagram.caption}\n\n${hashStr(result.instagram.hashtags)}`} k="ig-full" />
                    : <CopyBtn text={result.instagram.caption_intro} k="ig-intro" />}
                </div>
                {mode === "post" ? (
                  <>
                    <p style={s.secLbl}>Caption</p>
                    <p style={s.body}>{result.instagram.caption}</p>
                    <p style={s.hash}>{hashStr(result.instagram.hashtags)}</p>
                    {result.instagram.cta && (
                      <div style={{ marginTop: 10, padding: "8px 12px", background: CARD, borderRadius: 8, borderLeft: `2px solid ${G}`, fontSize: 12, color: WHITE }}>
                        <span style={{ color: G, fontSize: 11, fontWeight: 500 }}>CTA · </span>{result.instagram.cta}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p style={{ ...s.body, marginBottom: 12 }}>{result.instagram.caption_intro}</p>
                    <p style={s.secLbl}>Slides del carrusel</p>
                    {(result.instagram.slides || []).map((sl, i) => <Slide key={i} s={sl} i={i} />)}
                    <p style={s.hash}>{hashStr(result.instagram.hashtags)}</p>
                  </>
                )}
              </div>

              {/* TIKTOK */}
              <div style={s.card}>
                <div style={s.cardHdr}>
                  <Badge label="TikTok" variant="tt" />
                  <CopyBtn text={result.tiktok.script || result.tiktok.structure} k="tt-full" />
                </div>
                <p style={s.secLbl}>Hook · primeros 3s</p>
                <p style={s.hook}>"{result.tiktok.hook}"</p>
                <hr style={s.divider} />
                <p style={s.secLbl}>{mode === "post" ? "Guion del video" : "Estructura del video"}</p>
                <p style={s.body}>{result.tiktok.script || result.tiktok.structure}</p>
                <hr style={s.divider} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <p style={s.secLbl}>Caption</p>
                    <p style={{ ...s.body, fontSize: 12 }}>{result.tiktok.caption}</p>
                    <p style={s.hash}>{hashStr(result.tiktok.hashtags)}</p>
                  </div>
                  <CopyBtn text={`${result.tiktok.caption}\n\n${hashStr(result.tiktok.hashtags)}`} k="tt-caption" />
                </div>
              </div>

              {/* VISUAL */}
              <div style={s.card}>
                <div style={s.cardHdr}>
                  <Badge label="Concepto visual" variant="vis" />
                </div>
                <p style={s.body}>{result.visual.concept}</p>
                {result.visual.mood && (
                  <p style={{ fontSize: 12, color: MUTED, margin: "8px 0 0" }}>
                    <span style={{ color: G, fontWeight: 500 }}>Estilo</span> · {result.visual.mood}
                  </p>
                )}
                {(result.visual.elements || []).length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                    {result.visual.elements.map((e, i) => (
                      <span key={i} style={{ fontSize: 12, padding: "3px 9px", background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, color: MUTED }}>{e}</span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

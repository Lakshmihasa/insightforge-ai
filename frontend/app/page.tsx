"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "../services/api";

export default function Home() {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [resultType, setResultType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [activeDataset, setActiveDataset] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askingQuestion, setAskingQuestion] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null);
  const [chartUrl, setChartUrl] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const fetchDatasets = async () => {
    try {
      const res = await api.get("/datasets/");
      setDatasets(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchDatasets(); }, []);

  const uploadDataset = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/datasets/upload", formData);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await fetchDatasets();
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const handleAction = async (id: number, action: string) => {
    setLoadingAction(`${id}-${action}`);
    setActiveDataset(id);
    setChartUrl("");
    try {
      const res = await api.get(`/datasets/${id}/${action}`);
      setResult(res.data);
      setResultType(action);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) { console.error(err); }
    finally { setLoadingAction(""); }
  };

  const handleChart = async (id: number) => {
    setLoadingAction(`${id}-chart`);
    setActiveDataset(id);
    setResult(null);
    try {
      const res = await api.get(`/datasets/${id}/chart`);
      setChartUrl(res.data.chart_url);
      setResultType("chart");
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) { console.error(err); }
    finally { setLoadingAction(""); }
  };

  const askQuestion = async () => {
    if (!selectedDatasetId || !question.trim()) return;
    setAskingQuestion(true);
    try {
      const res = await api.post(`/datasets/${selectedDatasetId}/ask`, { question });
      setAnswer(res.data.answer);
    } catch (err) { console.error(err); }
    finally { setAskingQuestion(false); }
  };

  const filteredDatasets = datasets.filter((d) =>
    d.filename.toLowerCase().includes(search.toLowerCase())
  );

  const totalRows = datasets.reduce((sum, d) => sum + (d.rows || 0), 0);
  const totalCols = datasets.reduce((sum, d) => sum + (d.columns || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #04050a; --surface: #0b0d14; --surface2: #11141f;
          --border: rgba(255,255,255,0.07); --border-bright: rgba(255,255,255,0.15);
          --text: #e8eaf0; --muted: #6b7280;
          --accent: #6366f1; --accent2: #22d3ee; --accent3: #f472b6;
          --green: #34d399; --yellow: #fbbf24;
          --font-head: 'Syne', sans-serif; --font-mono: 'JetBrains Mono', monospace;
        }
        body { background: var(--bg); overflow-x: hidden; }
        .page { min-height: 100vh; background: var(--bg); color: var(--text); font-family: var(--font-head); padding: 0 0 80px; overflow-x: hidden; }

        /* NAV */
        .nav { display: flex; align-items: center; justify-content: space-between; padding: 22px 48px; border-bottom: 1px solid var(--border); backdrop-filter: blur(20px); position: sticky; top: 0; z-index: 100; background: rgba(4,5,10,0.92); }
        .nav-logo { font-size: 36px; font-weight: 800; letter-spacing: -2px; line-height: 1; background: linear-gradient(90deg, #fff 0%, var(--accent2) 40%, var(--accent) 75%, var(--accent3) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 20px rgba(34,211,238,0.4)); }
        .nav-badge { font-family: var(--font-mono); font-size: 13px; color: var(--muted); border: 1px solid var(--border); padding: 5px 12px; border-radius: 20px; letter-spacing: 1px; }
        .badge { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 13px; padding: 5px 12px; border-radius: 20px; }
        .badge-green { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.25); color: var(--green); }

        /* HERO — capped so it never overflows */
        .hero { padding: 56px 48px 44px; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; top: -160px; left: -160px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%); pointer-events: none; }
        .hero-eyebrow { font-family: var(--font-mono); font-size: 12px; letter-spacing: 3px; color: var(--accent2); text-transform: uppercase; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .hero-eyebrow::before { content: ''; display: block; width: 28px; height: 1px; background: var(--accent2); }
        .hero-title { font-size: clamp(40px, 5vw, 72px); font-weight: 800; line-height: 1; letter-spacing: -2px; margin-bottom: 20px; max-width: 640px; }
        .hero-title span { display: block; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.5) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-title em { font-style: normal; background: linear-gradient(135deg, var(--accent2) 0%, var(--accent) 50%, var(--accent3) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { font-size: 17px; color: var(--muted); max-width: 480px; line-height: 1.65; font-weight: 400; }

        /* SHOWCASE STRIP */
        .showcase { margin: 0 48px 48px; display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; background: var(--surface); }
        .showcase-item { padding: 32px 28px; border-right: 1px solid var(--border); position: relative; overflow: hidden; transition: background 0.2s; }
        .showcase-item:hover { background: rgba(255,255,255,0.02); }
        .showcase-item:last-child { border-right: none; }
        .showcase-item::after { content: ''; position: absolute; bottom: 0; left: 28px; right: 28px; height: 2px; border-radius: 2px; opacity: 0; transition: opacity 0.2s; }
        .showcase-item:hover::after { opacity: 1; }
        .showcase-item.c1::after { background: var(--accent2); }
        .showcase-item.c2::after { background: var(--accent); }
        .showcase-item.c3::after { background: var(--accent3); }
        .showcase-item.c4::after { background: var(--green); }
        .showcase-label { font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 12px; display: flex; align-items: center; gap: 7px; }
        .showcase-label-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .showcase-number { font-size: 56px; font-weight: 800; letter-spacing: -2px; line-height: 1; margin-bottom: 8px; }
        .showcase-sub { font-size: 14px; color: var(--muted); font-weight: 500; }
        .showcase-number.cyan   { color: var(--accent2); filter: drop-shadow(0 0 14px rgba(34,211,238,0.3)); }
        .showcase-number.indigo { color: var(--accent);  filter: drop-shadow(0 0 14px rgba(99,102,241,0.3)); }
        .showcase-number.pink   { color: var(--accent3); filter: drop-shadow(0 0 14px rgba(244,114,182,0.3)); }
        .showcase-number.green  { color: var(--green);   filter: drop-shadow(0 0 14px rgba(52,211,153,0.3)); }

        /* MAIN LAYOUT */
        .content { padding: 0 48px; display: grid; grid-template-columns: 300px 1fr 300px; gap: 20px; margin-bottom: 40px; align-items: start; }
        @media (max-width: 1200px) { .content { grid-template-columns: 300px 1fr; } .right-panel { display: none; } }
        @media (max-width: 800px)  { .content { grid-template-columns: 1fr; } }

        /* PANELS */
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; }
        .panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--border-bright), transparent); }
        .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .panel-title { font-size: 18px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
        .panel-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; background: var(--surface2); border: 1px solid var(--border); }

        /* RIGHT PANEL — fully self-contained, no overflow */
        .right-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 28px; position: relative; overflow: hidden; display: flex; flex-direction: column; gap: 24px; }
        .right-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(244,114,182,0.5), transparent); }

        /* TICKER — contained, words scroll within the box */
        .ticker-wrap { overflow: hidden; border: 1px solid var(--border); border-radius: 10px; background: var(--surface2); padding: 12px 0; }
        .ticker-track { display: flex; gap: 32px; animation: ticker 20s linear infinite; width: max-content; }
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .ticker-item { font-family: var(--font-mono); font-size: 12px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; white-space: nowrap; display: flex; align-items: center; gap: 10px; }
        .ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent2); flex-shrink: 0; }

        /* LIVE COUNTERS */
        .live-counters { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .live-counter { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 18px 20px; position: relative; overflow: hidden; }
        .live-counter::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; }
        .live-counter.lc1::after { background: linear-gradient(90deg, var(--accent2), var(--accent)); }
        .live-counter.lc2::after { background: linear-gradient(90deg, var(--accent3), var(--yellow)); }
        .live-counter.lc3::after { background: linear-gradient(90deg, var(--green), var(--accent2)); }
        .live-counter.lc4::after { background: linear-gradient(90deg, var(--yellow), var(--accent3)); }
        .lc-label { font-family: var(--font-mono); font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; margin-bottom: 8px; }
        .lc-value { font-size: 36px; font-weight: 800; letter-spacing: -1.5px; line-height: 1; }
        .lc-value.cyan   { color: var(--accent2); }
        .lc-value.pink   { color: var(--accent3); }
        .lc-value.green  { color: var(--green); }
        .lc-value.yellow { color: var(--yellow); }
        .lc-sub { font-size: 12px; color: var(--muted); margin-top: 4px; }

        /* FEATURE TAGS */
        .feature-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .ftag { font-family: var(--font-mono); font-size: 12px; font-weight: 500; padding: 7px 14px; border-radius: 99px; letter-spacing: 0.5px; border: 1px solid; }
        .ftag.t1 { color: var(--accent2); border-color: rgba(34,211,238,0.3);  background: rgba(34,211,238,0.05); }
        .ftag.t2 { color: var(--accent3); border-color: rgba(244,114,182,0.3); background: rgba(244,114,182,0.05); }
        .ftag.t3 { color: var(--green);   border-color: rgba(52,211,153,0.3);  background: rgba(52,211,153,0.05); }
        .ftag.t4 { color: var(--yellow);  border-color: rgba(251,191,36,0.3);  background: rgba(251,191,36,0.05); }
        .ftag.t5 { color: var(--accent);  border-color: rgba(99,102,241,0.3);  background: rgba(99,102,241,0.05); }
        .ftag.t6 { color: #94a3b8;        border-color: rgba(148,163,184,0.25);background: rgba(148,163,184,0.04); }

        /* STAT STRIP */
        .stat-strip { border: 1px solid var(--border); border-radius: 14px; overflow: hidden; }
        .stat-strip-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid var(--border); transition: background 0.15s; }
        .stat-strip-row:last-child { border-bottom: none; }
        .stat-strip-row:hover { background: rgba(255,255,255,0.02); }
        .ss-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; }
        .ss-value { font-size: 16px; font-weight: 800; letter-spacing: -0.3px; }
        .ss-value.cyan   { color: var(--accent2); }
        .ss-value.green  { color: var(--green); }
        .ss-value.pink   { color: var(--accent3); }
        .ss-value.yellow { color: var(--yellow); }

        /* UPLOAD */
        .drop-zone { border: 1.5px dashed var(--border-bright); border-radius: 14px; padding: 28px; text-align: center; cursor: pointer; transition: all 0.2s; background: rgba(99,102,241,0.03); margin-bottom: 14px; }
        .drop-zone:hover { border-color: var(--accent); background: rgba(99,102,241,0.06); }
        .drop-zone-icon { font-size: 32px; margin-bottom: 10px; }
        .drop-zone-text { font-size: 17px; color: var(--muted); margin-bottom: 4px; }
        .drop-zone-hint { font-family: var(--font-mono); font-size: 13px; color: rgba(107,114,128,0.6); }
        .file-selected { font-family: var(--font-mono); font-size: 14px; color: var(--accent2); background: rgba(34,211,238,0.06); border: 1px solid rgba(34,211,238,0.2); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* BUTTONS */
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 22px; border-radius: 12px; border: none; cursor: pointer; font-family: var(--font-head); font-weight: 700; font-size: 17px; letter-spacing: 0.3px; transition: all 0.15s; }
        .btn:active { transform: scale(0.97); }
        .btn-primary { background: var(--accent); color: white; width: 100%; justify-content: center; }
        .btn-primary:hover { background: #4f51e0; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-sm { padding: 12px 18px; font-size: 16px; font-weight: 700; border-radius: 10px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); cursor: pointer; font-family: var(--font-head); transition: all 0.15s; }
        .btn-sm:hover { border-color: var(--border-bright); background: rgba(255,255,255,0.05); }
        .btn-sm.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }
        .btn-cyan   { border-color: rgba(34,211,238,0.3)  !important; color: var(--accent2) !important; }
        .btn-cyan:hover   { background: rgba(34,211,238,0.08) !important; }
        .btn-pink   { border-color: rgba(244,114,182,0.3) !important; color: var(--accent3) !important; }
        .btn-pink:hover   { background: rgba(244,114,182,0.08) !important; }
        .btn-green  { border-color: rgba(52,211,153,0.3)  !important; color: var(--green)   !important; }
        .btn-green:hover  { background: rgba(52,211,153,0.08) !important; }
        .btn-yellow { border-color: rgba(251,191,36,0.3)  !important; color: var(--yellow)  !important; }
        .btn-yellow:hover { background: rgba(251,191,36,0.08) !important; }

        /* SEARCH */
        .search-wrap { position: relative; margin-bottom: 18px; }
        .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 17px; color: var(--muted); pointer-events: none; }
        .search-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px 14px 44px; color: var(--text); font-family: var(--font-head); font-size: 17px; outline: none; transition: border-color 0.2s; }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: var(--border-bright); }

        /* DATASET CARDS */
        .dataset-list { display: flex; flex-direction: column; gap: 12px; max-height: 700px; overflow-y: auto; padding-right: 4px; }
        .dataset-list::-webkit-scrollbar { width: 4px; }
        .dataset-list::-webkit-scrollbar-track { background: transparent; }
        .dataset-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
        .dataset-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; transition: border-color 0.2s; }
        .dataset-card:hover { border-color: var(--border-bright); }
        .dataset-card.selected { border-color: rgba(99,102,241,0.4); background: rgba(99,102,241,0.05); }
        .dataset-name { font-size: 20px; font-weight: 700; color: var(--text); word-break: break-all; margin-bottom: 12px; }
        .dataset-meta { display: flex; gap: 10px; margin-bottom: 14px; }
        .meta-pill { font-family: var(--font-mono); font-size: 15px; color: var(--muted); background: var(--surface); border: 1px solid var(--border); padding: 5px 12px; border-radius: 20px; }
        .dataset-actions { display: flex; flex-wrap: wrap; gap: 8px; }
        .loading-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: currentColor; animation: pulse 1s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }

        /* QUALITY BADGE */
        .quality-badge { display: inline-flex; align-items: center; gap: 7px; background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.3); padding: 6px 14px; border-radius: 20px; font-size: 15px; font-weight: 600; margin-bottom: 12px; }
        .quality-badge::before { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #10b981; flex-shrink: 0; }

        /* QA */
        .qa-input-row { display: flex; gap: 10px; margin-top: 14px; }
        .qa-input { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; color: var(--text); font-family: var(--font-head); font-size: 17px; outline: none; transition: border-color 0.2s; }
        .qa-input::placeholder { color: var(--muted); }
        .qa-input:focus { border-color: rgba(99,102,241,0.4); }
        .qa-answer { margin-top: 18px; background: var(--surface2); border: 1px solid rgba(52,211,153,0.2); border-radius: 14px; padding: 20px 22px; }
        .qa-answer-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 2px; color: var(--green); text-transform: uppercase; margin-bottom: 10px; }
        .qa-answer-text { font-size: 17px; line-height: 1.7; color: var(--text); }
        .dataset-selector { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .btn-selector { padding: 9px 16px; font-size: 15px; font-weight: 600; border-radius: 9px; border: 1px solid var(--border); background: var(--surface2); color: var(--text); cursor: pointer; transition: all 0.15s; font-family: var(--font-head); }
        .btn-selector:hover { border-color: var(--border-bright); }
        .btn-selector.active { background: rgba(99,102,241,0.15); border-color: rgba(99,102,241,0.4); color: #a5b4fc; }

        /* RESULT PANEL */
        .full-section { margin: 0 48px 24px; }
        .result-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; position: relative; }
        .result-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(34,211,238,0.4), transparent); }
        .result-header { display: flex; align-items: center; justify-content: space-between; padding: 22px 30px; border-bottom: 1px solid var(--border); }
        .result-title { font-size: 20px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 10px; }
        .result-title-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent2); animation: pulse 2s ease-in-out infinite; }
        .result-body { padding: 30px; }

        /* SUMMARY */
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .summary-item { background: var(--surface2); border: 1px solid var(--border); border-radius: 14px; padding: 20px 22px; }
        .summary-item-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; margin-bottom: 10px; }
        .summary-item-value { font-size: 40px; font-weight: 800; letter-spacing: -1px; color: var(--accent2); }
        .col-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .col-tag { font-family: var(--font-mono); font-size: 16px; background: var(--surface2); border: 1px solid var(--border); padding: 8px 16px; border-radius: 8px; color: #a5b4fc; }

        /* STATS */
        .stats-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }
        .stat-col-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 16px; padding: 26px 28px; transition: border-color 0.2s; }
        .stat-col-card:hover { border-color: var(--border-bright); }
        .stat-col-name { font-size: 22px; font-weight: 700; color: #a5b4fc; margin-bottom: 20px; padding-bottom: 14px; border-bottom: 1px solid var(--border); word-break: break-all; }
        .stat-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .stat-metric { display: flex; flex-direction: column; gap: 6px; }
        .stat-metric-label { font-family: var(--font-mono); font-size: 12px; letter-spacing: 1.5px; color: var(--muted); text-transform: uppercase; }
        .stat-metric-value { font-family: var(--font-mono); font-size: 30px; font-weight: 600; letter-spacing: -1px; }
        .stat-metric-value.mean   { color: var(--accent2); }
        .stat-metric-value.median { color: var(--accent); }
        .stat-metric-value.min    { color: var(--green); }
        .stat-metric-value.max    { color: var(--accent3); }
        .stat-metric-value.std    { color: var(--yellow); }
        .stat-metric.full { grid-column: 1 / -1; }
        .stat-metric.full .stat-metric-value { font-size: 24px; }

        /* QUALITY */
        .quality-row { display: flex; align-items: center; gap: 16px; margin-bottom: 14px; }
        .quality-label { font-family: var(--font-mono); font-size: 15px; color: var(--muted); width: 160px; flex-shrink: 0; }
        .quality-bar-track { flex: 1; height: 10px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
        .quality-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .quality-val { font-family: var(--font-mono); font-size: 18px; color: var(--text); width: 56px; text-align: right; flex-shrink: 0; }
        .quality-score-big { font-size: 96px; font-weight: 800; letter-spacing: -4px; line-height: 1; background: linear-gradient(135deg, var(--green), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

        /* MISC */
        .insight-index { font-family: var(--font-mono); font-size: 13px; color: var(--yellow); background: rgba(251,191,36,0.08); border: 1px solid rgba(251,191,36,0.2); border-radius: 6px; padding: 3px 9px; flex-shrink: 0; margin-top: 2px; }
        .insight-text { font-size: 17px; line-height: 1.65; color: var(--text); }
        .chart-img { width: 100%; border-radius: 14px; border: 1px solid var(--border); }
        .raw-json { font-family: var(--font-mono); font-size: 14px; color: #94a3b8; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 20px; white-space: pre-wrap; word-break: break-word; max-height: 400px; overflow-y: auto; line-height: 1.6; }
        .footer { text-align: center; padding: 60px 48px 0; font-family: var(--font-mono); font-size: 13px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; }
        .empty { text-align: center; padding: 48px 20px; color: var(--muted); font-size: 17px; }
        .empty-icon { font-size: 34px; margin-bottom: 12px; }
        .spinner { display: inline-block; width: 15px; height: 15px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes glow-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
        .glow-line { position: absolute; top: 0; left: 0; right: 0; height: 1px; overflow: hidden; }
        .glow-line::after { content: ''; position: absolute; top: 0; left: 0; width: 30%; height: 100%; background: linear-gradient(90deg, transparent, var(--accent2), transparent); animation: glow-slide 3s ease-in-out infinite; }
      `}</style>

      <div className="page">
        {/* NAV */}
        <nav className="nav">
          <div className="nav-logo">InsightForge AI</div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span className="badge badge-green">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
              {datasets.length} datasets
            </span>
            <span className="nav-badge">v1.0</span>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <div className="hero-eyebrow">AI-Powered Analytics</div>
          <h1 className="hero-title">
            <span>Your data,</span>
            <em>decoded.</em>
          </h1>
          <p className="hero-sub">Upload CSV datasets and get instant statistics, quality scores, visualizations, and AI-powered answers.</p>
        </div>

        {/* SHOWCASE STRIP */}
        <div className="showcase">
          <div className="showcase-item c1">
            <div className="showcase-label"><span className="showcase-label-dot" style={{ background: "var(--accent2)" }} />Datasets Loaded</div>
            <div className="showcase-number cyan">{datasets.length || "0"}</div>
            <div className="showcase-sub">CSV files analyzed</div>
          </div>
          <div className="showcase-item c2">
            <div className="showcase-label"><span className="showcase-label-dot" style={{ background: "var(--accent)" }} />Total Rows</div>
            <div className="showcase-number indigo">{totalRows > 0 ? totalRows.toLocaleString() : "0"}</div>
            <div className="showcase-sub">Data points processed</div>
          </div>
          <div className="showcase-item c3">
            <div className="showcase-label"><span className="showcase-label-dot" style={{ background: "var(--accent3)" }} />Analytics Engine</div>
            <div className="showcase-number pink" style={{ fontSize: "40px", letterSpacing: "-1px" }}>InsightCore</div>
            <div className="showcase-sub">Powering Q&amp;A insights</div>
          </div>
          <div className="showcase-item c4">
            <div className="showcase-label"><span className="showcase-label-dot" style={{ background: "var(--green)" }} />Uptime</div>
            <div className="showcase-number green">99.9<span style={{ fontSize: "28px" }}>%</span></div>
            <div className="showcase-sub">Always live, always fast</div>
          </div>
        </div>

        {/* 3-COLUMN CONTENT */}
        <div className="content">

          {/* COL 1 — UPLOAD + QA */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Upload</span>
              <span className="panel-icon">↑</span>
            </div>
            <div className="drop-zone" onClick={() => fileInputRef.current?.click()}>
              <div className="drop-zone-icon">📂</div>
              <div className="drop-zone-text">Click to select a CSV file</div>
              <div className="drop-zone-hint">Only .csv files are supported</div>
              <input ref={fileInputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            {file && <div className="file-selected">📄 {file.name} — {(file.size / 1024).toFixed(1)} KB</div>}
            <button className="btn btn-primary" onClick={uploadDataset} disabled={!file || uploading}>
              {uploading ? <><span className="spinner" /> Uploading...</> : <>↑ Upload Dataset</>}
            </button>

            <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
              <div className="panel-header" style={{ marginBottom: "10px" }}>
                <span className="panel-title">Ask Data</span>
                <span className="panel-icon">✦</span>
              </div>
              <p style={{ fontSize: "14px", color: "var(--muted)", marginBottom: "12px" }}>Select a dataset, then ask anything.</p>
              <div className="dataset-selector">
                {datasets.map((d) => (
                  <button key={d.id} className={`btn-selector ${selectedDatasetId === d.id ? "active" : ""}`} onClick={() => setSelectedDatasetId(d.id)} title={d.filename}>
                    {d.filename.length > 14 ? d.filename.slice(0, 14) + "…" : d.filename}
                  </button>
                ))}
                {datasets.length === 0 && <span style={{ fontSize: "14px", color: "var(--muted)" }}>No datasets yet</span>}
              </div>
              <div className="qa-input-row">
                <input className="qa-input" type="text" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. What is the average age?" onKeyDown={(e) => e.key === "Enter" && askQuestion()} />
                <button className="btn btn-sm btn-cyan" onClick={askQuestion} disabled={askingQuestion || !selectedDatasetId || !question.trim()} style={{ whiteSpace: "nowrap" }}>
                  {askingQuestion ? <span className="loading-dot" /> : "Ask →"}
                </button>
              </div>
              {answer && (
                <div className="qa-answer">
                  <div className="qa-answer-label">AI Answer</div>
                  <div className="qa-answer-text">{answer}</div>
                </div>
              )}
            </div>
          </div>

          {/* COL 2 — DATASETS */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Datasets</span>
              <span className="panel-icon">⊞</span>
            </div>
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" placeholder="Search datasets..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {filteredDatasets.length === 0 ? (
              <div className="empty"><div className="empty-icon">📭</div>{search ? "No datasets match your search." : "No datasets uploaded yet."}</div>
            ) : (
              <div className="dataset-list">
                {filteredDatasets.map((dataset) => (
                  <div key={dataset.id} className={`dataset-card ${activeDataset === dataset.id ? "selected" : ""}`}>
                    <div className="dataset-name">📄 {dataset.filename}</div>
                    <div className="dataset-meta">
                      <span className="meta-pill">{dataset.rows?.toLocaleString()} rows</span>
                      <span className="meta-pill">{dataset.columns} cols</span>
                    </div>
                    <div className="quality-badge">Quality Score Available</div>
                    <div className="dataset-actions">
                      <button className={`btn btn-sm btn-green ${loadingAction === `${dataset.id}-summary` ? "active" : ""}`} onClick={() => handleAction(dataset.id, "summary")}>
                        {loadingAction === `${dataset.id}-summary` ? <span className="loading-dot" /> : "Summary"}
                      </button>
                      <button className={`btn btn-sm ${loadingAction === `${dataset.id}-statistics` ? "active" : ""}`} onClick={() => handleAction(dataset.id, "statistics")}>
                        {loadingAction === `${dataset.id}-statistics` ? <span className="loading-dot" /> : "Statistics"}
                      </button>
                      <button className={`btn btn-sm btn-pink ${loadingAction === `${dataset.id}-quality` ? "active" : ""}`} onClick={() => handleAction(dataset.id, "quality")}>
                        {loadingAction === `${dataset.id}-quality` ? <span className="loading-dot" /> : "Quality"}
                      </button>
                      <button className={`btn btn-sm btn-cyan ${loadingAction === `${dataset.id}-chart` ? "active" : ""}`} onClick={() => handleChart(dataset.id)}>
                        {loadingAction === `${dataset.id}-chart` ? <span className="loading-dot" /> : "Chart"}
                      </button>
                      <button className={`btn btn-sm btn-yellow ${loadingAction === `${dataset.id}-insights` ? "active" : ""}`} onClick={() => handleAction(dataset.id, "insights")}>
                        {loadingAction === `${dataset.id}-insights` ? <span className="loading-dot" /> : "Insights"}
                      </button>
                      <button className="btn btn-sm" style={{ borderColor: "rgba(148,163,184,0.3)", color: "#94a3b8" }} onClick={() => window.open(`http://127.0.0.1:8000/datasets/${dataset.id}/report`, "_blank")}>
                        ↓ Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COL 3 — RIGHT INFO PANEL (fully contained) */}
          <div className="right-panel">
            <div className="glow-line" />

            {/* SCROLLING TICKER */}
            <div className="ticker-wrap">
              <div className="ticker-track">
                {["Analyze","Visualize","Insights","Predict","Decode","Explore","Analyze","Visualize","Insights","Predict","Decode","Explore"].map((w, i) => (
                  <span key={i} className="ticker-item">
                    <span className="ticker-dot" />
                    {w}
                  </span>
                ))}
              </div>
            </div>

            {/* LIVE COUNTERS */}
            <div className="live-counters">
              <div className="live-counter lc1">
                <div className="lc-label">Datasets</div>
                <div className="lc-value cyan">{datasets.length}</div>
                <div className="lc-sub">loaded</div>
              </div>
              <div className="live-counter lc2">
                <div className="lc-label">Columns</div>
                <div className="lc-value pink">{totalCols}</div>
                <div className="lc-sub">features</div>
              </div>
              <div className="live-counter lc3">
                <div className="lc-label">Rows</div>
                <div className="lc-value green">{totalRows.toLocaleString()}</div>
                <div className="lc-sub">records</div>
              </div>
              <div className="live-counter lc4">
                <div className="lc-label">Uptime</div>
                <div className="lc-value yellow">99.9%</div>
                <div className="lc-sub">always on</div>
              </div>
            </div>

            {/* FEATURE TAGS */}
            <div className="feature-tags">
              <span className="ftag t1">CSV Upload</span>
              <span className="ftag t2">Statistics</span>
              <span className="ftag t3">Quality Score</span>
              <span className="ftag t4">Charts</span>
              <span className="ftag t5">AI Q&amp;A</span>
              <span className="ftag t6">Insights</span>
              <span className="ftag t1">Reports</span>
              <span className="ftag t3">FastAPI</span>
              <span className="ftag t5">PostgreSQL</span>
              <span className="ftag t2">Next.js</span>
            </div>

            {/* STAT STRIP */}
            <div className="stat-strip">
              <div className="stat-strip-row">
                <span className="ss-label">Engine</span>
                <span className="ss-value cyan">InsightCore</span>
              </div>
              <div className="stat-strip-row">
                <span className="ss-label">Stack</span>
                <span className="ss-value pink">Next.js + FastAPI</span>
              </div>
              <div className="stat-strip-row">
                <span className="ss-label">Database</span>
                <span className="ss-value green">PostgreSQL</span>
              </div>
              <div className="stat-strip-row">
                <span className="ss-label">Version</span>
                <span className="ss-value yellow">v1.0</span>
              </div>
            </div>
          </div>

        </div>

        {/* RESULT PANEL */}
        {(result || chartUrl) && (
          <div className="full-section" ref={resultRef}>
            <div className="result-panel">
              <div className="result-header">
                <div className="result-title">
                  <div className="result-title-dot" />
                  {resultType.charAt(0).toUpperCase() + resultType.slice(1)} Results
                </div>
                <button className="btn btn-sm" onClick={() => { setResult(null); setChartUrl(""); setResultType(""); }} style={{ fontSize: "15px" }}>✕ Close</button>
              </div>
              <div className="result-body">
                {resultType === "insights" && result && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {(result.insights || []).map((insight: string, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px", background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "18px 22px" }}>
                        <span className="insight-index">{String(i + 1).padStart(2, "0")}</span>
                        <span className="insight-text">{insight}</span>
                      </div>
                    ))}
                  </div>
                )}
                {resultType === "chart" && chartUrl && <img src={chartUrl} alt="Dataset Chart" className="chart-img" />}
                {resultType === "summary" && result && (
                  <>
                    <div className="summary-grid">
                      <div className="summary-item"><div className="summary-item-label">Filename</div><div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text)", wordBreak: "break-all" }}>{result.filename}</div></div>
                      <div className="summary-item"><div className="summary-item-label">Rows</div><div className="summary-item-value">{result.rows?.toLocaleString()}</div></div>
                      <div className="summary-item"><div className="summary-item-label">Columns</div><div className="summary-item-value">{result.columns}</div></div>
                    </div>
                    {result.column_names && (
                      <>
                        <div style={{ fontSize: "13px", letterSpacing: "2px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "14px" }}>Column Names</div>
                        <div className="col-list">{result.column_names.map((col: string) => <span key={col} className="col-tag">{col}</span>)}</div>
                      </>
                    )}
                  </>
                )}
                {resultType === "statistics" && result && (
                  <div className="stats-cards-grid">
                    {Object.entries(result.statistics || {}).map(([col, stats]: any) => (
                      <div key={col} className="stat-col-card">
                        <div className="stat-col-name">⬡ {col}</div>
                        <div className="stat-metrics">
                          <div className="stat-metric"><span className="stat-metric-label">Mean</span><span className="stat-metric-value mean">{typeof stats.mean === "number" ? stats.mean.toFixed(2) : stats.mean ?? "—"}</span></div>
                          <div className="stat-metric"><span className="stat-metric-label">Median</span><span className="stat-metric-value median">{typeof stats.median === "number" ? stats.median.toFixed(2) : stats.median ?? "—"}</span></div>
                          <div className="stat-metric"><span className="stat-metric-label">Min</span><span className="stat-metric-value min">{stats.min ?? "—"}</span></div>
                          <div className="stat-metric"><span className="stat-metric-label">Max</span><span className="stat-metric-value max">{stats.max ?? "—"}</span></div>
                          <div className="stat-metric full"><span className="stat-metric-label">Std Deviation</span><span className="stat-metric-value std">{typeof stats.std === "number" ? stats.std.toFixed(3) : stats.std ?? "—"}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {resultType === "quality" && result && (
                  <div style={{ display: "flex", gap: "40px", flexWrap: "wrap", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ fontSize: "13px", letterSpacing: "1.5px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "12px" }}>Quality Score</div>
                      <div className="quality-score-big">{result.quality_score}<span style={{ fontSize: "36px" }}>%</span></div>
                    </div>
                    <div style={{ flex: 1, minWidth: "240px" }}>
                      <div style={{ fontSize: "13px", letterSpacing: "1.5px", color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)", marginBottom: "16px" }}>Breakdown</div>
                      <div className="quality-row"><span className="quality-label">Quality Score</span><div className="quality-bar-track"><div className="quality-bar-fill" style={{ width: `${result.quality_score}%` }} /></div><span className="quality-val">{result.quality_score}%</span></div>
                      <div className="quality-row"><span className="quality-label">Missing Cells</span><div className="quality-bar-track"><div className="quality-bar-fill" style={{ width: `${Math.max(0, 100 - result.missing_cells)}%`, background: "linear-gradient(90deg, var(--accent3), var(--yellow))" }} /></div><span className="quality-val">{result.missing_cells}</span></div>
                    </div>
                  </div>
                )}
                {result && !["summary", "statistics", "quality", "insights"].includes(resultType) && (
                  <pre className="raw-json">{JSON.stringify(result, null, 2)}</pre>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="footer">FastAPI · PostgreSQL · Next.js · Built with precision</div>
      </div>
    </>
  );
}
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CriteriaMatrix } from './components/CriteriaMatrix';
import { InstructionsViewer } from './components/InstructionsViewer';
import { PromptCustomizer } from './components/PromptCustomizer';
import { SimulationPreview } from './components/SimulationPreview';
import { CustomizerSettings } from './types';
import {
  buildSystemInstruction,
  COMPACT_SYSTEM_INSTRUCTION,
  AGENTS_MD_TEMPLATE
} from './data/instructionsData';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

const DEFAULT_SETTINGS: CustomizerSettings = {
  includeA11y: true,
  vendorPath: './assets/vendor',
  bootstrapVersion: 'Bootstrap 5 (最新穩定版)',
  strictNegativeConstraints: true,
  twoStageOutput: true
};

export default function App() {
  const [settings, setSettings] = useState<CustomizerSettings>(DEFAULT_SETTINGS);
  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const standardInstruction = useMemo(() => {
    return buildSystemInstruction(settings);
  }, [settings]);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setToastMessage('已成功複製到剪貼簿！可直接貼至 Google AI Studio 的 System Instructions 欄位。');
    setTimeout(() => {
      setCopied(false);
      setToastMessage('');
    }, 3000);
  };

  const handleResetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-neutral-700 animate-fade-in max-w-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header onCopyAll={() => handleCopyText(standardInstruction)} copied={copied} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Intro banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-neutral-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              Google AI Studio 專用系統提示詞產生系統
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
              前端開發工程師高強度 System Instructions
            </h2>
            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
              根據您提供的 6 大核心規範（角色、背景、任務、限制、輸出協議、驗收標準），嚴格限制 AI
              <strong> 禁止使用 Vue/React 前端框架</strong>、<strong>禁止引用外部 CDN</strong>、
              <strong>優先使用 Bootstrap 5 本機資源與 Font Awesome</strong>、落實
              <strong> RWD 零水平捲軸</strong>與<strong>表單全欄位防呆機制</strong>。
            </p>
          </div>
        </div>

        {/* 1. Prompt Viewer & Tabs */}
        <InstructionsViewer
          standardText={standardInstruction}
          compactText={COMPACT_SYSTEM_INSTRUCTION}
          workspaceText={AGENTS_MD_TEMPLATE}
          onCopyText={handleCopyText}
          copied={copied}
        />

        {/* 2. Customizer */}
        <PromptCustomizer
          settings={settings}
          onChange={setSettings}
          onReset={handleResetSettings}
        />

        {/* 3. The 6 Requirements Matrix */}
        <CriteriaMatrix />

        {/* 4. Live Verification Playground & Simulation */}
        <SimulationPreview />

        {/* 5. Best Practice Advice Card */}
        <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            AI Studio 系統提示詞使用關鍵技巧（避免模型幻覺）：
          </h3>
          <ul className="text-xs text-neutral-600 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <strong>負面約束強化（Negative Constraints）</strong>：大語言模型通常習慣預設輸出 CDN 連結或 React 程式碼。本提示詞透過「【五大禁令與約束】」建立高優先級攔截，有效阻斷 CDN 與框架洩漏。
            </li>
            <li>
              <strong>兩階段輸出控制（Two-Phase Protocol）</strong>：強制模型「先分析目錄結構與防呆規劃，再輸出完整程式碼」，大幅減少遺漏欄位防呆或檔案結構混亂的情形。
            </li>
            <li>
              <strong>專案持久化（AGENTS.md）</strong>：若在 Google AI Studio Build 開發，專案根目錄的 <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">AGENTS.md</code> 與 <code className="bg-neutral-100 px-1 py-0.5 rounded text-neutral-800 font-mono">GEMINI.md</code> 亦已自動同步建立，每次對話均會自動注入此規範！
            </li>
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-4 text-center text-xs text-neutral-400">
        Google AI Studio 系統提示詞產生器 • 嚴格落實前端 Vanilla Web + Bootstrap 5 本地規範
      </footer>
    </div>
  );
}

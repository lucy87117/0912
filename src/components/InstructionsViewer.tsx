import React, { useState } from 'react';
import { PromptVersion } from '../types';
import { Copy, Check, Download, FileText, Sparkles, BookOpen, ExternalLink } from 'lucide-react';

interface InstructionsViewerProps {
  standardText: string;
  compactText: string;
  workspaceText: string;
  onCopyText: (text: string) => void;
  copied: boolean;
}

export const InstructionsViewer: React.FC<InstructionsViewerProps> = ({
  standardText,
  compactText,
  workspaceText,
  onCopyText,
  copied
}) => {
  const [activeTab, setActiveTab] = useState<PromptVersion>('standard');
  const [showGuide, setShowGuide] = useState<boolean>(false);

  const getCurrentContent = () => {
    switch (activeTab) {
      case 'standard':
        return standardText;
      case 'compact':
        return compactText;
      case 'workspace':
        return workspaceText;
      default:
        return standardText;
    }
  };

  const currentContent = getCurrentContent();
  const charCount = currentContent.length;
  const lineCount = currentContent.split('\n').length;

  const handleDownload = () => {
    const filename =
      activeTab === 'standard'
        ? 'AI_Studio_System_Instructions.md'
        : activeTab === 'compact'
        ? 'AI_Studio_System_Instructions_Compact.md'
        : 'AGENTS.md';

    const blob = new Blob([currentContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden mb-6">
      {/* Tab Navigation Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-neutral-200 bg-neutral-50/70 px-4 py-2.5 gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab('standard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'standard'
                ? 'bg-white text-blue-700 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            ⭐ 標準生產級 (AI Studio 欄位專用)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('compact')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'compact'
                ? 'bg-white text-blue-700 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            ⚡ 精簡省 Token 版
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === 'workspace'
                ? 'bg-white text-blue-700 shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50'
            }`}
          >
            📁 專案設定檔 (AGENTS.md)
          </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-blue-600 px-2.5 py-1.5 rounded-md hover:bg-neutral-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>AI Studio 設定指南</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 text-xs text-neutral-700 bg-white border border-neutral-200 hover:bg-neutral-100 px-2.5 py-1.5 rounded-md shadow-xs transition-colors"
            title="下載為 Markdown 檔案"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下載 .md</span>
          </button>
          <button
            type="button"
            onClick={() => onCopyText(currentContent)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-900 text-white hover:bg-neutral-800'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已複製！' : '複製此版本'}</span>
          </button>
        </div>
      </div>

      {/* Guide Banner */}
      {showGuide && (
        <div className="bg-blue-50/80 border-b border-blue-200/70 p-4 text-xs text-blue-900 leading-relaxed">
          <div className="font-bold text-blue-950 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            如何將這段提示詞套用到 Google AI Studio：
          </div>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>在 Google AI Studio (aistudio.google.com) 開啟或新建任一 Chat / Prompt 專案。</li>
            <li>在右側設定面板（Model Settings）中找到 <strong>System Instructions</strong>（系統說明/提示詞）欄位。</li>
            <li>點擊上方的「複製此版本」按鈕，將內容完整貼入 <strong>System Instructions</strong> 欄位中。</li>
            <li>日後無論你要求「做登入頁」、「做預約系統」或「寫自訂表格」，模型都會嚴格依循原生 HTML/CSS/JS、本地 Bootstrap 5 與 Font Awesome，先給變更說明再給程式碼，並落實 RWD 與防呆！</li>
          </ol>
        </div>
      )}

      {/* Prompt Text Viewer Container */}
      <div className="relative">
        <pre className="p-4 sm:p-5 text-xs sm:text-[13px] font-mono leading-relaxed text-neutral-800 bg-neutral-950/2 overflow-x-auto max-h-[460px] whitespace-pre-wrap select-text">
          {currentContent}
        </pre>
      </div>

      {/* Footer metadata info */}
      <div className="flex flex-wrap items-center justify-between border-t border-neutral-200 px-4 py-2 bg-neutral-50 text-[11px] text-neutral-500 gap-2">
        <div className="flex items-center gap-3">
          <span>字元數: <strong className="text-neutral-700 font-mono">{charCount}</strong></span>
          <span>行數: <strong className="text-neutral-700 font-mono">{lineCount}</strong></span>
          <span className="text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded font-medium">繁體中文標準</span>
        </div>
        <div className="flex items-center gap-2">
          <span>適用模型: Gemini 2.5 Pro / Flash / 3.x</span>
        </div>
      </div>
    </div>
  );
};

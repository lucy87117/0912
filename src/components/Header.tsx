import React from 'react';
import { Sparkles, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onCopyAll: () => void;
  copied: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onCopyAll, copied }) => {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                AI Studio 系統提示詞指令庫
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                前端工程師專用規範
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              原生 HTML/CSS/JS • Bootstrap 5 本地化 • 零 CDN • 全局 RWD • 嚴格表單防呆
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onCopyAll}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                已複製完整提示詞！
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                一鍵複製 AI Studio 提示詞
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

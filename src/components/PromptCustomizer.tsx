import React from 'react';
import { CustomizerSettings } from '../types';
import { Sliders, RotateCcw } from 'lucide-react';

interface PromptCustomizerProps {
  settings: CustomizerSettings;
  onChange: (newSettings: CustomizerSettings) => void;
  onReset: () => void;
}

export const PromptCustomizer: React.FC<PromptCustomizerProps> = ({
  settings,
  onChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-neutral-800">
            提示詞參數自訂微調器 (Prompt Fine-Tuning)
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-neutral-500 hover:text-neutral-800 inline-flex items-center gap-1 hover:underline"
        >
          <RotateCcw className="w-3 h-3" />
          恢復預設值
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Vendor Path */}
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">
            本機靜態資源路徑 (Vendor Path)
          </label>
          <input
            type="text"
            value={settings.vendorPath}
            onChange={(e) => onChange({ ...settings, vendorPath: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-md border border-neutral-300 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="./assets/vendor"
          />
          <p className="text-[11px] text-neutral-400 mt-1">本地引用的相對路徑根目錄</p>
        </div>

        {/* Bootstrap Version */}
        <div>
          <label className="block font-semibold text-neutral-700 mb-1">
            Bootstrap 指定版本
          </label>
          <select
            value={settings.bootstrapVersion}
            onChange={(e) => onChange({ ...settings, bootstrapVersion: e.target.value })}
            className="w-full px-2.5 py-1.5 rounded-md border border-neutral-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="Bootstrap 5 (最新穩定版)">Bootstrap 5 (最新穩定版)</option>
            <option value="Bootstrap 5.3">Bootstrap 5.3</option>
            <option value="Bootstrap 5.2">Bootstrap 5.2</option>
          </select>
          <p className="text-[11px] text-neutral-400 mt-1">規範 AI 採用的版本語法</p>
        </div>

        {/* A11y checkbox */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="a11yCheck"
            checked={settings.includeA11y}
            onChange={(e) => onChange({ ...settings, includeA11y: e.target.checked })}
            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="a11yCheck" className="text-neutral-700 cursor-pointer">
            <span className="font-semibold block">納入無障礙設計 (A11y)</span>
            <span className="text-[11px] text-neutral-500 leading-tight block">
              強制 label 綁定與 aria-label 標註
            </span>
          </label>
        </div>

        {/* Anti-overengineering */}
        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="strictCheck"
            checked={settings.strictNegativeConstraints}
            onChange={(e) =>
              onChange({ ...settings, strictNegativeConstraints: e.target.checked })
            }
            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="strictCheck" className="text-neutral-700 cursor-pointer">
            <span className="font-semibold block">強化防過度工程化</span>
            <span className="text-[11px] text-neutral-500 leading-tight block">
              嚴禁額外導入非必要套件
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

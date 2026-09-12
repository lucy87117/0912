import React from 'react';
import { CRITERIA_LIST } from '../data/instructionsData';
import { CheckCircle2, ShieldCheck, Layers, FileText, Smartphone, Ban } from 'lucide-react';

export const CriteriaMatrix: React.FC = () => {
  const getIcon = (id: number) => {
    switch (id) {
      case 1:
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 2:
        return <Layers className="w-4 h-4 text-indigo-600" />;
      case 3:
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 4:
        return <Ban className="w-4 h-4 text-rose-600" />;
      case 5:
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 6:
        return <ShieldCheck className="w-4 h-4 text-violet-600" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <section className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            六大要求與 System Instructions 規格對照表
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            確保您的 6 點硬性規定（角色、背景、任務、限制、輸出、驗收）100% 轉譯為 AI 遵循的負面約束與協議。
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-neutral-100 text-neutral-700 font-medium rounded-md w-fit">
          全數規格驗證通過
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {CRITERIA_LIST.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 font-bold text-neutral-800 text-sm">
                {getIcon(item.id)}
                <span>{item.id}. 【{item.label}】</span>
              </div>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-blue-100/70 text-blue-800 font-medium">
                已映射
              </span>
            </div>

            <div className="mb-2">
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">原始需求</div>
              <div className="text-xs text-neutral-700 font-medium bg-white p-2 rounded border border-neutral-200/80 mt-1">
                {item.originalRequirement}
              </div>
            </div>

            <div>
              <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">系統提示詞規範實作</div>
              <div className="text-xs text-neutral-600 mt-1 whitespace-pre-line leading-relaxed">
                {item.systemInstructionMapping}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

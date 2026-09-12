import React, { useState } from 'react';
import { SIMULATED_SAMPLE } from '../data/instructionsData';
import {
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Send,
  Loader2
} from 'lucide-react';

export const SimulationPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'interactive' | 'code' | 'protocol'>('interactive');
  const [viewportMode, setViewportMode] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Interactive Form State for verification test
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    date: '',
    notes: ''
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    date: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  const isNameValid = formData.name.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isDateValid = Boolean(formData.date && formData.date >= todayStr);

  const handleFieldChange = (field: 'name' | 'email' | 'date' | 'notes', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, date: true });

    if (!isNameValid || !isEmailValid || !isDateValid) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', date: '', notes: '' });
        setTouched({ name: false, email: false, date: false });
        setSubmitSuccess(false);
      }, 3500);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-neutral-900">
              AI 執行成效與驗收模擬沙盒 (Live Verification Sandbox)
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            展示套用此 System Instructions 後，AI 面對「建立網站需求」時的兩階段標準回覆與即時防呆驗證。
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('interactive')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'interactive'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            實機防呆與 RWD 模擬
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('protocol')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'protocol'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            階段一：變更清單說明
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'code'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            階段二：原生程式碼
          </button>
        </div>
      </div>

      {/* Simulated User Question Card */}
      <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200/80 mb-5 text-xs">
        <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
          模擬使用者提問 (User Prompt)
        </span>
        <div className="font-medium text-neutral-800 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
          「{SIMULATED_SAMPLE.userQuery}」
        </div>
      </div>

      {/* Tab: Interactive Demo */}
      {activeTab === 'interactive' && (
        <div>
          {/* Viewport Width Controls */}
          <div className="flex items-center justify-between bg-neutral-100 px-3 py-2 rounded-t-lg border border-b-0 border-neutral-200 text-xs">
            <span className="font-semibold text-neutral-700 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-neutral-500" />
              驗收項目 1：RWD 視窗響應式切換
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewportMode('mobile')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewportMode === 'mobile'
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="手機尺寸 (375px)"
              >
                <Smartphone className="w-3.5 h-3.5" /> 手機 (375px)
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('tablet')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewportMode === 'tablet'
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="平板尺寸 (640px)"
              >
                <Tablet className="w-3.5 h-3.5" /> 平板 (640px)
              </button>
              <button
                type="button"
                onClick={() => setViewportMode('desktop')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewportMode === 'desktop'
                    ? 'bg-white text-neutral-900 shadow-xs border border-neutral-300'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                title="桌機尺寸 (100%)"
              >
                <Monitor className="w-3.5 h-3.5" /> 桌機 (100%)
              </button>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="bg-neutral-200/50 p-4 sm:p-6 rounded-b-lg border border-neutral-200 flex justify-center items-start min-h-[520px] overflow-x-auto transition-all">
            <div
              className={`bg-white rounded-xl shadow-md border border-neutral-200 transition-all duration-300 ${
                viewportMode === 'mobile'
                  ? 'w-[375px] max-w-full'
                  : viewportMode === 'tablet'
                  ? 'w-[640px] max-w-full'
                  : 'w-full max-w-2xl'
              }`}
            >
              {/* Bootstrap Form Header */}
              <div className="p-5 sm:p-6 border-b border-neutral-100 text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 font-bold">
                  ✓
                </div>
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                  會員諮詢預約 (Bootstrap 5 響應式佈局)
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  請體驗嚴格表單防呆機制：即時欄位格式檢核與防重複送出
                </p>
              </div>

              {/* Form Body */}
              <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    真實姓名 <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    placeholder="請輸入至少 2 個字元"
                    className={`w-full px-3 py-2 rounded-lg border text-xs transition-colors ${
                      touched.name
                        ? isNameValid
                          ? 'border-emerald-500 bg-emerald-50/20 focus:ring-1 focus:ring-emerald-500'
                          : 'border-rose-500 bg-rose-50/20 focus:ring-1 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                  {touched.name && (
                    <div className="mt-1 text-[11px]">
                      {isNameValid ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 格式正確
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> 請填寫完整真實姓名（至少 2 個字元）
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    電子郵件 <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-3 py-2 rounded-lg border text-xs transition-colors ${
                      touched.email
                        ? isEmailValid
                          ? 'border-emerald-500 bg-emerald-50/20 focus:ring-1 focus:ring-emerald-500'
                          : 'border-rose-500 bg-rose-50/20 focus:ring-1 focus:ring-rose-500'
                        : 'border-neutral-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
                    }`}
                  />
                  {touched.email && (
                    <div className="mt-1 text-[11px]">
                      {isEmailValid ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 信箱格式有效
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> 請提供有效的電子郵件格式 (需含 @ 與網域)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    預約日期 <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={formData.date}
                    onChange={(e) => handleFieldChange('date', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-xs transition-colors ${
                      touched.date
                        ? isDateValid
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : 'border-rose-500 bg-rose-50/20'
                        : 'border-neutral-300'
                    }`}
                  />
                  <span className="text-[10px] text-neutral-400 mt-0.5 block">
                    防呆限制：不可選擇早於今日 ({todayStr}) 之過去日期
                  </span>
                  {touched.date && !isDateValid && (
                    <div className="mt-1 text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> 請選擇有效的未來預約日期
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    諮詢主旨與備註說明
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="請簡要描述諮詢需求（非必填）..."
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Success alert message */}
                {submitSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>預約送出成功！防重複機制已生效，表單已自動安全重設。</span>
                  </div>
                )}

                {/* Submit button with anti-double-click */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-neutral-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.99]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      處理中，防止重複提交...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      立即確認預約 (驗收防呆測試)
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Stage 1 Architecture */}
      {activeTab === 'protocol' && (
        <div className="space-y-4">
          <div className="border border-blue-200 bg-blue-50/50 p-4 rounded-lg">
            <h3 className="text-sm font-bold text-blue-900 mb-1">
              {SIMULATED_SAMPLE.stage1.title}
            </h3>
            <p className="text-xs text-blue-700">
              符合規定 5：「請先列出修改檔案及說明，再提供程式碼」。AI 會在產出代碼前精準規劃目錄結構。
            </p>
          </div>

          <div className="space-y-2.5">
            {SIMULATED_SAMPLE.stage1.files.map((f) => (
              <div
                key={f.path}
                className="p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/70"
              >
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-neutral-800">
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span>{f.path}</span>
                </div>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Stage 2 Code */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-neutral-700">
                📄 index.html (包含本地端 Bootstrap 5 與 Font Awesome 引用)
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                零 CDN 規範保證
              </span>
            </div>
            <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-lg text-xs font-mono overflow-x-auto max-h-72">
              {SIMULATED_SAMPLE.stage2.html}
            </pre>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-bold text-neutral-700">
                ⚡ assets/js/main.js (原生 Vanilla JS + 表單欄位防呆邏輯)
              </span>
              <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                純 Vanilla JS (ES6+)
              </span>
            </div>
            <pre className="p-4 bg-neutral-900 text-neutral-100 rounded-lg text-xs font-mono overflow-x-auto max-h-72">
              {SIMULATED_SAMPLE.stage2.js}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

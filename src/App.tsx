import React, { useState } from 'react';
import { Upload, FileText, Settings, Loader2, Database, AlertCircle, Languages } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { GoogleGenAI, Type } from '@google/genai';

interface Report {
  summary: string;
  painPoints: string[];
  praisedFeatures: string[];
  mentionedBrands: string[];
  highFrequencyWords: string[];
}

const translations = {
  en: {
    title: "Reddit Analyzer",
    dataInput: "Data Input",
    uploadText: "Upload JSON, CSV or Text file",
    dragDrop: "or drag and drop",
    orPaste: "or paste data",
    placeholder: "Paste your Reddit posts and comments here...",
    analyzeBtn: "Analyze Data",
    analyzingBtn: "Analyzing Data...",
    reportTitle: "Analysis Report",
    exportBtn: "Export to Notion",
    summary: "Summary of Discussions",
    painPoints: "Main User Pain Points",
    praisedFeatures: "Praised Product Features",
    mentionedBrands: "Mentioned Brands",
    highFreqWords: "High Frequency Words",
    emptyState: "Upload data and click analyze to see the report",
    settingsTitle: "Notion Export Settings",
    settingsHelp: "To export to Notion, you need an Internal Integration Token and the ID of the database you want to export to. The integration must be added to the database via the \"Share\" menu.",
    apiKeyLabel: "Notion API Key (Internal Integration Token)",
    dbIdLabel: "Database ID",
    cancel: "Cancel",
    save: "Save Settings",
    toastCsvSuccess: "CSV loaded successfully",
    toastJsonSuccess: "JSON loaded successfully",
    toastJsonError: "Invalid JSON file",
    toastFileSuccess: "File loaded successfully",
    toastNoData: "Please provide some data to analyze",
    toastAnalyzeSuccess: "Analysis complete!",
    toastAnalyzeFail: "Analysis failed",
    toastExportConfig: "Please configure Notion API Key and Database ID in settings",
    toastExportSuccess: "Successfully exported to Notion!",
    toastExportFail: "Export failed",
    toastSettingsSaved: "Settings saved",
  },
  zh: {
    title: "Reddit 数据分析器",
    dataInput: "数据输入",
    uploadText: "上传 JSON, CSV 或文本文件",
    dragDrop: "或拖拽文件到此处",
    orPaste: "或粘贴数据",
    placeholder: "在此粘贴您的 Reddit 帖子和评论...",
    analyzeBtn: "分析数据",
    analyzingBtn: "正在分析数据...",
    reportTitle: "分析报告",
    exportBtn: "导出至 Notion",
    summary: "讨论内容总结",
    painPoints: "主要用户痛点",
    praisedFeatures: "用户称赞的产品特点",
    mentionedBrands: "提及的品牌/产品",
    highFreqWords: "高频词汇",
    emptyState: "上传数据并点击分析以查看报告",
    settingsTitle: "Notion 导出设置",
    settingsHelp: "要导出到 Notion，您需要一个内部集成令牌 (Integration Token) 以及目标数据库的 ID。必须通过“共享”菜单将集成添加到该数据库。",
    apiKeyLabel: "Notion API Key (内部集成令牌)",
    dbIdLabel: "数据库 ID",
    cancel: "取消",
    save: "保存设置",
    toastCsvSuccess: "CSV 加载成功",
    toastJsonSuccess: "JSON 加载成功",
    toastJsonError: "无效的 JSON 文件",
    toastFileSuccess: "文件加载成功",
    toastNoData: "请提供要分析的数据",
    toastAnalyzeSuccess: "分析完成！",
    toastAnalyzeFail: "分析失败",
    toastExportConfig: "请在设置中配置 Notion API Key 和数据库 ID",
    toastExportSuccess: "成功导出至 Notion！",
    toastExportFail: "导出失败",
    toastSettingsSaved: "设置已保存",
  }
};

export default function App() {
  const [language, setLanguage] = useState<'en' | 'zh'>('zh');
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [notionApiKey, setNotionApiKey] = useState(localStorage.getItem('notionApiKey') || '');
  const [notionDbId, setNotionDbId] = useState(localStorage.getItem('notionDbId') || '');
  const [isExporting, setIsExporting] = useState(false);

  const t = translations[language];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const text = Array.isArray(json) 
            ? json.map(item => typeof item === 'object' ? Object.values(item).join(' ') : item).join('\n')
            : JSON.stringify(json, null, 2);
          setInputText(text);
          toast.success(t.toastJsonSuccess);
        } catch (error) {
          toast.error(t.toastJsonError);
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        complete: (results) => {
          const text = results.data.map((row: any) => Object.values(row).join(' ')).join('\n');
          setInputText(text);
          toast.success(t.toastCsvSuccess);
        },
        error: (error) => {
          toast.error(`${t.toastAnalyzeFail}: ${error.message}`);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputText(e.target?.result as string);
        toast.success(t.toastFileSuccess);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error(t.toastNoData);
      return;
    }

    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Analyze the following Reddit dataset (posts and comments) and provide a structured report based on this framework:
        1. Summary: Summarize the discussions in these posts and comments.
        2. Pain Points: Main user pain points, most frequent complaints or issues.
        3. Praised Features: Product features users recommend or praise (functionality, design, appearance, etc.).
        4. Mentioned Brands: Most frequently mentioned products or brand names.
        5. High Frequency Words: Most commonly used vocabulary or high-frequency words when describing products and issues.

        IMPORTANT: The final output MUST be in ${language === 'zh' ? 'Simplified Chinese' : 'English'}.

        Dataset:
        ${inputText.substring(0, 30000)} // Truncating to avoid token limits if too large
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING, description: "Summary of discussions" },
              painPoints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Main user pain points" },
              praisedFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Praised product features" },
              mentionedBrands: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Mentioned brands or products" },
              highFrequencyWords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "High frequency words" }
            },
            required: ["summary", "painPoints", "praisedFeatures", "mentionedBrands", "highFrequencyWords"]
          }
        }
      });

      const resultText = response.text;
      if (resultText) {
        setReport(JSON.parse(resultText));
        toast.success(t.toastAnalyzeSuccess);
      } else {
        throw new Error("No response from AI");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(`${t.toastAnalyzeFail}: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportToNotion = async () => {
    if (!report) return;
    if (!notionApiKey || !notionDbId) {
      toast.error(t.toastExportConfig);
      setShowSettings(true);
      return;
    }

    setIsExporting(true);
    try {
      const response = await fetch('/api/notion/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: notionApiKey,
          databaseId: notionDbId,
          report,
          language
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t.toastExportSuccess);
      } else {
        throw new Error(data.error || 'Failed to export');
      }
    } catch (error: any) {
      toast.error(`${t.toastExportFail}: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('notionApiKey', notionApiKey);
    localStorage.setItem('notionDbId', notionDbId);
    setShowSettings(false);
    toast.success(t.toastSettingsSaved);
  };

  return (
    <div className="h-screen bg-[#F9F8F6] text-stone-900 font-sans flex flex-col overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-[#F9F8F6] border-b border-stone-200 shrink-0">
        <div className="w-full px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-[#F9F8F6]" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-stone-800">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setLanguage(lang => lang === 'en' ? 'zh' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-200 rounded-full transition-colors"
            >
              <Languages className="w-4 h-4" />
              {language === 'en' ? '中' : 'EN'}
            </button>
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 text-stone-500 hover:bg-stone-200 rounded-full transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Input Section (Left Pane) */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto border-b lg:border-b-0 lg:border-r border-stone-200 flex flex-col">
          <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col space-y-6">
            <h2 className="text-lg font-medium flex items-center gap-2 text-stone-800 shrink-0">
              <FileText className="w-5 h-5 text-stone-600" />
              {t.dataInput}
            </h2>
            
            <div className="flex-1 flex flex-col space-y-4">
              <div className="shrink-0 border-2 border-dashed border-stone-300 rounded-xl p-6 text-center hover:bg-stone-50 transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept=".csv,.txt,.json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-stone-700">{t.uploadText}</p>
                <p className="text-xs text-stone-500 mt-1">{t.dragDrop}</p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-stone-500 uppercase tracking-wider">{t.orPaste}</span>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.placeholder}
                className="w-full flex-1 min-h-[200px] p-4 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-500 focus:border-stone-500 resize-none text-sm bg-white shadow-sm"
              />

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="shrink-0 w-full py-3.5 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-300 text-[#F9F8F6] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t.analyzingBtn}
                  </>
                ) : (
                  t.analyzeBtn
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section (Right Pane) */}
        <div className="w-full lg:w-1/2 p-6 lg:p-8 overflow-y-auto bg-white">
          <div className="max-w-2xl mx-auto w-full h-full">
            {report ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-semibold tracking-tight">{t.reportTitle}</h2>
                <button
                  onClick={handleExportToNotion}
                  disabled={isExporting}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-900 disabled:bg-stone-400 text-[#F9F8F6] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  {t.exportBtn}
                </button>
              </div>

              {/* 1. Summary */}
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                <h3 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-sm">1</span>
                  {t.summary}
                </h3>
                <p className="text-blue-900/80 text-sm leading-relaxed">{report.summary}</p>
              </div>

              {/* 2. Pain Points */}
              <div className="bg-red-50 border border-red-100 p-6 rounded-2xl">
                <h3 className="text-red-800 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center text-sm">2</span>
                  {t.painPoints}
                </h3>
                <ul className="space-y-2">
                  {report.painPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-red-900/80">
                      <span className="text-red-400 mt-1">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3. Praised Features */}
              <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <h3 className="text-emerald-800 font-semibold mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center text-sm">3</span>
                  {t.praisedFeatures}
                </h3>
                <ul className="space-y-2">
                  {report.praisedFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-emerald-900/80">
                      <span className="text-emerald-400 mt-1">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 4. Mentioned Brands */}
                <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl">
                  <h3 className="text-purple-800 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-sm">4</span>
                    {t.mentionedBrands}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.mentionedBrands.map((brand, i) => (
                      <span key={i} className="px-2.5 py-1 bg-purple-200/50 text-purple-800 rounded-md text-xs font-medium">
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 5. High Frequency Words */}
                <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl">
                  <h3 className="text-amber-800 font-semibold mb-3 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center text-sm">5</span>
                    {t.highFreqWords}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.highFrequencyWords.map((word, i) => (
                      <span key={i} className="px-2.5 py-1 bg-amber-200/50 text-amber-800 rounded-md text-xs font-medium">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-stone-400 space-y-4 py-20 border-2 border-dashed border-stone-200 rounded-2xl bg-[#F9F8F6]/50">
              <FileText className="w-12 h-12 text-stone-300" />
              <p>{t.emptyState}</p>
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#F9F8F6] rounded-2xl max-w-md w-full p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-semibold mb-4 text-stone-800">{t.settingsTitle}</h2>
            
            <div className="space-y-4">
              <div className="bg-stone-200/50 text-stone-800 p-3 rounded-lg text-xs flex gap-2 items-start">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{t.settingsHelp}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.apiKeyLabel}</label>
                <input 
                  type="password" 
                  value={notionApiKey}
                  onChange={(e) => setNotionApiKey(e.target.value)}
                  placeholder="secret_..."
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 text-sm bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t.dbIdLabel}</label>
                <input 
                  type="text" 
                  value={notionDbId}
                  onChange={(e) => setNotionDbId(e.target.value)}
                  placeholder="e.g. 1234567890abcdef1234567890abcdef"
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-stone-500 focus:border-stone-500 text-sm bg-white"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button 
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 text-stone-600 hover:bg-stone-200 rounded-lg text-sm font-medium transition-colors"
              >
                {t.cancel}
              </button>
              <button 
                onClick={saveSettings}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-[#F9F8F6] rounded-lg text-sm font-medium transition-colors"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

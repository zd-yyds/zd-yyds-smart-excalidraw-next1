'use client';

import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, onApply, onOptimize, onClear, jsonError, onClearJsonError, isGenerating, isApplyingCode, isOptimizingCode }) {
  return (
    <div className="flex relative flex-col h-full bg-transparent border-t border-fuchsia-500/30">
      <div className="flex items-center justify-between px-4 py-3 bg-black/20 border-b border-fuchsia-500/30">
        <h3 className="text-sm font-semibold text-fuchsia-200">生成的代码</h3>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            disabled={isGenerating || isApplyingCode || isOptimizingCode}
            className="rounded cyber-button-secondary flex items-center gap-2"
          >
            清除
            {isGenerating && (
              <div className="w-3 h-3 border border-fuchsia-400 border-t-transparent rounded-full animate-spin"></div>
            )}
          </button>
          <button
            onClick={onOptimize}
            disabled={isGenerating || isApplyingCode || isOptimizingCode || !code.trim()}
            className="rounded cyber-button-primary flex items-center gap-2"
            title="优化图标布局和箭头连接"
          >
            {isOptimizingCode ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>优化中...</span>
              </>
            ) : (
              <>
                <span>优化</span>
                {isGenerating && (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </>
            )}
          </button>
          <button
            onClick={onApply}
            disabled={isGenerating || isApplyingCode || isOptimizingCode || !code.trim()}
            className="rounded cyber-button-primary flex items-center gap-2"
          >
            {isApplyingCode ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>应用中...</span>
              </>
            ) : (
              <>
                <span>应用</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
                {isGenerating && (
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* JSON Error Banner */}
      {jsonError && (
        <div className="absolute bottom-0 z-1 border-b border-red-500/50 px-4 py-3 flex items-start justify-between bg-red-900/40 backdrop-blur-sm" >
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-300 mt-1 font-mono" style={{ fontSize: '12px' }}>{jsonError}</p>
            </div>
          </div>
          <button
            onClick={onClearJsonError}
            className="text-red-400 hover:text-red-300 transition-colors ml-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}


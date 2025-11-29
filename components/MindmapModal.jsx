import { useState } from 'react';

export default function MindmapModal({ isOpen, onClose, onGenerate }) {
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 rounded-xl overflow-hidden shadow-2xl border border-fuchsia-500/50 bg-black/90 cyber-border backdrop-blur-xl">
        <div className="px-6 py-4 border-b border-fuchsia-500/30">
          <h2 className="text-xl font-bold tracking-widest text-fuchsia-300 neo-text">AI生成思维导图</h2>
        </div>
        <div className="px-6 py-5 space-y-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入中心主题或内容"
            className="cyber-input"
          />
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded cyber-button-secondary"
            >
              取消
            </button>
            <button
              onClick={() => onGenerate(input)}
              className="rounded cyber-button-primary"
            >
              生成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


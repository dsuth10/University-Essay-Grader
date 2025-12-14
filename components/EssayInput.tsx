import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface EssayInputProps {
  onSubmit: (text: string, prompt: string) => void;
  isLoading: boolean;
}

const EssayInput: React.FC<EssayInputProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 50) {
      onSubmit(text, prompt);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-indigo-600" />
        Submit Your Work
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Assignment Prompt (Optional)
        </label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. Discuss the socio-economic impacts of..."
          className="w-full rounded-md bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 transition-colors"
          disabled={isLoading}
        />
      </div>

      <div className="flex-grow flex flex-col relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your essay here..."
          className="flex-grow w-full resize-none rounded-md bg-slate-900 border-slate-700 p-4 font-serif text-slate-100 placeholder-slate-400 leading-relaxed focus:border-indigo-500 focus:ring-indigo-500 min-h-[300px] sm:min-h-[400px] transition-colors"
          disabled={isLoading}
        />
        
        <div className="absolute bottom-4 right-4 text-xs text-slate-300 bg-slate-800/90 px-2 py-1 rounded backdrop-blur-sm border border-slate-700 shadow-sm">
          {wordCount} words
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative">
           <input
            type="file"
            accept=".txt,.md"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            disabled={isLoading}
          />
          <label 
            htmlFor="file-upload"
            className={`flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Upload className="w-4 h-4" />
            Upload .txt
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isLoading || wordCount < 10}
          className={`
            px-6 py-2.5 rounded-lg text-white font-medium shadow-md transition-all
            ${isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : wordCount < 10 
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:transform active:scale-95'
            }
          `}
        >
          {isLoading ? 'Grading...' : 'Grade Essay'}
        </button>
      </div>
      
      {wordCount > 0 && wordCount < 50 && (
         <div className="mt-2 text-amber-600 text-xs flex items-center gap-1">
            <AlertCircle className="w-3 h-3"/> Essay is too short for a proper university-level grade.
         </div>
      )}
    </div>
  );
};

export default EssayInput;

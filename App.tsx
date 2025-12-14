import React, { useState } from 'react';
import Header from './components/Header';
import EssayInput from './components/EssayInput';
import GradingResult from './components/GradingResult';
import { gradeEssay } from './services/geminiService';
import { GradingResult as GradingResultType, GradingState } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [gradingState, setGradingState] = useState<GradingState>(GradingState.IDLE);
  const [result, setResult] = useState<GradingResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEssaySubmit = async (text: string, prompt: string) => {
    setGradingState(GradingState.GRADING);
    setError(null);
    try {
      const data = await gradeEssay(text, prompt);
      setResult(data);
      setGradingState(GradingState.COMPLETE);
    } catch (err: any) {
      console.error(err);
      setError("An error occurred while grading the essay. Please try again. Ensure your essay is text-based.");
      setGradingState(GradingState.ERROR);
    }
  };

  const handleReset = () => {
    setGradingState(GradingState.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Introduction / Hero text only when IDLE */}
        {gradingState === GradingState.IDLE && (
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Academic Essay Evaluation</h2>
            <p className="text-slate-600">
              Get instant, university-level feedback on your writing. Our AI analyzes your argument, structure, and style to help you improve your grades.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-8">
          
          {/* Input Section - Hide when complete on mobile to focus on results, or keep side-by-side on desktop */}
          <div className={`${gradingState === GradingState.COMPLETE ? 'hidden lg:block' : 'block'}`}>
            <EssayInput 
              onSubmit={handleEssaySubmit} 
              isLoading={gradingState === GradingState.GRADING} 
            />
          </div>

          {/* Loading State */}
          {gradingState === GradingState.GRADING && (
            <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100 flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-xl font-semibold text-slate-800">Analyzing your work...</h3>
                <p className="text-slate-500 text-center mt-2 max-w-xs">
                  Reviewing thesis, checking citations, and evaluating structure. This usually takes about 10-20 seconds.
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
          {gradingState === GradingState.ERROR && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Grading Failed</h3>
                <p className="text-red-700 text-sm">{error}</p>
                <button 
                  onClick={() => setGradingState(GradingState.IDLE)}
                  className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Result Section */}
          {gradingState === GradingState.COMPLETE && result && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="flex justify-between items-center mb-6 lg:hidden">
                <button 
                  onClick={handleReset}
                  className="text-sm text-indigo-600 font-medium hover:underline"
                >
                  &larr; Submit another essay
                </button>
              </div>
              <GradingResult result={result} />
               <div className="mt-8 flex justify-center lg:justify-start">
                  <button 
                    onClick={handleReset}
                    className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Grade Another Essay
                  </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;

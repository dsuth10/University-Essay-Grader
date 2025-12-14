import React from 'react';
import { GradingResult as GradingResultType } from '../types';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Quote, 
  Feather, 
  AlignLeft, 
  Type, 
  Sparkles,
  Maximize2
} from 'lucide-react';

interface GradingResultProps {
  result: GradingResultType;
}

const GradingResult: React.FC<GradingResultProps> = ({ result }) => {
  
  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRatingColor = (rating: string) => {
    const r = rating.toLowerCase();
    if (r.includes('excellent') || r.includes('advanced')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (r.includes('good') || r.includes('proficient')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (r.includes('fair') || r.includes('intermediate')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  const chartData = result.criteria.map(c => ({
    subject: c.name,
    A: c.score,
    fullMark: 100,
  }));

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Top Score Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Award className="w-32 h-32 text-indigo-600" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
          <div className={`flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 ${getGradeColor(result.overallScore)}`}>
            <span className="text-3xl sm:text-4xl font-bold">{result.overallScore}</span>
            <span className="text-sm font-medium opacity-80">/ 100</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-800">Overall Grade: {result.letterGrade}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              {result.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Radar Chart & Criteria Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 self-start w-full border-b border-slate-100 pb-2">Competency Map</h3>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="#4f46e5"
                  fillOpacity={0.4}
                />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#94a3b8' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Criteria List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
           <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-2">Detailed Criteria</h3>
           <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
             {result.criteria.map((criterion, idx) => (
               <div key={idx} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-semibold text-slate-700 text-sm">{criterion.name}</span>
                   <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                     criterion.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 
                     criterion.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                   }`}>
                     {criterion.score}%
                   </span>
                 </div>
                 <p className="text-xs text-slate-600">{criterion.feedback}</p>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* Style & Tone Analysis Section */}
      {result.styleAnalysis && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Feather className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Style & Tone Analysis</h3>
              <p className="text-slate-500 text-sm flex items-center gap-2">
                Detected Tone: 
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium text-xs border border-slate-200 uppercase tracking-wide">
                  {result.styleAnalysis.tone}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {result.styleAnalysis.metrics.map((metric, idx) => (
              <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-700 flex items-center gap-2 text-sm">
                    {metric.category.includes('Sentence') && <AlignLeft className="w-4 h-4 text-slate-400" />}
                    {metric.category.includes('Word') && <Type className="w-4 h-4 text-slate-400" />}
                    {metric.category.includes('Formality') && <Award className="w-4 h-4 text-slate-400" />}
                    {metric.category.includes('Clarity') && <Maximize2 className="w-4 h-4 text-slate-400" />}
                    {metric.category}
                  </h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getRatingColor(metric.rating)}`}>
                    {metric.rating}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {metric.feedback}
                </p>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h4 className="text-sm font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Style Improvements
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.styleAnalysis.suggestions.map((sugg, i) => (
                <span key={i} className="bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-md text-sm shadow-sm">
                  {sugg}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Key Strengths
          </h3>
          <ul className="space-y-3">
            {result.strengths.map((strength, i) => (
              <li key={i} className="flex gap-3 text-slate-700 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-amber-800 flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {result.improvements.map((improvement, i) => (
              <li key={i} className="flex gap-3 text-slate-700 text-sm">
                 <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></span>
                {improvement}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex gap-4">
        <Quote className="w-8 h-8 text-indigo-300 shrink-0" />
        <div>
            <h4 className="text-indigo-900 font-semibold text-sm uppercase tracking-wider mb-1">Professor's Note</h4>
            <p className="text-indigo-800 text-sm italic">
                "University writing requires not just correct grammar, but deep critical thinking and structured argumentation. Use the specific feedback above to refine your next draft."
            </p>
        </div>
      </div>

    </div>
  );
};

export default GradingResult;

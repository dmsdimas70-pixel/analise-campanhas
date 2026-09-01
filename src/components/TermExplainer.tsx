import React from 'react';
import { HelpCircle } from 'lucide-react';

interface TermExplainerProps {
  term: string;
  meaning: string;
  className?: string;
  pill?: boolean;
}

export const TermExplainer: React.FC<TermExplainerProps> = ({
  term,
  meaning,
  className = '',
  pill = false
}) => {
  if (pill) {
    return (
      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#1e222b] text-[#94a3b8] border border-[#2d3139] ${className}`}>
        <strong className="text-[#cbd5e1] font-semibold">{term}</strong>
        <span className="text-[#64748b]">•</span>
        <span className="text-[#38bdf8]">{meaning}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-baseline gap-1 text-inherit ${className}`}>
      <span className="font-semibold text-[#f1f5f9]">{term}</span>
      <span className="text-[11px] font-normal text-[#38bdf8] bg-[#0284c7]/10 border border-[#0284c7]/30 px-1.5 py-0.2 rounded">
        ({meaning})
      </span>
    </span>
  );
};

export const TermHelperBadge: React.FC<{ term: string; meaning: string }> = ({ term, meaning }) => {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] bg-[#1e293b]/70 border border-[#334155] text-[#94a3b8]" title={`${term}: ${meaning}`}>
      <span className="text-white font-medium">{term}</span>
      <span className="text-[#64748b]">→</span>
      <span className="text-[#38bdf8] font-normal">{meaning}</span>
    </span>
  );
};

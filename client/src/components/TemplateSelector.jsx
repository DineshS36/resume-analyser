'use client';

import { Check, Sparkles } from 'lucide-react';

const templates = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, ATS-optimized layout with clean formatting',
    color: 'bg-gradient-to-br from-gray-100 to-gray-200',
    features: ['Professional header', 'Clear section dividers', 'ATS-friendly'],
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with accent colors and visual hierarchy',
    color: 'bg-gradient-to-br from-blue-100 to-indigo-200',
    features: ['Color accent header', 'Visual timeline', 'Modern typography'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, elegant design with generous whitespace',
    color: 'bg-gradient-to-br from-slate-100 to-slate-200',
    features: ['Elegant typography', 'Generous whitespace', 'Subtle styling'],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, artistic design perfect for designers and creative professionals',
    color: 'bg-gradient-to-br from-purple-100 to-pink-200',
    features: ['Bold color accents', 'Unique sidebar layout', 'Visual portfolio style'],
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated, premium design for senior leadership roles',
    color: 'bg-gradient-to-br from-slate-200 to-gray-300',
    features: ['Elegant typography', 'Premium styling', 'Leadership focused'],
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Clean, structured layout optimized for developers and engineers',
    color: 'bg-gradient-to-br from-blue-50 to-cyan-100',
    features: ['Skills highlight section', 'Project-focused layout', 'Technical certifications'],
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Research-oriented design for educators, researchers, and scholars',
    color: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    features: ['Publications section', 'Research focus', 'Academic credentials'],
  },
  {
    id: 'two-column',
    name: 'Two Column',
    description: 'Efficient two-column layout with sidebar for maximum content',
    color: 'bg-gradient-to-br from-indigo-100 to-purple-200',
    features: ['Sidebar layout', 'Maximum content', 'Balanced sections'],
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Modern startup style with bold headers and vibrant accents',
    color: 'bg-gradient-to-br from-emerald-100 to-teal-200',
    features: ['Bold headers', 'Vibrant accents', 'Growth-focused'],
  },
  {
    id: 'consultant',
    name: 'Consultant',
    description: 'Professional consulting style emphasizing expertise and results',
    color: 'bg-gradient-to-br from-orange-100 to-amber-200',
    features: ['Results-focused', 'Expertise highlight', 'Client-oriented'],
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Healthcare-focused design for medical professionals',
    color: 'bg-gradient-to-br from-cyan-100 to-sky-200',
    features: ['Healthcare focus', 'Clinical style', 'Credentials highlight'],
  },
  {
    id: 'finance',
    name: 'Finance',
    description: 'Professional finance style for banking and investment professionals',
    color: 'bg-gradient-to-br from-slate-100 to-zinc-300',
    features: ['Numbers-focused', 'Achievement metrics', 'Corporate style'],
  },
];


export default function TemplateSelector({ selected, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
          Choose a Template
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Select a layout that best represents your professional style. All templates are ATS-friendly.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className={`relative p-5 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              selected === template.id
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-blue-300 bg-white'
            }`}
          >
            {selected === template.id && (
              <div className="absolute top-3 right-3">
                <div className="bg-blue-500 text-white rounded-full p-1 shadow-md">
                  <Check className="h-4 w-4" />
                </div>
              </div>
            )}
            
            {/* Template Preview */}
            <div className={`h-24 ${template.color} rounded-lg mb-3 flex items-center justify-center shadow-inner`}>
              <div className="text-center">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {template.name}
                </div>
              </div>
            </div>
            
            <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
            
            <ul className="text-xs text-gray-500 space-y-1">
              {template.features.map((feature, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
      
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 shadow-sm">
        <h4 className="text-sm font-semibold text-purple-900 mb-2 flex items-center">
          <Sparkles className="h-4 w-4 mr-2" />
          ATS Compatibility
        </h4>
        <p className="text-sm text-purple-800">
          All our templates are designed to be ATS (Applicant Tracking System) friendly. 
          They use standard fonts, clear formatting, and avoid complex layouts that might 
          confuse automated resume parsers.
        </p>
      </div>
    </div>
  );
}

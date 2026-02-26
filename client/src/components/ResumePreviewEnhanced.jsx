'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  Smartphone, 
  Monitor, 
  Tablet,
  Palette,
  Type,
  GripVertical,
  Download,
  Eye
} from 'lucide-react';
import ResumePreview from './ResumePreview';
import TemplateSelector from './TemplateSelector';


const colorThemes = [
  { id: 'blue', name: 'Professional Blue', primary: '#2563eb', secondary: '#1e40af' },
  { id: 'green', name: 'Fresh Green', primary: '#059669', secondary: '#047857' },
  { id: 'purple', name: 'Creative Purple', primary: '#7c3aed', secondary: '#5b21b6' },
  { id: 'red', name: 'Bold Red', primary: '#dc2626', secondary: '#991b1b' },
  { id: 'gray', name: 'Minimal Gray', primary: '#374151', secondary: '#1f2937' },
  { id: 'orange', name: 'Energetic Orange', primary: '#ea580c', secondary: '#c2410c' },
];

const fontOptions = [
  { id: 'inter', name: 'Inter (Modern)', family: 'Inter, sans-serif' },
  { id: 'georgia', name: 'Georgia (Classic)', family: 'Georgia, serif' },
  { id: 'roboto', name: 'Roboto (Clean)', family: 'Roboto, sans-serif' },
  { id: 'playfair', name: 'Playfair (Elegant)', family: 'Playfair Display, serif' },
];

export default function ResumePreviewEnhanced({ data, template, onTemplateChange, onDownloadPDF }) {
  const [zoom, setZoom] = useState(100);
  const [deviceView, setDeviceView] = useState('desktop'); // desktop, tablet, mobile
  const [colorTheme, setColorTheme] = useState('blue');
  const [fontFamily, setFontFamily] = useState('inter');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const previewRef = useRef(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);

  const getDeviceWidth = () => {
    switch (deviceView) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const handleDragStart = (e, section) => {
    setIsDragging(true);
    e.dataTransfer.setData('section', section);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetSection) => {
    e.preventDefault();
    setIsDragging(false);
    const sourceSection = e.dataTransfer.getData('section');
    // Reordering logic would go here
    console.log(`Moving ${sourceSection} to ${targetSection}`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left: View Controls */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`p-2 rounded-md transition-all ${deviceView === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceView('tablet')}
              className={`p-2 rounded-md transition-all ${deviceView === 'tablet' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`p-2 rounded-md transition-all ${deviceView === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              title="Mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>

          {/* Center: Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 w-16 text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-xs text-gray-500 hover:text-gray-700 px-2"
            >
              Reset
            </button>
          </div>

          {/* Right: Customization */}
          <div className="flex items-center space-x-2">
            {/* Color Picker */}
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Palette className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Theme</span>
              </button>
              
              <AnimatePresence>
                {showColorPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-20"
                  >
                    <p className="text-sm font-medium text-gray-700 mb-3">Choose Color Theme</p>
                    <div className="grid grid-cols-2 gap-2">
                      {colorThemes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => {
                            setColorTheme(theme.id);
                            setShowColorPicker(false);
                          }}
                          className={`flex items-center space-x-2 p-2 rounded-lg border transition-all ${
                            colorTheme === theme.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: theme.primary }}
                          />
                          <span className="text-xs text-gray-700">{theme.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Font Picker */}
            <div className="relative">
              <button
                onClick={() => setShowFontPicker(!showFontPicker)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Type className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Font</span>
              </button>
              
              <AnimatePresence>
                {showFontPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-20"
                  >
                    {fontOptions.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => {
                          setFontFamily(font.id);
                          setShowFontPicker(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          fontFamily === font.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                        }`}
                        style={{ fontFamily: font.family }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

             {/* Download PDF Button */}
            <button
              onClick={onDownloadPDF}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm font-medium">Download</span>
            </button>

          </div>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 overflow-auto p-8 bg-gray-100">
        <div className="flex justify-center min-h-full">
          <motion.div
            ref={previewRef}
            style={{
              width: getDeviceWidth(),
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              fontFamily: fontOptions.find(f => f.id === fontFamily)?.family,
            }}
            className="bg-white shadow-2xl transition-all duration-300"
          >
            {/* Draggable Sections Indicator */}
            <div className="absolute -left-8 top-0 space-y-2">
              {['header', 'summary', 'experience', 'education', 'skills'].map((section) => (
                <motion.div
                  key={section}
                  draggable
                  onDragStart={(e) => handleDragStart(e, section)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, section)}
                  whileHover={{ x: -2 }}
                  className="flex items-center space-x-1 text-gray-400 cursor-move hover:text-gray-600"
                  title={`Drag to reorder ${section}`}
                >
                  <GripVertical className="h-4 w-4" />
                  <span className="text-xs capitalize">{section}</span>
                </motion.div>
              ))}
            </div>

            {/* Resume Content */}
            <div style={{ 
              '--primary-color': colorThemes.find(t => t.id === colorTheme)?.primary,
              '--secondary-color': colorThemes.find(t => t.id === colorTheme)?.secondary,
            }}>
              <ResumePreview 
                data={data} 
                template={template}
                colorTheme={colorTheme}
                fontFamily={fontFamily}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Template Selector at Bottom */}
      <div className="bg-white border-t border-gray-200 p-4">
        <TemplateSelector selected={template} onSelect={onTemplateChange} />
      </div>
    </div>
  );
}

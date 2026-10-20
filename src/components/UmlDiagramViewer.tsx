import React, { useState, useRef, useMemo } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Info, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { UML_CLASSES, UML_RELATIONSHIPS, SIGNATURE_METADATA, MERMAID_DIAGRAM_CODE, PLANTUML_CODE } from '../data/umlData';
import { UmlClass, UmlCategory } from '../types/uml';

interface UmlDiagramViewerProps {
  onSelectClass?: (umlClass: UmlClass) => void;
}

export const UmlDiagramViewer: React.FC<UmlDiagramViewerProps> = ({ onSelectClass }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>('AboneKullanici');
  const [selectedCategory, setSelectedCategory] = useState<UmlCategory | 'all'>('all');
  const [zoom, setZoom] = useState<number>(0.85);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 10 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [copiedFormat, setCopiedFormat] = useState<'mermaid' | 'plantuml' | null>(null);
  const [showCodeExportModal, setShowCodeExportModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter classes if category is selected
  const filteredClasses = useMemo(() => {
    if (selectedCategory === 'all') return UML_CLASSES;
    return UML_CLASSES.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const activeClass = useMemo(() => {
    return UML_CLASSES.find(c => c.id === selectedClassId) || null;
  }, [selectedClassId]);

  // Handle Drag / Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.clickable-class')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetZoom = () => {
    setZoom(0.85);
    setPan({ x: 30, y: 10 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.15, 2.0));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.15, 0.4));
  };

  const copyToClipboard = (text: string, format: 'mermaid' | 'plantuml') => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  const handleDownloadSvg = () => {
    const svgElement = document.getElementById('uml-canvas-svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);

    // Add namespaces if missing
    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineSystem_UML_Sinif_Diyagrami_Enes_Ozturk.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to get center coordinates of a class box
  const getClassCenter = (classId: string) => {
    const c = UML_CLASSES.find(item => item.id === classId);
    if (!c) {
      return { x: 0, y: 0, top: 0, bottom: 0, left: 0, right: 0 };
    }
    return {
      x: c.x + c.width / 2,
      y: c.y + c.height / 2,
      top: c.y,
      bottom: c.y + c.height,
      left: c.x,
      right: c.x + c.width
    };
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Top Diagram Toolbar */}
      <div className="shrink-0 bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Category Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs overflow-x-auto">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Sınıflar (12)
          </button>
          <button
            onClick={() => setSelectedCategory('user')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'user'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kullanıcı & Abonelik
          </button>
          <button
            onClick={() => setSelectedCategory('catalog')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'catalog'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Film & Katalog
          </button>
          <button
            onClick={() => setSelectedCategory('transaction')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'transaction'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kiralama & Satış
          </button>
          <button
            onClick={() => setSelectedCategory('request')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'request'
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Film Talebi
          </button>
        </div>

        {/* Center: Signature Banner Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-300 bg-slate-950/80 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <span className="text-sky-400 font-mono text-[11px]">UML 2.5</span>
          <span className="text-slate-500">|</span>
          <span>Sistem Mimarisi:</span>
          <span className="font-semibold text-white tracking-wide">{SIGNATURE_METADATA.author}</span>
        </div>

        {/* Right: Zoom & Export Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-lg border border-slate-800">
            <button
              onClick={handleZoomOut}
              title="Uzaklaş"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-400 tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Yakınlaş"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Sıfırla"
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer ml-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export Code / SVG Buttons */}
          <button
            onClick={() => setShowCodeExportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Kodu Al</span>
          </button>

          <button
            onClick={handleDownloadSvg}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG İndir</span>
          </button>
        </div>

      </div>

      {/* Main Workspace: SVG Canvas & Class Inspector Side Drawer */}
      <div className="relative flex-1 flex overflow-hidden">
        
        {/* Interactive SVG Diagram Canvas */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex-1 relative overflow-hidden select-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          <svg
            id="uml-canvas-svg"
            width="100%"
            height="100%"
            viewBox="0 0 1450 1350"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <defs>
              {/* Markers for Relationships */}
              {/* 1. Inheritance (Generalization): Empty closed triangle pointing TO superclass */}
              <marker
                id="inheritance-arrow"
                markerWidth="16"
                markerHeight="16"
                refX="16"
                refY="8"
                orient="auto"
              >
                <polygon points="0,0 16,8 0,16" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
              </marker>

              {/* 2. Association Arrow: Open arrowhead */}
              <marker
                id="association-arrow"
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="6"
                orient="auto"
              >
                <polyline points="2,2 10,6 2,10" fill="none" stroke="#94A3B8" strokeWidth="1.8" />
              </marker>

              {/* 3. Dependency Arrow */}
              <marker
                id="dependency-arrow"
                markerWidth="12"
                markerHeight="12"
                refX="10"
                refY="6"
                orient="auto"
              >
                <polyline points="2,2 10,6 2,10" fill="none" stroke="#F59E0B" strokeWidth="1.8" />
              </marker>

              {/* 4. Composition: Filled Diamond */}
              <marker
                id="composition-diamond"
                markerWidth="18"
                markerHeight="14"
                refX="0"
                refY="7"
                orient="auto"
              >
                <polygon points="0,7 9,2 18,7 9,12" fill="#38BDF8" stroke="#38BDF8" strokeWidth="1.5" />
              </marker>

              {/* 5. Aggregation: Hollow Diamond */}
              <marker
                id="aggregation-diamond"
                markerWidth="18"
                markerHeight="14"
                refX="0"
                refY="7"
                orient="auto"
              >
                <polygon points="0,7 9,2 18,7 9,12" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.8" />
              </marker>

              {/* Subtle Drop Shadow */}
              <filter id="uml-shadow" x="-8%" y="-8%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.45" />
              </filter>
            </defs>

            {/* --- RELATIONSHIP LINES LAYER --- */}
            <g className="uml-relationships-layer">
              {UML_RELATIONSHIPS.map(rel => {
                const fromCenter = getClassCenter(rel.from);
                const toCenter = getClassCenter(rel.to);

                let strokeColor = '#64748B';
                let markerEnd = '';
                let markerStart = '';
                let dashArray = 'none';

                if (rel.type === 'inheritance') {
                  strokeColor = '#38BDF8';
                  markerEnd = 'url(#inheritance-arrow)';
                } else if (rel.type === 'dependency') {
                  strokeColor = '#F59E0B';
                  dashArray = '5,5';
                  markerEnd = 'url(#dependency-arrow)';
                } else if (rel.type === 'composition') {
                  strokeColor = '#38BDF8';
                  markerStart = 'url(#composition-diamond)';
                } else if (rel.type === 'aggregation') {
                  strokeColor = '#38BDF8';
                  markerStart = 'url(#aggregation-diamond)';
                } else {
                  strokeColor = '#94A3B8';
                  markerEnd = 'url(#association-arrow)';
                }

                // Calculate smart path connecting box edges
                // If vertical flow:
                const isVertical = Math.abs(toCenter.y - fromCenter.y) > Math.abs(toCenter.x - fromCenter.x);
                let startX = fromCenter.x;
                let startY = fromCenter.y;
                let endX = toCenter.x;
                let endY = toCenter.y;

                if (isVertical) {
                  if (fromCenter.y > toCenter.y) {
                    startY = fromCenter.top;
                    endY = toCenter.bottom + (rel.type === 'inheritance' ? 16 : 8);
                  } else {
                    startY = fromCenter.bottom;
                    endY = toCenter.top - (rel.type === 'inheritance' ? 16 : 8);
                  }
                } else {
                  if (fromCenter.x > toCenter.x) {
                    startX = fromCenter.left;
                    endX = toCenter.right + 8;
                  } else {
                    startX = fromCenter.right;
                    endX = toCenter.left - 8;
                  }
                }

                // Midpoint for label
                const midX = (startX + endX) / 2;
                const midY = (startY + endY) / 2;

                return (
                  <g key={rel.id} className="uml-rel-group">
                    {/* Path line */}
                    <path
                      d={`M ${startX} ${startY} L ${endX} ${endY}`}
                      stroke={strokeColor}
                      strokeWidth="2"
                      strokeDasharray={dashArray}
                      markerEnd={markerEnd}
                      markerStart={markerStart}
                      fill="none"
                    />

                    {/* Relationship Text Label */}
                    {rel.label && (
                      <g transform={`translate(${midX}, ${midY})`}>
                        <rect
                          x={-rel.label.length * 3.5 - 6}
                          y="-10"
                          width={rel.label.length * 7 + 12}
                          height="18"
                          rx="4"
                          fill="#090D16"
                          stroke="#334155"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          fill="#CBD5E1"
                          fontSize="10"
                          fontFamily="sans-serif"
                          fontWeight="500"
                          textAnchor="middle"
                        >
                          {rel.label}
                        </text>
                      </g>
                    )}

                    {/* Multiplicities */}
                    {rel.fromMultiplicity && (
                      <text
                        x={startX + (startX < endX ? 15 : -25)}
                        y={startY + (startY < endY ? 15 : -10)}
                        fill="#94A3B8"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {rel.fromMultiplicity}
                      </text>
                    )}
                    {rel.toMultiplicity && (
                      <text
                        x={endX + (endX < startX ? 15 : -25)}
                        y={endY + (endY < startY ? 20 : -10)}
                        fill="#94A3B8"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="600"
                      >
                        {rel.toMultiplicity}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* --- UML NOTE & SIGNATURE STAMP BLOCK (ENES ÖZTÜRK) --- */}
            <g transform="translate(60, 40)" className="uml-signature-note">
              {/* Note folded-corner shape */}
              <polygon
                points="0,0 340,0 365,25 365,240 0,240"
                fill="#0F172A"
                stroke="#38BDF8"
                strokeWidth="1.5"
                filter="url(#uml-shadow)"
              />
              <polygon
                points="340,0 340,25 365,25"
                fill="#1E293B"
                stroke="#38BDF8"
                strokeWidth="1"
              />

              {/* Note Header */}
              <text x="16" y="24" fill="#38BDF8" fontSize="12" fontWeight="700" fontFamily="sans-serif">
                UML 2.5 MİMARİ NOTLARI & KURALLAR
              </text>
              <line x1="16" y1="32" x2="340" y2="32" stroke="#334155" strokeWidth="1" />

              {/* Business Rules Text */}
              <text x="16" y="52" fill="#CBD5E1" fontSize="11" fontFamily="sans-serif">
                • Filmler listelenebilir, çoklu kritere göre sıralanabilir.
              </text>
              <text x="16" y="72" fill="#CBD5E1" fontSize="11" fontFamily="sans-serif">
                • Kullanıcılar abonelik kapsamında kredi satın alır.
              </text>
              <text x="16" y="92" fill="#F59E0B" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                • SADECE ABONE kullanıcılar krediyle film kiralayabilir.
              </text>
              <text x="16" y="112" fill="#CBD5E1" fontSize="11" fontFamily="sans-serif">
                • Kiralama bedeli kadar kredi bakiyeden anında düşülür.
              </text>
              <text x="16" y="132" fill="#CBD5E1" fontSize="11" fontFamily="sans-serif">
                • Normal & abone kullanıcılar nakit/kartla film satın alabilir.
              </text>
              <text x="16" y="152" fill="#38BDF8" fontSize="11" fontWeight="600" fontFamily="sans-serif">
                • Mevcut olmayan filmler için FilmTalebi oluşturulabilir.
              </text>

              <line x1="16" y1="170" x2="340" y2="170" stroke="#334155" strokeWidth="1" />

              {/* Signature Stamp Badge */}
              <rect x="16" y="180" width="333" height="48" rx="6" fill="#090D16" stroke="#0284C7" strokeWidth="1" />
              <text x="28" y="200" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">
                Sistem Tasarımı & UML Modellemesi:
              </text>
              <text x="28" y="218" fill="#F8FAFC" fontSize="14" fontWeight="800" letterSpacing="0.5" fontFamily="sans-serif">
                ★ ENES ÖZTÜRK ★
              </text>
              <text x="260" y="217" fill="#38BDF8" fontSize="10" fontFamily="monospace">
                ONAYLANDI
              </text>
            </g>

            {/* --- CLASSES LAYER --- */}
            <g className="uml-classes-layer">
              {filteredClasses.map(umlClass => {
                const isSelected = selectedClassId === umlClass.id;
                
                // Color coding per category
                let headerBg = '#0284C7';
                let headerText = '#FFFFFF';
                let borderColor = isSelected ? '#38BDF8' : '#334155';
                
                if (umlClass.type === 'abstract') {
                  headerBg = '#1E293B';
                } else if (umlClass.type === 'interface') {
                  headerBg = '#065F46';
                } else if (umlClass.category === 'payment') {
                  headerBg = '#854D0E';
                } else if (umlClass.category === 'transaction') {
                  headerBg = '#312E81';
                } else if (umlClass.category === 'request') {
                  headerBg = '#831843';
                }

                // Attributes & Methods separator Y-coordinates
                const headerHeight = umlClass.stereotype ? 48 : 36;
                const attributesHeight = Math.max(umlClass.attributes.length * 20 + 12, 28);
                const attrDividerY = umlClass.y + headerHeight;
                const methodDividerY = attrDividerY + attributesHeight;

                return (
                  <g
                    key={umlClass.id}
                    className="clickable-class cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setSelectedClassId(umlClass.id);
                      if (onSelectClass) onSelectClass(umlClass);
                    }}
                    filter="url(#uml-shadow)"
                  >
                    {/* Class Main Outer Box */}
                    <rect
                      x={umlClass.x}
                      y={umlClass.y}
                      width={umlClass.width}
                      height={umlClass.height}
                      rx="6"
                      fill="#0B132B"
                      stroke={isSelected ? '#38BDF8' : borderColor}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                    />

                    {/* Class Header Box */}
                    <path
                      d={`M ${umlClass.x} ${umlClass.y + 6} 
                          A 6 6 0 0 1 ${umlClass.x + 6} ${umlClass.y} 
                          L ${umlClass.x + umlClass.width - 6} ${umlClass.y} 
                          A 6 6 0 0 1 ${umlClass.x + umlClass.width} ${umlClass.y + 6} 
                          L ${umlClass.x + umlClass.width} ${attrDividerY} 
                          L ${umlClass.x} ${attrDividerY} Z`}
                      fill={headerBg}
                    />

                    {/* Stereotype if any (e.g. <<abstract>>, <<interface>>) */}
                    {umlClass.stereotype && (
                      <text
                        x={umlClass.x + umlClass.width / 2}
                        y={umlClass.y + 16}
                        fill="#E2E8F0"
                        fontSize="10"
                        fontStyle="italic"
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {umlClass.stereotype}
                      </text>
                    )}

                    {/* Class Title */}
                    <text
                      x={umlClass.x + umlClass.width / 2}
                      y={umlClass.y + (umlClass.stereotype ? 36 : 24)}
                      fill={headerText}
                      fontSize="14"
                      fontWeight="700"
                      fontFamily="sans-serif"
                      textAnchor="middle"
                    >
                      {umlClass.name}
                    </text>

                    {/* Attributes Section */}
                    {umlClass.attributes.map((attr, idx) => {
                      const attrY = attrDividerY + 18 + idx * 20;
                      let visColor = '#38BDF8';
                      if (attr.visibility === '-') visColor = '#F43F5E';
                      if (attr.visibility === '#') visColor = '#F59E0B';

                      return (
                        <text
                          key={attr.name}
                          x={umlClass.x + 12}
                          y={attrY}
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          <tspan fill={visColor} fontWeight="700">{attr.visibility} </tspan>
                          <tspan fill="#F1F5F9">{attr.name}: </tspan>
                          <tspan fill="#94A3B8">{attr.type}</tspan>
                        </text>
                      );
                    })}

                    {/* Divider between attributes & methods */}
                    <line
                      x1={umlClass.x}
                      y1={methodDividerY}
                      x2={umlClass.x + umlClass.width}
                      y2={methodDividerY}
                      stroke="#1E293B"
                      strokeWidth="1.5"
                    />

                    {/* Methods Section */}
                    {umlClass.methods.map((method, idx) => {
                      const methodY = methodDividerY + 18 + idx * 20;
                      let visColor = '#38BDF8';
                      if (method.visibility === '-') visColor = '#F43F5E';
                      if (method.visibility === '#') visColor = '#F59E0B';

                      // Format params: (film: Film)
                      const paramsStr = method.parameters
                        .map(p => `${p.name}: ${p.type}`)
                        .join(', ');

                      return (
                        <text
                          key={method.name}
                          x={umlClass.x + 12}
                          y={methodY}
                          fontSize="11"
                          fontFamily="monospace"
                        >
                          <tspan fill={visColor} fontWeight="700">{method.visibility} </tspan>
                          <tspan fill="#F8FAFC" fontWeight="500">{method.name}</tspan>
                          <tspan fill="#94A3B8">({paramsStr}): </tspan>
                          <tspan fill="#38BDF8">{method.returnType}</tspan>
                        </text>
                      );
                    })}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Right Drawer: Selected Class Inspector */}
        {activeClass && (
          <aside className="w-80 md:w-96 shrink-0 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden">
            
            {/* Inspector Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-sky-400">
                    {activeClass.stereotype || '«class»'}
                  </span>
                  <span className="text-xs text-slate-500">·</span>
                  <span className="text-xs text-slate-400 capitalize">{activeClass.category}</span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {activeClass.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedClassId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer text-xs"
              >
                Kapat
              </button>
            </div>

            {/* Inspector Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              
              {/* Description */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Sorumluluk & Görev
                </h4>
                <p className="text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                  {activeClass.description}
                </p>
              </div>

              {/* Attributes Table */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Özellikler (Attributes)</span>
                  <span className="font-mono text-slate-500">{activeClass.attributes.length}</span>
                </h4>
                <div className="space-y-1.5">
                  {activeClass.attributes.map(attr => (
                    <div 
                      key={attr.name}
                      className="p-2 rounded bg-slate-950/40 border border-slate-800/80 font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className={
                            attr.visibility === '+' ? 'text-sky-400 font-bold' :
                            attr.visibility === '-' ? 'text-rose-400 font-bold' :
                            'text-amber-400 font-bold'
                          }>
                            {attr.visibility}
                          </span>{' '}
                          <span className="text-slate-200">{attr.name}</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">{attr.type}</span>
                      </div>
                      {attr.description && (
                        <p className="text-[10px] text-slate-400 font-sans mt-1">
                          {attr.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Methods Table */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-between">
                  <span>Metotlar (Operations)</span>
                  <span className="font-mono text-slate-500">{activeClass.methods.length}</span>
                </h4>
                <div className="space-y-2">
                  {activeClass.methods.map(method => (
                    <div 
                      key={method.name}
                      className="p-2.5 rounded bg-slate-950/40 border border-slate-800/80 font-mono"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <div>
                          <span className={
                            method.visibility === '+' ? 'text-sky-400 font-bold' :
                            method.visibility === '-' ? 'text-rose-400 font-bold' :
                            'text-amber-400 font-bold'
                          }>
                            {method.visibility}
                          </span>{' '}
                          <span className="text-white font-medium">{method.name}</span>
                          <span className="text-slate-400">
                            ({method.parameters.map(p => `${p.name}: ${p.type}`).join(', ')})
                          </span>
                        </div>
                        <span className="text-sky-400 text-[10px] font-semibold">
                          : {method.returnType}
                        </span>
                      </div>
                      {method.description && (
                        <p className="text-[10px] text-slate-400 font-sans mt-1.5 leading-snug">
                          {method.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Relationships */}
              <div>
                <h4 className="text-[11px] font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Bağlı İlişkiler
                </h4>
                <div className="space-y-1.5">
                  {UML_RELATIONSHIPS
                    .filter(r => r.from === activeClass.id || r.to === activeClass.id)
                    .map(rel => (
                      <div 
                        key={rel.id}
                        className="p-2 rounded bg-slate-950/40 border border-slate-800 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 font-medium text-slate-300">
                          <span className="text-sky-400 font-mono">{rel.from}</span>
                          <span className="text-slate-500">→</span>
                          <span className="text-sky-400 font-mono">{rel.to}</span>
                          <span className="text-[10px] text-slate-400 ml-auto bg-slate-800 px-1.5 py-0.5 rounded">
                            {rel.type}
                          </span>
                        </div>
                        {rel.description && (
                          <p className="text-[10px] text-slate-400 mt-1">
                            {rel.description}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Signature Verification Card */}
              <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-800/40 text-[11px]">
                <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Onaylı Sistem Mimarisi</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  Bu sınıf tanımı ve ilişkileri, Enes Öztürk tarafından hazırlanan nesne yönelimli online film platformu şartnamesine uygundur.
                </p>
              </div>

            </div>
          </aside>
        )}
      </div>

      {/* Code Export Modal (Mermaid & PlantUML) */}
      {showCodeExportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">
                  Diyagram Kodlarını Dışa Aktar
                </h3>
                <p className="text-xs text-slate-400">
                  PlantUML ve Mermaid.js formatlarında hazır UML diyagramı
                </p>
              </div>
              <button
                onClick={() => setShowCodeExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              
              {/* Mermaid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Mermaid.js Formatı</span>
                  <button
                    onClick={() => copyToClipboard(MERMAID_DIAGRAM_CODE, 'mermaid')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedFormat === 'mermaid' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === 'mermaid' ? 'Kopyalandı!' : 'Mermaid Kopyala'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40">
                  {MERMAID_DIAGRAM_CODE}
                </pre>
              </div>

              {/* PlantUML */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">PlantUML Formatı</span>
                  <button
                    onClick={() => copyToClipboard(PLANTUML_CODE, 'plantuml')}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors cursor-pointer"
                  >
                    {copiedFormat === 'plantuml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFormat === 'plantuml' ? 'Kopyalandı!' : 'PlantUML Kopyala'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-40">
                  {PLANTUML_CODE}
                </pre>
              </div>

            </div>

            <div className="p-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowCodeExportModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

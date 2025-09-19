import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Leaf, ArrowRight, Info, Settings, Target, TrendingUp, Users, Shield } from 'lucide-react';

interface ParallaxLandingPageProps {
  onEnter: () => void;
}

const ParallaxLandingPage: React.FC<ParallaxLandingPageProps> = ({ onEnter }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredWindow, setHoveredWindow] = useState<number | null>(null);
  const [isMouseMoving, setIsMouseMoving] = useState(false);
  const [autoRotation, setAutoRotation] = useState(0);
  
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoRotationRef = useRef<number>();
  const [lightningPath, setLightningPath] = useState('');
  const rafRef = useRef<number>();

  const circularWindows = useMemo(() => [
    {
      id: 1,
      icon: Info,
      title: "Smart India Hackathon 2025",
      description: "Problem Statement ID: 25027 | Theme: Blockchain & Cybersecurity | PS Category: Software",
      details: "Problem Statement Title: Develop a blockchain-based system for botanical traceability of Ayurvedic herbs, including geo-tagging from the point of collection (farmers/wild collectors) to the final Ayurvedic formulation label. Team ID: [To be assigned]. Team Name: The Sentinels. This hackathon focuses on creating innovative blockchain solutions for healthcare transparency and supply chain management in the traditional medicine sector.",
      color: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-400/30"
    },
    {
      id: 2,
      icon: Settings,
      title: "Technical Approach",
      description: "Hyperledger Fabric blockchain with React frontend, Node.js microservices, and IPFS storage for decentralized data management",
      details: "Our technical stack leverages Hyperledger Fabric for enterprise-grade blockchain, React for responsive UI, Node.js microservices architecture, and IPFS for decentralized storage. This ensures scalability, security, and performance.",
      color: "from-purple-500/10 to-indigo-500/10",
      borderColor: "border-purple-400/30"
    },
    {
      id: 3,
      icon: Target,
      title: "Feasibility & Viability",
      description: "Comprehensive feasibility analysis, real-world challenges assessment, and practical implementation strategies for nationwide deployment",
      details: "Our comprehensive analysis covers technology readiness with Hyperledger Fabric, low-cost cloud deployment, GPS-enabled data capture, and SMS integration for low-connectivity areas. We address real-world challenges including farmer adoption barriers, connectivity gaps, data accuracy concerns, and operational costs through practical strategies like farmer training programs, offline-first applications, verification layers, and partnership models with AYUSH ministry and pharma companies.",
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-400/30"
    },
    {
      id: 4,
      icon: TrendingUp,
      title: "Impact & Benefits",
      description: "Transforming healthcare transparency with measurable social impact, economic benefits, and consumer trust enhancement",
      details: "Expected 40% reduction in counterfeit medicines, 60% improvement in supply chain transparency, and enhanced consumer confidence. Economic impact includes job creation and export potential.",
      color: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-400/30"
    },
    {
      id: 5,
      icon: Users,
      title: "Team & Execution",
      description: "Experienced multidisciplinary team with proven expertise in blockchain, healthcare, and system integration for successful delivery",
      details: "Our team comprises blockchain developers, healthcare domain experts, UI/UX designers, and project managers with combined 50+ years experience in delivering enterprise solutions.",
      color: "from-teal-500/10 to-cyan-500/10",
      borderColor: "border-teal-400/30"
    },
    {
      id: 6,
      icon: Shield,
      title: "Security & Compliance",
      description: "Enterprise-grade blockchain security with comprehensive regulatory compliance and data protection protocols",
      details: "Our blockchain platform implements immutable ledger technology preventing data tampering, complete supply chain transparency with time-location tracking, smart contract enforcement of conservation rules, QR code verification for consumer trust, and simplified AYUSH compliance for international trade certifications.",
      color: "from-pink-500/10 to-rose-500/10",
      borderColor: "border-pink-400/30"
    }
  ], []);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      setScrollY(window.scrollY);
      rafRef.current = undefined;
    });
  }, []);

  // Optimized lightning generation
  const generateLightning = useCallback((startX: number, startY: number, endX: number, endY: number) => {
    const segments = 6;
    const dx = (endX - startX) / segments;
    const dy = (endY - startY) / segments;
    
    let path = `M ${startX} ${startY}`;
    for (let i = 1; i <= segments; i++) {
      const x = startX + dx * i + (Math.random() - 0.5) * 30;
      const y = startY + dy * i + (Math.random() - 0.5) * 30;
      path += ` L ${i === segments ? endX : x} ${i === segments ? endY : y}`;
    }
    return path;
  }, []);

  // Enhanced mouse move handler with throttling
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      const newMousePos = { x: e.clientX, y: e.clientY };
      setMousePosition(newMousePos);
      setIsMouseMoving(true);
      
      // Clear existing timeout
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
      
      // Hide lightning after mouse stops
      mouseMoveTimeoutRef.current = setTimeout(() => {
        setIsMouseMoving(false);
        setLightningPath('');
      }, 100);
      
      // Update lightning if mouse moved significantly
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const distance = Math.sqrt((e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2);
      
      if (distance > 50) {
        setLightningPath(generateLightning(centerX, centerY, e.clientX, e.clientY));
      }
      
      rafRef.current = undefined;
    });
  }, [generateLightning]);

  const navigateNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % circularWindows.length);
  }, [circularWindows.length]);

  const navigatePrevious = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + circularWindows.length) % circularWindows.length);
  }, [circularWindows.length]);

  // Improved keyboard navigation - works when modal is open
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && hoveredWindow !== null) {
      setHoveredWindow(null);
      return;
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      navigateNext(); // Reversed: left arrow rotates clockwise (visually left movement)
      if (hoveredWindow !== null) {
        const newIndex = (hoveredWindow + 1) % circularWindows.length;
        setHoveredWindow(newIndex);
      }
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      navigatePrevious(); // Reversed: right arrow rotates counter-clockwise (visually right movement)
      if (hoveredWindow !== null) {
        const newIndex = (hoveredWindow - 1 + circularWindows.length) % circularWindows.length;
        setHoveredWindow(newIndex);
      }
    }
  }, [hoveredWindow, navigateNext, navigatePrevious, circularWindows.length]);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('.modal-content') && !target.closest('.circular-window')) {
      setHoveredWindow(null);
    }
  }, []);

  // Auto rotation effect
  useEffect(() => {
    if (hoveredWindow === null) {
      const animate = () => {
        setAutoRotation(prev => prev + 0.1);
        autoRotationRef.current = requestAnimationFrame(animate);
      };
      autoRotationRef.current = requestAnimationFrame(animate);
    } else {
      if (autoRotationRef.current) {
        cancelAnimationFrame(autoRotationRef.current);
      }
    }

    return () => {
      if (autoRotationRef.current) {
        cancelAnimationFrame(autoRotationRef.current);
      }
    };
  }, [hoveredWindow]);

  // Consolidated event listeners
  useEffect(() => {
    const events = [
      ['scroll', handleScroll, { passive: true }],
      ['mousemove', handleMouseMove, { passive: true }],
      ['keydown', handleKeyDown]
    ] as const;

    events.forEach(([event, handler, options]) => {
      window.addEventListener(event, handler, options);
    });

    document.addEventListener('click', handleClick);

    return () => {
      events.forEach(([event, handler]) => {
        window.removeEventListener(event, handler);
      });
      document.removeEventListener('click', handleClick);
      
      // Cleanup timeouts and animation frames
      [hoverTimeoutRef, mouseMoveTimeoutRef].forEach(ref => {
        if (ref.current) clearTimeout(ref.current);
      });
      [rafRef, autoRotationRef].forEach(ref => {
        if (ref.current) cancelAnimationFrame(ref.current);
      });
    };
  }, [handleScroll, handleMouseMove, handleKeyDown, handleClick]);

  // Optimized hover handlers
  const handleWindowHover = useCallback((index: number) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setHoveredWindow(index);
    setActiveIndex(index);
  }, []);

  const handleWindowLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredWindow(null), 50);
  }, []);

  const handleModalEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const handleModalLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredWindow(null), 50);
  }, []);

  const closeModal = useCallback(() => setHoveredWindow(null), []);

  // Memoized window position calculation - FIXED VERSION
  const windowPositions = useMemo(() => {
    const radius = window.innerWidth > 768 ? 280 : 180;
    return circularWindows.map((_, index) => {
      // Calculate angle based on activeIndex rotation
      const baseAngle = (index / circularWindows.length) * 360;
      const rotationOffset = (activeIndex / circularWindows.length) * -360; // Negative for counter-clockwise
      const angle = baseAngle + rotationOffset - 90; // Start from top (-90 degrees)
      const radian = (angle * Math.PI) / 180;
      
      return {
        x: radius * Math.cos(radian),
        y: radius * Math.sin(radian),
        isActive: index === activeIndex
      };
    });
  }, [activeIndex, circularWindows.length]);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      
      {/* Lightning Strike Effect */}
      {lightningPath && isMouseMoving && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <svg className="w-full h-full" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))' }}>
            <defs>
              <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.8)" />
                <stop offset="50%" stopColor="rgba(59, 130, 246, 0.6)" />
                <stop offset="100%" stopColor="rgba(147, 51, 234, 0.4)" />
              </linearGradient>
            </defs>
            <path
              d={lightningPath}
              stroke="url(#lightningGradient)"
              strokeWidth="2"
              fill="none"
              className="opacity-80"
            />
          </svg>
        </div>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 z-0 opacity-30">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-20">
        
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 backdrop-blur-md bg-black/30 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="p-2 md:p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Leaf className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">HerbionYX</h1>
                <p className="text-green-200 text-xs md:text-sm">Ayurvedic Traceability</p>
              </div>
            </div>
            <div className="text-white/80 text-xs md:text-sm">
              Powered by <span className="font-semibold text-white">SENTINELS</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="h-screen flex items-center justify-center relative pt-24 md:pt-28">
          
          {/* Vertical Title - Left Side */}
          <div 
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 pointer-events-none z-0"
            style={{ 
              transform: `translateY(-50%) translateX(${scrollY * -0.05}px) rotate(-90deg)`,
              transformOrigin: 'center center'
            }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white/25 leading-none select-none tracking-widest whitespace-nowrap drop-shadow-lg">
              HERBION<span className="text-blue-300/40">YX</span>
            </h1>
          </div>

          {/* FIXED: Container for centered positioning */}
          <div className="absolute inset-0 flex items-center justify-center z-25">
            
            {/* Central Enter Button - HIGHER Z-INDEX */}
            <div className="relative z-40">
              <div className="relative">
                <div className="absolute -inset-8 md:-inset-12 rounded-full border border-white/20 animate-ping opacity-70" />
                <div className="absolute -inset-16 md:-inset-20 rounded-full border border-white/10 animate-ping opacity-50" style={{ animationDelay: '1s' }} />
                
                <button
                  onClick={onEnter}
                  className="group relative w-32 h-32 md:w-48 md:h-48 rounded-full bg-black/40 backdrop-blur-xl border-4 border-white/30 hover:border-white/60 transition-all duration-500 hover:scale-110 flex flex-col items-center justify-center"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-2 md:mb-4 group-hover:bg-white/40 transition-all duration-300">
                      <ArrowRight className="h-6 w-6 md:h-8 md:w-8 text-white group-hover:translate-x-1 transition-transform" />
                    </div>
                    <span className="text-white font-bold text-lg md:text-xl tracking-wider">ENTER</span>
                    <span className="text-blue-200 text-xs md:text-sm mt-1">PLATFORM</span>
                  </div>
                </button>
              </div>
            </div>

            {/* FIXED: Revolving Circular Windows Container */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{
                transform: hoveredWindow !== null 
                  ? `rotate(${scrollY * 0.03}deg)` 
                  : `rotate(${scrollY * 0.03 + autoRotation}deg)`,
                transition: hoveredWindow !== null ? 'transform 0.1s ease-out' : 'none'
              }}
            >
              {/* FIXED: Properly centered circle container */}
              <div className="relative w-0 h-0">
                {circularWindows.map((window, index) => {
                  const position = windowPositions[index];
                  return (
                    <div
                      key={window.id}
                      className="absolute group circular-window pointer-events-auto"
                      style={{
                        left: `${position.x}px`,
                        top: `${position.y}px`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: hoveredWindow === index ? 35 : 25
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveIndex(index);
                        setHoveredWindow(index);
                      }}
                      onMouseEnter={() => handleWindowHover(index)}
                      onMouseLeave={handleWindowLeave}
                    >
                      <div className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 backdrop-blur-xl transition-all duration-500 bg-black/30 cursor-pointer hover:scale-110 border-white/30 hover:border-white/60`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <window.icon className="h-6 w-6 md:h-8 md:w-8 text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Modal Window */}
        {hoveredWindow !== null && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onMouseEnter={handleModalEnter}
            onMouseLeave={handleModalLeave}
          >
            <div 
              className="modal-content relative max-w-2xl w-full max-h-[85vh] overflow-auto bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              style={{
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {(() => {
                const windowData = circularWindows[hoveredWindow];
                return (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${windowData.color} rounded-3xl opacity-30`} />
                    
                    <div className="relative z-10 p-6 md:p-8">
                      <div className="flex items-center mb-6">
                        <div className={`p-3 rounded-xl mr-4 bg-white/10 backdrop-blur-xl ${windowData.borderColor} border`}>
                          <windowData.icon className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{windowData.title}</h2>
                          <p className="text-blue-200 text-sm">Smart India Hackathon 2025</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Feasibility and Viability Analysis</h3>
                          
                          {/* Feasibility Analysis Section */}
                          <div className="mb-6">
                            <h4 className="text-base font-bold text-blue-300 mb-3">🔍 Feasibility Analysis</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-bold text-white">• Technology readiness:</span>
                                <span className="text-gray-200"> Hyperledger Fabric is open-source, already tested in supply chain (e.g., food traceability).</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">• Low-cost deployment:</span>
                                <span className="text-gray-200"> Runs on commodity cloud servers (AWS/Azure/On-Prem); no per-transaction fees.</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">• Data capture:</span>
                                <span className="text-gray-200"> GPS-enabled Android phones (already in use by most farmers) + QR code printers/scanners (cheap, available).</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">• SMS integration:</span>
                                <span className="text-gray-200"> Existing APIs (Twilio, Gupshup, BSNL SMS Gateway) work even in low-connectivity areas.</span>
                              </div>
                            </div>
                          </div>

                          {/* Challenges Section */}
                          <div className="mb-6">
                            <h4 className="text-base font-bold text-orange-300 mb-3">⚠️ Challenges (Real-World Issues)</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-bold text-white">1. Farmer adoption barrier →</span>
                                <span className="text-gray-200"> Farmers may not be tech-savvy.</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">2. Connectivity gaps →</span>
                                <span className="text-gray-200"> Remote villages may lack 4G.</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">3. Data accuracy →</span>
                                <span className="text-gray-200"> Fake entries or wrong plant identification possible.</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">4. Operational costs →</span>
                                <span className="text-gray-200"> Training, device distribution, server hosting.</span>
                              </div>
                            </div>
                          </div>

                          {/* Practical Strategies Section */}
                          <div className="mb-6">
                            <h4 className="text-base font-bold text-green-300 mb-3">⚙️ Practical Strategies</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="font-bold text-white">• Farmer Training & Incentives:</span>
                                <span className="text-gray-200"> Hands-on training + premium price for verified herbs.</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">• Offline-first app:</span>
                                <span className="text-gray-200"> Local storage → syncs when internet available (already supported in React Native, Flutter).</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">• Verification Layer:</span>
                                <span className="text-gray-200"> Lab test + GPS cross-check ensures no fake entries.</span>
                              </div>
                              <div>
                                <span className="font-bold text-white">• Partnership Model:</span>
                                <span className="text-gray-200"> Costs split between AYUSH ministry, pharma companies, and cooperatives.</span>
                              </div>
                            </div>
                          </div>

                          {/* Revenue Model Section */}
                          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                            <h4 className="text-base font-bold text-purple-300 mb-3">💰 Revenue Model</h4>
                            <div className="space-y-3 text-sm">
                              <div>
                                <span className="font-bold text-white">1. Subscription from Manufacturers & Exporters</span>
                                <div className="ml-4 space-y-1 text-gray-200">
                                  <div>• Ayurvedic product manufacturers/exporters pay a monthly/annual fee to use HERBIONYX for traceability, compliance reporting, and QR labeling.</div>
                                  <div>• Logical → these companies benefit directly (export clearance, consumer trust).</div>
                                </div>
                              </div>
                              <div>
                                <span className="font-bold text-white">2. Government/AYUSH Contracts</span>
                                <div className="ml-4 space-y-1 text-gray-200">
                                  <div>• Ministry of AYUSH or NMPB can fund/mandate HERBIONYX for certification and sustainable harvesting monitoring.</div>
                                  <div>• Logical → aligns with their mandate of standardization, biodiversity conservation, and export promotion.</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParallaxLandingPage;
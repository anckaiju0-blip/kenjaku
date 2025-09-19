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
      title: "RESEARCH  AND REFERENCES",
      description: "Hyperledger Fabric blockchain with React frontend, Node.js microservices, and IPFS storage for decentralized data management",
      details: "Our technical stack leverages Hyperledger Fabric for enterprise-grade blockchain, React for responsive UI, Node.js microservices architecture, and IPFS for decentralized storage. This ensures scalability, security, and performance.",
      color: "from-purple-500/10 to-indigo-500/10",
      borderColor: "border-purple-400/30"
    },
    {
      id: 3,
      icon: Target,
      title: "Impact & Benefits",
      description: "Comprehensive impact analysis showcasing potential benefits for all stakeholders and measurable social, economic, and environmental outcomes",
      details: "Our solution delivers transformative impact across multiple dimensions: empowering rural communities through fair pricing and digital inclusion, building consumer trust through transparency, reducing fraud to boost herbal exports, incentivizing sustainable harvesting practices, and promoting biodiversity conservation through geo-tracking and quotas.",
      color: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-400/30"
    },
    {
      id: 4,
      icon: TrendingUp,
      title: "Feasibility & Viability",
      description: "Comprehensive feasibility analysis, real-world challenges assessment, and practical implementation strategies for nationwide deployment",
      details: "Our comprehensive analysis covers technology readiness with Hyperledger Fabric, low-cost cloud deployment, GPS-enabled data capture, and SMS integration for low-connectivity areas. We address real-world challenges including farmer adoption barriers, connectivity gaps, data accuracy concerns, and operational costs through practical strategies like farmer training programs, offline-first applications, verification layers, and partnership models with AYUSH ministry and pharma companies.",
      color: "from-orange-500/10 to-red-500/10",
      borderColor: "border-orange-400/30"
    },
    {
      id: 5,
      icon: Users,
      title: "TECHNICAL APPROACH",
      description: "Experienced multidisciplinary team with proven expertise in blockchain, healthcare, and system integration for successful delivery",
      details: "Our team comprises blockchain developers, healthcare domain experts, UI/UX designers, and project managers with combined 50+ years experience in delivering enterprise solutions.",
      color: "from-teal-500/10 to-cyan-500/10",
      borderColor: "border-teal-400/30"
    },
    {
      id: 6,
      icon: Leaf,
      title: "HERBIONYX",
      description: "Comprehensive blockchain solution with innovative features, technical approach, and problem-solving capabilities",
      details: "Our platform combines proven blockchain technology with geo-tagging for Ayurvedic herbs, low-connectivity SMS integration for rural participation, standardized FHIR-style metadata for global interoperability, and practical incentives linking verified sustainable practices to premium pricing for farmers.",
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
        <div className="absolute top-20 right-20 w-64
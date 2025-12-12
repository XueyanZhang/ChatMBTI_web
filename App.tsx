import React, { useLayoutEffect, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PixelCard, PixelButton, MBTIBadge, ChatBubble } from './components/PixelComponents';

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// MBTI Data for the grid
const mbtiGridData = [
  { code: 'INTJ', color: 'bg-[#8d6add]' }, { code: 'INTP', color: 'bg-[#a88fe8]' }, { code: 'ENTJ', color: 'bg-[#7042c9]' }, { code: 'ENTP', color: 'bg-[#bea6ff]' },
  { code: 'INFJ', color: 'bg-[#4fb868]' }, { code: 'INFP', color: 'bg-[#7bdcb5]' }, { code: 'ENFJ', color: 'bg-[#358f4f]' }, { code: 'ENFP', color: 'bg-[#81e6ae]' },
  { code: 'ISTJ', color: 'bg-[#4290e2]' }, { code: 'ISFJ', color: 'bg-[#7abaff]' }, { code: 'ESTJ', color: 'bg-[#2b70c9]' }, { code: 'ESFJ', color: 'bg-[#9ac9ff]' },
  { code: 'ISTP', color: 'bg-[#d1a049]' }, { code: 'ISFP', color: 'bg-[#f4ce69]' }, { code: 'ESTP', color: 'bg-[#ba8530]' }, { code: 'ESFP', color: 'bg-[#ffde7a]' },
];

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for animation elements
  const startTitleRef = useRef<HTMLHeadingElement>(null);
  const welcomeModalRef = useRef<HTMLDivElement>(null);
  
  // New Refs for Selection Phase
  const selectionModalRef = useRef<HTMLDivElement>(null);
  const mbtiGridRefs = useRef<HTMLButtonElement[]>([]);

  const bubblesContainerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<HTMLDivElement[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const logoRef = useRef<HTMLDivElement>(null);

  // Keyboard Control State
  const [isPlaying, setIsPlaying] = useState(false);
  const autoScrollTween = useRef<gsap.core.Tween | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Setup the main pinned timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=8000", // Increased scroll distance to accommodate new phase
          scrub: 1,
          pin: true,
        }
      });
      
      timelineRef.current = tl;

      /* ------------------------------------------------
         PHASE 0: OPENING TITLE -> WELCOME (0% - 15%)
      ------------------------------------------------ */
      tl.to(startTitleRef.current, {
        y: -window.innerHeight / 1.5,
        opacity: 0,
        scale: 0.8,
        duration: 4,
        ease: "power2.inOut"
      });

      tl.fromTo(welcomeModalRef.current, 
        { y: 400, opacity: 0, scale: 0.8, pointerEvents: 'none' },
        { y: 0, opacity: 1, scale: 1, pointerEvents: 'auto', duration: 4, ease: "back.out(1.2)" },
        "<2"
      );

      tl.addLabel("welcomePhase"); // Label for scrolling target
      tl.to({}, { duration: 3 }); // Pause

      /* ------------------------------------------------
         PHASE 1: WELCOME EXIT -> SELECTION ENTER (15% - 40%)
      ------------------------------------------------ */
      // Welcome exits
      tl.to(welcomeModalRef.current, {
        opacity: 0,
        scale: 0.8,
        y: -200,
        pointerEvents: 'none',
        duration: 3
      });

      // Selection Modal Enters
      tl.fromTo(selectionModalRef.current,
        { y: 600, opacity: 0, rotateX: 45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 4, ease: "power3.out" }
      );

      // Animate MBTI Grid Buttons (More Exaggerated!)
      tl.fromTo(mbtiGridRefs.current,
        { scale: 0, rotation: -360, opacity: 0 }, // Full spin from 0
        { 
          scale: 1, 
          rotation: 0, 
          opacity: 1, 
          stagger: {
             amount: 1.5,
             grid: [4, 4],
             from: "random" // Chaotic entrance
          }, 
          duration: 2, 
          ease: "elastic.out(1, 0.3)" // Very bouncy
        }
      );

      tl.addLabel("selectionPhase"); // Label for scrolling target
      tl.to({}, { duration: 4 }); // Pause to look at selection

      /* ------------------------------------------------
         PHASE 1.5: SELECTION EXIT -> CHAT BUBBLES (40% - 60%)
      ------------------------------------------------ */
      
      // MBTI Fly Out Animation (Explosion effect with variable speeds)
      // We animate them BEFORE/AS the container moves
      tl.to(mbtiGridRefs.current, {
        x: (i) => (Math.random() - 0.5) * window.innerWidth * 2, // Fly off screen horizontally
        y: (i) => (Math.random() - 0.5) * window.innerHeight * 2, // Fly off screen vertically
        rotation: () => Math.random() * 720 - 360, // Random wild rotation
        scale: 0,
        opacity: 0,
        duration: () => 1.5 + Math.random() * 2, // Random duration (1.5s to 3.5s) for variable speeds
        ease: "power3.in", // Accelerate out
        stagger: {
            amount: 0.5,
            from: "random"
        }
      }, "selectionExit");

      // Selection Modal Exits
      tl.to(selectionModalRef.current, {
        y: -800,
        opacity: 0,
        scale: 0.9,
        duration: 4,
        ease: "power2.in"
      }, "selectionExit+=0.5"); // Start slightly after blocks start flying

      /* ------------------------------------------------
         PHASE 2: UI DEMO - FLYING BUBBLES (60% - 75%)
      ------------------------------------------------ */
      const bubbles = bubbleRefs.current;
      tl.fromTo(bubbles, 
        { 
          x: (i) => (i % 2 === 0 ? -1500 : 1500),
          y: (i) => (Math.random() * 1000 - 500),
          rotation: (i) => (Math.random() * 90 - 45),
          opacity: 0
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          stagger: 0.5,
          duration: 5,
          ease: "power3.out"
        }
      );

      tl.to({}, { duration: 3 });

      tl.to(bubbles, {
        y: -1000,
        opacity: 0,
        stagger: 0.2,
        duration: 3
      });


      /* ------------------------------------------------
         PHASE 3: STACKING TOPICS (75% - 90%)
      ------------------------------------------------ */
      const cards = cardRefs.current;
      cards.forEach((card, index) => {
        tl.fromTo(card, 
          { y: 1200, rotate: index % 2 === 0 ? 10 : -10, opacity: 0 },
          { y: 0, rotate: index % 2 === 0 ? 2 : -2, opacity: 1, duration: 4, ease: "power2.out" }
        );
        tl.to({}, { duration: 2 });
        if (index < cards.length - 1) {
           tl.to(card, {
             scale: 0.9 - (index * 0.05),
             y: -50 * (index + 1),
             filter: "brightness(0.7)",
             duration: 2
           });
        }
      });
      tl.to(cards, {
        y: -1500,
        opacity: 0,
        stagger: 0.5,
        duration: 4
      });

      /* ------------------------------------------------
         PHASE 4: LOGO REVEAL (90% - 100%)
      ------------------------------------------------ */
      tl.fromTo(logoRef.current, 
        { y: 800, scale: 0.5, rotate: -10, opacity: 0 },
        { y: 0, scale: 1, rotate: 0, opacity: 1, duration: 5, ease: "elastic.out(1, 0.6)" }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Keyboard Control Logic
  useEffect(() => {
    const killAutoScroll = () => {
        if (autoScrollTween.current) {
            autoScrollTween.current.kill();
            autoScrollTween.current = null;
            setIsPlaying(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
            e.preventDefault();
            if (autoScrollTween.current && autoScrollTween.current.isActive()) {
                killAutoScroll();
            } else {
                // START PLAYBACK
                const currentY = window.scrollY;
                const endY = document.documentElement.scrollHeight - window.innerHeight;
                const distance = endY - currentY;
                
                if (distance < 50) return; // Already near bottom

                setIsPlaying(true);
                const scrollProxy = { y: currentY };
                // Speed: 500px per second seems reasonable
                const duration = distance / 500; 

                autoScrollTween.current = gsap.to(scrollProxy, {
                    y: endY,
                    duration: duration,
                    ease: "none",
                    onUpdate: () => window.scrollTo(0, scrollProxy.y),
                    onComplete: () => {
                        setIsPlaying(false);
                        autoScrollTween.current = null;
                    }
                });
            }
        } else if (e.code === 'KeyR') {
            // REPLAY
            e.preventDefault();
            killAutoScroll();
            const scrollProxy = { y: window.scrollY };
            autoScrollTween.current = gsap.to(scrollProxy, {
                y: 0,
                duration: 2,
                ease: "power3.inOut",
                onUpdate: () => window.scrollTo(0, scrollProxy.y),
                onComplete: () => {
                  autoScrollTween.current = null;
                }
            });
        }
    };

    const handleInteraction = () => {
        // Stop auto-scroll on manual interaction (wheel or touch)
        if (autoScrollTween.current && autoScrollTween.current.isActive()) {
             // Only kill if it's the playback tween, not the reset tween (optional, but safer to kill all)
             killAutoScroll();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('wheel', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
        if (autoScrollTween.current) autoScrollTween.current.kill();
    };
  }, []);

  // Handle "Create New Chat" click
  const handleCreateChatClick = () => {
    if (!timelineRef.current || !timelineRef.current.scrollTrigger) return;
    
    // Check if auto scroll is already active, kill it first
    if (autoScrollTween.current) autoScrollTween.current.kill();
    
    // Calculate target scroll position for the 'selectionPhase' label
    const targetScroll = timelineRef.current.scrollTrigger.labelToScroll("selectionPhase");
    const currentScroll = window.scrollY;
    
    setIsPlaying(true); // Show playing indicator
    
    const scrollProxy = { y: currentScroll };
    autoScrollTween.current = gsap.to(scrollProxy, {
      y: targetScroll,
      duration: 2.5, // Smooth duration to next section
      ease: "power3.inOut",
      onUpdate: () => window.scrollTo(0, scrollProxy.y),
      onComplete: () => {
        setIsPlaying(false);
        autoScrollTween.current = null;
      }
    });
  };

  const addToRefs = (el: any, refArray: React.MutableRefObject<any[]>) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el);
    }
  };

  return (
    <div className="bg-dots min-h-screen text-black font-['VT323']">
      <div ref={containerRef} className="h-screen w-full relative overflow-hidden flex items-center justify-center">
        
        {/* --- PHASE 0: OPENING TITLE --- */}
        <div ref={startTitleRef} className="absolute z-50 text-center">
             <h1 className="text-[12rem] md:text-[16rem] font-normal leading-none tracking-tighter text-black mb-4" 
                 style={{ 
                     textShadow: "6px 6px 0px #fff, 12px 12px 0px rgba(0,0,0,0.2)",
                     WebkitTextStroke: "2px white"
                 }}>
               CHAT<br/>MBTI
             </h1>
             <div className="animate-bounce mt-8 text-2xl font-bold">SCROLL TO START ▼</div>
        </div>

        {/* --- PHASE 1: WELCOME SCREEN --- */}
        <div ref={welcomeModalRef} className="absolute z-40 p-4 opacity-0 w-full flex justify-center items-center">
          <div className="relative bg-white border-[6px] border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-16 text-center w-full max-w-4xl flex flex-col items-center">
            <h2 className="text-6xl md:text-8xl font-black text-[#ff00ff] mb-8 uppercase tracking-widest" style={{ textShadow: "3px 3px 0px #000" }}>
              WELCOME
            </h2>
            <p className="text-2xl md:text-3xl font-bold mb-12 max-w-2xl leading-relaxed">
              Select a chat from the sidebar or create a new one to talk with MBTI personalities!
            </p>
            <button 
              onClick={handleCreateChatClick}
              className="bg-yellow-300 hover:bg-yellow-400 border-[5px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none px-8 py-5 text-2xl md:text-3xl font-bold uppercase tracking-wide transition-all w-full md:w-auto"
            >
              Create New Chat
            </button>
          </div>
        </div>

        {/* --- PHASE 1.5: SELECTION SCREEN --- */}
        <div ref={selectionModalRef} className="absolute z-40 p-4 opacity-0 w-full flex justify-center items-center">
           {/* Scaled down to max-w-2xl (approx 70% of 4xl) and adjusted internal sizing */}
           <div className="relative bg-white border-[6px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-2xl">
              {/* Close Button Decoration */}
              <div className="absolute top-3 right-4 text-xl font-bold font-sans cursor-pointer hover:text-gray-500">X</div>
              
              <h2 className="text-3xl md:text-4xl font-black text-center mb-6 uppercase tracking-widest">
                 CREATE CHAT ROOM
              </h2>

              <div className="mb-6">
                 <label className="block text-xl font-bold mb-2 uppercase">Room Name</label>
                 <div className="w-full bg-[#333] border-4 border-black p-3 text-gray-300 font-mono text-lg shadow-[4px_4px_0_0_#000]">
                    e.g. The Debaters
                 </div>
              </div>

              <div className="mb-6">
                 <label className="block text-xl font-bold mb-3 uppercase">Select Members (Max 8)</label>
                 <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {mbtiGridData.map((mbti, idx) => (
                      <button 
                        key={mbti.code}
                        ref={el => addToRefs(el, mbtiGridRefs)}
                        // Updated font size to text-3xl / md:text-4xl
                        className={`${mbti.color} aspect-[3/2] border-[3px] border-black shadow-[3px_3px_0_0_rgba(0,0,0,1)] flex items-center justify-center font-bold text-3xl md:text-4xl hover:translate-y-1 hover:shadow-none transition-all`}
                      >
                        {mbti.code}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="flex justify-end">
                <button className="bg-[#dcdcdc] hover:bg-white border-[4px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none px-6 py-2 text-lg font-bold uppercase tracking-wide transition-all">
                  START CHAT
                </button>
              </div>
           </div>
        </div>

        {/* --- PHASE 2: FLYING BUBBLES --- */}
        <div ref={bubblesContainerRef} className="absolute w-full max-w-2xl px-4 z-30 flex flex-col gap-6">
          <div ref={el => addToRefs(el, bubbleRefs)}>
             <ChatBubble 
               sender="ENTP" 
               color="bg-purple-300"
               text="Finally, a branding update! I'm thinking we go for something abstract and chaotic." 
             />
          </div>
          
          <div ref={el => addToRefs(el, bubbleRefs)} className="self-end">
            <ChatBubble 
              sender="ISFP" 
              color="bg-yellow-300"
              isUser
              text="Let's keep it friendly, okay? I'm picturing a cozy pixel-art group selfie." 
            />
          </div>

           <div ref={el => addToRefs(el, bubbleRefs)}>
             <ChatBubble 
               sender="INTJ" 
               color="bg-blue-300"
               text="Efficiency is key. The design must be functional before it is 'cozy'." 
             />
          </div>

          <div ref={el => addToRefs(el, bubbleRefs)} className="self-end">
            <ChatBubble 
              sender="ENFP" 
              isUser
              text="Yes!! Make sure it looks super colorful! A digital hug for everyone! ✨" 
            />
          </div>
        </div>

        {/* --- PHASE 3: STACKING CARDS --- */}
        <div ref={cardsContainerRef} className="absolute w-full max-w-3xl px-4 z-20 flex items-center justify-center h-full pointer-events-none">
          {/* Card 1 */}
          <div ref={el => addToRefs(el, cardRefs)} className="absolute w-full max-w-lg">
             <PixelCard title="Excel Help" color="bg-cyan-300">
               <div className="mb-4">
                 <ChatBubble 
                   sender="ESTJ" 
                   text="Standard procedure is to use the SUM function. Don't complicate it." 
                 />
                 <ChatBubble 
                   sender="ISTP" 
                   color="bg-orange-400"
                   text="Too much typing. Just press 'Alt + ='. Done." 
                 />
               </div>
               <div className="flex gap-2 border-t-4 border-black pt-4">
                 <MBTIBadge type="ESTJ" color="bg-blue-500 text-white"/>
                 <MBTIBadge type="ISTP" color="bg-yellow-600 text-white"/>
               </div>
             </PixelCard>
          </div>
          {/* Card 2 */}
          <div ref={el => addToRefs(el, cardRefs)} className="absolute w-full max-w-lg">
             <PixelCard title="Family Dinner" color="bg-yellow-300">
                <div className="mb-4">
                 <ChatBubble 
                   sender="User" 
                   color="bg-green-400"
                   text="Please help me plan a family dinner for Christmas in Toronto." 
                 />
                 <ChatBubble 
                   sender="ISFJ" 
                   text="Oh, that sounds wonderful! ❤️ The Drake Hotel offers a festive 3-course meal..." 
                 />
               </div>
                <div className="flex gap-2 border-t-4 border-black pt-4">
                 <MBTIBadge type="ISFJ" color="bg-blue-300"/>
               </div>
             </PixelCard>
          </div>
          {/* Card 3 */}
          <div ref={el => addToRefs(el, cardRefs)} className="absolute w-full max-w-lg">
             <PixelCard title="Coding Questions" color="bg-white">
                <div className="mb-4">
                 <ChatBubble 
                   sender="INTP" 
                   color="bg-purple-300"
                   text="Technically, using a recursion here creates a stack overflow risk." 
                 />
                 <ChatBubble 
                   sender="ENTJ" 
                   color="bg-red-400"
                   text="Just ship it. We can refactor in Q3." 
                 />
               </div>
                <div className="flex gap-2 border-t-4 border-black pt-4">
                 <MBTIBadge type="INTP" color="bg-purple-400 text-white"/>
                 <MBTIBadge type="ENTJ" color="bg-red-600 text-white"/>
               </div>
             </PixelCard>
          </div>
        </div>

        {/* --- PHASE 4: LOGO --- */}
        <div ref={logoRef} className="absolute z-20 flex flex-col items-center justify-center opacity-0">
            <h1 className="text-[12rem] md:text-[16rem] font-normal leading-none tracking-tighter text-black text-center"
                 style={{ 
                     textShadow: "6px 6px 0px #fff, 10px 10px 0px rgba(0,0,0,0.5)",
                     WebkitTextStroke: "2px white"
                 }}>
               CHAT<br/>MBTI
            </h1>
        </div>

      </div>

      {/* KEYBOARD CONTROLS UI INDICATOR */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 pointer-events-none">
         {isPlaying && <div className="text-xl font-bold bg-green-400 border-2 border-black px-3 py-1 animate-pulse shadow-[4px_4px_0_0_#000]">PLAYING...</div>}
         <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0_0_#000] text-sm md:text-lg">
             <div className="flex items-center gap-2 mb-1">
                 <span className="bg-gray-200 border border-black px-1.5 py-0.5 font-bold">[SPACE]</span> 
                 <span>Play / Pause</span>
             </div>
             <div className="flex items-center gap-2">
                 <span className="bg-gray-200 border border-black px-1.5 py-0.5 font-bold">[R]</span> 
                 <span>Replay</span>
             </div>
         </div>
      </div>
      
      <div className="h-1 w-full bg-transparent"></div>
    </div>
  );
}

export default App;
import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface PhysicsSimulationProps {
  courseTitle: string;
  topicName: string;
}

export function PhysicsSimulation({ courseTitle, topicName }: PhysicsSimulationProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Engine
    const engine = Matter.Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    // 2. Setup Render
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 400,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio,
      }
    });
    renderRef.current = render;

    // 3. Create basic borders
    const width = sceneRef.current.clientWidth;
    const height = 400;
    const wallOptions = { 
      isStatic: true, 
      render: { fillStyle: '#1e293b' } 
    };

    Matter.World.add(world, [
      // Ground
      Matter.Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions),
      // Left Wall
      Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions),
      // Right Wall
      Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions)
    ]);

    // 4. Create bodies depending on the topic or a general sandbox
    const stack = Matter.Composites.stack(
      width / 2 - 100, 50, 
      4, 4, 
      0, 0, 
      (x: number, y: number) => {
        // Create mixed shapes (circles and rectangles)
        const isCircle = Math.random() > 0.5;
        const color = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b'][Math.floor(Math.random() * 4)];
        
        if (isCircle) {
          return Matter.Bodies.circle(x, y, Math.random() * 20 + 15, {
            restitution: 0.9,
            render: { fillStyle: color }
          });
        } else {
          return Matter.Bodies.rectangle(x, y, Math.random() * 40 + 20, Math.random() * 40 + 20, {
            restitution: 0.6,
            render: { fillStyle: color }
          });
        }
      }
    );

    // Add a big central body
    const bigCircle = Matter.Bodies.circle(width / 2, height / 2, 50, {
      isStatic: true,
      render: { fillStyle: '#334155' }
    });

    Matter.World.add(world, [stack, bigCircle]);

    // 5. Add Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(world, mouseConstraint);
    
    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // 6. Run the engine and renderer
    Matter.Runner.run(Matter.Runner.create(), engine);
    Matter.Render.run(render);

    // Add some random forces based on clicks just for fun
    const handleCanvasClick = () => {
        const bodies = Matter.Composite.allBodies(engine.world);
        bodies.forEach(body => {
            if (!body.isStatic) {
                Matter.Body.applyForce(body, body.position, {
                    x: (Math.random() - 0.5) * 0.05,
                    y: -0.05 - Math.random() * 0.05
                });
            }
        });
    };

    render.canvas.addEventListener('mousedown', handleCanvasClick);

    // Cleanup
    return () => {
      render.canvas.removeEventListener('mousedown', handleCanvasClick);
      Matter.Render.stop(render);
      Matter.Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
    };
  }, [courseTitle, topicName]);

  return (
    <div className="flex flex-col items-center justify-center w-full bg-slate-950/60 rounded-3xl border border-slate-800 overflow-hidden relative mt-4">
      <div className="absolute top-4 right-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-700/50 backdrop-blur-sm z-10 text-right pointer-events-none">
        <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
          <span>🧪</span> מעבדה דיגיטלית - {topicName}
        </h4>
        <p className="text-xs text-slate-300 mt-1">אפשר לגרור צורות, לזרוק אותן וללחוץ כדי להפעיל כוח פרץ (Burst).</p>
      </div>
      <div ref={sceneRef} className="w-full h-[400px]" />
    </div>
  );
}

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

export default function FloatingCore() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(400, 400);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Core Geometry
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    
    // Wireframe Material
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x6d28d9, // Primary color
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    
    const core = new THREE.Mesh(geometry, material);
    scene.add(core);

    // Inner Glowing Core
    const innerGeo = new THREE.IcosahedronGeometry(1.5, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6, // Secondary color
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // Animation Loop
    let animationFrameId: number;
    let time = 0;

    const render = () => {
      time += 0.005;
      
      core.rotation.x += 0.005;
      core.rotation.y += 0.005;
      
      innerCore.rotation.x -= 0.003;
      innerCore.rotation.y -= 0.003;

      // Subtle hover effect
      core.position.y = Math.sin(time * 2) * 0.1;
      innerCore.position.y = Math.sin(time * 2) * 0.1;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative flex items-center justify-center pointer-events-none"
    >
      <div className="absolute w-[300px] h-[300px] bg-primary/20 blur-[100px] rounded-full" />
      <div ref={mountRef} className="w-[400px] h-[400px] relative z-10" />
    </motion.div>
  );
}

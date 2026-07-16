'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Dimensions
    let width = containerRef.current.clientWidth;
    let height = containerRef.current.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Particles Configuration
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorCyan = new THREE.Color('#00E5FF');
    const colorPurple = new THREE.Color('#8B5CF6');
    const colorAccent = new THREE.Color('#38BDF8');

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Random coordinates in a spherical or cubical boundary
      positions[i] = (Math.random() - 0.5) * 160;
      positions[i + 1] = (Math.random() - 0.5) * 160;
      positions[i + 2] = (Math.random() - 0.5) * 120;

      // Blend colors based on distribution
      const mixRatio = Math.random();
      let chosenColor = colorCyan;
      if (mixRatio > 0.6) {
        chosenColor = colorPurple;
      } else if (mixRatio > 0.3) {
        chosenColor = colorAccent;
      }

      colors[i] = chosenColor.r;
      colors[i + 1] = chosenColor.g;
      colors[i + 2] = chosenColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular particle texture using HTML Canvas
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.5,
      map: createParticleTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Floating 3D Blobs (Meshes with smooth shading)
    const blobCount = 3;
    const blobMeshes: THREE.Mesh[] = [];
    const blobSpeeds: { x: number; y: number; z: number }[] = [];
    const blobAmplitudes: { x: number; y: number; z: number }[] = [];

    const blobGeom = new THREE.SphereGeometry(12, 64, 64);
    
    // Cyan Blob
    const matCyan = new THREE.MeshPhysicalMaterial({
      color: 0x00E5FF,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.6,
      thickness: 1.5,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    
    // Purple Blob
    const matPurple = new THREE.MeshPhysicalMaterial({
      color: 0x8B5CF6,
      roughness: 0.2,
      metalness: 0.2,
      transmission: 0.6,
      thickness: 1.5,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });

    const materials = [matCyan, matPurple, matCyan];

    for (let i = 0; i < blobCount; i++) {
      const mesh = new THREE.Mesh(blobGeom, materials[i]);
      
      // Position blobs
      mesh.position.set(
        (i - 1) * 35 + (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20,
        -10 + i * 5
      );
      
      scene.add(mesh);
      blobMeshes.push(mesh);

      // Random parameters for floating animation
      blobSpeeds.push({
        x: 0.0005 + Math.random() * 0.0005,
        y: 0.0007 + Math.random() * 0.0005,
        z: 0.0003 + Math.random() * 0.0003,
      });

      blobAmplitudes.push({
        x: 10 + Math.random() * 5,
        y: 8 + Math.random() * 4,
        z: 5 + Math.random() * 3,
      });
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0x00E5FF, 1.5);
    directionalLight1.position.set(10, 20, 15);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0x8B5CF6, 1.5);
    directionalLight2.position.set(-10, -20, 15);
    scene.add(directionalLight2);

    // Mouse Tracking Coordinates
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      targetMouseX = (event.clientX - window.innerWidth / 2) * 0.06;
      targetMouseY = (event.clientY - window.innerHeight / 2) * 0.06;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Slow global rotations
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = elapsedTime * 0.01;

      // Hover Parallax interpolator (dampened lag)
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX;
      camera.position.y = -currentMouseY;
      camera.lookAt(scene.position);

      // Animate Blobs (floating sinusoidal wave)
      blobMeshes.forEach((mesh, index) => {
        const speed = blobSpeeds[index];
        const amp = blobAmplitudes[index];

        mesh.position.x = (index - 1) * 35 + Math.sin(elapsedTime * speed.x * 1000) * amp.x;
        mesh.position.y = Math.cos(elapsedTime * speed.y * 1000) * amp.y;
        mesh.position.z = -10 + index * 5 + Math.sin(elapsedTime * speed.z * 1000) * amp.z;

        // Blob self-rotation
        mesh.rotation.x = elapsedTime * 0.05 * (index + 1);
        mesh.rotation.y = elapsedTime * 0.08 * (index + 1);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }

      particleGeometry.dispose();
      particleMaterial.dispose();
      blobGeom.dispose();
      materials.forEach(mat => mat.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full -z-10 bg-[#0B0F19] overflow-hidden"
    />
  );
}

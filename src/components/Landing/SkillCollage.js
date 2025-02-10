"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useInView } from "framer-motion";

export default function SkillCollage({ className = "" }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Enhanced scene setup
    const scene = new THREE.Scene();
    
    // Dynamic lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // Add point lights for dramatic effect
    const pointLight1 = new THREE.PointLight(0x6666ff, 2, 100);
    const pointLight2 = new THREE.PointLight(0xff6666, 2, 100);
    pointLight1.position.set(20, 20, 20);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight1, pointLight2);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Enhanced skills with additional properties
    const skills = [
      { name: "JavaScript", color: "#f0db4f", size: 1.2, icon: "JS" },
      { name: "React", color: "#61dafb", size: 1.3, icon: "⚛️" },
      { name: "Next.js", color: "#ffffff", size: 1.2, icon: "N" },
      { name: "Node.js", color: "#7ec729", size: 1.1, icon: "🟢" },
      { name: "TypeScript", color: "#007acc", size: 1.15, icon: "TS" },
      { name: "Python", color: "#ffd43b", size: 1.1, icon: "🐍" }
    ];

    function createSkillSprite(skill) {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 256;
      const context = canvas.getContext("2d");

      // Create gradient background
      const gradient = context.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
      );
      gradient.addColorStop(0, `${skill.color}33`);
      gradient.addColorStop(1, `${skill.color}00`);
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Draw main text
      context.font = "bold 48px Inter, system-ui";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillStyle = skill.color;
      
      // Add glow effect
      context.shadowColor = skill.color;
      context.shadowBlur = 20;
      context.fillText(skill.name, canvas.width/2, canvas.height/2);

      // Add icon
      context.font = "32px Inter, system-ui";
      context.fillText(skill.icon, canvas.width/2, canvas.height/2 - 50);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(12 * skill.size, 6 * skill.size, 1);
      return sprite;
    }

    const spriteGroup = [];
    const radius = 20;
    const angleStep = (Math.PI * 2) / skills.length;
    
    // Create and position sprites with initial positions off-screen
    skills.forEach((skill, i) => {
      const sprite = createSkillSprite(skill);
      const angle = i * angleStep;
      
      // Store final position
      sprite.userData.finalPosition = new THREE.Vector3(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
      );
      
      // Start position (far away and random)
      sprite.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
      );
      
      group.add(sprite);
      spriteGroup.push(sprite);
    });

    // Create connection lines with glow effect
    const connections = [];
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });

    // Create all possible connections
    for (let i = 0; i < spriteGroup.length; i++) {
      for (let j = i + 1; j < spriteGroup.length; j++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          spriteGroup[i].position,
          spriteGroup[j].position
        ]);
        const line = new THREE.Line(geometry, lineMaterial.clone());
        scene.add(line);
        connections.push({
          line,
          spriteA: spriteGroup[i],
          spriteB: spriteGroup[j]
        });
      }
    }

    const clock = new THREE.Clock();
    let animationFrameId;
    
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isInView) {
        // Animate sprites to their positions
        spriteGroup.forEach((sprite, i) => {
          const delay = i * 0.2;
          const progress = Math.max(0, Math.min(1, (elapsed - delay) * 0.8));
          sprite.position.lerp(sprite.userData.finalPosition, 0.05);
          sprite.material.opacity = progress;
        });

        // Animate connections
        connections.forEach(({ line, spriteA, spriteB }) => {
          const points = [spriteA.position, spriteB.position];
          line.geometry.setFromPoints(points);
          
          const distance = spriteA.position.distanceTo(spriteB.position);
          const maxDistance = radius * 1.5;
          
          if (distance < maxDistance) {
            line.material.opacity = Math.max(0, 0.3 * (1 - distance / maxDistance));
          } else {
            line.material.opacity = 0;
          }
        });
      }

      // Dynamic rotation based on scroll position
      const rotationSpeed = 0.15;
      group.rotation.y = elapsed * rotationSpeed;
      group.rotation.x = Math.sin(elapsed * 0.2) * 0.1;

      // Animate lights
      pointLight1.position.x = Math.sin(elapsed * 0.7) * 20;
      pointLight1.position.y = Math.cos(elapsed * 0.5) * 20;
      pointLight2.position.x = -Math.cos(elapsed * 0.3) * 20;
      pointLight2.position.y = -Math.sin(elapsed * 0.5) * 20;

      renderer.render(scene, camera);
    }
    
    animate();

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      container.removeChild(renderer.domElement);
    };
  }, [isInView]);

  return (
    <div 
      ref={containerRef} 
      className={`min-h-[400px] ${className}`}
    />
  );
}
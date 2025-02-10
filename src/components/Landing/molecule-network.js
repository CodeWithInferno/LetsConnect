"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useInView } from "framer-motion";

export default function MoleculeNetwork({ className = "" }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    
    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x4444ff, 2, 100);
    pointLight.position.set(0, 0, 20);
    scene.add(pointLight);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 40;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create nodes with glowing effect
    const numNodes = 8;
    const circleRadius = 15;
    const nodes = [];
    
    // Glowing sphere material
    const nodeMaterial = new THREE.MeshPhongMaterial({
      color: 0x4444ff,
      emissive: 0x2222ff,
      emissiveIntensity: 0.5,
      shininess: 100
    });

    const nodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    
    for (let i = 0; i < numNodes; i++) {
      const angle = (i / numNodes) * Math.PI * 2;
      const finalX = circleRadius * Math.cos(angle);
      const finalY = circleRadius * Math.sin(angle);
      
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.userData.finalPosition = new THREE.Vector3(finalX, finalY, 0);
      // Start nodes in random positions far away
      node.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 50
      );
      scene.add(node);
      nodes.push(node);
    }

    // Create lines with glowing effect
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x4444ff,
      transparent: true,
      opacity: 0,
      linewidth: 2
    });

    const connections = [];
    
    // Create all possible connections between nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          nodes[i].position,
          nodes[j].position
        ]);
        const line = new THREE.Line(geometry, lineMaterial.clone());
        scene.add(line);
        connections.push({
          line,
          nodeA: nodes[i],
          nodeB: nodes[j],
          distance: nodes[i].userData.finalPosition.distanceTo(nodes[j].userData.finalPosition)
        });
      }
    }

    const clock = new THREE.Clock();
    let animationFrameId;
    
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (isInView) {
        // Animate nodes to their final positions when in view
        nodes.forEach((node, i) => {
          const progress = Math.min((elapsed - i * 0.1) * 0.5, 1);
          if (progress > 0) {
            node.position.lerp(node.userData.finalPosition, progress * 0.05);
          }
        });

        // Animate connections based on distance between nodes
        connections.forEach(({ line, nodeA, nodeB, distance }) => {
          const points = [nodeA.position, nodeB.position];
          line.geometry.setFromPoints(points);
          
          const currentDistance = nodeA.position.distanceTo(nodeB.position);
          const distanceRatio = Math.max(0, 1 - (currentDistance - distance) / 50);
          
          // Only show connections when nodes are close to their final positions
          if (distanceRatio > 0.7) {
            line.material.opacity = Math.min((distanceRatio - 0.7) * 3, 0.5);
          } else {
            line.material.opacity = 0;
          }
        });
      }

      // Gentle rotation
      scene.rotation.y = Math.sin(elapsed * 0.2) * 0.1;
      scene.rotation.x = Math.cos(elapsed * 0.2) * 0.1;

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
      className={`relative ${className}`}
    />
  );
}
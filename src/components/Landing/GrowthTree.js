// GrowthTree.js
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GrowthTree({ className = "" }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 10, 30);
    camera.lookAt(0, 5, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
    
    // Create tree trunk (cylinder)
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 1, 8, 16);
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 4;
    scene.add(trunk);
    
    // Create branches as lines from the trunk top.
    const branchMaterial = new THREE.LineBasicMaterial({ color: 0x8B4513 });
    const branchGroup = new THREE.Group();
    scene.add(branchGroup);
    
    const branchEndpoints = [
      new THREE.Vector3(2, 8, 0),
      new THREE.Vector3(-2, 8, 0),
      new THREE.Vector3(0, 8, 2),
      new THREE.Vector3(0, 8, -2)
    ];
    branchEndpoints.forEach((endpoint) => {
      const points = [new THREE.Vector3(0, 8, 0), endpoint];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, branchMaterial);
      line.scale.set(0, 0, 0); // start at 0 scale
      branchGroup.add(line);
    });
    
    const clock = new THREE.Clock();
    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const growthDuration = 3;
      const growth = Math.min(elapsed / growthDuration, 1);
      
      // Grow trunk and branches
      trunk.scale.y = growth;
      branchGroup.children.forEach((line) => {
        line.scale.set(growth, growth, growth);
      });
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
      container.removeChild(renderer.domElement);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <div ref={containerRef} className={className}></div>;
}

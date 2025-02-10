// FlippingCalendar.js
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FlippingCalendar({ className = "" }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    
    // Create a canvas texture for the calendar page.
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = "bold 60px Arial";
    context.fillStyle = "#333333";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("12", canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    
    const pageGeometry = new THREE.PlaneGeometry(10, 10);
    const pageMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const page = new THREE.Mesh(pageGeometry, pageMaterial);
    scene.add(page);
    
    const clock = new THREE.Clock();
    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      // Flip every 2 seconds: continuously rotate along the X-axis.
      page.rotation.x = (elapsed % 2) / 2 * Math.PI * 2;
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

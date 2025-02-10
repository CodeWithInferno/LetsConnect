// AnimatedLaptop.js
"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimatedLaptop({ className = "" }) {
  const containerRef = useRef(null);
  const hoveredRef = useRef(false);
  const screenRotationRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // Laptop group
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    // Laptop base
    const baseGeometry = new THREE.BoxGeometry(12, 0.5, 8);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1;
    laptopGroup.add(base);

    // Laptop screen – we use a plane with its pivot at the bottom edge.
    const screenGeometry = new THREE.PlaneGeometry(12, 8);
    const screenMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0x000000,
      emissiveIntensity: 1
    });
    const screen = new THREE.Mesh(screenGeometry, screenMaterial);
    // Translate geometry so that the bottom edge is at (0,0)
    screen.geometry.translate(0, -4, 0);
    // Position the screen at the top of the base.
    screen.position.set(0, 0.25, -4);
    const screenGroup = new THREE.Group();
    screenGroup.add(screen);
    // This group’s pivot is at the bottom of the screen.
    screenGroup.position.set(0, 0.25, 0);
    laptopGroup.add(screenGroup);

    // Pointer events for hover effect.
    const onPointerEnter = () => { hoveredRef.current = true; };
    const onPointerLeave = () => { hoveredRef.current = false; };
    container.addEventListener("pointerenter", onPointerEnter);
    container.addEventListener("pointerleave", onPointerLeave);

    // Animation loop – interpolate screen rotation based on hover.
    const clock = new THREE.Clock();
    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const targetRotation = hoveredRef.current ? -Math.PI / 6 : 0; // Rotate up to 30° when hovered.
      screenRotationRef.current = THREE.MathUtils.lerp(screenRotationRef.current, targetRotation, dt * 5);
      screenGroup.rotation.x = screenRotationRef.current;
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
      container.removeEventListener("pointerenter", onPointerEnter);
      container.removeEventListener("pointerleave", onPointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <div ref={containerRef} className={className}></div>;
}

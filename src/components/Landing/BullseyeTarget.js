"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BullseyeTarget({ className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    // (We use a transparent clear color below rather than a scene background.)

    // Camera: shifted left (x = -5) to adjust perspective
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(-5, 0, 60);
    camera.lookAt(0, 0, 0);

    // Renderer setup with transparency.
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(0, 0, 80);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Create dartboard backing using a cylinder without caps (openEnded)
    const boardGeometry = new THREE.CylinderGeometry(20, 20, 2, 32, 1, true);
    const boardMaterial = new THREE.MeshPhongMaterial({
      color: 0x4a4a4a,
      shininess: 30
    });
    const board = new THREE.Mesh(boardGeometry, boardMaterial);
    board.receiveShadow = true;
    scene.add(board);

    // Create rings (bullseye) without adding extra geometry in the center.
    const ringConfigs = [
      { inner: 16, outer: 20, color: 0x000000 }, // Outer black
      { inner: 12, outer: 16, color: 0xffffff }, // White
      { inner: 8, outer: 12, color: 0xff0000 },  // Red
      { inner: 4, outer: 8, color: 0xffffff },   // White
      { inner: 0, outer: 4, color: 0xff0000 }      // Center red
    ];

    ringConfigs.forEach(({ inner, outer, color }) => {
      const ringGeometry = new THREE.RingGeometry(inner, outer, 32);
      const ringMaterial = new THREE.MeshPhongMaterial({
        color,
        side: THREE.DoubleSide,
        shininess: 50
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.z = 1.1; // Slightly in front of board
      scene.add(ring);
    });

    // Create dart group.
    const dartGroup = new THREE.Group();

    // Dart body
    const bodyGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 12);
    const bodyMaterial = new THREE.MeshPhongMaterial({
      color: 0x3366cc,
      shininess: 100
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    dartGroup.add(body);

    // Dart tip
    const tipGeometry = new THREE.ConeGeometry(0.5, 2, 12);
    const tipMaterial = new THREE.MeshPhongMaterial({
      color: 0xcccccc,
      shininess: 100
    });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.y = 5;
    tip.castShadow = true;
    dartGroup.add(tip);

    // Dart flights
    const flightGeometry = new THREE.ConeGeometry(2, 4, 3);
    const flightMaterial = new THREE.MeshPhongMaterial({
      color: 0xff3366,
      shininess: 50
    });
    for (let i = 0; i < 3; i++) {
      const flight = new THREE.Mesh(flightGeometry, flightMaterial);
      flight.position.y = -3;
      flight.rotation.z = (i * Math.PI * 2) / 3;
      flight.rotation.x = Math.PI / 6;
      flight.castShadow = true;
      dartGroup.add(flight);
    }

    // Set initial dart position (starting far away) and orientation.
    dartGroup.position.set(0, 0, 100);
    dartGroup.rotation.x = -Math.PI / 2; // Pointing downward
    scene.add(dartGroup);

    // Animation variables
    const clock = new THREE.Clock();
    let throwComplete = false;
    const loopTime = 3; // seconds for one complete cycle

    function animate() {
      requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const t = (elapsed % loopTime) / loopTime;

      if (t < 0.5) {
        throwComplete = false;
        const throwT = t * 2; // Normalize to 0-1
        const easeT = throwT * throwT; // Quadratic easing
        // Move dart from z = 100 to z = 2
        dartGroup.position.z = 100 - easeT * 98;
      } else if (!throwComplete) {
        dartGroup.position.z = 2;
        throwComplete = true;
      }

      renderer.render(scene, camera);
    }
    animate();

    // Handle window resize.
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
    };
  }, []);

  return <div ref={containerRef} className={`min-h-[400px] ${className}`}></div>;
}

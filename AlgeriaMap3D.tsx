"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { REGIONS, regionCenter, toPlan, type Region } from "./regions";

const DEPTH = 0.22;
const HOVER_COLOR = new THREE.Color("#E0A93F"); // ocre doré
const SELECTED_COLOR = new THREE.Color("#D9A441");

/* ------------------------------ Hooks ------------------------------ */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

/* --------------------------- Point doré --------------------------- */
function Hub({ position, offset }: { position: [number, number, number]; offset: number }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const m = ring.current;
    if (!m) return;
    const t = (clock.elapsedTime * 0.7 + offset) % 1;
    m.scale.setScalar(1 + t * 2.4);
    (m.material as THREE.MeshBasicMaterial).opacity = 0.75 * (1 - t);
  });
  return (
    <group position={position}>
      <mesh raycast={() => null}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial color="#C9A24B" emissive="#FFC94D" emissiveIntensity={2.2} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color="#FFD27A" transparent opacity={0.6} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* --------------------------- Une région --------------------------- */
interface RegionMeshProps {
  region: Region;
  isSelected: boolean;
  isDimmed: boolean;
  onSelect: (id: string) => void;
}

function RegionMesh({ region, isSelected, isDimmed, onSelect }: RegionMeshProps) {
  const lift = useRef<THREE.Group>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape(
      region.polygon.map(([lo, la]) => {
        const [x, y] = toPlan(lo, la);
        return new THREE.Vector2(x, y);
      })
    );
    return new THREE.ExtrudeGeometry(shape, {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    });
  }, [region]);
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 25), [geometry]);
  useEffect(() => () => { geometry.dispose(); edges.dispose(); }, [geometry, edges]);

  const base = useMemo(() => new THREE.Color(region.tone), [region.tone]);
  const dim = useMemo(() => base.clone().multiplyScalar(0.5), [base]);
  const [cx, cy] = useMemo(() => regionCenter(region), [region]);

  useFrame((_, dt) => {
    const g = lift.current;
    const m = material.current;
    if (!g || !m) return;
    const targetY = isSelected ? 0.4 : hovered ? 0.28 : isDimmed ? -0.04 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, targetY, 7, dt);
    const target = isSelected ? SELECTED_COLOR : hovered ? HOVER_COLOR : isDimmed ? dim : base;
    m.color.lerp(target, 1 - Math.exp(-9 * dt));
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };
  const out = () => {
    setHovered(false);
    document.body.style.cursor = "";
  };

  return (
    <group ref={lift}>
      {/* Le shape est dans le plan XY : on le couche sur XZ (nord = -Z) */}
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <mesh
          geometry={geometry}
          onPointerOver={over}
          onPointerOut={out}
          onClick={(e) => { e.stopPropagation(); onSelect(region.id); }}
        >
          <meshStandardMaterial ref={material} color={region.tone} roughness={0.92} metalness={0} />
        </mesh>
        <lineSegments geometry={edges} raycast={() => null}>
          <lineBasicMaterial color="#C9A24B" transparent opacity={0.55} />
        </lineSegments>
      </group>

      {region.hubs.map((h, i) => {
        const [x, y] = toPlan(h.lon, h.lat);
        return <Hub key={h.name} position={[x, DEPTH + 0.05, -y]} offset={i * 0.37 + region.id.length * 0.1} />;
      })}

      <Html position={[cx, DEPTH + 0.06, -cy]} center pointerEvents="none" zIndexRange={[10, 0]}>
        <span
          className={`select-none whitespace-nowrap font-serif text-[15px] font-semibold tracking-wide transition-all duration-500 [text-shadow:0_1px_6px_rgba(26,15,10,0.85)] ${
            isSelected || hovered ? "scale-110 text-or" : isDimmed ? "text-chaux/30" : "text-chaux/85"
          }`}
        >
          {region.name}
        </span>
      </Html>
    </group>
  );
}

/* -------------------------- Caméra animée -------------------------- */
interface View { px: number; py: number; pz: number; tx: number; ty: number; tz: number }

function computeView(region: Region | null, aspect: number, isMobile: boolean): View {
  if (!region) {
    const d = aspect < 0.8 ? 17 : aspect < 1.25 ? 14 : 12;
    return { tx: 0, ty: 0, tz: 0, px: 0, py: d * 0.78, pz: d * 0.62 };
  }
  const [cx, cy] = regionCenter(region);
  const d = region.zoom * (isMobile ? 1.25 : 1);
  // Décale la région hors de la zone masquée par le panneau
  const shiftX = isMobile ? 0 : 0.126 * d * aspect; // panneau à droite (40 %)
  const shiftZ = isMobile ? 0.23 * d : 0; // bottom-sheet en bas
  const tx = cx + shiftX;
  const tz = -cy + shiftZ;
  return { tx, ty: 0, tz, px: tx, py: d * 0.78, pz: tz + d * 0.62 };
}

function CameraRig({ region, isMobile }: { region: Region | null; isMobile: boolean }) {
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(size.height, 1);
  const view = useRef<View>(computeView(region, aspect, isMobile));

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(view.current, {
      ...computeView(region, aspect, isMobile),
      duration: reduce ? 0 : 1.15,
      ease: "power3.inOut",
      overwrite: true,
    });
  }, [region, aspect, isMobile]);

  useFrame(() => {
    const v = view.current;
    camera.position.set(v.px, v.py, v.pz);
    camera.lookAt(v.tx, v.ty, v.tz);
  });
  return null;
}

/* ------------------------------ Scène ------------------------------ */
interface SceneProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  isMobile: boolean;
}

function Scene({ selectedId, onSelect, isMobile }: SceneProps) {
  const root = useRef<THREE.Group>(null);
  const selected = REGIONS.find((r) => r.id === selectedId) ?? null;

  // Léger parallaxe à la souris (desktop uniquement)
  useFrame((state, dt) => {
    const g = root.current;
    if (!g || isMobile) return;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.05, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.025, 3, dt);
  });

  return (
    <>
      <ambientLight intensity={0.9} color="#FFE6BF" />
      <directionalLight position={[-6, 9, 5]} intensity={2.4} color="#FFD9A0" />
      <directionalLight position={[6, 4, -4]} intensity={0.6} color="#B5542F" />
      <CameraRig region={selected} isMobile={isMobile} />
      <group ref={root}>
        {REGIONS.map((r) => (
          <RegionMesh
            key={r.id}
            region={r}
            isSelected={r.id === selectedId}
            isDimmed={selectedId !== null && r.id !== selectedId}
            onSelect={onSelect}
          />
        ))}
      </group>
    </>
  );
}

/* ----------------------------- Export ----------------------------- */
interface AlgeriaMap3DProps {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

export default function AlgeriaMap3D({ selectedId, onSelect }: AlgeriaMap3DProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (selectedId) setTouched(true);
  }, [selectedId]);

  // Échap : retour à la vue d'ensemble
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onSelect(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  return (
    <div
      className="relative h-full w-full"
      role="img"
      aria-label="Carte 3D interactive de l'Algérie. Utilisez la liste des régions pour naviguer au clavier."
    >
      <Canvas
        camera={{ fov: 35, near: 0.1, far: 100, position: [0, 9, 8] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }} // le scroll vertical de la page n'est jamais bloqué
        onPointerMissed={() => selectedId && onSelect(null)}
      >
        <Scene selectedId={selectedId} onSelect={onSelect} isMobile={isMobile} />
      </Canvas>

      {!touched && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 z-10 flex justify-center">
          <span className="animate-breathe rounded-full border border-or/60 bg-nuit/60 px-5 py-2 font-serif text-lg italic text-sable backdrop-blur">
            {isMobile ? "Touchez une région" : "Cliquez sur une région"}
          </span>
        </div>
      )}
    </div>
  );
}

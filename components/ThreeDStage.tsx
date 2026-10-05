"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { RawPoint } from "../data/dataset";

type Stage = "raw" | "stationarity" | "breaks" | "ardl" | "longrun" | "ecm";

type Props = {
  data: RawPoint[];
  startYear: number;
  endYear: number;
  selectedYear: number;
  stage: Stage;
};

const lanes = [
  { key: "gdpPerCapita", label: "GDP per capita", z: -2.25, unit: "constant 2015 US$" },
  { key: "fertilityRate", label: "Fertility rate", z: -0.75, unit: "births per woman" },
  { key: "expectedSchooling", label: "Expected years of schooling", z: 0.75, unit: "years" },
  { key: "oilRents", label: "Oil rents", z: 2.25, unit: "% of GDP" },
] as const;

function normalize(value: number, min: number, max: number) {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 2.5 - 1.25;
}

function DataField({ data, startYear, endYear, selectedYear, stage }: Props) {
  const group = useRef<THREE.Group>(null);
  const filtered = useMemo(
    () => data.filter((d) => d.Year >= startYear && d.Year <= endYear),
    [data, startYear, endYear]
  );

  const stats = useMemo(() => {
    const result: Record<string, { min: number; max: number }> = {};
    for (const lane of lanes) {
      const values = filtered.map((d) => d[lane.key]);
      result[lane.key] = { min: Math.min(...values), max: Math.max(...values) };
    }
    return result;
  }, [filtered]);

  useFrame((state) => {
    if (group.current) group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.12) * 0.025;
  });

  const selected = data.find((d) => d.Year === selectedYear);
  const selectedIndex = data.findIndex((d) => d.Year === selectedYear);
  const lagYears = new Set([selectedYear, selectedYear - 1, selectedYear - 2, selectedYear - 3]);

  const breakYears = new Set([1999, 2008, 2013, 2019]);
  const potentialBreakYears = new Set([2004, 2012, 2017]);

  return (
    <group ref={group}>
      {lanes.map((lane) => (
        <group key={lane.key}>
          <Line points={[[-5.7, -1.45, lane.z], [5.7, -1.45, lane.z]]} color="#1c2520" lineWidth={0.7} />
          <Text position={[-5.8, -1.65, lane.z]} rotation={[0, Math.PI / 2, 0]} fontSize={0.13} color="#718078" anchorX="right">
            {lane.label}
          </Text>
        </group>
      ))}

      {filtered.map((d, i) => {
        const x = -5.25 + (i / Math.max(filtered.length - 1, 1)) * 10.5;
        const points = lanes.map((lane) => {
          const y = normalize(d[lane.key], stats[lane.key].min, stats[lane.key].max);
          return [x, y, lane.z] as [number, number, number];
        });
        const isSelected = d.Year === selectedYear;
        const isLag = lagYears.has(d.Year) && d.Year >= startYear && d.Year <= endYear;
        const isBreak = breakYears.has(d.Year) && d.Year >= startYear && d.Year <= endYear;
        const isPotential = potentialBreakYears.has(d.Year) && d.Year >= startYear && d.Year <= endYear;

        return (
          <group key={d.Year}>
            {lanes.map((lane, li) => {
              const [px, py, pz] = points[li];
              const emphasized = isSelected || (stage === "ardl" && isLag);
              const color = emphasized ? "#caffdf" : isLag ? "#557565" : "#344039";
              return (
                <group key={lane.key}>
                  <mesh position={[px, py, pz]}>
                    <sphereGeometry args={[emphasized ? 0.075 : 0.038, 10, 10]} />
                    <meshStandardMaterial color={color} emissive={emphasized ? "#173b27" : "#07100b"} emissiveIntensity={emphasized ? 1.8 : 0.4} />
                  </mesh>
                  {isSelected && (
                    <mesh position={[px, py, pz]}>
                      <ringGeometry args={[0.11, 0.125, 24]} />
                      <meshBasicMaterial color="#b9ffd3" transparent opacity={0.8} side={THREE.DoubleSide} />
                    </mesh>
                  )}
                </group>
              );
            })}


            {isBreak && (
              <mesh position={[x, -1.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.22, 0.25, 40]} />
                <meshBasicMaterial color="#baffd0" transparent opacity={0.75} side={THREE.DoubleSide} />
              </mesh>
            )}
            {isPotential && (
              <mesh position={[x, -1.38, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.16, 0.18, 40]} />
                <meshBasicMaterial color="#6c8b78" transparent opacity={0.45} side={THREE.DoubleSide} />
              </mesh>
            )}

            {(isLag && stage === "ardl") && lanes.map((lane, li) => {
              const [px, py, pz] = points[li];
              return <Line key={`link-${lane.key}`} points={[[px, py, pz], [0, -0.1, 0]]} color="#426a50" lineWidth={0.8} transparent opacity={d.Year === selectedYear ? 0.8 : 0.32} />;
            })}

            {(isSelected || (isLag && stage === "ardl")) && (
              <Text position={[x, 1.45, 0]} fontSize={0.14} color={isSelected ? "#e7ffef" : "#6e907b"} anchorX="center">
                {d.Year}
              </Text>
            )}
          </group>
        );
      })}

      {stage === "stationarity" && selectedIndex > 0 && selected && (
        <group>
          <Text position={[0, 1.9, 0]} fontSize={0.18} color="#caffdf" anchorX="center">
            FIRST DIFFERENCE STAGE · ΔY, ΔFERT, ΔHC, ΔOIL
          </Text>
          {lanes.map((lane, li) => {
            const current = data[selectedIndex][lane.key];
            const previous = data[selectedIndex - 1][lane.key];
            const delta = current - previous;
            const scale = Math.max(Math.abs(delta), 0.001);
            const sign = delta >= 0 ? 1 : -1;
            const x = -2.8 + li * 1.85;
            return (
              <group key={lane.key} position={[x, 0, 0]}>
                <Line points={[[0, 0, 0], [0, sign * Math.min(1.25, 0.25 + Math.log10(1 + scale) * 0.6), 0]]} color="#baffd0" lineWidth={2} />
                <Text position={[0, -1.55, 0]} fontSize={0.11} color="#75867b" anchorX="center">
                  {lane.label}
                </Text>
              </group>
            );
          })}
        </group>
      )}

      {stage === "ardl" && selected && (
        <group>
          <Text position={[0, 1.85, 0]} fontSize={0.18} color="#caffdf" anchorX="center">
            SELECTED OBSERVATION + REQUIRED LAGS → ARDL(2,1,3,2)
          </Text>
          <mesh position={[0, -0.1, 0]}>
            <boxGeometry args={[2.2, 0.9, 0.08]} />
            <meshStandardMaterial color="#0a1710" emissive="#102d1d" emissiveIntensity={0.8} transparent opacity={0.95} />
          </mesh>
          <Text position={[0, 0.18, 0.08]} fontSize={0.16} color="#e8fff0" anchorX="center">
            ARDL(2,1,3,2)
          </Text>
          <Text position={[0, -0.08, 0.08]} fontSize={0.105} color="#81968a" anchorX="center">
            dynamic lag structure
          </Text>
          <Text position={[0, -0.28, 0.08]} fontSize={0.09} color="#81968a" anchorX="center">
            year {selectedYear}
          </Text>
        </group>
      )}

      {stage === "longrun" && (
        <group>
          <Text position={[0, 1.85, 0]} fontSize={0.18} color="#caffdf" anchorX="center">
            LONG-RUN RELATIONSHIP
          </Text>
          {[
            ["FERT", "+10,348.39"],
            ["HC", "−602.4398"],
            ["OIL", "+161.4387"],
          ].map(([label, value], i) => (
            <group key={label} position={[(i - 1) * 2.15, -0.05, 0]}>
              <mesh>
                <boxGeometry args={[1.7, 0.75, 0.08]} />
                <meshStandardMaterial color="#0a1710" emissive="#102d1d" emissiveIntensity={0.8} />
              </mesh>
              <Text position={[0, 0.08, 0.08]} fontSize={0.13} color="#e8fff0" anchorX="center">{label}</Text>
              <Text position={[0, -0.16, 0.08]} fontSize={0.095} color="#81968a" anchorX="center">{value}</Text>
            </group>
          ))}
        </group>
      )}

      {stage === "ecm" && (
        <group>
          <Text position={[0, 1.85, 0]} fontSize={0.18} color="#caffdf" anchorX="center">
            SHORT-RUN + ERROR-CORRECTION STAGE
          </Text>
          <Line points={[[-2.4, 0, 0], [2.4, 0, 0]]} color="#587564" lineWidth={1.5} />
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshStandardMaterial color="#d7ffe5" emissive="#1b4a2d" emissiveIntensity={1.5} />
          </mesh>
          <Text position={[0, -0.45, 0]} fontSize={0.12} color="#d7ffe5" anchorX="center">
            COINTEQ = −1.383761
          </Text>
          <Text position={[0, -0.7, 0]} fontSize={0.095} color="#81968a" anchorX="center">
            p &lt; 0.001 · adjustment toward long-run equilibrium
          </Text>
        </group>
      )}
    </group>
  );
}

export default function ThreeDStage(props: Props) {
  return (
    <div className="stage">
      <div className="stageTopline">
        <span>3D ECONOMETRIC FIELD</span>
        <span>DRAG · ROTATE · SCROLL TO ZOOM</span>
      </div>
      <Canvas camera={{ position: [0, 3.4, 10.5], fov: 48 }} dpr={[1, 1.5]} gl={{ antialias: true }}>
        <color attach="background" args={["#020503"]} />
        <fog attach="fog" args={["#020503", 9, 19]} />
        <ambientLight intensity={0.38} />
        <directionalLight position={[4, 6, 5]} intensity={1.2} />
        <pointLight position={[-4, 2, 2]} intensity={0.8} color="#7bffad" />
        <gridHelper args={[16, 32, "#183024", "#0a130e"]} position={[0, -1.45, 0]} />
        <DataField {...props} />
        <OrbitControls enablePan={false} minDistance={5.5} maxDistance={15} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}

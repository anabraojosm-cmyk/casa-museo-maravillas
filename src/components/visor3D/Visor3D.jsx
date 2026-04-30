import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import MapaCenital from './MapaCenital'

function Sala({ codigoSeleccionado }) {
  const { scene } = useGLTF('/casa-museo-maravillas/models/sala.glb')
  const materialesOriginales = useRef({})

  useEffect(() => {
    scene.traverse((objeto) => {
      if (objeto.name === 'techo') {
        objeto.visible = false
      }
      if (objeto.isMesh) {
        if (!materialesOriginales.current[objeto.name]) {
          materialesOriginales.current[objeto.name] = objeto.material.clone()
        }
        if (objeto.name === codigoSeleccionado) {
          objeto.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#ee912e'),
            emissive: new THREE.Color('#ee912e'),
            emissiveIntensity: 0.4,
          })
        } else {
          objeto.material = materialesOriginales.current[objeto.name]
        }
      }
    })
  }, [scene, codigoSeleccionado])

  return <primitive object={scene} />
}
const bx = (x) => ((x + 10) / 20) * 100
const by = (y) => ((7 - y) / 14) * 100

function Visor3D({ codigoSeleccionado, vistaActiva }) {
  const mostrarMapa = vistaActiva === 'calor-temperatura' || vistaActiva === 'calor-humedad'

  const puntosTemperatura = [
    { x: bx(-4.75), y: by(6.98), color: 'rgba(255,0,0,0.7)', r: 120 },
    { x: bx(2.48), y: by(6.77), color: 'rgba(255,50,0,0.6)', r: 100 },
    { x: bx(9.64), y: by(0.11), color: 'rgba(255,30,0,0.65)', r: 130 },
    { x: bx(-4.52), y: by(-6.85), color: 'rgba(0,68,255,0.7)', r: 110 },
    { x: bx(3.38), y: by(-6.85), color: 'rgba(0,68,255,0.7)', r: 110 },
    { x: bx(-9.88), y: by(0.11), color: 'rgba(0,80,255,0.65)', r: 120 },
    { x: bx(0), y: by(0), color: 'rgba(68,200,68,0.5)', r: 100 },
  ]

  const puntosHumedad = [
    { x: bx(-4.52), y: by(-6.85), color: 'rgba(0,34,255,0.75)', r: 130 },
    { x: bx(3.38), y: by(-6.85), color: 'rgba(0,34,255,0.75)', r: 130 },
    { x: bx(0), y: by(-5), color: 'rgba(0,68,255,0.5)', r: 100 },
    { x: bx(-4.75), y: by(6.98), color: 'rgba(255,170,0,0.65)', r: 110 },
    { x: bx(0), y: by(0), color: 'rgba(0,170,255,0.4)', r: 90 },
  ]

  const puntos = vistaActiva === 'calor-temperatura' ? puntosTemperatura : puntosHumedad

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={mostrarMapa
          ? { position: [0, 20, 0], fov: 60, up: [0, 0, -1] }
          : { position: [0, 5, 10], fov: 60 }
        }
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Sala codigoSeleccionado={codigoSeleccionado} />
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls
          enableZoom={!mostrarMapa}
          enableRotate={!mostrarMapa}
          enablePan={!mostrarMapa}
        />
      </Canvas>

      {/* Mapa de calor SVG encima del canvas */}
      {mostrarMapa && (
        <svg style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          pointerEvents: 'none',
          zIndex: 10,
        }}>
          <defs>
            {puntos.map((p, i) => (
              <radialGradient key={i} id={`heatgrad${i}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={p.color} />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            ))}
          </defs>
          {puntos.map((p, i) => (
            <ellipse
              key={i}
              cx={`${p.x}%`}
              cy={`${p.y}%`}
              rx={p.r}
              ry={p.r}
              fill={`url(#heatgrad${i})`}
            />
          ))}
        </svg>
      )}
    </div>
  )
}

export default Visor3D
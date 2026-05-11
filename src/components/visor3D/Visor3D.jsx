import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'

const PIEZAS_RIESGO = ['silla_02', 'cojin_sofa_02']

const FUENTES_TEMPERATURA = [
  { x: -4.52, z: 6.85, tipo: 'frio', intensidad: 1.5 },
  { x: 3.38,  z: 6.85, tipo: 'frio', intensidad: 1.5 },
  { x: -9.88, z: 0,    tipo: 'frio', intensidad: 0.7 },
  { x: 9.64,  z: 0,    tipo: 'calor', intensidad: 1.0 },
  { x: 0,     z: -6.98, tipo: 'calor', intensidad: 1.8 },
  { x: 0,     z: -0.06, tipo: 'calor', intensidad: 0.8 },
  { x: 0,     z: -0.06, tipo: 'frio', intensidad: 0.6 },
]

const FUENTES_HUMEDAD = [
  { x: -4.52, z: 6.85, tipo: 'humedo', intensidad: 1.0 },
  { x: 3.38,  z: 6.85, tipo: 'humedo', intensidad: 1.0 },
  { x: 0,     z: -6.98, tipo: 'seco', intensidad: 0.8 },
  { x: 9.64,  z: 0,    tipo: 'seco', intensidad: 0.6 },
]

function calcularColorTemperatura(x, z) {
  let pesoFrio = 0
  let pesoCalor = 0
  FUENTES_TEMPERATURA.forEach(f => {
    const dist = Math.sqrt((x - f.x) ** 2 + (z - f.z) ** 2)
    const influencia = f.intensidad / (1 + dist * 0.15)
    if (f.tipo === 'frio') pesoFrio += influencia
    else pesoCalor += influencia
  })
  const total = pesoFrio + pesoCalor
  const t = pesoCalor / total
  const color = new THREE.Color()
  if (t < 0.25) color.lerpColors(new THREE.Color('#2255ff'), new THREE.Color('#44aaff'), t / 0.25)
  else if (t < 0.5) color.lerpColors(new THREE.Color('#44aaff'), new THREE.Color('#44cc44'), (t - 0.25) / 0.25)
  else if (t < 0.75) color.lerpColors(new THREE.Color('#44cc44'), new THREE.Color('#ffaa00'), (t - 0.5) / 0.25)
  else color.lerpColors(new THREE.Color('#ffaa00'), new THREE.Color('#ff2200'), (t - 0.75) / 0.25)
  return color
}

function calcularColorHumedad(x, z) {
  let pesoHumedo = 0
  let pesoSeco = 0
  FUENTES_HUMEDAD.forEach(f => {
    const dist = Math.sqrt((x - f.x) ** 2 + (z - f.z) ** 2)
    const influencia = f.intensidad / (1 + dist * 0.15)
    if (f.tipo === 'humedo') pesoHumedo += influencia
    else pesoSeco += influencia
  })
  const total = pesoHumedo + pesoSeco
  const t = pesoHumedo / total
  const color = new THREE.Color()
  if (t < 0.25) color.lerpColors(new THREE.Color('#ffaa00'), new THREE.Color('#88cc44'), t / 0.25)
  else if (t < 0.5) color.lerpColors(new THREE.Color('#88cc44'), new THREE.Color('#00aaff'), (t - 0.25) / 0.25)
  else if (t < 0.75) color.lerpColors(new THREE.Color('#00aaff'), new THREE.Color('#0088ff'), (t - 0.5) / 0.25)
  else color.lerpColors(new THREE.Color('#0088ff'), new THREE.Color('#0022ff'), (t - 0.75) / 0.25)
  return color
}

// Componente que parpadea — tiene que estar DENTRO del Canvas
function ParpadeoRiesgo({ materialesRiesgo }) {
  useFrame(({ clock }) => {
    const t = (Math.sin(clock.getElapsedTime() * 3) + 1) / 2
    PIEZAS_RIESGO.forEach(nombre => {
      if (materialesRiesgo.current[nombre]) {
        materialesRiesgo.current[nombre].emissiveIntensity = 0.2 + t * 1.0
      }
    })
  })
  return null
}

function Sala({ codigoSeleccionado, vistaActiva, materialesRiesgo }) {
  const { scene } = useGLTF('/casa-museo-maravillas/models/sala.glb')
  const materialesOriginales = useRef({})
  const mostrarMapa = vistaActiva === 'calor-temperatura' || vistaActiva === 'calor-humedad'
  const mostrarRiesgo = vistaActiva === 'piezas-riesgo'

  useEffect(() => {
    scene.traverse((objeto) => {
      if (objeto.name === 'techo') objeto.visible = false

      if (objeto.isMesh) {
        if (!materialesOriginales.current[objeto.name]) {
          materialesOriginales.current[objeto.name] = objeto.material.clone()
        }

        if (mostrarMapa) {
          const posicion = new THREE.Vector3()
          objeto.getWorldPosition(posicion)
          const color = vistaActiva === 'calor-temperatura'
            ? calcularColorTemperatura(posicion.x, posicion.z)
            : calcularColorHumedad(posicion.x, posicion.z)
          objeto.material = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.2,
            transparent: true,
            opacity: 0.85,
          })
        } else if (mostrarRiesgo && PIEZAS_RIESGO.includes(objeto.name)) {
          const mat = new THREE.MeshStandardMaterial({
            color: new THREE.Color('#ff0000'),
            emissive: new THREE.Color('#ff0000'),
            emissiveIntensity: 0.6,
          })
          materialesRiesgo.current[objeto.name] = mat
          objeto.material = mat
        } else if (objeto.name === codigoSeleccionado) {
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
  }, [scene, codigoSeleccionado, vistaActiva, mostrarMapa, mostrarRiesgo])

  return <primitive object={scene} />
}

function Visor3D({ codigoSeleccionado, vistaActiva }) {
  const [mensajeCerrado, setMensajeCerrado] = useState(false)
  const materialesRiesgo = useRef({})
  const mostrarMapa = vistaActiva === 'calor-temperatura' || vistaActiva === 'calor-humedad'
  const mostrarRiesgo = vistaActiva === 'piezas-riesgo'

  useEffect(() => {
    setMensajeCerrado(false)
    materialesRiesgo.current = {}
  }, [vistaActiva])

  const escalaTemperatura = 'linear-gradient(to bottom, #ff2200, #ffaa00, #44cc44, #44aaff, #2255ff)'
  const escalaHumedad = 'linear-gradient(to bottom, #0022ff, #0088ff, #00aaff, #88cc44, #ffaa00)'
  const labelsTemperatura = ['25°C+', '22°C', '20°C', '18°C', '16°C']
  const labelsHumedad = ['70%+', '60%', '50%', '40%', '-40%']
  const escalaGradiente = vistaActiva === 'calor-temperatura' ? escalaTemperatura : escalaHumedad
  const escalaLabels = vistaActiva === 'calor-temperatura' ? labelsTemperatura : labelsHumedad

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
  camera={{ position: [0, 5, 10], fov: 60 }}
  style={{ width: '100%', height: '100%', display: 'block' }}
>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Sala
            codigoSeleccionado={codigoSeleccionado}
            vistaActiva={vistaActiva}
            materialesRiesgo={materialesRiesgo}
          />
          {mostrarRiesgo && <ParpadeoRiesgo materialesRiesgo={materialesRiesgo} />}
          <Environment preset="apartment" />
        </Suspense>
        <OrbitControls enableZoom={true} enableRotate={true} enablePan={true} />
      </Canvas>

      {/* Escala mapa de calor */}
      {mostrarMapa && (
        <div className="escala-calor">
          <div className="escala-calor-barra" style={{ background: escalaGradiente }} />
          <div className="escala-calor-labels">
            {escalaLabels.map((label, i) => (
              <span key={i} className="escala-calor-label">{label}</span>
            ))}
          </div>
        </div>
      )}

      {/* Mensaje piezas en riesgo */}
      {mostrarRiesgo && !mensajeCerrado && (
        <div className="mensaje-riesgo">
          <div className="mensaje-riesgo-contenido">
            <span className="mensaje-riesgo-icono">⚠️</span>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
  <p className="mensaje-riesgo-titulo">Piezas en riesgo</p>
  <p className="mensaje-riesgo-texto" style={{ textAlign: 'center' }}>
    Silla_02 y Cojín_sofá_02 presentan condiciones de temperatura y humedad inadecuadas — 35°C · 40%
  </p>
  <div className="mensaje-riesgo-botones">
    <button className="boton-mandar-aviso" onClick={() => alert('Aviso enviado al equipo de conservación y registro')}>
  Mandar aviso
</button>
    <button className="boton-exportar-informe" onClick={() => alert('Exportando informe...')}>
     Exportar informe
    </button>
  </div>
</div>
            <button className="mensaje-riesgo-cerrar" onClick={() => setMensajeCerrado(true)}>✕</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Visor3D
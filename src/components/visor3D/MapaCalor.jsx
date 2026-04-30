import { useMemo } from 'react'
import * as THREE from 'three'

function MapaCalor({ tipo }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    if (tipo === 'calor-temperatura') {
      // Sur y este = caliente (rojo), norte y oeste = frío (azul)
      const gradiente = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
      gradiente.addColorStop(0, 'rgba(0, 0, 255, 0.6)')    // norte-oeste: frío azul
      gradiente.addColorStop(0.4, 'rgba(0, 255, 100, 0.5)') // centro: verde
      gradiente.addColorStop(0.7, 'rgba(255, 200, 0, 0.5)') // cálido: amarillo
      gradiente.addColorStop(1, 'rgba(255, 0, 0, 0.6)')     // sur-este: caliente rojo
      ctx.fillStyle = gradiente
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    if (tipo === 'calor-humedad') {
      // Norte (ventanas) = húmedo (azul intenso), sur = seco (amarillo)
      const gradiente = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradiente.addColorStop(0, 'rgba(0, 80, 255, 0.65)')    // norte: muy húmedo
      gradiente.addColorStop(0.3, 'rgba(0, 180, 255, 0.55)') // bastante húmedo
      gradiente.addColorStop(0.6, 'rgba(100, 220, 180, 0.45)') // medio
      gradiente.addColorStop(1, 'rgba(255, 220, 50, 0.5)')   // sur: seco
      ctx.fillStyle = gradiente
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    return new THREE.CanvasTexture(canvas)
  }, [tipo])

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
      <planeGeometry args={[20, 14]} />
      <meshBasicMaterial
        map={texture}
        transparent={true}
        opacity={1}
        depthWrite={false}
      />
    </mesh>
  )
}

export default MapaCalor
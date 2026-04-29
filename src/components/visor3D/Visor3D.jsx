import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'

function Sala() {
  const { scene } = useGLTF('/casa-museo-maravillas/models/sala.glb')

  useEffect(() => {
    scene.traverse((objeto) => {
      if (objeto.name === 'techo') {
        objeto.visible = false
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

function Visor3D() {
  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 60 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Suspense fallback={null}>
        <Sala />
        <Environment preset="apartment" />
      </Suspense>
      <OrbitControls
        enableZoom={true}
        enableRotate={true}
        enablePan={true}
      />
    </Canvas>
  )
}

export default Visor3D
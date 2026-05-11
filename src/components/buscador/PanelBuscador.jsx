import { useState, Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment } from '@react-three/drei'
import * as THREE from 'three'
import piezas from '../../data/piezas.json'

function ModeloPieza({ codigo }) {
  const { scene } = useGLTF(`/casa-museo-maravillas/models/piezas/${codigo}.glb`)

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)
  }, [scene])

  return <primitive object={scene} />
}

function VisorPieza({ codigo }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <ModeloPieza codigo={codigo} />
        <Environment preset="apartment" />
      </Suspense>
      <OrbitControls enableZoom={true} enableRotate={true} enablePan={false} target={[0, 0, 0]} />
    </Canvas>
  )
}

const piezasConModelo = [
  'armario_01', 'armario_02', 'cuadro_01', 'cuadro_02', 'cuadro_03',
  'cuadro_04', 'cuadro_05', 'alfombra', 'sofa_01', 'tapiz_01',
  'silla_01', 'silla_02', 'mesa_01'
]

function PanelBuscador({ onPiezaSeleccionada, onSustitucion }) {
  const [busqueda, setBusqueda] = useState('')
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null)
  const [piezaSustituta, setPiezaSustituta] = useState(null)
  const [modalSustituir, setModalSustituir] = useState(false)
  const [busquedaSustituir, setBusquedaSustituir] = useState('')
  const [resultadoSustituir, setResultadoSustituir] = useState(null)

  const piezaMostrada = piezaSustituta || piezaSeleccionada
  const tieneModelo = piezaMostrada && piezasConModelo.includes(piezaMostrada.codigo)

  const buscarPieza = () => {
    const resultado = piezas.find(
      (p) => p.codigo.toLowerCase() === busqueda.toLowerCase().trim()
    )
    if (resultado) {
      setPiezaSeleccionada(resultado)
      setPiezaSustituta(null)
      onPiezaSeleccionada(resultado.codigo)
    } else {
      setPiezaSeleccionada(null)
      onPiezaSeleccionada(null)
      alert('No se ha encontrado ninguna pieza con ese código')
    }
  }

  const buscarSustituta = () => {
    const resultado = piezas.find(
      (p) => p.codigo.toLowerCase() === busquedaSustituir.toLowerCase().trim()
    )
    setResultadoSustituir(resultado || null)
    if (!resultado) alert('No se ha encontrado ninguna pieza con ese código')
  }

  const confirmarSustitucion = () => {
  if (resultadoSustituir && piezaSeleccionada) {
    setPiezaSustituta(resultadoSustituir)
    onPiezaSeleccionada(resultadoSustituir.codigo)
    onSustitucion({
      original: piezaSeleccionada.codigo,
      sustituta: resultadoSustituir.codigo
    })
    setModalSustituir(false)
    setBusquedaSustituir('')
    setResultadoSustituir(null)
  }
}

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscarPieza()
  }

  return (
    <div className="buscador-contenedor">

      <p className="buscador-titulo">Buscador de piezas</p>

      <input
        className="buscador-input"
        type="text"
        placeholder="Código de la pieza..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="boton-buscar" onClick={buscarPieza}>
        Buscar
      </button>

      <div className="buscador-botones">
        <button className="boton-rotar">ROTACIÓN</button>
        <button className="boton-sustituir" onClick={() => piezaSeleccionada && setModalSustituir(true)}>
          SUSTITUCIÓN
        </button>
        <button className="boton-vacio">RETIRADA</button>
      </div>

      {/* VISTA PIEZA */}
      <div className="buscador-centro">
        {tieneModelo ? (
          <VisorPieza codigo={piezaMostrada.codigo} />
        ) : piezaMostrada ? (
          <p className="placeholder-pieza">Sin modelo 3D disponible</p>
        ) : (
          <p className="placeholder-pieza">Modelo 3D de la pieza</p>
        )}
      </div>

      {/* DATOS PIEZA */}
      <div className="buscador-derecha">
        <p><strong>Nombre:</strong> {piezaMostrada ? piezaMostrada.nombre : '—'}</p>
        <p><strong>Autor:</strong> {piezaMostrada ? piezaMostrada.autor : '—'}</p>
        <p><strong>Datación:</strong> {piezaMostrada ? piezaMostrada.datacion : '—'}</p>
        <p><strong>Tipología:</strong> {piezaMostrada ? piezaMostrada.tipologia : '—'}</p>
        <p><strong>Materiales:</strong> {piezaMostrada ? piezaMostrada.materiales : '—'}</p>
        <p><strong>Dimensiones:</strong> {piezaMostrada ? piezaMostrada.dimensiones : '—'}</p>
        <button className="boton-exportar" onClick={() => {
          if (piezaMostrada) {
            const texto = `INFORME DE PIEZA\n\nNombre: ${piezaMostrada.nombre}\nAutor: ${piezaMostrada.autor}\nDatación: ${piezaMostrada.datacion}\nTipología: ${piezaMostrada.tipologia}\nMateriales: ${piezaMostrada.materiales}\nDimensiones: ${piezaMostrada.dimensiones}`
            navigator.clipboard.writeText(texto)
            alert('Informe de pieza copiado al portapapeles')
          }
        }}>Exportar</button>
      </div>

      {/* MODAL SUSTITUCIÓN */}
      {modalSustituir && (
        <div className="modal-overlay">
          <div className="modal-contenido">
            <p className="modal-titulo">Sustitución de pieza</p>
            <p className="modal-subtitulo">Pieza actual: <strong>{piezaSeleccionada?.nombre}</strong></p>
            <input
              className="buscador-input"
              type="text"
              placeholder="Código de la pieza sustituta..."
              value={busquedaSustituir}
              onChange={(e) => setBusquedaSustituir(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && buscarSustituta()}
            />
            <button className="boton-buscar" onClick={buscarSustituta}>Buscar</button>
            {resultadoSustituir && (
              <div className="modal-resultado">
                <p><strong>{resultadoSustituir.nombre}</strong></p>
                <p>{resultadoSustituir.autor} — {resultadoSustituir.datacion}</p>
                <button className="boton-sustituir-confirmar" onClick={confirmarSustitucion}>
                  Sustituir pieza
                </button>
              </div>
            )}
            <button className="modal-cerrar" onClick={() => { setModalSustituir(false); setBusquedaSustituir(''); setResultadoSustituir(null) }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default PanelBuscador
import { useState } from 'react'
import piezas from '../../data/piezas.json'

function PanelBuscador({ onPiezaSeleccionada }) {
  const [busqueda, setBusqueda] = useState('')
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null)

  const buscarPieza = () => {
    const resultado = piezas.find(
      (p) => p.codigo.toLowerCase() === busqueda.toLowerCase().trim()
    )
    if (resultado) {
      setPiezaSeleccionada(resultado)
      onPiezaSeleccionada(resultado.codigo)
    } else {
      setPiezaSeleccionada(null)
      onPiezaSeleccionada(null)
      alert('No se ha encontrado ninguna pieza con ese código')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') buscarPieza()
  }

  return (
    <div className="buscador-contenedor">

      {/* TÍTULO */}
      <p className="buscador-titulo">Buscador de piezas</p>

      {/* INPUT */}
      <input
        className="buscador-input"
        type="text"
        placeholder="Código de la pieza..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="boton-buscar" onClick={() => buscarPieza()}>
        Buscar
      </button>

      {/* BOTONES */}
      <div className="buscador-botones">
        <button className="boton-rotar">Rotar</button>
        <button className="boton-sustituir">Sustituir</button>
        <button className="boton-vacio">Dejar vacío</button>
      </div>

      {/* VISTA PIEZA */}
      <div className="buscador-centro">
        {piezaSeleccionada ? (
          <p className="nombre-pieza-centro">{piezaSeleccionada.nombre}</p>
        ) : (
          <p className="placeholder-pieza">Modelo 3D de la pieza</p>
        )}
      </div>

      {/* DATOS PIEZA */}
      <div className="buscador-derecha">
        <p><strong>Nombre:</strong> {piezaSeleccionada ? piezaSeleccionada.nombre : '—'}</p>
        <p><strong>Autor:</strong> {piezaSeleccionada ? piezaSeleccionada.autor : '—'}</p>
        <p><strong>Datación:</strong> {piezaSeleccionada ? piezaSeleccionada.datacion : '—'}</p>
        <p><strong>Tipología:</strong> {piezaSeleccionada ? piezaSeleccionada.tipologia : '—'}</p>
        <p><strong>Materiales:</strong> {piezaSeleccionada ? piezaSeleccionada.materiales : '—'}</p>
        <p><strong>Dimensiones:</strong> {piezaSeleccionada ? piezaSeleccionada.dimensiones : '—'}</p>
        <button className="boton-exportar">Exportar</button>
      </div>

    </div>
  )
}

export default PanelBuscador
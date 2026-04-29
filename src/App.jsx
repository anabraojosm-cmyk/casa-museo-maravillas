import { useState } from 'react'
import './App.css'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [vistaActiva, setVistaActiva] = useState('normal')

  return (
    <div className="app-contenedor">

      {/* BLOQUE 1 - HEADER */}
      <header className="header">
        <h1 className="titulo">Casa Museo Maravillas</h1>
        <button className="boton-hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}>
          ☰
        </button>
        {menuAbierto && (
          <div className="menu-desplegable">
            <button onClick={() => { setVistaActiva('restablecido'); setMenuAbierto(false) }}>
              Restablecer mapa 3D
            </button>
            <button onClick={() => { setVistaActiva('calor-temperatura'); setMenuAbierto(false) }}>
              Mapa de calor de temperatura
            </button>
            <button onClick={() => { setVistaActiva('calor-humedad'); setMenuAbierto(false) }}>
              Mapa de calor de humedad
            </button>
            <button onClick={() => { setVistaActiva('graficas'); setMenuAbierto(false) }}>
              Gráficas
            </button>
            <button onClick={() => { setVistaActiva('piezas-riesgo'); setMenuAbierto(false) }}>
              Mapa de piezas en riesgo
            </button>
          </div>
        )}
      </header>

      {/* BLOQUE 2 - VISOR 3D */}
      <main className="visor-contenedor">
        <div className="visor-3d">
          <p className="visor-placeholder">[ Visor 3D de la sala — aquí irá el modelo ]</p>
          <div className="hud-sensores">
            <p>🌡️ Temp: 21°C</p>
            <p>💧 Hum: 55%</p>
            <p>💡 Lux: 60</p>
          </div>
          <div className="controles-visor">
            <button>🔍+</button>
            <button>🔍-</button>
            <button>🔄</button>
          </div>
        </div>
        <p className="vista-activa-info">Vista activa: {vistaActiva}</p>
      </main>

      {/* BLOQUE 3 - BUSCADOR */}
      <div className="buscador-contenedor">

        {/* Izquierda - búsqueda y botones */}
        <div className="buscador-izquierda">
          <input className="buscador-input" type="text" placeholder="Introduce el código de la pieza..." />
          <div className="buscador-botones">
            <button className="boton-rotar">🔄 Rotar</button>
            <button className="boton-sustituir">🔁 Sustituir</button>
            <button className="boton-vacio">⬜ Dejar vacío</button>
          </div>
        </div>

        {/* Centro - foto o modelo de la pieza */}
        <div className="buscador-centro">
          <p className="placeholder-pieza">[ Foto o modelo 3D de la pieza ]</p>
        </div>

        {/* Derecha - datos de la pieza */}
        <div className="buscador-derecha">
          <p><strong>Nombre:</strong> —</p>
          <p><strong>Autor:</strong> —</p>
          <p><strong>Datación:</strong> —</p>
          <p><strong>Tipología:</strong> —</p>
          <p><strong>Materiales:</strong> —</p>
          <p><strong>Dimensiones:</strong> —</p>
          <button className="boton-exportar">📄 Exportar</button>
        </div>

      </div>

    </div>
  )
}

export default App
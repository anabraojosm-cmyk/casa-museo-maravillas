import { useState } from 'react'
import './App.css'
import Visor3D from './components/visor3D/Visor3D'
import PanelBuscador from './components/buscador/PanelBuscador'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [vistaActiva, setVistaActiva] = useState('normal')
  const [codigoSeleccionado, setCodigoSeleccionado] = useState(null)

  return (
    <div className="app-contenedor">

      {/* COLUMNA IZQUIERDA */}
      <div className="columna-izquierda">

        {/* HEADER */}
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

        {/* VISOR 3D */}
        <main className="visor-contenedor">
  <Visor3D codigoSeleccionado={codigoSeleccionado} vistaActiva={vistaActiva} />
  <div className="hud-sensores">
    <p>🌡️ Temp: 21°C</p>
    <p>💧 Hum: 55%</p>
    <p>💡 Lux: 60</p>
  </div>
</main>

      </div>

      {/* COLUMNA DERECHA */}
      <div className="columna-derecha">
        <PanelBuscador onPiezaSeleccionada={setCodigoSeleccionado} />
      </div>

    </div>
  )
}

export default App
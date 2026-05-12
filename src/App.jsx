import { useState } from 'react'
import './App.css'
import Visor3D from './components/visor3D/Visor3D'
import PanelBuscador from './components/buscador/PanelBuscador'

function PantallaLogin({ onEntrar }) {
  const [modo, setModo] = useState(null)
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
  if (usuario.trim() === 'ana' && contrasena.trim() === 'ana') {
    onEntrar()
  } else {
    setError('Usuario o contraseña incorrectos')
  }
}

  return (
    <div className="login-contenedor">
      <div className="login-caja">

        <div className="login-header">
          <p className="login-subtitulo">Gemelo Digital</p>
          <h1 className="login-titulo">Casa Museo Maravillas</h1>
          <div className="login-separador" />
        </div>

        {!modo && (
          <div className="login-opciones">
            <p className="login-pregunta">¿Cómo desea acceder?</p>
            <button className="login-boton-visitante" onClick={() => setModo('visitante')}>
              Visitante
            </button>
            <button className="login-boton-trabajador" onClick={() => setModo('trabajador')}>
              Trabajador
            </button>
          </div>
        )}

        {modo === 'visitante' && (
          <div className="login-visitante">
            <p className="login-mensaje-visitante">
              El acceso para visitantes no está disponible en este momento.
            </p>
            <button className="login-volver" onClick={() => setModo(null)}>
              Volver
            </button>
          </div>
        )}

        {modo === 'trabajador' && (
          <div className="login-form">
            <p className="login-pregunta">Acceso para trabajadores</p>
            <input
              className="login-input"
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => { setUsuario(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Contraseña"
              value={contrasena}
              onChange={(e) => { setContrasena(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="login-error">{error}</p>}
            <button className="login-boton-entrar" onClick={handleLogin}>
              Entrar
            </button>
            <button className="login-volver" onClick={() => { setModo(null); setError('') }}>
              Volver
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

function App() {
  const [logueado, setLogueado] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [vistaActiva, setVistaActiva] = useState('normal')
  const [codigoSeleccionado, setCodigoSeleccionado] = useState(null)
  const [sustitucion, setSustitucion] = useState(null)

  if (!logueado) {
    return <PantallaLogin onEntrar={() => setLogueado(true)} />
  }

  return (
    <div className="app-contenedor">

      <div className="columna-izquierda">
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

        <main className="visor-contenedor">
          <Visor3D codigoSeleccionado={codigoSeleccionado} vistaActiva={vistaActiva} sustitucion={sustitucion} />
          <div className="hud-sensores">
            <p>🌡️ Temp: 21°C</p>
            <p>💧 Hum: 55%</p>
            <p>💡 Lux: 60</p>
          </div>
          <div className="controles-visor">
            <button onClick={() => document.dispatchEvent(new CustomEvent('zoom-in'))}>+</button>
            <button onClick={() => document.dispatchEvent(new CustomEvent('zoom-out'))}>−</button>
            <button onClick={() => document.dispatchEvent(new CustomEvent('reset-camera'))}>↺</button>
          </div>
        </main>
      </div>

      <div className="columna-derecha">
        <PanelBuscador onPiezaSeleccionada={setCodigoSeleccionado} onSustitucion={setSustitucion} />
      </div>

    </div>
  )
}

export default App
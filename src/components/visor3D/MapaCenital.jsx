function MapaCenital({ tipo }) {

  // Sala: 20x14m. Blender: X va de -10 a +10, Y va de -7 a +7
  // Convertimos coordenadas Blender a porcentaje del plano
  // X: (-10 a +10) → (0% a 100%)
  // Y: (-7 a +7) → (100% a 0%) — invertido porque Y positivo es sur en pantalla

  const bx = (x) => ((x + 10) / 20) * 100
  const by = (y) => ((7 - y) / 14) * 100  // norte arriba, sur abajo

  const piezas = [
    { id: 'cuadro_01', x: bx(-9.88), y: by(0.11), w: 1, h: 4, label: 'C01' },
    { id: 'cuadro_02', x: bx(9.64), y: by(-4.11), w: 1, h: 4, label: 'C02' },
    { id: 'cuadro_03', x: bx(9.64), y: by(0.11), w: 1, h: 4, label: 'C03' },
    { id: 'cuadro_04', x: bx(9.64), y: by(4.35), w: 1, h: 4, label: 'C04' },
    { id: 'armario_01', x: bx(-8.91), y: by(4.71), w: 4, h: 6, label: 'Arm.01' },
    { id: 'tapiz_01', x: bx(2.48), y: by(6.77), w: 4, h: 1, label: 'Tapiz' },
    { id: 'puerta', x: bx(-4.75), y: by(6.98), w: 3, h: 1, label: 'Puerta' },
    { id: 'sofa_01', x: bx(-2), y: by(-0.01), w: 10, h: 5, label: 'Sofá' },
    { id: 'mesa_01', x: bx(-2), y: by(-2), w: 6, h: 4, label: 'Mesa' },
    { id: 'silla_01', x: bx(-5.75), y: by(-1.89), w: 4, h: 4, label: 'Silla 01' },
    { id: 'silla_02', x: bx(-2.48), y: by(-3.96), w: 4, h: 4, label: 'Silla 02' },
    { id: 'alfombra', x: bx(4.69), y: by(1.31), w: 14, h: 10, label: 'Alfombra' },
    { id: 'ventana_01', x: bx(-4.52), y: by(-6.85), w: 4, h: 1, label: 'V01' },
    { id: 'ventana_02', x: bx(3.38), y: by(-6.85), w: 4, h: 1, label: 'V02' },
  ]

  // Puntos del mapa de calor con coordenadas reales
  const puntosTemperatura = [
    // Sur (Y positivo en Blender) = caliente
    { x: bx(-4.75), y: by(6.98), color: 'rgba(255,0,0,0.7)', r: 120 },   // puerta sur
    { x: bx(2.48), y: by(6.77), color: 'rgba(255,50,0,0.6)', r: 100 },   // tapiz sur
    // Este (X positivo en Blender) = caliente
    { x: bx(9.64), y: by(0.11), color: 'rgba(255,30,0,0.65)', r: 130 },  // cuadros este
    // Norte (Y negativo en Blender) = frío (ventanas)
    { x: bx(-4.52), y: by(-6.85), color: 'rgba(0,68,255,0.7)', r: 110 }, // ventana 01
    { x: bx(3.38), y: by(-6.85), color: 'rgba(0,68,255,0.7)', r: 110 },  // ventana 02
    // Oeste (X negativo en Blender) = frío
    { x: bx(-9.88), y: by(0.11), color: 'rgba(0,80,255,0.65)', r: 120 }, // cuadro 01 oeste
    { x: bx(-8.91), y: by(4.71), color: 'rgba(0,100,255,0.6)', r: 100 }, // armario oeste
    // Centro = templado
    { x: bx(0), y: by(0), color: 'rgba(68,200,68,0.5)', r: 100 },
  ]

  const puntosHumedad = [
    // Norte = muy húmedo (ventanas)
    { x: bx(-4.52), y: by(-6.85), color: 'rgba(0,34,255,0.75)', r: 130 },
    { x: bx(3.38), y: by(-6.85), color: 'rgba(0,34,255,0.75)', r: 130 },
    { x: bx(0), y: by(-5), color: 'rgba(0,68,255,0.5)', r: 100 },
    // Sur = seco
    { x: bx(-4.75), y: by(6.98), color: 'rgba(255,170,0,0.65)', r: 110 },
    { x: bx(2.48), y: by(6.77), color: 'rgba(255,150,0,0.6)', r: 100 },
    // Centro
    { x: bx(0), y: by(0), color: 'rgba(0,170,255,0.4)', r: 90 },
  ]

  const puntos = tipo === 'calor-temperatura' ? puntosTemperatura : puntosHumedad
  const titulo = tipo === 'calor-temperatura' ? 'Mapa de calor — Temperatura' : 'Mapa de calor — Humedad'

  const leyenda = tipo === 'calor-temperatura'
    ? [
        { color: '#0044ff', label: 'Frío (16-18°C)' },
        { color: '#44cc44', label: 'Templado (19-21°C)' },
        { color: '#ff6600', label: 'Cálido (22-24°C)' },
        { color: '#ff0000', label: 'Caliente (25°C+)' },
      ]
    : [
        { color: '#0022ff', label: 'Muy húmedo (70%+)' },
        { color: '#0088ff', label: 'Húmedo (55-70%)' },
        { color: '#00aaff', label: 'Normal (40-55%)' },
        { color: '#ffaa00', label: 'Seco (-40%)' },
      ]

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#e8e8e5',
      padding: '16px',
      gap: '10px',
    }}>

      <p style={{
        fontFamily: 'Playfair Display, serif',
        fontSize: '1rem',
        color: '#051d39',
        letterSpacing: '2px',
        textTransform: 'uppercase',
      }}>{titulo}</p>

      {/* Plano de la sala */}
      <div style={{
        position: 'relative',
        width: '560px',
        height: '392px',
        border: '2px solid #051d39',
        backgroundColor: '#f5f0e8',
        overflow: 'hidden',
        flexShrink: 0,
      }}>

        {/* Mapa de calor con canvas SVG */}
        <svg style={{
          position: 'absolute',
          top: 0, left: 0,
          width: '100%', height: '100%',
          zIndex: 1,
        }}>
          <defs>
            {puntos.map((p, i) => (
              <radialGradient key={i} id={`grad${i}`} cx="50%" cy="50%" r="50%">
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
              fill={`url(#grad${i})`}
            />
          ))}
        </svg>

        {/* Etiquetas paredes */}
        <div style={{ position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: '#051d39', zIndex: 3, fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}>NORTE</div>
        <div style={{ position: 'absolute', bottom: 3, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', color: '#051d39', zIndex: 3, fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}>SUR</div>
        <div style={{ position: 'absolute', left: 3, top: '50%', transform: 'translateY(-50%) rotate(-90deg)', fontSize: '0.6rem', color: '#051d39', zIndex: 3, fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}>OESTE</div>
        <div style={{ position: 'absolute', right: 3, top: '50%', transform: 'translateY(-50%) rotate(90deg)', fontSize: '0.6rem', color: '#051d39', zIndex: 3, fontFamily: 'Inter, sans-serif', letterSpacing: '1px' }}>ESTE</div>

        {/* Piezas */}
        {piezas.map((pieza) => (
          <div key={pieza.id} style={{
            position: 'absolute',
            left: `${pieza.x}%`,
            top: `${pieza.y}%`,
            width: `${pieza.w}%`,
            height: `${pieza.h}%`,
            border: '1px solid rgba(5,29,57,0.6)',
            backgroundColor: 'rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.5rem',
            color: '#051d39',
            fontFamily: 'Inter, sans-serif',
            zIndex: 2,
            whiteSpace: 'nowrap',
          }}>
            {pieza.label}
          </div>
        ))}
      </div>

      {/* Leyenda */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {leyenda.map((item) => (
          <div key={item.label} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '0.75rem', fontFamily: 'Inter, sans-serif', color: '#051d39',
          }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }} />
            {item.label}
          </div>
        ))}
      </div>

    </div>
  )
}

export default MapaCenital
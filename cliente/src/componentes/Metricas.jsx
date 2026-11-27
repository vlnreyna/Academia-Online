function calcularMetricas(tickets) {
  const contar = (estados) => tickets.filter((ticket) => estados.includes(ticket.estado)).length
  return [
    { clave: 'total', texto: 'Total', valor: tickets.length },
    { clave: 'abiertos', texto: 'Abiertos', valor: contar(['ABIERTO']) },
    { clave: 'curso', texto: 'En curso', valor: contar(['EN_CURSO', 'PENDIENTE_CLIENTE']) },
    { clave: 'resueltos', texto: 'Resueltos o cerrados', valor: contar(['RESUELTO', 'CERRADO']) },
  ]
}

export default function Metricas({ tickets }) {
  return (
    <dl className="metricas">
      {calcularMetricas(tickets).map((metrica) => (
        <div key={metrica.clave} className={`metrica metrica-${metrica.clave}`}>
          <dt>{metrica.texto}</dt>
          <dd>{metrica.valor}</dd>
        </div>
      ))}
    </dl>
  )
}

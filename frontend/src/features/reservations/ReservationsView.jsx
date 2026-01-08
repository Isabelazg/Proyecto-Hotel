import { ReservationCard } from './components/ReservationCard'
import { useReservations } from './hooks/useReservations'

export function ReservationsView() {
  const { reservations, isLoading, error } = useReservations()

  if (isLoading) {
    return <div className="p-6">Cargando reservaciones...</div>
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Reservaciones</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((reservation) => (
          <ReservationCard key={reservation.id} reservation={reservation} />
        ))}
      </div>
    </div>
  )
}

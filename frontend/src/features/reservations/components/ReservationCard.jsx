export function ReservationCard({ reservation }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">{reservation.guestName}</h3>
      <p className="text-gray-600">Habitación: {reservation.roomNumber}</p>
      <p className="text-gray-600">Check-in: {reservation.checkIn}</p>
      <p className="text-gray-600">Check-out: {reservation.checkOut}</p>
    </div>
  )
}

export function ReservationCard({ reservation }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg border-2 border-emerald-200/50 p-8 rounded-3xl shadow-xl shadow-black/10 hover:shadow-2xl hover:border-emerald-300 hover:scale-[1.02] transition-all duration-300">
      <h3 className="text-xl font-light tracking-wide text-emerald-950 mb-4">{reservation.guestName}</h3>
      <div className="space-y-2">
        <p className="text-gray-700 font-light">
          <span className="text-emerald-700 font-medium">Habitación:</span> {reservation.roomNumber}
        </p>
        <p className="text-gray-700 font-light">
          <span className="text-emerald-700 font-medium">Check-in:</span> {reservation.checkIn}
        </p>
        <p className="text-gray-700 font-light">
          <span className="text-emerald-700 font-medium">Check-out:</span> {reservation.checkOut}
        </p>
      </div>
    </div>
  )
}

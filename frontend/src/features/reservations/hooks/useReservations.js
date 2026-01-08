import { useState, useEffect } from 'react'
import { getReservations } from '../services/reservations.api'

export function useReservations() {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async () => {
    setIsLoading(true)
    try {
      const data = await getReservations()
      setReservations(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return { reservations, isLoading, error, refetch: loadReservations }
}

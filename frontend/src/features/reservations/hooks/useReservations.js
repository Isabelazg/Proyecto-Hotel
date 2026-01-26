import { useState, useEffect } from 'react'
import { 
  getReservations, 
  createReservation, 
  updateReservation, 
  deleteReservation,
  startReservation,
  finalizeReservation 
} from '../services/reservations.api'

export function useReservations(params = {}) {
  const [reservations, setReservations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    loadReservations()
  }, [])

  const loadReservations = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getReservations({ ...params, ...filters })
      // El backend devuelve { data, meta, links }
      const reservasData = response.data || response
      // Asegurar que hospedaje_id esté en el nivel superior para facilitar la edición
      const reservasMapped = Array.isArray(reservasData) 
        ? reservasData.map(r => ({
            ...r,
            hospedaje_id: r.hospedaje_id || r.hospedaje?.id
          }))
        : reservasData
      setReservations(reservasMapped)
      setMeta(response.meta || null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error('Error loading reservations:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const create = async (data) => {
    try {
      await createReservation(data)
      await loadReservations()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.detail || err.message
      console.error('Error creating reservation:', err.response?.data)
      throw new Error(errorMsg)
    }
  }

  const update = async (id, data) => {
    try {
      await updateReservation(id, data)
      await loadReservations()
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message)
    }
  }

  const remove = async (id) => {
    try {
      await deleteReservation(id)
      await loadReservations()
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message)
    }
  }

  const start = async (id) => {
    try {
      await startReservation(id)
      await loadReservations()
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message)
    }
  }

  const finalize = async (id) => {
    try {
      await finalizeReservation(id)
      await loadReservations()
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message)
    }
  }

  return { 
    reservations, 
    isLoading, 
    error, 
    meta,
    refetch: loadReservations,
    create,
    update,
    remove,
    start,
    finalize
  }
}

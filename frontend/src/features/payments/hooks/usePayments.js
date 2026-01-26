import { useState, useEffect } from 'react'
import { getPayments, createPayment, updatePayment, deletePayment } from '../services/payments.api'

export function usePayments() {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)

  const loadPayments = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getPayments({ limit: 100, ...filters })
      setPayments(response.data || [])
      setMeta(response.meta || null)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar pagos'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const create = async (data) => {
    try {
      await createPayment(data)
      await loadPayments()
    } catch (err) {
      // Extraer mensaje de error detallado
      let errorMessage = 'Error al crear pago'
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Errores de validación o del servicio
        const firstError = err.response.data.errors[0]
        errorMessage = firstError?.detail || firstError?.msg || err.response.data.message
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      throw new Error(errorMessage)
    }
  }

  const update = async (id, data) => {
    try {
      await updatePayment(id, data)
      await loadPayments()
    } catch (err) {
      // Extraer mensaje de error detallado
      let errorMessage = 'Error al actualizar pago'
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const firstError = err.response.data.errors[0]
        errorMessage = firstError?.detail || firstError?.msg || err.response.data.message
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }
      
      throw new Error(errorMessage)
    }
  }

  const remove = async (id) => {
    try {
      await deletePayment(id)
      await loadPayments()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al eliminar pago'
      throw new Error(errorMessage)
    }
  }

  const refetch = () => loadPayments()

  return {
    payments,
    isLoading,
    error,
    meta,
    refetch,
    create,
    update,
    remove
  }
}

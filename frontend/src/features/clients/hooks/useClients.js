import { useState, useEffect } from 'react'
import { getClients, createClient, updateClient, deleteClient } from '../services/clients.api'

export function useClients() {
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)

  const loadClients = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getClients({ limit: 100, ...filters })
      setClients(response.data || [])
      setMeta(response.meta || null)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al cargar clientes'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadClients()
  }, [])

  const create = async (data) => {
    try {
      await createClient(data)
      await loadClients()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0]?.msg ||
                          err.message || 
                          'Error al crear cliente'
      throw new Error(errorMessage)
    }
  }

  const update = async (id, data) => {
    try {
      await updateClient(id, data)
      await loadClients()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.errors?.[0]?.msg ||
                          err.message || 
                          'Error al actualizar cliente'
      throw new Error(errorMessage)
    }
  }

  const remove = async (id) => {
    try {
      await deleteClient(id)
      await loadClients()
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          'Error al eliminar cliente'
      throw new Error(errorMessage)
    }
  }

  const refetch = () => loadClients()

  return {
    clients,
    isLoading,
    error,
    meta,
    refetch,
    create,
    update,
    remove
  }
}

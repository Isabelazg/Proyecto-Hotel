import { useState, useEffect } from 'react'
import { 
  getUnits, 
  createUnit, 
  updateUnit, 
  deleteUnit 
} from '../services/units.api'

export function useUnits(params = {}) {
  const [units, setUnits] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    loadUnits()
  }, [])

  const loadUnits = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getUnits({ ...params, ...filters })
      // El backend devuelve { data, meta, links }
      setUnits(response.data || response)
      setMeta(response.meta || null)
    } catch (err) {
      setError(err.response?.data?.message || err.message)
      console.error('Error loading units:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const create = async (data) => {
    try {
      await createUnit(data)
      await loadUnits()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.detail || err.message
      console.error('Error creating unit:', err.response?.data)
      throw new Error(errorMsg)
    }
  }

  const update = async (id, data) => {
    try {
      await updateUnit(id, data)
      await loadUnits()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.detail || err.message
      console.error('Error updating unit:', err.response?.data)
      throw new Error(errorMsg)
    }
  }

  const remove = async (id) => {
    try {
      await deleteUnit(id)
      await loadUnits()
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.detail || err.message
      console.error('Error deleting unit:', err.response?.data)
      throw new Error(errorMsg)
    }
  }

  return { 
    units, 
    isLoading, 
    error, 
    meta,
    refetch: loadUnits,
    create,
    update,
    remove
  }
}

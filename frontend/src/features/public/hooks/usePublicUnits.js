import { useState, useEffect } from 'react'
import { getAvailableUnits, getUnitDetails, getUnitTypes } from '../services/public.api'

export const usePublicUnits = (filters = {}) => {
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true)
        const response = await getAvailableUnits(filters)
        setUnits(response.data || [])
        setPagination(response.pagination || null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUnits()
  }, [JSON.stringify(filters)])

  return { units, loading, error, pagination }
}

export const useUnitDetails = (id) => {
  const [unit, setUnit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchUnit = async () => {
      try {
        setLoading(true)
        const response = await getUnitDetails(id)
        setUnit(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUnit()
  }, [id])

  return { unit, loading, error }
}

export const useUnitTypes = () => {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setLoading(true)
        const response = await getUnitTypes()
        setTypes(response.data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTypes()
  }, [])

  return { types, loading, error }
}

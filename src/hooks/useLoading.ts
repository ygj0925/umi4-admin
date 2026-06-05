import { useState, useCallback } from 'react'

export function useLoading(initial = false) {
  const [loading, setLoading] = useState(initial)
  const startLoading = useCallback(() => setLoading(true), [])
  const stopLoading = useCallback(() => setLoading(false), [])
  const toggleLoading = useCallback(() => setLoading((prev) => !prev), [])
  return { loading, setLoading, startLoading, stopLoading, toggleLoading }
}

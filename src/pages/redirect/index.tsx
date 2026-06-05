import React, { useEffect } from 'react'
import { useParams, history } from 'umi'

export default function RedirectPage() {
  const params = useParams()
  useEffect(() => {
    if (params.path) {
      history.replace(`/${params.path}`)
    } else {
      history.replace('/')
    }
  }, [])
  return null
}

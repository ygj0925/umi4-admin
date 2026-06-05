import { useState, useEffect } from 'react'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

const breakpointMap: Record<Breakpoint, number> = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('xl')
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth
      setWidth(w)
      if (w < breakpointMap.xs) setBreakpoint('xs')
      else if (w < breakpointMap.sm) setBreakpoint('sm')
      else if (w < breakpointMap.md) setBreakpoint('md')
      else if (w < breakpointMap.lg) setBreakpoint('lg')
      else if (w < breakpointMap.xl) setBreakpoint('xl')
      else setBreakpoint('xxl')
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm'
  const isTablet = breakpoint === 'md'
  const isDesktop = !isMobile && !isTablet

  return { breakpoint, width, isMobile, isTablet, isDesktop }
}

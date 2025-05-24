import { useState, useEffect } from 'react'

interface Breakpoints {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  xxl: number
}

const breakpoints: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}

type BreakpointKey = keyof Breakpoints

export function useResponsive() {
  const [width, setWidth] = useState<number>(window.innerWidth)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isBreakpoint = (breakpoint: BreakpointKey) => {
    return width >= breakpoints[breakpoint]
  }

  const isBreakpointDown = (breakpoint: BreakpointKey) => {
    return width < breakpoints[breakpoint]
  }

  const isBreakpointBetween = (start: BreakpointKey, end: BreakpointKey) => {
    return width >= breakpoints[start] && width < breakpoints[end]
  }

  return {
    width,
    isBreakpoint,
    isBreakpointDown,
    isBreakpointBetween,
    breakpoints
  }
}

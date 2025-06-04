declare module 'react-360-view' {
  interface React360ViewProps {
    count: number
    imagePath: string[]
    fileName: string
    autoplay?: boolean
    loop?: boolean
    width?: number | string
    height?: number | string
  }

  const React360View: React.FC<React360ViewProps>
  export default React360View
}

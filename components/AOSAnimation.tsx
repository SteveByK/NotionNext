import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'

declare global {
  interface Window {
    AOS?: {
      init: () => void
    }
  }
}

const AOSAnimation: React.FC = () => {
  useEffect(() => {
    const initAOS = async () => {
      try {
        await Promise.all([
          loadExternalResource('/js/aos.js', 'js'),
          loadExternalResource('/css/aos.css', 'css')
        ])
        window.AOS?.init()
      } catch (error) {
        console.error('Failed to initialize AOS:', error)
      }
    }

    initAOS()
  }, [])

  return null
}

export default AOSAnimation
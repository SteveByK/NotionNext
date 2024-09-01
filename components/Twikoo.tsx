import React, { useEffect, useRef } from 'react'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

interface TwikooProps {
  isDarkMode?: boolean;
}

declare global {
  interface Window {
    twikoo?: {
      init: (config: TwikooConfig) => void
    }
  }
}

interface TwikooConfig {
  envId: string
  el: string
  lang: string
}

/**
 * Twikoo comment component
 * @see https://twikoo.js.org/
 */
const Twikoo: React.FC<TwikooProps> = ({ isDarkMode }) => {
  const isInitRef = useRef(false)
  
  const envId = siteConfig('COMMENT_TWIKOO_ENV_ID')
  const el = siteConfig('COMMENT_TWIKOO_ELEMENT_ID', '#twikoo')
  const twikooCDNURL = siteConfig('COMMENT_TWIKOO_CDN_URL')
  const lang = siteConfig('LANG')

  const loadTwikoo = async () => {
    if (isInitRef.current) return

    try {
      await loadExternalResource(twikooCDNURL, 'js')
      const twikoo = window.twikoo
      if (twikoo && typeof twikoo.init === 'function') {
        twikoo.init({
          envId,
          el,
          lang
        })
        console.log('Twikoo initialized')
        isInitRef.current = true
      }
    } catch (error) {
      console.error('Failed to load Twikoo:', error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (isInitRef.current) {
        clearInterval(interval)
      } else {
        loadTwikoo()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isDarkMode])

  return <div id="twikoo" />
}

export default Twikoo
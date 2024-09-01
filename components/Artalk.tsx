import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'

interface ArtalkProps {
  siteInfo?: any // Consider defining a more specific type for siteInfo
}

declare global {
  interface Window {
    Artalk?: {
      init: (config: ArtalkConfig) => void
    }
  }
}

interface ArtalkConfig {
  server: string
  el: string
  locale: string
  site: string
}

const Artalk: React.FC<ArtalkProps> = ({ siteInfo }) => {
  const artalkCss = siteConfig('COMMENT_ARTALK_CSS')
  const artalkServer = siteConfig('COMMENT_ARTALK_SERVER')
  const artalkLocale = siteConfig('LANG')
  const site = siteConfig('TITLE')

  useEffect(() => {
    const initArtalk = async () => {
      try {
        await loadExternalResource(artalkCss, 'css')
        window.Artalk?.init({
          server: artalkServer,
          el: '#artalk',
          locale: artalkLocale,
          site: site
        })
      } catch (error) {
        console.error('Failed to initialize Artalk:', error)
      }
    }

    initArtalk()
  }, [artalkCss, artalkServer, artalkLocale, site])

  return <div id="artalk" />
}

export default Artalk
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import { loadExternalResource } from '@/lib/utils'
import { siteConfig } from '@/lib/config'

interface CusdisProps {
  frontMatter: {
    id: string
    title: string
  }
}

declare global {
  interface Window {
    CUSDIS?: {
      initial: () => void
    }
  }
}

const CusdisComponent: React.FC<CusdisProps> = ({ frontMatter }) => {
  const router = useRouter()
  const { isDarkMode, lang } = useGlobal()
  const src = siteConfig('COMMENT_CUSDIS_SCRIPT_SRC')
  const i18nForCusdis = siteConfig('LANG').toLowerCase().startsWith('zh')
    ? siteConfig('LANG').toLowerCase()
    : siteConfig('LANG').toLowerCase().substring(0, 2)
  const langCDN = siteConfig(
    'COMMENT_CUSDIS_LANG_SRC',
    `https://cusdis.com/js/widget/lang/${i18nForCusdis}.js`
  )

  useEffect(() => {
    const loadCusdis = async () => {
      try {
        await loadExternalResource(langCDN, 'js')
        await loadExternalResource(src, 'js')
        window.CUSDIS?.initial()
      } catch (error) {
        console.error('Failed to load Cusdis:', error)
      }
    }

    loadCusdis()
  }, [isDarkMode, lang, langCDN, src])

  return (
    <div
      id="cusdis_thread"
      data-host={siteConfig('COMMENT_CUSDIS_HOST')}
      data-app-id={siteConfig('COMMENT_CUSDIS_APP_ID')}
      data-page-id={frontMatter.id}
      data-page-url={`${siteConfig('LINK')}${router.asPath}`}
      data-page-title={frontMatter.title}
      data-theme={isDarkMode ? 'dark' : 'light'}
      data-lang={lang.toLowerCase()}
    />
  )
}

export default CusdisComponent
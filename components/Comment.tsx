import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Tabs from '@/components/Tabs'
import { siteConfig } from '@/lib/config'
import { isBrowser, isSearchEngineBot } from '@/lib/utils'
import Artalk from './Artalk'

// Dynamic imports for comment components
const WalineComponent = dynamic(() => import('@/components/WalineComponent'), { ssr: false })
const CusdisComponent = dynamic(() => import('@/components/CusdisComponent'), { ssr: false })
const TwikooComponent = dynamic(() => import('@/components/Twikoo'), { ssr: false })
const GitalkComponent = dynamic(() => import('@/components/Gitalk'), { ssr: false })
const UtterancesComponent = dynamic(() => import('@/components/Utterances'), { ssr: false })
const GiscusComponent = dynamic(() => import('@/components/Giscus'), { ssr: false })
const WebMentionComponent = dynamic(() => import('@/components/WebMention'), { ssr: false })
const ValineComponent = dynamic(() => import('@/components/ValineComponent'), { ssr: false })

interface CommentProps {
  frontMatter: {
    id: string
    comment?: string
  }
  className?: string
}

const Comment: React.FC<CommentProps> = ({ frontMatter, className }) => {
  const router = useRouter()
  const [shouldLoad, setShouldLoad] = useState(false)
  const commentRef = useRef<HTMLDivElement>(null)

  const commentConfig = {
    ARTALK_SERVER: siteConfig('COMMENT_ARTALK_SERVER'),
    TWIKOO_ENV_ID: siteConfig('COMMENT_TWIKOO_ENV_ID'),
    WALINE_SERVER_URL: siteConfig('COMMENT_WALINE_SERVER_URL'),
    VALINE_APP_ID: siteConfig('COMMENT_VALINE_APP_ID'),
    GISCUS_REPO: siteConfig('COMMENT_GISCUS_REPO'),
    CUSDIS_APP_ID: siteConfig('COMMENT_CUSDIS_APP_ID'),
    UTTERRANCES_REPO: siteConfig('COMMENT_UTTERRANCES_REPO'),
    GITALK_CLIENT_ID: siteConfig('COMMENT_GITALK_CLIENT_ID'),
    WEBMENTION_ENABLE: siteConfig('COMMENT_WEBMENTION_ENABLE')
  }

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer.unobserve(entry.target)
        }
      })
    })

    if (commentRef.current) {
      observer.observe(commentRef.current)
    }

    return () => {
      if (commentRef.current) {
        observer.unobserve(commentRef.current)
      }
    }
  }, [frontMatter])

  useEffect(() => {
    if (isBrowser && ('giscus' in router.query || router.query.target === 'comment')) {
      setTimeout(() => {
        const url = router.asPath.replace('?target=comment', '')
        history.replaceState({}, '', url)
        document.getElementById('comment')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }, 1000)
    }
  }, [router])

  if (!frontMatter) {
    return <div>Loading...</div>
  }

  if (isSearchEngineBot() || frontMatter?.comment === 'Hide') {
    return null
  }

  return (
    <div id='comment' ref={commentRef} className={`comment mt-5 text-gray-800 dark:text-gray-300 ${className || ''}`}>
      {!shouldLoad ? (
        <div className='text-center'>
          Loading...
          <i className='fas fa-spinner animate-spin text-3xl' />
        </div>
      ) : (
        <Tabs>
          {commentConfig.ARTALK_SERVER && (
            <div key='Artalk'>
              <Artalk />
            </div>
          )}
          {commentConfig.TWIKOO_ENV_ID && (
            <div key='Twikoo'>
              <TwikooComponent />
            </div>
          )}
          {commentConfig.WALINE_SERVER_URL && (
            <div key='Waline'>
              <WalineComponent />
            </div>
          )}
          {commentConfig.VALINE_APP_ID && (
            <div key='Valine' name='reply'>
              <ValineComponent path={frontMatter.id} />
            </div>
          )}
          {commentConfig.GISCUS_REPO && (
            <div key='Giscus'>
              <GiscusComponent className='px-2' />
            </div>
          )}
          {commentConfig.CUSDIS_APP_ID && (
            <div key='Cusdis'>
              <CusdisComponent frontMatter={frontMatter} />
            </div>
          )}
          {commentConfig.UTTERRANCES_REPO && (
            <div key='Utterance'>
              <UtterancesComponent issueTerm={frontMatter.id} className='px-2' />
            </div>
          )}
          {commentConfig.GITALK_CLIENT_ID && (
            <div key='GitTalk'>
              <GitalkComponent frontMatter={frontMatter} />
            </div>
          )}
          {commentConfig.WEBMENTION_ENABLE && (
            <div key='WebMention'>
              <WebMentionComponent frontMatter={frontMatter} className='px-2' />
            </div>
          )}
        </Tabs>
      )}
    </div>
  )
}

export default Comment
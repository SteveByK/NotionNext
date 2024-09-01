import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useGlobal } from '@/lib/global'
import busuanzi from '@/lib/plugins/busuanzi'

const Busuanzi: React.FC = () => {
  const { theme } = useGlobal()
  const router = useRouter()

  useEffect(() => {
    let path = ''

    const handleRouteChange = (url: string) => {
      if (url !== path) {
        path = url
        busuanzi.fetch()
      }
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    // Initial fetch
    busuanzi.fetch()

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router])

  useEffect(() => {
    if (theme) {
      busuanzi.fetch()
    }
  }, [theme])

  return null
}

export default Busuanzi
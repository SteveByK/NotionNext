'use client'

import { useEffect } from 'react'
import { loadExternalResource } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/lib/config'

interface AckeeEnvironment {
  server: string
  domainId: string
}

interface AckeeOptions {
  detailed: boolean
  ignoreLocalhost: boolean
  ignoreOwnVisits: boolean
}

const Ackee: React.FC = () => {
  const pathname = usePathname()
  const server = siteConfig('ANALYTICS_ACKEE_DATA_SERVER')
  const domainId = siteConfig('ANALYTICS_ACKEE_DOMAIN_ID')

  useEffect(() => {
    handleAckeeCallback()
  }, [pathname])

  const handleAckeeCallback = () => {
    handleAckee(
      pathname,
      {
        server,
        domainId
      },
      {
        detailed: true,
        ignoreLocalhost: false,
        ignoreOwnVisits: false
      }
    )
  }

  return null
}

export default Ackee

const handleAckee = async (
  pathname: string | null,
  environment: AckeeEnvironment,
  options: AckeeOptions = {
    detailed: false,
    ignoreLocalhost: false,
    ignoreOwnVisits: false
  }
): Promise<(() => void) | undefined> => {
  await loadExternalResource(siteConfig('ANALYTICS_ACKEE_TRACKER'), 'js')
  const ackeeTracker = (window as any).ackeeTracker

  const instance = ackeeTracker?.create(environment.server, options)

  if (instance == null) {
    console.warn('Skipped record creation because useAckee has been called in a non-browser environment')
    return
  }

  const hasPathname = pathname != null && pathname !== ''

  if (!hasPathname) {
    console.warn('Skipped record creation because useAckee has been called without pathname')
    return
  }

  const attributes = ackeeTracker?.attributes(options.detailed)
  const url = new URL(pathname, window.location.href)

  return instance.record(environment.domainId, {
    ...attributes,
    siteLocation: url.href
  }).stop
}
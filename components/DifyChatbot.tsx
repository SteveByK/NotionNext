import React, { useEffect } from 'react'
import { siteConfig } from '@/lib/config'

interface DifyChatbotConfig {
  token: string
  baseUrl: string
}

declare global {
  interface Window {
    difyChatbotConfig?: DifyChatbotConfig
  }
}

const DifyChatbot: React.FC = () => {
  useEffect(() => {
    const DIFY_ENABLED = siteConfig('DIFY_CHATBOT_ENABLED')
    const DIFY_TOKEN = siteConfig('DIFY_CHATBOT_TOKEN')
    const DIFY_BASE_URL = siteConfig('DIFY_CHATBOT_BASE_URL')

    if (!DIFY_ENABLED) {
      return
    }

    // Configure DifyChatbot
    window.difyChatbotConfig = {
      token: DIFY_TOKEN,
      baseUrl: DIFY_BASE_URL
    }

    // Load DifyChatbot script
    const script = document.createElement('script')
    script.src = `${DIFY_BASE_URL}/embed.min.js`
    script.id = DIFY_TOKEN
    script.defer = true
    document.body.appendChild(script)

    return () => {
      // Clean up script tag on component unmount
      const existingScript = document.getElementById(DIFY_TOKEN)
      if (existingScript?.parentNode) {
        existingScript.parentNode.removeChild(existingScript)
      }
    }
  }, []) // Empty dependency array means this effect runs once on mount

  return null
}

export default DifyChatbot
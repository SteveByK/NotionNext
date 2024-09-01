import React from 'react'
import { siteConfig } from '@/lib/config'

/**
 * This is an embedded component that can display your chat-base dialog box in full screen at any location.
 * Currently not referenced by any page.
 * You can directly embed this in your Notion using the inline web page method:
 * https://www.chatbase.co/chatbot-iframe/${siteConfig('CHATBASE_ID')}
 */
const ChatBase: React.FC = () => {
  const chatbaseId = siteConfig('CHATBASE_ID')

  if (!chatbaseId) {
    return null
  }

  return (
    <iframe
      src={`https://www.chatbase.co/chatbot-iframe/${chatbaseId}`}
      width="100%"
      style={{ height: '100%', minHeight: '700px' }}
      frameBorder="0"
      title="ChatBase Dialog"
    />
  )
}

export default ChatBase
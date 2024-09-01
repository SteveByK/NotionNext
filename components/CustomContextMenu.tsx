import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useWindowSize from '@/hooks/useWindowSize'
import { useGlobal } from '@/lib/global'
import { siteConfig } from '@/lib/config'
import { THEMES, saveDarkModeToLocalStorage } from '@/themes/theme'

interface CustomContextMenuProps {
  allNavPages: Array<{ slug: string }>
}

const CustomContextMenu: React.FC<CustomContextMenuProps> = ({ allNavPages }) => {
  const [position, setPosition] = useState({ x: '0px', y: '0px' })
  const [show, setShow] = useState(false)
  const { isDarkMode, updateDarkMode, locale } = useGlobal()
  const menuRef = useRef<HTMLDivElement>(null)
  const windowSize = useWindowSize()
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const router = useRouter()

  useLayoutEffect(() => {
    if (menuRef.current) {
      setWidth(menuRef.current.offsetWidth)
      setHeight(menuRef.current.offsetHeight)
    }
  }, [])

  useEffect(() => {
    setShow(false)
  }, [router])

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault()
      const x = Math.min(event.clientX, windowSize.width - width)
      const y = Math.min(event.clientY, windowSize.height - height)
      setPosition({ y: `${y}px`, x: `${x}px` })
      setShow(true)
    }

    const handleClick = () => setShow(false)

    window.addEventListener('contextmenu', handleContextMenu)
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
      window.removeEventListener('click', handleClick)
    }
  }, [windowSize, width, height])

  const handleJumpToRandomPost = () => {
    const randomPost = allNavPages[Math.floor(Math.random() * allNavPages.length)]
    router.push(`${siteConfig('SUB_PATH', '')}/${randomPost?.slug}`)
  }

  const handleBack = () => window.history.back()
  const handleForward = () => window.history.forward()
  const handleRefresh = () => window.location.reload()
  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleCopyLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
      .then(() => alert(`${locale.COMMON.PAGE_URL_COPIED} : ${url}`))
      .catch(error => console.error('Failed to copy page URL:', error))
  }

  const handleChangeTheme = () => {
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)]
    router.push({ pathname: router.pathname, query: { ...router.query, theme: randomTheme } })
  }

  const handleCopy = () => {
    const selectedText = window.getSelection()?.toString()
    if (selectedText) {
      navigator.clipboard.writeText(selectedText)
        .then(() => console.log("Text copied"))
        .catch(err => console.error("Failed to copy text:", err))
    }
  }

  const handleChangeDarkMode = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    document.documentElement.classList.toggle('dark', newStatus)
    document.documentElement.classList.toggle('light', !newStatus)
  }

  // Configuration variables
  const CONFIG = {
    RANDOM_POST: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU_RANDOM_POST'),
    CATEGORY: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU_CATEGORY'),
    TAG: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU_TAG'),
    CAN_COPY: siteConfig('CAN_COPY'),
    SHARE_LINK: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU_SHARE_LINK'),
    DARK_MODE: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU_DARK_MODE'),
    THEME_SWITCH: siteConfig('CUSTOM_RIGHT_CLICK_CONTEXT_MENU_THEME_SWITCH')
  }

  return (
    <div
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className={`${show ? '' : 'invisible opacity-0'} select-none transition-opacity duration-200 fixed z-50`}
    >
      {/* Menu content */}
      <div className='rounded-xl w-52 dark:hover:border-yellow-600 bg-white dark:bg-[#040404] dark:text-gray-200 dark:border-gray-600 p-3 border drop-shadow-lg flex-col duration-300 transition-colors'>
        {/* Navigation buttons */}
        <div className='flex justify-between'>
          {[
            { icon: 'fa-arrow-left', onClick: handleBack },
            { icon: 'fa-arrow-right', onClick: handleForward },
            { icon: 'fa-rotate-right', onClick: handleRefresh },
            { icon: 'fa-arrow-up', onClick: handleScrollTop }
          ].map((button, index) => (
            <i
              key={index}
              onClick={button.onClick}
              className={`hover:bg-blue-600 hover:text-white px-2 py-2 text-center w-8 rounded cursor-pointer fa-solid ${button.icon}`}
            />
          ))}
        </div>

        <hr className='my-2 border-dashed' />

        {/* Jump navigation buttons */}
        <div className='w-full px-2'>
          {CONFIG.RANDOM_POST && (
            <div
              onClick={handleJumpToRandomPost}
              title={locale.MENU.WALK_AROUND}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className='fa-solid fa-podcast mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.WALK_AROUND}</div>
            </div>
          )}

          {CONFIG.CATEGORY && (
            <Link
              href='/category'
              title={locale.MENU.CATEGORY}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className='fa-solid fa-square-minus mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.CATEGORY}</div>
            </Link>
          )}

          {CONFIG.TAG && (
            <Link
              href='/tag'
              title={locale.MENU.TAGS}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className='fa-solid fa-tag mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.TAGS}</div>
            </Link>
          )}
        </div>

        <hr className='my-2 border-dashed' />

        {/* Function buttons */}
        <div className='w-full px-2'>
          {CONFIG.CAN_COPY && (
            <div
              onClick={handleCopy}
              title={locale.MENU.COPY}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className='fa-solid fa-copy mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.COPY}</div>
            </div>
          )}

          {CONFIG.SHARE_LINK && (
            <div
              onClick={handleCopyLink}
              title={locale.MENU.SHARE_URL}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className='fa-solid fa-arrow-up-right-from-square mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.SHARE_URL}</div>
            </div>
          )}

          {CONFIG.DARK_MODE && (
            <div
              onClick={handleChangeDarkMode}
              title={isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className={`fa-regular ${isDarkMode ? 'fa-sun' : 'fa-moon'} mr-2`} />
              <div className='whitespace-nowrap'>
                {isDarkMode ? locale.MENU.LIGHT_MODE : locale.MENU.DARK_MODE}
              </div>
            </div>
          )}

          {CONFIG.THEME_SWITCH && (
            <div
              onClick={handleChangeTheme}
              title={locale.MENU.THEME_SWITCH}
              className='w-full px-2 h-10 flex justify-start items-center flex-nowrap cursor-pointer hover:bg-blue-600 hover:text-white rounded-lg duration-200 transition-all'
            >
              <i className='fa-solid fa-palette mr-2' />
              <div className='whitespace-nowrap'>{locale.MENU.THEME_SWITCH}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CustomContextMenu
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Select from './Select'
import { useGlobal } from '@/lib/global'
import { THEMES } from '@/themes/theme'
import { siteConfigMap } from '@/lib/config'
import { getQueryParam } from '@/lib/utils'

interface SiteConfig {
  [key: string]: string | boolean | number
}

const DebugPanel: React.FC = () => {
  const [show, setShow] = useState(false)
  const { theme, switchTheme, locale } = useGlobal()
  const router = useRouter()
  const currentTheme = getQueryParam(router.asPath, 'theme') || theme
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({})

  const themeOptions = THEMES?.map(t => ({ value: t, text: t }))

  useEffect(() => {
    setSiteConfig(siteConfigMap())
  }, [])

  const toggleShow = () => setShow(!show)

  const handleChangeDebugTheme = () => switchTheme()

  const handleUpdateDebugTheme = (newTheme: string) => {
    const query = { ...router.query, theme: newTheme }
    router.push({ pathname: router.pathname, query })
  }

  const filterResult = (text: string) => {
    switch (text) {
      case 'true':
        return <span className='text-green-500'>true</span>
      case 'false':
        return <span className='text-red-500'>false</span>
      case '':
        return '-'
      default:
        return text
    }
  }

  return (
    <>
      {/* Debug button */}
      <div
        style={{ writingMode: 'vertical-lr' }}
        className={`bg-black text-xs text-white shadow-2xl p-1.5 rounded-l-xl cursor-pointer ${show ? 'right-96' : 'right-0'} fixed bottom-72 duration-200 z-50`}
        onClick={toggleShow}
      >
        {show
          ? <i className="fas fa-times">&nbsp;{locale.COMMON.DEBUG_CLOSE}</i>
          : <i className="fas fa-tools">&nbsp;{locale.COMMON.DEBUG_OPEN}</i>}
      </div>

      {/* Debug side drawer */}
      <div
        className={`${show ? 'shadow-card w-96 right-0' : '-right-96 invisible w-0'} overflow-y-scroll h-full p-5 bg-white fixed bottom-0 z-50 duration-200`}
      >
        <div className="flex justify-between space-x-1 my-5">
          <div className='flex'>
            <Select
              label={locale.COMMON.THEME_SWITCH}
              value={currentTheme}
              options={themeOptions}
              onChange={handleUpdateDebugTheme}
            />
            <div className="p-2 cursor-pointer" onClick={handleChangeDebugTheme}>
              <i className="fas fa-sync" />
            </div>
          </div>

          <div className='p-2'>
            <i className='fas fa-times' onClick={toggleShow}/>
          </div>
        </div>

        <div>
          <div className="font-bold w-18 border-b my-2">
            Site Configuration [blog.config.js]
          </div>
          <div className="text-xs">
            {Object.entries(siteConfig).map(([key, value]) => (
              <div key={key} className="justify-between flex py-1">
                <span className="bg-blue-500 p-0.5 rounded text-white mr-2">
                  {key}
                </span>
                <span className="whitespace-nowrap">
                  {filterResult(String(value))}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default DebugPanel
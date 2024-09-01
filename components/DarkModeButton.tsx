import React, { useImperativeHandle, forwardRef } from 'react'
import { useGlobal } from '@/lib/global'
import { Moon, Sun } from './HeroIcons'

interface DarkModeButtonProps {
  className?: string
}

export interface DarkModeButtonRef {
  handleChangeDarkMode: () => void
}

/**
 * Dark mode toggle button
 */
const DarkModeButton = forwardRef<DarkModeButtonRef, DarkModeButtonProps>((props, ref) => {
  const { className = '' } = props
  const { isDarkMode, toggleDarkMode } = useGlobal()

  /**
   * Expose methods to parent component
   */
  useImperativeHandle(ref, () => ({
    handleChangeDarkMode: toggleDarkMode
  }))

  return (
    <div 
      onClick={toggleDarkMode} 
      className={`${className} flex justify-center dark:text-gray-200 text-gray-800`}
    >
      <div 
        id='darkModeButton' 
        className='hover:scale-110 cursor-pointer transform duration-200 w-5 h-5'
      >
        {isDarkMode ? <Sun /> : <Moon />}
      </div>
    </div>
  )
})

DarkModeButton.displayName = 'DarkModeButton'

export default DarkModeButton
import React, { useEffect, useImperativeHandle, useRef } from 'react'

interface CollapseProps {
  type?: 'horizontal' | 'vertical'
  isOpen: boolean
  className?: string
  children: React.ReactNode
  collapseRef?: React.RefObject<CollapseRef>
  onHeightChange?: (params: { height: number; increase: boolean }) => void
}

interface CollapseRef {
  updateCollapseHeight: (params: { height: number; increase: boolean }) => void
}

/**
 * Collapsible panel component, supports horizontal and vertical collapsing
 */
const Collapse: React.FC<CollapseProps> = ({
  type = 'vertical',
  isOpen,
  className = '',
  children,
  collapseRef,
  onHeightChange
}) => {
  const ref = useRef<HTMLDivElement>(null)

  useImperativeHandle(collapseRef, () => ({
    updateCollapseHeight: ({ height, increase }) => {
      if (isOpen && ref.current) {
        ref.current.style.height = `${ref.current.scrollHeight}px`
        ref.current.style.height = 'auto'
      }
    }
  }))

  const collapseSection = (element: HTMLElement) => {
    const sectionHeight = element.scrollHeight
    const sectionWidth = element.scrollWidth

    requestAnimationFrame(() => {
      if (type === 'horizontal') {
        element.style.width = `${sectionWidth}px`
        requestAnimationFrame(() => {
          element.style.width = '0px'
        })
      } else {
        element.style.height = `${sectionHeight}px`
        requestAnimationFrame(() => {
          element.style.height = '0px'
        })
      }
    })
  }

  const expandSection = (element: HTMLElement) => {
    const sectionHeight = element.scrollHeight
    const sectionWidth = element.scrollWidth

    if (type === 'horizontal') {
      element.style.width = `${sectionWidth}px`
      setTimeout(() => {
        element.style.width = 'auto'
      }, 400)
    } else {
      element.style.height = `${sectionHeight}px`
      setTimeout(() => {
        element.style.height = 'auto'
      }, 400)
    }
  }

  useEffect(() => {
    if (!ref.current) return

    if (isOpen) {
      expandSection(ref.current)
    } else {
      collapseSection(ref.current)
    }

    onHeightChange?.({ height: ref.current.scrollHeight, increase: isOpen })
  }, [isOpen, onHeightChange])

  return (
    <div
      ref={ref}
      style={type === 'vertical' ? { height: '0px', willChange: 'height' } : { width: '0px', willChange: 'width' }}
      className={`${className} overflow-hidden duration-200`}
    >
      {children}
    </div>
  )
}

export default Collapse
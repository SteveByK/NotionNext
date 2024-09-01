import React, { useEffect, useRef, useState } from 'react'

interface DraggableProps {
  children: React.ReactNode
  stick?: 'left' | 'right' | 'top' | 'bottom'
}

interface NormalizedEvent {
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  target: EventTarget | null;
  type: string;
  preventDefault: () => void;
}

export const Draggable: React.FC<DraggableProps> = ({ children, stick }) => {
  const draggableRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const [moving, setMoving] = useState(false)
  const currentObjRef = useRef<HTMLElement | null>(null)
  const offsetRef = useRef({ x: 0, y: 0 })

  const normalizeEvent = (event: MouseEvent | TouchEvent): NormalizedEvent => {
    if ('touches' in event) {
      return {
        clientX: event.touches[0].clientX,
        clientY: event.touches[0].clientY,
        pageX: event.touches[0].pageX,
        pageY: event.touches[0].pageY,
        target: event.target,
        type: event.type,
        preventDefault: () => event.preventDefault()
      };
    }
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      target: event.target,
      type: event.type,
      preventDefault: () => event.preventDefault()
    };
  };

  useEffect(() => {
    const inDragBox = (event: NormalizedEvent, drag: Element): boolean => {
      const { clientX, clientY } = event;
      const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = drag.firstElementChild as HTMLElement;
      return (
        clientX > offsetLeft &&
        clientX < offsetLeft + offsetWidth &&
        clientY > offsetTop &&
        clientY < offsetTop + offsetHeight
      );
    };

    const checkInWindow = () => {
      const draggableElements = document.getElementsByClassName('draggable')
      for (const drag of Array.from(draggableElements)) {
        const element = drag.firstElementChild as HTMLElement
        const { offsetHeight, offsetWidth, offsetTop, offsetLeft } = element
        const { clientHeight, clientWidth } = document.documentElement

        element.style.top = `${Math.max(0, Math.min(offsetTop, clientHeight - offsetHeight))}px`
        element.style.left = `${Math.max(0, Math.min(offsetLeft, clientWidth - offsetWidth))}px`

        if (stick === 'left') {
          element.style.left = '0px'
        }
      }
    }

    const updatePosition = (event: NormalizedEvent) => {
      if (currentObjRef.current) {
        const left = event.pageX - offsetRef.current.x
        const top = event.pageY - offsetRef.current.y
        currentObjRef.current.style.left = `${left}px`
        currentObjRef.current.style.top = `${top}px`
        checkInWindow()
      }
    }

    const start = (event: MouseEvent | TouchEvent) => {
      const normalizedEvent = normalizeEvent(event)
      const draggableElements = document.getElementsByClassName('draggable')
      
      for (const drag of Array.from(draggableElements)) {
        if (inDragBox(normalizedEvent, drag)) {
          currentObjRef.current = drag.firstElementChild as HTMLElement
          break
        }
      }

      if (currentObjRef.current) {
        if (normalizedEvent.type.startsWith('touch')) {
          normalizedEvent.preventDefault()
          document.documentElement.style.overflow = 'hidden'
        }

        setMoving(true)
        offsetRef.current = {
          x: normalizedEvent.pageX - currentObjRef.current.offsetLeft,
          y: normalizedEvent.pageY - currentObjRef.current.offsetTop
        }

        document.addEventListener('mousemove', move)
        document.addEventListener('touchmove', move)
        document.addEventListener('mouseup', stop)
        document.addEventListener('touchend', stop)
      }
    }

    const move = (event: MouseEvent | TouchEvent) => {
      const normalizedEvent = normalizeEvent(event)
      rafRef.current = requestAnimationFrame(() => updatePosition(normalizedEvent))
    }

    const stop = () => {
      document.documentElement.style.overflow = 'auto'
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setMoving(false)
      currentObjRef.current = null

      document.removeEventListener('mousemove', move)
      document.removeEventListener('touchmove', move)
      document.removeEventListener('mouseup', stop)
      document.removeEventListener('touchend', stop)
    }

    document.addEventListener('mousedown', start)
    document.addEventListener('touchstart', start)
    window.addEventListener('resize', checkInWindow)

    return () => {
      document.removeEventListener('mousedown', start)
      document.removeEventListener('touchstart', start)
      window.removeEventListener('resize', checkInWindow)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [stick])

  return (
    <div 
      className={`draggable ${moving ? 'cursor-grabbing' : 'cursor-grab'} select-none`} 
      ref={draggableRef}
    >
      {children}
    </div>
  )
}

Draggable.defaultProps = { stick: undefined }
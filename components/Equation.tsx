import * as React from 'react'
import Katex from '@/components/KatexReact'
import { getBlockTitle } from 'notion-utils'
import { BlockType } from 'notion-types' // 假设您使用 notion-types 包

interface EquationProps {
  block?: BlockType
  math?: string
  inline?: boolean
  className?: string
  [key: string]: any // 用于 ...rest
}

const katexSettings = {
  throwOnError: false,
  strict: false
}

/**
 * 数学公式
 */
export const Equation: React.FC<EquationProps> = ({ 
  block, 
  math, 
  inline = false, 
  className, 
  ...rest 
}) => {
  const equation = math || (block ? getBlockTitle(block, null) : null)
  if (!equation) return null

  return (
    <span
      role='button'
      tabIndex={0}
      className={`notion-equation ${inline ? 'notion-equation-inline' : 'notion-equation-block'} ${className || ''}`}
    >
      <Katex math={equation} settings={katexSettings} {...rest} />
    </span>
  )
}
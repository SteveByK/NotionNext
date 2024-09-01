'use client'

import { useEffect } from 'react'

/**
 * 检测广告插件
 */
export default function AdBlockDetect(): null {
  useEffect(() => {
    // 如果检测到广告屏蔽插件
    function ABDetected(): void {
      if (typeof document === 'undefined') {
        return
      }
      const wwadsCns = document.getElementsByClassName('wwads-cn')
      if (wwadsCns && wwadsCns.length > 0) {
        for (let i = 0; i < wwadsCns.length; i++) {
          const wwadsCn = wwadsCns[i] as HTMLElement
          wwadsCn.insertAdjacentHTML('beforeend', `<style>
            // ... (保持原有的 CSS 样式)
          </style>
          <a href='https://wwads.cn/page/whitelist-wwads' class='wwads-img' target='_blank' rel='nofollow'>
            <img src='https://creatives-1301677708.file.myqcloud.com/images/placeholder/wwads-friendly-ads.png' width='130' alt='Friendly Ads'>
          </a>
          <div class='wwads-content'>
            <a href='https://wwads.cn/page/whitelist-wwads' class='wwads-text' target='_blank' rel='nofollow'>为了本站的长期运营，请将我们的网站加入广告拦截器的白名单，感谢您的支持！</a>
            <a href='https://wwads.cn/page/end-user-privacy' class='wwads-poweredby' title='万维广告 ～ 让广告更优雅，且有用' target='_blank'><span>万维</span><span>广告</span></a>
          </div>
          <a class='wwads-hide' onclick='this.parentNode.remove()' title='隐藏广告'>
            <svg xmlns='http://www.w3.org/2000/svg' width='6' height='7'><path d='M.879.672L3 2.793 5.121.672a.5.5 0 11.707.707L3.708 3.5l2.12 2.121a.5.5 0 11-.707.707l-2.12-2.12-2.122 2.12a.5.5 0 11-.707-.707l2.121-2.12L.172 1.378A.5.5 0 01.879.672z'></path></svg>
          </a>`)
        }
      }
    }

    // check document ready
    function docReady(callback: () => void): void {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(callback, 1)
      } else {
        document.addEventListener('DOMContentLoaded', callback)
      }
    }

    // check if wwads' fire function was blocked after document is ready with 3s timeout (waiting the ad loading)
    docReady(() => {
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any)._AdBlockInit === undefined) {
          ABDetected()
        }
      }, 3000)
    })
  }, [])

  return null
}
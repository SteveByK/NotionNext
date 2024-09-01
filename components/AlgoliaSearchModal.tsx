import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import algoliasearch from 'algoliasearch'
import { useHotkeys } from 'react-hotkeys-hook'
import debounce from 'lodash/debounce'
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import replaceSearchResult from '@/components/Mark'

// ... ShortCutActions array remains the same

const AlgoliaSearchModal: React.FC<{ cRef: React.RefObject<{ openSearch: () => void }> }> = ({ cRef }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [searchMeta, setSearchMeta] = useState({ keyword: '', page: 0, totalPage: 0, totalHit: 0, useTime: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const client = algoliasearch(siteConfig('ALGOLIA_APP_ID'), siteConfig('ALGOLIA_SEARCH_ONLY_APP_KEY'))
  const index = client.initIndex(siteConfig('ALGOLIA_INDEX'))

  useHotkeys('ctrl+k', () => setIsModalOpen(true), { preventDefault: true })
  useHotkeys('down', () => setActiveIndex(prev => Math.min(prev + 1, searchResults.length - 1)), { enableOnFormTags: true })
  useHotkeys('up', () => setActiveIndex(prev => Math.max(prev - 1, 0)), { enableOnFormTags: true })
  useHotkeys('esc', () => setIsModalOpen(false), { enableOnFormTags: true })
  useHotkeys('enter', () => {
    if (searchResults.length > 0) {
      window.location.href = `${siteConfig('SUB_PATH', '')}/${searchResults[activeIndex].slug}`
    }
  }, { enableOnFormTags: true })

  const handleSearch = useCallback(debounce(async (query: string, page = 0) => {
    if (!query) return
    setIsLoading(true)
    try {
      const { hits, nbHits, nbPages, processingTimeMS } = await index.search(query, { page, hitsPerPage: 10 })
      setSearchResults(hits)
      setSearchMeta({ keyword: query, page, totalPage: nbPages, totalHit: nbHits, useTime: processingTimeMS })
      setIsLoading(false)
      setTimeout(() => {
        const doms = document.getElementById('search-wrapper')?.getElementsByClassName('replace')
        if (doms) {
          replaceSearchResult({
            doms,
            search: query,
            target: { element: 'span', className: 'font-bold border-b border-dashed' }
          })
        }
      }, 200)
    } catch (error) {
      console.error('Algolia search error:', error)
      setIsLoading(false)
    }
  }, 800), [index])

  useEffect(() => {
    setIsModalOpen(false)
  }, [router.asPath])

  useEffect(() => {
    if (isModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setActiveIndex(0)
      setSearchResults([])
      setSearchMeta({ keyword: '', page: 0, totalPage: 0, totalHit: 0, useTime: 0 })
      if (inputRef.current) inputRef.current.value = ''
    }
  }, [isModalOpen])

  useEffect(() => {
    if (cRef.current) {
      cRef.current.openSearch = () => setIsModalOpen(true)
    }
  }, [cRef])

  if (!siteConfig('ALGOLIA_APP_ID')) return null

  return (
    <div id='search-wrapper' className={`fixed inset-0 z-30 flex items-start justify-center ${isModalOpen ? 'opacity-100' : 'invisible opacity-0 pointer-events-none'}`}>
      <div className={`w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-300 ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Modal content */}
        {/* ... (Keep the existing JSX structure, but simplify class names where possible) */}
      </div>
      <div onClick={() => setIsModalOpen(false)} className='fixed inset-0 bg-black bg-opacity-50' />
    </div>
  )
}

// ... TagGroups and Pagination components remain largely the same, with minor TypeScript adjustments

export default AlgoliaSearchModal
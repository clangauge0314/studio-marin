import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import useDarkModeStore from '../../Store/useDarkModeStore'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  loading = false 
}) => {
  const { dark } = useDarkModeStore()

  const getVisiblePages = () => {
    const delta = 1
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <motion.div
      className="flex items-center justify-center space-x-1 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* 이전 페이지 버튼 */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
          dark
            ? 'bg-gray-800 text-gray-400 hover:bg-cyan-500 hover:text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-cyan-500 hover:text-white'
        }`}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.button>

      {/* 페이지 번호들 */}
      <div className="flex items-center space-x-1">
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={`px-3 py-2 text-sm ${
                dark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                ...
              </span>
            ) : (
              <motion.button
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed ${
                  page === currentPage
                    ? dark
                      ? 'bg-white text-gray-900 shadow-lg'
                      : 'bg-cyan-500 text-white shadow-lg'
                    : dark
                    ? 'bg-gray-800 text-gray-400 hover:bg-cyan-500 hover:text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-cyan-500 hover:text-white'
                }`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {page}
              </motion.button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* 다음 페이지 버튼 */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed ${
          dark
            ? 'bg-gray-800 text-gray-400 hover:bg-cyan-500 hover:text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-cyan-500 hover:text-white'
        }`}
        whileHover={{ scale: loading ? 1 : 1.05 }}
        whileTap={{ scale: loading ? 1 : 0.95 }}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.button>
    </motion.div>
  )
}

export default Pagination

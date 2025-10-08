import React from 'react'
import { motion } from 'framer-motion'
import { Users, Globe, Activity } from 'lucide-react'
import { useOnlineUsers } from '../../../hooks/useOnlineUsers'
import { useVisitorCount } from '../../../hooks/useVisitorCount'
import useDarkModeStore from '../../../Store/useDarkModeStore'

const OnlineStats = () => {
  const { dark } = useDarkModeStore()
  const { onlineCount, loading: onlineLoading } = useOnlineUsers()
  const { totalVisitors, loading: visitorLoading } = useVisitorCount()

  if (onlineLoading && visitorLoading) {
    return (
      <motion.div
        className={`p-4 rounded-xl ${dark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-pulse flex space-x-4">
            <div className={`h-8 w-8 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-4 w-20 rounded ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`p-6 rounded-xl ${dark ? 'bg-gray-800/90' : 'bg-white/90'} shadow-lg backdrop-blur-sm border ${dark ? 'border-gray-700' : 'border-gray-200'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex flex-col space-y-6">
        {/* 온라인 사용자 */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <motion.div
            className={`p-3 rounded-full ${dark ? 'bg-cyan-900/30' : 'bg-cyan-100'} mb-3`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Activity className={`w-6 h-6 ${dark ? 'text-cyan-400' : 'text-cyan-500'}`} />
          </motion.div>
          <div className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
            オンライン
          </div>
          <motion.div
            className={`text-3xl font-bold ${dark ? 'text-cyan-400' : 'text-cyan-500'}`}
            key={onlineCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {onlineCount}人
          </motion.div>
        </motion.div>

        {/* 구분선 */}
        <div className={`w-full h-px ${dark ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

        {/* 총 방문자 */}
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            className={`p-3 rounded-full ${dark ? 'bg-cyan-900/30' : 'bg-cyan-100'} mb-3`}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Globe className={`w-6 h-6 ${dark ? 'text-cyan-400' : 'text-cyan-500'}`} />
          </motion.div>
          <div className={`text-sm font-medium ${dark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>
            総訪問者
          </div>
          <div className={`text-3xl font-bold ${dark ? 'text-cyan-400' : 'text-cyan-500'}`}>
            {totalVisitors.toLocaleString()}人
          </div>
        </motion.div>
      </div>

      {/* 실시간 상태 표시 */}
      <motion.div
        className="flex items-center justify-center mt-6 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.div
          className={`w-2 h-2 rounded-full ${dark ? 'bg-cyan-400' : 'bg-cyan-500'} mr-2`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <span className={`text-xs font-medium ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
          リアルタイム更新中
        </span>
      </motion.div>
    </motion.div>
  )
}

export default OnlineStats

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import useDarkModeStore from '../../Store/useDarkModeStore'

const LikeButton = ({ 
  postId, 
  likeCount = 0, 
  likedBy = [], 
  currentUser, 
  onToggleLike 
}) => {
  const { dark } = useDarkModeStore()
  const [loading, setLoading] = useState(false)

  const isLiked = currentUser && likedBy.includes(currentUser.uid)

  const handleLikeClick = async (e) => {
    e.stopPropagation()
    
    if (!currentUser) {
      toast.error('ログインが必要です。')
      return
    }

    try {
      setLoading(true)
      const newIsLiked = await onToggleLike(postId)
      
      if (newIsLiked) {
        toast.success('いいねしました！')
      } else {
        toast.success('いいねを取り消しました。')
      }
    } catch (error) {
      toast.error(error.message || 'いいね処理に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.button
      onClick={handleLikeClick}
      disabled={loading}
      className={`flex items-center space-x-2 transition-colors ${
        isLiked
          ? dark
            ? 'text-red-400'
            : 'text-red-500'
          : dark
          ? 'text-gray-500 hover:text-red-400'
          : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
    >
      <Heart 
        className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${loading ? 'animate-pulse' : ''}`} 
      />
      <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
        {likeCount || 0}
      </span>
    </motion.button>
  )
}

export default LikeButton

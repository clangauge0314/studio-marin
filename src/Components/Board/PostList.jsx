import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../Contexts/AuthContext'
import { MessageCircle, Eye, Calendar, User, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import useDarkModeStore from '../../Store/useDarkModeStore'
import LikeButton from './LikeButton'

const PostList = ({ posts, loading, onDelete, onEdit, onToggleLike }) => {
  const { dark } = useDarkModeStore()
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diff = now - date
    
    // 1分未満
    if (diff < 60000) return 'たった今'
    // 1時間未満
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分前`
    // 1日未満
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}時間前`
    // 7日未満
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}日前`
    
    // その他は日付表示
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handlePostClick = (postId) => {
    navigate(`/board/${postId}`)
  }

  const handleEditClick = (e, post) => {
    e.stopPropagation()
    onEdit(post)
  }

  const handleDeleteClick = (e, postId) => {
    e.stopPropagation()
    if (window.confirm('投稿を削除しますか？')) {
      onDelete(postId)
    }
  }


  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={`p-6 rounded-lg border animate-pulse ${
            dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className={`h-4 rounded mb-2 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className={`h-3 rounded w-2/3 mb-4 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <div className="flex items-center space-x-4">
              <div className={`h-3 rounded w-16 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-3 rounded w-12 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-3 rounded w-20 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <motion.div
        className={`p-12 text-center rounded-lg border ${
          dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>
          投稿がありません
        </h3>
        <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
          まだ投稿がありません。最初の投稿を作成してみてください！
        </p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          className={`p-4 lg:p-6 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-xl ${
            dark 
              ? 'bg-gray-800 hover:bg-gray-750' 
              : 'bg-white hover:bg-gray-50'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ y: -4 }}
          onClick={() => handlePostClick(post.id)}
        >
          <div className="flex items-start justify-between mb-6">
            <h3 className={`text-lg lg:text-xl font-bold line-clamp-2 flex-1 mr-4 ${
              dark ? 'text-white' : 'text-gray-900'
            }`}>
              {post.title}
            </h3>
            
            {/* 작성자만 수정/삭제 버튼 표시 */}
            {currentUser && currentUser.uid === post.authorId && (
              <div className="flex space-x-2">
                <motion.button
                  onClick={(e) => handleEditClick(e, post)}
                  className={`p-2 rounded-full transition-colors ${
                    dark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={(e) => handleDeleteClick(e, post.id)}
                  className={`p-2 rounded-full transition-colors ${
                    dark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            )}
          </div>

          <p className={`text-sm mb-4 line-clamp-3 leading-relaxed ${
            dark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {post.content}
          </p>

          {/* 상단 메타 정보 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <User className={`w-4 h-4 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <span className={`font-semibold text-sm ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                {post.authorName}
              </span>
              <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                •
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                dark 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {post.category || '一般'}
              </span>
            </div>
            
            <span className={`text-xs ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* 하단 통계 정보 */}
          <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-300 dark:border-gray-600">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Eye className={`w-4 h-4 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {post.viewCount || 0}
                </span>
              </div>
              
              <LikeButton
                postId={post.id}
                likeCount={post.likeCount}
                likedBy={post.likedBy}
                currentUser={currentUser}
                onToggleLike={onToggleLike}
              />
              
              <div className="flex items-center space-x-1">
                <MessageCircle className={`w-4 h-4 ${dark ? 'text-green-400' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {post.commentCount || 0}
                </span>
              </div>
            </div>
            
            {/* 읽기 더보기 인디케이터 */}
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              dark 
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              詳細を見る
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default PostList

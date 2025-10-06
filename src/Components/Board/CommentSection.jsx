import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Send, Edit, Trash2, User, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'

const CommentSection = ({ 
  postId, 
  comments, 
  onAddComment, 
  onUpdateComment, 
  onDeleteComment, 
  loading 
}) => {
  const { dark } = useDarkModeStore()
  const { currentUser } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editContent, setEditContent] = useState('')

  // 디버깅용 로그

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return

    try {
      await onAddComment(postId, newComment)
      setNewComment('')
      toast.success('コメントが追加されました！')
    } catch (error) {
      toast.error(error.message || 'コメントの追加に失敗しました。')
    }
  }

  const handleEditComment = (comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleUpdateComment = async (e) => {
    e.preventDefault()
    if (!editContent.trim()) return

    try {
      await onUpdateComment(editingComment, editContent)
      setEditingComment(null)
      setEditContent('')
      toast.success('コメントが更新されました！')
    } catch (error) {
      toast.error(error.message || 'コメントの更新に失敗しました。')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('コメントを削除しますか？')) {
      try {
        await onDeleteComment(commentId, postId)
        toast.success('コメントが削除されました！')
      } catch (error) {
        toast.error('コメントの削除に失敗しました。')
      }
    }
  }

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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="mt-8">
      {/* 댓글 헤더 */}
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className={`w-6 h-6 ${dark ? 'text-gray-400' : 'text-gray-500'}`} />
        <h3 className={`text-xl font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
          コメント ({comments.length})
        </h3>
      </div>

      {/* 댓글 작성 폼 */}
      {currentUser && (
        <motion.div
          className={`p-6 rounded-2xl mb-6 ${
            dark ? 'bg-gray-800' : 'bg-white'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力してください..."
              rows={3}
              maxLength={500}
              className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 resize-none ${
                dark
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20'
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:ring-gray-900/20'
              }`}
            />
            <div className="flex justify-between items-center">
              <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {newComment.length}/500
              </span>
              <motion.button
                type="submit"
                disabled={!newComment.trim() || loading}
                className={`flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  'bg-cyan-500 text-white hover:bg-cyan-600'
                }`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                <Send className="w-4 h-4" />
                <span>投稿</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* 로그인 안내 */}
      {!currentUser && (
        <motion.div
          className={`p-4 rounded-xl mb-6 text-center ${
            dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm">
            コメントを投稿するには、ログインまたはゲストとしてアクセスしてください。
          </p>
        </motion.div>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <motion.div
            className={`p-8 rounded-2xl text-center ${
              dark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageCircle className="w-12 h-12 mx-auto mb-3" />
            <p>まだコメントがありません。最初のコメントを投稿してみてください！</p>
          </motion.div>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className={`p-6 rounded-2xl ${
                dark ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {editingComment === comment.id ? (
                // 편집 모드
                <form onSubmit={handleUpdateComment} className="space-y-4">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    maxLength={500}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 resize-none ${
                      dark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-white focus:ring-white/20'
                        : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gray-900 focus:ring-gray-900/20'
                    }`}
                  />
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setEditingComment(null)
                        setEditContent('')
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors bg-red-500 text-white hover:bg-red-600`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      キャンセル
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={!editContent.trim()}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 bg-cyan-500 text-white hover:bg-cyan-600`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      更新
                    </motion.button>
                  </div>
                </form>
              ) : (
                // 표시 모드
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <User className={`w-5 h-5 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <span className={`font-semibold ${dark ? 'text-gray-200' : 'text-gray-800'}`}>
                        {comment.authorName}
                      </span>
                      <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    {/* 작성자만 수정/삭제 버튼 표시 */}
                    {currentUser && currentUser.uid === comment.authorId && (
                      <div className="flex space-x-2">
                        <motion.button
                          onClick={() => handleEditComment(comment)}
                          className={`p-2 rounded-full transition-colors ${
                            dark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteComment(comment.id)}
                          className={`p-2 rounded-full transition-colors ${
                            dark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                  
                  <p className={`text-base leading-relaxed whitespace-pre-wrap ${
                    dark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {comment.content}
                  </p>
                </>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection

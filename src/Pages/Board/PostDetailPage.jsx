import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit, Trash2, Eye, MessageCircle, User, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'
import { useBoard } from '../../hooks/useBoard'
import CommentSection from '../../Components/Board/CommentSection'
import LikeButton from '../../Components/Board/LikeButton'
import PostForm from '../../Components/Board/PostForm'

const PostDetailPage = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const { dark } = useDarkModeStore()
  const { currentUser } = useAuth()
  const { 
    fetchPost, 
    updatePost,
    deletePost, 
    incrementViewCount, 
    toggleLike,
    addComment,
    updateComment,
    deleteComment,
    subscribeToComments
  } = useBoard()
  
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [comments, setComments] = useState([])
  const [showEditForm, setShowEditForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => {
    const loadPost = async () => {
      try {
        setLoading(true)
        const postData = await fetchPost(postId)
        setPost(postData)
        
        // 조회수 증가
        incrementViewCount(postId)
      } catch (err) {
        setError(err.message)
        toast.error('投稿の読み込みに失敗しました。')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      loadPost()
    }
  }, [postId]) // 의존성 배열에서 함수들 제거

  // 실시간 댓글 구독
  useEffect(() => {
    if (!postId) return

    const unsubscribe = subscribeToComments(postId, (commentsData) => {
      setComments(commentsData)
    })

    return () => {
      unsubscribe()
    }
  }, [postId]) // subscribeToComments 함수 제거

  const handleToggleLike = async (postId) => {
    try {
      const newIsLiked = await toggleLike(postId)
      
      // 게시글 상태 업데이트
      setPost(prev => prev ? {
        ...prev,
        likedBy: newIsLiked 
          ? [...(prev.likedBy || []), currentUser.uid]
          : (prev.likedBy || []).filter(uid => uid !== currentUser.uid),
        likeCount: newIsLiked 
          ? (prev.likeCount || 0) + 1 
          : Math.max(0, (prev.likeCount || 0) - 1)
      } : null)
      
      return newIsLiked
    } catch (error) {
      throw error
    }
  }

  const handleDelete = async () => {
    if (window.confirm('投稿を削除しますか？')) {
      try {
        await deletePost(postId)
        toast.success('投稿が削除されました！')
        navigate('/board')
      } catch (err) {
        toast.error('投稿の削除に失敗しました。')
      }
    }
  }

  const handleEdit = () => {
    setEditingPost(post)
    setShowEditForm(true)
  }

  const handleUpdatePost = async (title, content, category) => {
    try {
      await updatePost(postId, title, content, category)
      setShowEditForm(false)
      setEditingPost(null)
      // 게시글 데이터 다시 로드
      const updatedPost = await fetchPost(postId)
      setPost(updatedPost)
      toast.success('投稿が更新されました！')
    } catch (error) {
      toast.error(error.message || '投稿の更新に失敗しました。')
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className={`p-6 rounded-2xl ${dark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="animate-pulse">
              <div className={`h-8 rounded mb-4 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className={`h-4 rounded w-2/3 mb-6 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div className="space-y-3">
                <div className={`h-4 rounded ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 ${dark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            className={`p-6 rounded-2xl text-center ${dark ? 'bg-gray-800' : 'bg-white'}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className={`text-2xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
              投稿が見つかりません
            </h2>
            <p className={`text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {error || 'この投稿は存在しないか、削除されました。'}
            </p>
            <motion.button
              onClick={() => navigate('/board')}
              className={`mt-6 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                dark
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              掲示板に戻る
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 뒤로가기 버튼 */}
        <motion.button
          onClick={() => navigate('/board')}
          className={`flex items-center space-x-2 mb-8 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
            dark
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>掲示板に戻る</span>
        </motion.button>

        {/* 게시글 내용 */}
        <motion.article
          className={`p-6 rounded-2xl ${dark ? 'bg-gray-800' : 'bg-white'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <h1 className={`text-4xl font-bold leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
                {post.title}
              </h1>
              
              {/* 작성자만 수정/삭제 버튼 표시 */}
              {currentUser && currentUser.uid === post.authorId && (
                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleEdit}
                    className={`p-3 rounded-full transition-colors ${
                      dark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    className={`p-3 rounded-full transition-colors ${
                      dark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="w-6 h-6" />
                  </motion.button>
                </div>
              )}
            </div>

            {/* 상단 메타 정보 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <User className={`w-5 h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
                <span className={`font-bold text-base ${dark ? 'text-gray-200' : 'text-gray-700'}`}>
                  {post.authorName}
                </span>
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                  •
                </span>
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  dark
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {post.category || '一般'}
                </span>
              </div>
              
              <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(post.createdAt)}
              </span>
            </div>

            {/* 하단 통계 정보 */}
            <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Eye className={`w-5 h-5 ${dark ? 'text-blue-400' : 'text-blue-600'}`} />
                  <span className={`text-base font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {post.viewCount || 0} views
                  </span>
                </div>
                
                <LikeButton
                  postId={postId}
                  likeCount={post.likeCount}
                  likedBy={post.likedBy}
                  currentUser={currentUser}
                  onToggleLike={handleToggleLike}
                />
                
                <div className="flex items-center space-x-2">
                  <MessageCircle className={`w-5 h-5 ${dark ? 'text-green-400' : 'text-green-600'}`} />
                  <span className={`text-base font-semibold ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {comments.length} comments
                  </span>
                </div>
              </div>
              
              {/* 게시글 상태 인디케이터 */}
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                dark 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                📄 게시글
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className={`prose prose-lg max-w-none ${
            dark ? 'prose-invert' : ''
          }`}>
            <div className={`text-lg leading-relaxed whitespace-pre-wrap ${
              dark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {post.content}
            </div>
          </div>
        </motion.article>

        {/* 댓글 섹션 */}
        <CommentSection
          postId={postId}
          comments={comments}
          onAddComment={addComment}
          onUpdateComment={updateComment}
          onDeleteComment={deleteComment}
          loading={loading}
        />
      </div>

      {/* 편집 폼 모달 */}
      <PostForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setEditingPost(null)
        }}
        onSubmit={handleUpdatePost}
        loading={loading}
        initialData={editingPost}
        mode="edit"
      />
    </div>
  )
}

export default PostDetailPage

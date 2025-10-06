import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Loader2, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { useAuth } from '../../Contexts/AuthContext'
import { useBoard } from '../../hooks/useBoard'
import PostList from '../../Components/Board/PostList'
import PostForm from '../../Components/Board/PostForm'
import Pagination from '../../Components/Board/Pagination'

const CATEGORIES = [
  { value: 'all', label: 'すべて' },
  { value: '一般', label: '一般' },
  { value: 'お知らせ', label: 'お知らせ' },
  { value: '質問と回答', label: '質問と回答' },
  { value: '雑談', label: '雑談' },
  { value: '技術情報', label: '技術情報' }
]

const BoardPage = () => {
  const { dark } = useDarkModeStore()
  const { currentUser } = useAuth()
  const {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    changePage,
    changeCategory,
    changeSearch,
    selectedCategory: hookSelectedCategory,
    searchQuery: hookSearchQuery
  } = useBoard()

  const [showPostForm, setShowPostForm] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  const handleCreatePost = async (title, content, category) => {
    try {
      await createPost(title, content, category)
      setShowPostForm(false)
      toast.success('投稿が作成されました！')
    } catch (error) {
      toast.error(error.message || '投稿の作成に失敗しました。')
    }
  }

  const handleUpdatePost = async (title, content, category) => {
    try {
      await updatePost(editingPost.id, title, content, category)
      setEditingPost(null)
      toast.success('投稿が更新されました！')
    } catch (error) {
      toast.error(error.message || '投稿の更新に失敗しました。')
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId)
      toast.success('投稿が削除されました！')
    } catch (error) {
      toast.error('投稿の削除に失敗しました。')
    }
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
  }

  const handlePageChange = (page) => {
    changePage(page)
  }


  const handleToggleLike = async (postId) => {
    try {
      const newIsLiked = await toggleLike(postId)
      return newIsLiked
    } catch (error) {
      throw error
    }
  }

  return (
    <div className={`min-h-screen ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 lg:py-8 mt-4">
        {/* 헤더 */}
        <motion.div
          className="text-center mb-8 lg:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-4 ${
              dark ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30' : 'bg-gradient-to-br from-cyan-100 to-blue-100 border border-cyan-200'
            }`}>
              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h1 className={`text-3xl lg:text-5xl font-black bg-gradient-to-r ${
              dark ? 'from-cyan-400 via-blue-400 to-cyan-500' : 'from-cyan-600 via-blue-600 to-cyan-700'
            } bg-clip-text text-transparent`}>
              BOARD
            </h1>
          </motion.div>
          <motion.p
            className={`text-base lg:text-xl font-medium mb-4 ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            コミュニティと交流しましょう
          </motion.p>
          {totalPosts > 0 && (
            <motion.div
              className={`inline-block px-4 py-2 rounded-full ${
                dark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-700'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="text-sm font-medium">全 {totalPosts} 件の投稿</span>
            </motion.div>
          )}
        </motion.div>

        {/* 통합 컨트롤 패널 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* 데스크톱 버전 */}
          <div className="hidden lg:block">
            <div className={`p-6 rounded-2xl ${
              dark ? 'bg-gray-800' : 'bg-white'
            } shadow-xl`}>
              <div className="flex flex-col xl:grid xl:grid-cols-10 xl:gap-4">
                {/* 카테고리 필터 (2/10) */}
                <motion.div 
                  className="xl:col-span-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <motion.select
                    value={hookSelectedCategory}
                    onChange={(e) => changeCategory(e.target.value)}
                    className={`w-full px-6 py-4 rounded-xl text-base font-medium transition-all duration-200 border-2 focus:outline-none focus:ring-4 cursor-pointer ${
                      dark
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500 hover:border-cyan-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {CATEGORIES.map((category) => (
                      <motion.option 
                        key={category.value} 
                        value={category.value}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {category.label}
                      </motion.option>
                    ))}
                  </motion.select>
                </motion.div>

                {/* 검색 입력 (8/10) */}
                <div className="relative xl:col-span-8">
                  <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    dark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="タイトルで検索..."
                    value={hookSearchQuery}
                    onChange={(e) => changeSearch(e.target.value)}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 ${
                      dark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500'
                    }`}
                  />
                </div>

                {/* 새 글 작성 버튼 (전체 너비) */}
                <motion.div
                  className="xl:col-span-10 mt-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <motion.button
                    onClick={() => setShowPostForm(true)}
                    className="group relative flex items-center justify-center space-x-3 w-full px-8 py-4 rounded-2xl font-bold text-lg bg-cyan-500 text-white shadow-xl hover:shadow-2xl hover:bg-cyan-600 transition-all duration-300 overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -3,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* 배경 애니메이션 효과 */}
                    <motion.div
                      className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    
                    {/* 아이콘과 텍스트 */}
                    <div className="relative flex items-center space-x-3">
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Plus className="w-6 h-6" />
                      </motion.div>
                      <span className="font-bold">新しい投稿を作成</span>
                    </div>
                    
                    {/* 반짝이는 효과 */}
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                    />
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* 태블릿/모바일 버전 */}
          <div className="lg:hidden">
            <div className={`p-4 rounded-2xl ${
              dark ? 'bg-gray-800' : 'bg-white'
            } shadow-xl space-y-4`}>
              {/* 상단: 검색 및 새 글 작성 */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                    dark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="検索..."
                    value={hookSearchQuery}
                    onChange={(e) => changeSearch(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 ${
                      dark
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500'
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500'
                    }`}
                  />
                </div>
                
                <motion.button
                  onClick={() => setShowPostForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden md:inline">新規</span>
                </motion.button>
              </div>

              {/* 하단: 카테고리 필터 */}
              <motion.div 
                className="w-40"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.select
                  value={hookSelectedCategory}
                  onChange={(e) => changeCategory(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border focus:outline-none cursor-pointer ${
                    dark
                      ? 'bg-gray-700 border-gray-600 text-white hover:border-cyan-400'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-cyan-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  {CATEGORIES.map((category) => (
                    <motion.option 
                      key={category.value} 
                      value={category.value}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {category.label}
                    </motion.option>
                  ))}
                </motion.select>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 에러 메시지 */}
        {error && (
          <motion.div
            className={`p-6 rounded-2xl mb-8 text-center ${
              dark ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-800'
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-base">{error}</p>
          </motion.div>
        )}

        {/* 게시글 목록 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <PostList
            posts={posts}
            loading={loading}
            onDelete={handleDeletePost}
            onEdit={handleEditPost}
            onToggleLike={handleToggleLike}
          />
        </motion.div>

        {/* 게시글 작성 폼 */}
        <PostForm
          isOpen={showPostForm}
          onClose={() => setShowPostForm(false)}
          onSubmit={handleCreatePost}
          loading={loading}
        />

        {/* 게시글 수정 폼 */}
        <PostForm
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSubmit={handleUpdatePost}
          loading={loading}
          initialData={editingPost}
          mode="edit"
        />
      </div>

      {/* 페이지네이션 - 하단 고정 */}
      {totalPages > 1 && (
        <div className={`sticky bottom-0 ${dark ? 'bg-gray-900' : 'bg-gray-50'} border-t ${
          dark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            loading={loading}
          />
        </div>
      )}
    </div>
  )
}

export default BoardPage

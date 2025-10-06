import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Edit } from 'lucide-react'
import useDarkModeStore from '../../Store/useDarkModeStore'

const CATEGORIES = [
  { value: '一般', label: '一般' },
  { value: 'お知らせ', label: 'お知らせ' },
  { value: '質問と回答', label: '質問と回答' },
  { value: '雑談', label: '雑談' },
  { value: '技術情報', label: '技術情報' }
]

const PostForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  initialData = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  const { dark } = useDarkModeStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('一般')

  // initialData가 변경될 때마다 폼 데이터 업데이트
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setContent(initialData.content || '')
      setCategory(initialData.category || '一般')
    } else {
      setTitle('')
      setContent('')
      setCategory('一般')
    }
  }, [initialData])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert('タイトルと内容を入力してください。')
      return
    }
    onSubmit(title, content, category)
  }

  const handleClose = () => {
    setTitle('')
    setContent('')
    setCategory('一般')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* 모달 */}
          <motion.div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`w-full max-w-2xl rounded-xl shadow-xl ${
                dark ? 'bg-gray-800' : 'bg-white'
              }`}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* 헤더 */}
              <div className={`flex items-center justify-between p-3 border-b ${
                dark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  {mode === 'edit' ? (
                    <Edit className={`w-6 h-6 ${dark ? 'text-white' : 'text-gray-900'}`} />
                  ) : (
                    <Send className={`w-6 h-6 ${dark ? 'text-white' : 'text-gray-900'}`} />
                  )}
                  <h2 className={`text-2xl font-bold ${
                    dark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {mode === 'edit' ? '投稿を編集' : '新しい投稿を作成'}
                  </h2>
                </div>
                
                <motion.button
                  onClick={handleClose}
                  className={`p-2 rounded-full transition-colors ${
                    dark 
                      ? 'hover:bg-gray-700 text-gray-400' 
                      : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit} className="p-3">
                <div className="space-y-4">
                  {/* 카테고리 선택 */}
                  <div>
                    <label className={`block text-base font-semibold mb-2 ${
                      dark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      カテゴリー
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 text-base ${
                        dark
                          ? 'bg-gray-800 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 제목 입력 */}
                  <div>
                    <label className={`block text-base font-semibold mb-2 ${
                      dark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      タイトル
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="タイトルを入力してください"
                      maxLength={100}
                      className={`w-full px-6 py-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-4 text-lg ${
                        dark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                      required
                    />
                    <div className={`text-sm mt-2 text-right ${
                      dark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {title.length}/100
                    </div>
                  </div>

                  {/* 내용 입력 */}
                  <div>
                    <label className={`block text-base font-semibold mb-2 ${
                      dark ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      内容
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="内容を入力してください"
                      rows={8}
                      maxLength={2000}
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-4 resize-none text-base ${
                        dark
                          ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500 focus:border-cyan-500'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500'
                      }`}
                      required
                    />
                    <div className={`text-sm mt-2 text-right ${
                      dark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {content.length}/2000
                    </div>
                  </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={handleClose}
                    className={`px-6 py-2 rounded-lg font-semibold text-base transition-all duration-200 bg-red-500 text-white hover:bg-red-600`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    キャンセル
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={loading || !title.trim() || !content.trim()}
                    className={`px-6 py-2 rounded-lg font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-cyan-500 text-white hover:bg-cyan-600`}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>{mode === 'edit' ? '更新中...' : '作成中...'}</span>
                      </div>
                    ) : (
                      mode === 'edit' ? '更新する' : '作成する'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default PostForm

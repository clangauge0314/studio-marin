import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, Users, X, ChevronDown } from 'lucide-react'
import { ref, push, onValue, off, serverTimestamp } from 'firebase/database'
import { database } from '../../firebase/config'
import { useAuth } from '../../Contexts/AuthContext'
import useDarkModeStore from '../../Store/useDarkModeStore'
import { toast } from 'sonner'
import { TwitterTweetEmbed } from 'react-twitter-embed'
import OnlineStats from '../../Components/Common/OnlineStats/OnlineStats'

const MainPage = () => {
  const { dark } = useDarkModeStore()
  const { currentUser, userProfile } = useAuth()
  
  // 채팅 상태
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreMessages, setHasMoreMessages] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // 메시지 전송
  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    // 회원 또는 게스트만 채팅 가능
    if (!currentUser || (!currentUser.isAnonymous && !currentUser.email)) {
      toast.error('チャット機能はログインしたユーザーまたはゲストユーザーのみ利用できます。')
      return
    }

    try {
      setIsLoading(true)
      const messagesRef = ref(database, 'chat/messages')
      
      const messageData = {
        userId: currentUser?.uid || 'guest_' + Date.now(),
        nickname: userProfile?.nickname || (currentUser?.isAnonymous ? 'ゲスト' : 'ユーザー'),
        message: newMessage.trim(),
        timestamp: serverTimestamp(),
        isGuest: currentUser?.isAnonymous || false,
        email: currentUser?.email || null
      }

      await push(messagesRef, messageData)
      setNewMessage('')
      // 메시지 전송 후 하단으로 스크롤
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    } catch (error) {
      toast.error('メッセージの送信に失敗しました。')
    } finally {
      setIsLoading(false)
    }
  }

  // 실시간 메시지 리스너
  useEffect(() => {
    if (!isChatOpen) return

    const messagesRef = ref(database, 'chat/messages')
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const messageList = Object.entries(data)
          .map(([id, message]) => ({
            id,
            ...message,
            timestamp: message.timestamp ? new Date(message.timestamp) : new Date()
          }))
          .sort((a, b) => a.timestamp - b.timestamp)
          .slice(-50) // 최근 50개 메시지 표시
        
        setMessages(messageList)
        setHasMoreMessages(messageList.length >= 50)
      } else {
        setMessages([])
        setHasMoreMessages(false)
      }
    })

    return () => off(messagesRef, 'value', unsubscribe)
  }, [isChatOpen])

  // 스크롤 이벤트 핸들러 (인피니티 스크롤 + 스크롤 버튼 표시)
  const handleScroll = () => {
    const container = messagesContainerRef.current
    if (!container) return

    const { scrollTop, scrollHeight, clientHeight } = container
    
    // 스크롤 버튼 표시/숨김 (하단에서 100px 이상 떨어져 있을 때)
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
    
    // 맨 위에 도달했을 때 더 많은 메시지 로드
    if (scrollTop === 0 && !isLoadingMore && hasMoreMessages) {
      loadMoreMessages()
    }
  }

  // 더 많은 메시지 로드
  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages) return

    setIsLoadingMore(true)
    try {
      // 실제 구현에서는 이전 메시지들을 로드하는 로직이 필요
      // 현재는 간단히 더 많은 메시지를 표시하도록 설정
      setTimeout(() => {
        setIsLoadingMore(false)
        setHasMoreMessages(false) // 더 이상 로드할 메시지가 없다고 가정
      }, 1000)
    } catch (error) {
      setIsLoadingMore(false)
    }
  }

  // 시간 포맷팅
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
  }

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* 메인 컨텐츠 */}
      <div className="w-full">
        {/* 메인 제목 */}
        <motion.div
          className="text-center mb-12"
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className={`text-5xl font-black bg-gradient-to-r ${
              dark ? 'from-cyan-400 via-blue-400 to-cyan-500' : 'from-cyan-600 via-blue-600 to-cyan-700'
            } bg-clip-text text-transparent`}>
              HOME
            </h1>
          </motion.div>
          <motion.p
            className={`text-lg font-medium ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            コミュニティの中心地へようこそ
          </motion.p>
        </motion.div>

        {/* 온라인 통계 */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <OnlineStats />
        </motion.div>

        {/* 채팅 섹션 */}
      <motion.div
          className={`rounded-2xl shadow-lg ${
          dark 
              ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* 채팅 헤더 */}
          <div 
            className={`flex items-center justify-between p-4 border-b cursor-pointer transition-colors duration-200 ${
              dark ? 'border-gray-700/50 hover:bg-gray-800/50' : 'border-gray-200/50 hover:bg-gray-50'
            }`}
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            <div className="flex items-center space-x-3">
              <MessageCircle className={`w-5 h-5 ${dark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <h2 className={`text-lg font-bold ${dark ? 'text-white' : 'text-gray-900'}`}>
              学祭 Live Chat
              </h2>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                dark ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'
              }`}>
                {messages.length}
              </div>
            </div>
            <motion.div
              className={`p-1 rounded-full ${
                dark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
              animate={{ rotate: isChatOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg 
                className={`w-4 h-4 ${
                  dark ? 'text-gray-400' : 'text-gray-600'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          {/* 채팅 컨텐츠 */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div 
                className="overflow-hidden"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* 메시지 리스트 */}
                <div
                  ref={messagesContainerRef}
                  className="relative h-96 overflow-y-auto overflow-x-hidden p-4 space-y-2"
                  onScroll={handleScroll}
                >
                  {/* 로딩 인디케이터 */}
                  {isLoadingMore && (
                    <div className="text-center py-2">
                      <div className={`inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ${
                        dark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                  )}
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${dark ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                        最初のメッセージを送信してください
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex flex-col space-y-1 ${
                          message.userId === (currentUser?.uid || 'guest') ? 'items-end' : 'items-start'
                        }`}
                      >
                        {/* 닉네임 */}
                        <div
                          className={`flex items-center space-x-2 ${
                            message.userId === (currentUser?.uid || 'guest') ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          <span className={`text-xs font-medium ${
                            message.isGuest 
                              ? (dark ? 'text-gray-400' : 'text-gray-500')
                              : (dark ? 'text-cyan-400' : 'text-cyan-600')
                          }`}>
                            {message.nickname}
                            {message.isGuest && ' (ゲスト)'}
                          </span>
                        </div>

                        {/* 메시지 박스 컨테이너 */}
                        <div className="relative group">
                          {/* 메시지 박스 */}
                          <div
                            className={`inline-block max-w-xs sm:max-w-sm md:max-w-md px-3 py-2 rounded-lg cursor-pointer ${
                              message.userId === (currentUser?.uid || 'guest')
                                ? (dark ? 'bg-cyan-500 text-white' : 'bg-cyan-500 text-white')
                                : (dark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900')
                            }`}
                          >
                            <p className="text-sm break-words whitespace-pre-wrap">{message.message}</p>
        </div>

                          {/* 호버 시 시간 표시 */}
                          <div
                            className={`absolute top-full left-0 mt-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shadow-lg z-10 opacity-0 group-hover:opacity-100 ${
                              dark ? 'bg-gray-900 text-white border border-gray-600' : 'bg-gray-800 text-white border border-gray-500'
                            }`}
                          >
                            {formatTime(message.timestamp)}
                            <div
                              className={`absolute bottom-full left-4 w-0 h-0 ${
                                dark ? 'border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900' : 'border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800'
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                  
                  {/* 스크롤 다운 버튼 - 채팅 영역 내부에 고정 */}
                  <AnimatePresence>
                    {showScrollButton && (
                      <motion.div
                        className="absolute bottom-4 right-4 z-10"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        <motion.button
                          onClick={scrollToBottom}
                          className={`p-2 rounded-full shadow-lg backdrop-blur-sm border transition-all duration-200 ${
                            dark 
                              ? 'bg-gray-800/90 border-gray-600 text-white hover:bg-gray-700/90' 
                              : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-gray-50/90'
                          }`}
                          whileHover={{ 
                            scale: 1.1,
                            y: -2
                          }}
                          whileTap={{ 
                            scale: 0.95,
                            y: 0
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 메시지 입력 */}
                <form onSubmit={sendMessage} className={`p-4 border-t ${
                  dark ? 'border-gray-700/50' : 'border-gray-200/50'
                }`}>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="メッセージを入力..."
                      maxLength={200}
                      className={`flex-1 px-3 py-2 rounded-lg border text-sm ${
                        dark 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-cyan-500'
                      } focus:outline-none focus:ring-2 focus:ring-cyan-500/20`}
                      disabled={isLoading}
                    />
                    <motion.button
                      type="submit"
                      disabled={!newMessage.trim() || isLoading}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        !newMessage.trim() || isLoading
                          ? (dark ? 'bg-gray-600 text-gray-400' : 'bg-gray-300 text-gray-500')
                          : (dark ? 'bg-cyan-500 hover:bg-cyan-600 text-white' : 'bg-cyan-500 hover:bg-cyan-600 text-white')
                      }`}
                      whileHover={newMessage.trim() && !isLoading ? { scale: 1.05 } : {}}
                      whileTap={newMessage.trim() && !isLoading ? { scale: 0.95 } : {}}
                    >
                      <Send className="w-4 h-4" />
                    </motion.button>
                  </div>
                  <p className={`text-xs mt-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {newMessage.length}/200
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 트위터 임베드 섹션 */}
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TwitterTweetEmbed
                tweetId="1962796575731925061"
                placeholder={
                  <div className={`p-4 rounded-lg ${
                    dark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              />
              <TwitterTweetEmbed
                tweetId="1083592734038929408"
                placeholder={
                  <div className={`p-4 rounded-lg ${
                    dark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              />
              <TwitterTweetEmbed
                tweetId="1083592734038929408"
                placeholder={
                  <div className={`p-4 rounded-lg ${
                    dark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
            
            {/* Divider */}
            <div className={`border-t ${
              dark ? 'border-gray-700' : 'border-gray-200'
            }`}></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TwitterTweetEmbed
                tweetId="1083592734038929408"
                placeholder={
                  <div className={`p-4 rounded-lg ${
                    dark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              />
              <TwitterTweetEmbed
                tweetId="1083592734038929408"
                placeholder={
                  <div className={`p-4 rounded-lg ${
                    dark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-24"></div>
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
        </div>
      </motion.div>

      </div>
    </motion.div>
  )
}

export default MainPage
import { useState, useEffect, useCallback } from 'react'
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  where,
  increment,
  arrayUnion,
  arrayRemove,
  onSnapshot
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../Contexts/AuthContext'

export const useBoard = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const { currentUser, userProfile } = useAuth()

  const POSTS_PER_PAGE = 10

  const fetchTotalPosts = async () => {
    try {
      let firebaseCount = 0
      
      try {
        const postsRef = collection(db, 'posts')
        const snapshot = await getDocs(postsRef)
        firebaseCount = snapshot.size
      } catch (firebaseError) {
      }
      
      const total = firebaseCount
      setTotalPosts(total)
      setTotalPages(Math.ceil(total / POSTS_PER_PAGE))
      
    } catch (err) {
    }
  }

  // 게시글 목록 조회 (최적화된 쿼리)
  const fetchPosts = async (page = 1, category = 'all', search = '') => {
    try {
      setLoading(true)
      setError(null)

      // 실제 Firebase 데이터만 사용
      let allPosts = []

      // Firebase 쿼리 (정렬만 서버에서 처리)
      try {
        let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'))
        
        const querySnapshot = await getDocs(q)
        
        querySnapshot.forEach((doc) => {
          allPosts.push({
            id: doc.id,
            ...doc.data()
          })
        })
        
      } catch (firebaseError) {
        // Firebase 데이터가 없어도 빈 배열로 처리
      }

      // 최신순 정렬 (Firebase 데이터만)
      allPosts.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt)
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt)
        return dateB - dateA
      })

      // 카테고리 필터링 (클라이언트 사이드)
      if (category !== 'all') {
        allPosts = allPosts.filter(post => post.category === category)
      }

      // 검색 필터링 (클라이언트 사이드 - Firestore의 검색 제한으로 인해)
      if (search.trim()) {
        const searchLower = search.toLowerCase()
        allPosts = allPosts.filter(post => 
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower)
        )
      }

      // 페이지네이션 적용 (클라이언트 사이드)
      const startIndex = (page - 1) * POSTS_PER_PAGE
      const endIndex = startIndex + POSTS_PER_PAGE
      const paginatedPosts = allPosts.slice(startIndex, endIndex)

      // 전체 페이지 수 계산
      const totalFilteredPosts = allPosts.length
      const totalPages = Math.ceil(totalFilteredPosts / POSTS_PER_PAGE)

      setPosts(paginatedPosts)
      setCurrentPage(page)
      setTotalPages(totalPages)
      setTotalPosts(totalFilteredPosts)

      // 캐시 업데이트
      const cacheKey = `${category}-${search}`
      setPostsCache(prev => ({
        ...prev,
        [cacheKey]: {
          posts: paginatedPosts,
          totalPosts: totalFilteredPosts,
          totalPages: totalPages,
          currentPage: page,
          timestamp: Date.now()
        }
      }))

    } catch (err) {
      setError('投稿一覧の読み込みに失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  // 페이지 변경
  const changePage = (page) => {
    if (page >= 1 && page !== currentPage) {
      fetchPosts(page, selectedCategory, searchQuery)
    }
  }

  // 카테고리 변경
  const changeCategory = (category) => {
    setSelectedCategory(category)
    fetchPosts(1, category, searchQuery)
  }

  // 검색 변경
  const changeSearch = (search) => {
    setSearchQuery(search)
    fetchPosts(1, selectedCategory, search)
  }

  // 게시글 상세 조회
  const fetchPost = useCallback(async (postId) => {
    try {
      setLoading(true)
      setError(null)

      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)

      if (postSnap.exists()) {
        return {
          id: postSnap.id,
          ...postSnap.data()
        }
      } else {
        throw new Error('投稿が見つかりません。')
      }
    } catch (err) {
      setError('投稿の読み込みに失敗しました。')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // 게시글 작성
  const createPost = async (title, content, category = '일반') => {
    try {
      setLoading(true)
      setError(null)

      if (!currentUser) {
        throw new Error('ログインが必要です。')
      }

      if (!title.trim() || !content.trim()) {
        throw new Error('タイトルと内容を入力してください。')
      }

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category: category,
        authorId: currentUser.uid,
        authorName: userProfile?.nickname || (currentUser.isAnonymous ? 'ゲスト' : '不明'),
        authorEmail: currentUser.isAnonymous ? null : currentUser.email,
        isAnonymous: currentUser.isAnonymous,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        likedBy: []
      }

      const docRef = await addDoc(collection(db, 'posts'), postData)
      
      // 새 게시글을 목록에 추가
      const newPost = {
        id: docRef.id,
        ...postData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setPosts(prev => [newPost, ...prev])
      
      // 총 게시글 수 업데이트
      setTotalPosts(prev => prev + 1)
      setTotalPages(Math.ceil((totalPosts + 1) / POSTS_PER_PAGE))
      
      return docRef.id
    } catch (err) {
      setError(err.message || '投稿の作成に失敗しました。')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 게시글 수정
  const updatePost = async (postId, title, content, category = '일반') => {
    try {
      setLoading(true)
      setError(null)

      if (!title.trim() || !content.trim()) {
        throw new Error('タイトルと内容を入力してください。')
      }

      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        title: title.trim(),
        content: content.trim(),
        category: category,
        updatedAt: serverTimestamp()
      })

      // 목록에서 해당 게시글 업데이트
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, title: title.trim(), content: content.trim(), category: category, updatedAt: new Date() }
          : post
      ))

    } catch (err) {
      setError(err.message || '投稿の更新に失敗しました。')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 게시글 삭제
  const deletePost = async (postId) => {
    try {
      setLoading(true)
      setError(null)

      await deleteDoc(doc(db, 'posts', postId))

      // 목록에서 해당 게시글 제거
      setPosts(prev => prev.filter(post => post.id !== postId))
      
      // 총 게시글 수 업데이트
      setTotalPosts(prev => prev - 1)
      setTotalPages(Math.ceil((totalPosts - 1) / POSTS_PER_PAGE))

    } catch (err) {
      setError('投稿の削除に失敗しました。')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // 조회수 증가
  const incrementViewCount = useCallback(async (postId) => {
    try {
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        viewCount: increment(1)
      })
    } catch (err) {
    }
  }, [])

  // 좋아요 토글
  const toggleLike = useCallback(async (postId) => {
    try {
      if (!currentUser) {
        throw new Error('ログインが必要です。')
      }

      const postRef = doc(db, 'posts', postId)
      const postSnap = await getDoc(postRef)
      
      if (!postSnap.exists()) {
        throw new Error('投稿が見つかりません。')
      }

      const postData = postSnap.data()
      const likedBy = postData.likedBy || []
      const isLiked = likedBy.includes(currentUser.uid)

      if (isLiked) {
        // 좋아요 취소
        await updateDoc(postRef, {
          likedBy: arrayRemove(currentUser.uid),
          likeCount: increment(-1)
        })

        // 목록의 해당 게시글 좋아요 취소 상태 업데이트
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likedBy: (post.likedBy || []).filter(uid => uid !== currentUser.uid), 
                likeCount: Math.max(0, (post.likeCount || 0) - 1) 
              }
            : post
        ))
      } else {
        // 좋아요 추가
        await updateDoc(postRef, {
          likedBy: arrayUnion(currentUser.uid),
          likeCount: increment(1)
        })

        // 목록의 해당 게시글 좋아요 상태 업데이트
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, likedBy: [...(post.likedBy || []), currentUser.uid], likeCount: (post.likeCount || 0) + 1 }
            : post
        ))
      }

      return !isLiked
    } catch (err) {
      throw err
    }
  }, [currentUser])

  // 댓글 작성
  const addComment = useCallback(async (postId, content) => {
    try {
      if (!currentUser) {
        throw new Error('ログインが必要です。')
      }

      if (!content.trim()) {
        throw new Error('コメント内容を入力してください。')
      }

      const commentData = {
        postId,
        content: content.trim(),
        authorId: currentUser.uid,
        authorName: userProfile?.nickname || (currentUser.isAnonymous ? 'ゲスト' : '不明'),
        authorEmail: currentUser.isAnonymous ? null : currentUser.email,
        isAnonymous: currentUser.isAnonymous,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }


      // 댓글 추가
      const commentRef = await addDoc(collection(db, 'comments'), commentData)

      // 게시글의 댓글 수 증가
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        commentCount: increment(1)
      })

      return commentRef.id
    } catch (err) {
      throw err
    }
  }, [currentUser, userProfile])

  // 댓글 수정
  const updateComment = useCallback(async (commentId, content) => {
    try {
      if (!content.trim()) {
        throw new Error('コメント内容を入力してください。')
      }

      const commentRef = doc(db, 'comments', commentId)
      await updateDoc(commentRef, {
        content: content.trim(),
        updatedAt: serverTimestamp()
      })
    } catch (err) {
      throw err
    }
  }, [])

  // 댓글 삭제
  const deleteComment = useCallback(async (commentId, postId) => {
    try {
      await deleteDoc(doc(db, 'comments', commentId))

      // 게시글의 댓글 수 감소
      const postRef = doc(db, 'posts', postId)
      await updateDoc(postRef, {
        commentCount: increment(-1)
      })
    } catch (err) {
      throw err
    }
  }, [])

  // 댓글 목록 조회
  const fetchComments = async (postId) => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('postId', '==', postId),
        orderBy('createdAt', 'asc')
      )

      const querySnapshot = await getDocs(q)
      const comments = []
      
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data()
        })
      })

      return comments
    } catch (err) {
      throw err
    }
  }

  // 실시간 댓글 구독
  const subscribeToComments = useCallback((postId, callback) => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId)
    )

    return onSnapshot(q, (querySnapshot) => {
      const comments = []
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data()
        })
      })
      
      // 클라이언트에서 정렬
      comments.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.createdAt)
        const bTime = b.createdAt?.toDate?.() || new Date(b.createdAt)
        return aTime - bTime
      })
      
      callback(comments)
    }, (error) => {
    })
  }, [])


  // 캐싱을 위한 상태
  const [postsCache, setPostsCache] = useState({})
  const [lastFetchTime, setLastFetchTime] = useState(0)

  // 초기 데이터 로드 (최적화)
  useEffect(() => {
    const loadInitialData = async () => {
      // 5분 이내에 로드했다면 캐시 사용
      const now = Date.now()
      const CACHE_DURATION = 5 * 60 * 1000 // 5분
      
      if (now - lastFetchTime < CACHE_DURATION && postsCache['all']) {
        setPosts(postsCache['all'].posts)
        setTotalPosts(postsCache['all'].totalPosts)
        setTotalPages(postsCache['all'].totalPages)
        setCurrentPage(postsCache['all'].currentPage)
        return
      }
      
      // 새로운 데이터 로드
      await fetchTotalPosts()
      await fetchPosts(1)
      setLastFetchTime(now)
    }
    
    loadInitialData()
  }, [])

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    fetchPosts,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    incrementViewCount,
    toggleLike,
    addComment,
    updateComment,
    deleteComment,
    fetchComments,
    subscribeToComments,
    changePage,
    changeCategory,
    changeSearch,
    selectedCategory,
    searchQuery
  }
}


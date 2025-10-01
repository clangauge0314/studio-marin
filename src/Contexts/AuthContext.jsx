import React, { createContext, useContext, useState, useEffect } from 'react'
import { 
  signInAnonymously as firebaseSignInAnonymously, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, query, where, getDocs, collection } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { toast } from 'sonner'

const AuthContext = createContext()

// 간단한 해시 함수 (실제 프로덕션에서는 더 강력한 해시 사용)
const simpleHash = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit 정수로 변환
  }
  return hash.toString()
}

// 닉네임 중복 검사
const checkNicknameExists = async (nickname) => {
  try {
    const q = query(collection(db, 'users'), where('nickname', '==', nickname))
    const querySnapshot = await getDocs(q)
    return !querySnapshot.empty
  } catch (error) {
    console.error('닉네임 중복 검사 오류:', error)
    return false
  }
}

// 닉네임으로 사용자 찾기
const findUserByNickname = async (nickname) => {
  try {
    const q = query(collection(db, 'users'), where('nickname', '==', nickname))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      return { id: userDoc.id, ...userDoc.data() }
    }
    return null
  } catch (error) {
    console.error('사용자 찾기 오류:', error)
    return null
  }
}


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // 익명 로그인
  const signInAnonymously = async () => {
    try {
      const result = await firebaseSignInAnonymously(auth)
      
      // 게스트 프로필 설정 (localStorage 제거)
      const guestProfile = {
        nickname: 'ゲスト',
        uid: result.user.uid,
        isAnonymous: true
      }
      setUserProfile(guestProfile)
      setCurrentUser(result.user)
      
      toast.success('ゲストとしてログインしました')
      return result
    } catch (error) {
      console.error('익명 로그인 오류:', error)
      toast.error('ゲストログイン中にエラーが発生しました')
      throw error
    }
  }

  // 이메일 회원가입
  const signUp = async (email, password, nickname) => {
    try {
      // 1. Firebase Auth로 계정 생성
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // 2. 사용자 프로필 업데이트 (닉네임 설정)
      await updateProfile(result.user, {
        displayName: nickname
      })
      
      // 3. Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', result.user.uid), {
        email: email,
        nickname: nickname,
        uid: result.user.uid,
        createdAt: new Date(),
        lastLoginAt: new Date(),
        isGuest: false
      })
      
      // 4. 상태 업데이트
      const userProfile = {
        nickname: nickname,
        email: email,
        uid: result.user.uid
      }
      
      setCurrentUser(result.user)
      setUserProfile(userProfile)
      setLoading(false)
      
      toast.success('회원가입이 완료되었습니다!')
      return result
      
    } catch (error) {
      console.error('회원가입 오류:', error)
      setLoading(false)
      
      // Firebase 오류 메시지 한국어 변환
      let errorMessage = '회원가입 중 오류가 발생했습니다'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = '이미 사용 중인 이메일입니다'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = '비밀번호가 너무 약합니다'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = '유효하지 않은 이메일입니다'
      }
      
      toast.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  // 이메일 기반 인증 (로그인)
  const authenticate = async (email, password) => {
    try {
      // 1. 먼저 로그인 시도
      try {
        const result = await signInWithEmailAndPassword(auth, email, password)
        
        // 로그인 성공 - Firestore에서 사용자 정보 가져오기
        const userDoc = await getDoc(doc(db, 'users', result.user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const userProfile = {
            nickname: userData.nickname || userData.email.split('@')[0],
            email: userData.email,
            uid: result.user.uid,
            isAnonymous: false
          }
          setUserProfile(userProfile)
          // 로컬 스토리지에 이메일 저장 (랭킹용)
          localStorage.setItem('currentUserEmail', userData.email)
        } else {
          // Firestore에 사용자 정보가 없으면 기본값 설정
          const userProfile = {
            nickname: result.user.displayName || email.split('@')[0],
            email: email,
            uid: result.user.uid,
            isAnonymous: false
          }
          setUserProfile(userProfile)
          localStorage.setItem('currentUserEmail', email)
        }
        
        setCurrentUser(result.user)
        toast.success('ログインしました！')
        return result
        
      } catch (loginError) {
        // 2. 로그인 실패 시 회원가입 시도
        if (loginError.code === 'auth/user-not-found') {
          // 신규 사용자 - 회원가입 진행
          const result = await createUserWithEmailAndPassword(auth, email, password)
          
          // 프로필 업데이트
          const nickname = email.split('@')[0]
          await updateProfile(result.user, {
            displayName: nickname
          })

          // Firestore에 사용자 정보 저장
          await setDoc(doc(db, 'users', result.user.uid), {
            nickname: nickname,
            email: email,
            isAnonymous: false,
            createdAt: new Date()
          })

          // 상태 업데이트
          const userProfile = {
            nickname: nickname,
            email: email,
            uid: result.user.uid,
            isAnonymous: false
          }
          setUserProfile(userProfile)
          setCurrentUser(result.user)
          // 로컬 스토리지에 이메일 저장 (랭킹용)
          localStorage.setItem('currentUserEmail', email)
          toast.success('会員登録が完了しました！')
          return result
          
        } else {
          // 다른 로그인 오류
          throw loginError
        }
      }
      
    } catch (error) {
      console.error('인증 오류:', error)
      if (error.code === 'auth/wrong-password') {
        toast.error('パスワードが正しくありません')
      } else if (error.code === 'auth/invalid-email') {
        toast.error('無効なメールアドレスです')
      } else if (error.code === 'auth/weak-password') {
        toast.error('パスワードは6文字以上である必要があります')
      } else if (error.code === 'auth/email-already-in-use') {
        toast.error('このメールアドレスは既に使用されています')
      } else if (error.code === 'auth/user-disabled') {
        toast.error('このアカウントは無効化されています')
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('ログイン試行回数が多すぎます。しばらく待ってから再試行してください')
      } else {
        toast.error('認証中にエラーが発生しました')
      }
      throw error
    }
  }

  // 기존 함수들 유지 (호환성을 위해)

  const login = async (email, password) => {
    return authenticate(email, password)
  }

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth)
      setUserProfile(null)
      setCurrentUser(null)
      // 로컬 스토리지에서 이메일 제거
      localStorage.removeItem('currentUserEmail')
      toast.success('ログアウトしました')
    } catch (error) {
      console.error('로그아웃 오류:', error)
      toast.error('ログアウト中にエラーが発生しました')
      throw error
    }
  }

  // 사용자 프로필 가져오기 (Firestore에서)
  const getUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid))
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() }
      }
      return null
    } catch (error) {
      console.error('프로필 가져오기 오류:', error)
      return null
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setCurrentUser(user)
          
          // Firestore에서 사용자 프로필 가져오기
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            
            if (userDoc.exists()) {
              const userData = userDoc.data()
              const profile = {
                nickname: userData.nickname,
                email: userData.email,
                uid: user.uid,
                isAnonymous: user.isAnonymous || false,
                createdAt: userData.createdAt
              }
              setUserProfile(profile)
              // 로그인 시 이메일을 localStorage에 저장
              if (userData.email && !user.isAnonymous) {
                localStorage.setItem('currentUserEmail', userData.email)
              }
            } else {
              // Firestore에 사용자 정보가 없으면 기본값 설정
              const profile = {
                nickname: user.displayName || (user.isAnonymous ? 'ゲスト' : 'ユーザー'),
                email: user.email,
                uid: user.uid,
                isAnonymous: user.isAnonymous || false,
                createdAt: new Date()
              }
              setUserProfile(profile)
              // 로그인 시 이메일을 localStorage에 저장
              if (user.email && !user.isAnonymous) {
                localStorage.setItem('currentUserEmail', user.email)
              }
            }
          } catch (firestoreError) {
            console.warn('Firestore 연결 실패, 기본 프로필 사용:', firestoreError)
            // Firestore 연결 실패해도 기본 프로필로 계속 진행
            const profile = {
              nickname: user.displayName || (user.isAnonymous ? 'ゲスト' : 'ユーザー'),
              uid: user.uid,
              isAnonymous: user.isAnonymous || false,
              createdAt: new Date()
            }
            setUserProfile(profile)
          }
        } else {
          setCurrentUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('인증 상태 변경 오류:', error)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signInAnonymously,
    authenticate,
    signUp,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth 훅 export
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

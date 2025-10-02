import { useState, useEffect } from 'react'
import { collection, query, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../Contexts/AuthContext'

export const useRanking = () => {
  const [rankings, setRankings] = useState([])
  const [currentUserRank, setCurrentUserRank] = useState(null)
  const [totalUsers, setTotalUsers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { currentUser, userProfile } = useAuth()

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true)
        setError(null)

        const usersRef = collection(db, 'userStreaks')
        // currentUser 또는 userProfile에서 이메일 가져오기
        const currentUserEmail = currentUser?.email || userProfile?.email || null


        // 1. 상위 10명의 사용자 데이터 가져오기 (최적화: 필요한 데이터만)
        const topQuery = query(usersRef, orderBy('bestStreak', 'desc'), limit(10))
        const topSnapshot = await getDocs(topQuery)

        const rankingsData = []
        topSnapshot.forEach((doc) => {
          const data = doc.data()
          rankingsData.push({
            id: doc.id,
            email: data.email,
            nickname: data.nickname || 'Unknown',
            bestStreak: data.bestStreak || 0,
            totalGames: data.totalGames || 0,
            winRate: data.winRate || 0
          })
        })

        setRankings(rankingsData)

        // 2. 현재 사용자의 정확한 등수 계산 (효율적 알고리즘)
        if (currentUserEmail) {
          // 현재 사용자가 상위 10위 안에 있는지 확인
          const userInTop10 = rankingsData.find(user => user.email === currentUserEmail)
          
          
          if (userInTop10) {
            // 상위 10위 안에 있으면 인덱스로 순위 계산
            const rank = rankingsData.findIndex(user => user.email === currentUserEmail) + 1
            const userRankData = {
              ...userInTop10,
              rank: rank
            }
            setCurrentUserRank(userRankData)
          } else {
            // 상위 10위 밖이면 현재 사용자 데이터만 가져오기
            const userQuery = query(usersRef, where('email', '==', currentUserEmail))
            const userSnapshot = await getDocs(userQuery)
            
            
            if (!userSnapshot.empty) {
              const userData = userSnapshot.docs[0].data()
              const currentUserStreak = userData.bestStreak || 0
              
              
              // 현재 사용자보다 높은 점수를 가진 사용자 수를 카운트 (최적화)
              const higherScoreQuery = query(
                usersRef, 
                where('bestStreak', '>', currentUserStreak)
              )
              const higherScoreCount = await getCountFromServer(higherScoreQuery)
              const rank = higherScoreCount.data().count + 1
              
              const userRankData = {
                id: userSnapshot.docs[0].id,
                email: userData.email,
                nickname: userData.nickname || 'Unknown',
                bestStreak: currentUserStreak,
                totalGames: userData.totalGames || 0,
                winRate: userData.winRate || 0,
                rank: rank
              }
              
              setCurrentUserRank(userRankData)
            } else {
            }
          }
        } else {
        }

        // 3. 전체 사용자 수 카운트 (선택적)
        const totalCountSnapshot = await getCountFromServer(usersRef)
        setTotalUsers(totalCountSnapshot.data().count)

      } catch (err) {
        console.error('랭킹 데이터 가져오기 실패:', err)
        setError('랭킹 데이터를 불러올 수 없습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchRankings()
  }, [currentUser, userProfile]) // currentUser와 userProfile이 변경될 때마다 재실행

  return {
    rankings,
    currentUserRank,
    totalUsers,
    loading,
    error
  }
}

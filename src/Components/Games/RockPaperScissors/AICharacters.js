// AI 캐릭터 데이터
export const AI_CHARACTERS = [
  {
    id: 1,
    name: 'ゆう',
    difficulty: '簡単',
    winRate: '75%', // 플레이어 승률
    points: 1,
    avatar: '/yuu.png',
    color: 'bg-green-500',
    description: '初心者向け・1点+ボーナス',
    personality: '優しくて親切な指導者',
    aiPattern: 'random' // 랜덤 선택으로 쉬움
  },
  {
    id: 2,
    name: 'かりん',
    difficulty: '普通',
    winRate: '50%', // 플레이어 승률
    points: 2,
    avatar: '/karin.png',
    color: 'bg-blue-500',
    description: 'バランス型・2点+連勝ボーナス',
    personality: '冷静で公平な対戦相手',
    aiPattern: 'balanced' // 약간의 패턴이 있지만 균형적
  },
  {
    id: 3,
    name: 'ここあ',
    difficulty: '難しい',
    winRate: '25%', // 플레이어 승률
    points: 3,
    avatar: '/cocoa.png',
    color: 'bg-red-500',
    description: '上級者向け・3点+連勝ボーナス',
    personality: '戦略的で計算高い',
    aiPattern: 'counter' // 상대방 선택을 카운터하는 패턴
  },
  {
    id: 4,
    name: 'ちふゆ',
    difficulty: '超難しい',
    winRate: '10%', // 플레이어 승률
    points: 4,
    avatar: '/chihuu.png',
    color: 'bg-sky-400',
    description: '最強・4点+連勝ボーナス',
    personality: '完璧主義のプロゲーマー',
    aiPattern: 'advanced' // 고급 패턴 인식 및 대응
  }
]

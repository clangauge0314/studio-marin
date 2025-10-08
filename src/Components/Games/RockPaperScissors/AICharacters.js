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
    description: '無邪気でいたずら好きなかわいい妹キャラ',
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
    description: '明るくて友達が多い、水泳部のお姉さんタイプ',
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
    description: 'ちょっとバカっぽいオタク系チアガール',
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
    description: 'クールで優しくて、なんでも許してくれそうなお姉さん',
    aiPattern: 'advanced' // 고급 패턴 인식 및 대응
  }
]

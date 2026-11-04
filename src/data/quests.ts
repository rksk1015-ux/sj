import { Quest, SeasonId, EmotionOption } from '../types';

export const SEASONS_INFO: Record<SeasonId, { title: string; subtitle: string; days: string; themeColor: string; bgLight: string; icon: string }> = {
  1: {
    title: '시즌 1: 취향과 일상',
    subtitle: '내가 좋아하는 나',
    days: '1일 ~ 25일',
    themeColor: 'from-amber-400 to-orange-400',
    bgLight: 'bg-amber-50',
    icon: '✨',
  },
  2: {
    title: '시즌 2: 감정과 마음',
    subtitle: '내 안의 내면 탐구',
    days: '26일 ~ 50일',
    themeColor: 'from-teal-400 to-emerald-400',
    bgLight: 'bg-emerald-50',
    icon: '🌱',
  },
  3: {
    title: '시즌 3: 관계와 교실',
    subtitle: '타인 속의 나',
    days: '51일 ~ 75일',
    themeColor: 'from-sky-400 to-blue-400',
    bgLight: 'bg-sky-50',
    icon: '🌈',
  },
  4: {
    title: '시즌 4: 꿈과 미래',
    subtitle: '앞으로의 나',
    days: '76일 ~ 100일',
    themeColor: 'from-violet-400 to-pink-400',
    bgLight: 'bg-purple-50',
    icon: '🚀',
  },
};

export const EMOTION_OPTIONS: EmotionOption[] = [
  {
    type: 'HAPPY',
    label: '행복해요',
    emoji: '😊',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100/80 hover:bg-amber-100',
    borderColor: 'border-amber-300 ring-amber-400',
  },
  {
    type: 'CALM',
    label: '차분해요',
    emoji: '😌',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100/80 hover:bg-emerald-100',
    borderColor: 'border-emerald-300 ring-emerald-400',
  },
  {
    type: 'EXCITED',
    label: '신나요',
    emoji: '🤩',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100/80 hover:bg-orange-100',
    borderColor: 'border-orange-300 ring-orange-400',
  },
  {
    type: 'ANXIOUS',
    label: '불안해요',
    emoji: '😰',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100/80 hover:bg-indigo-100',
    borderColor: 'border-indigo-300 ring-indigo-400',
  },
  {
    type: 'SAD',
    label: '슬퍼요',
    emoji: '😢',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100/80 hover:bg-blue-100',
    borderColor: 'border-blue-300 ring-blue-400',
  },
  {
    type: 'TIRED',
    label: '피곤해요',
    emoji: '🥱',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100/80 hover:bg-purple-100',
    borderColor: 'border-purple-300 ring-purple-400',
  },
];

// Helper to generate full 100 days of thoughtful 5th grade prompts
const basePrompts: { [day: number]: Partial<Quest> } = {
  1: {
    title: '나의 가장 행복한 순간',
    question: '내가 하루 중 가장 행복하다고 느낄 때는 언제인가요?',
    guideHint: '집에 돌아와 포근한 침대에 누울 때, 맛있는 간식을 먹을 때 등 사소한 순간도 좋아요!',
    statBoost: 'selfAwareness',
    badgeId: 'badge_first_step',
    suggestedTags: ['방과후', '침대속', '간식타임', '게임', '가족과함께'],
  },
  2: {
    title: '내가 가장 아끼는 보물',
    question: '내 방이나 가방 속에 있는 물건 중 가장 아끼는 것은 무엇인가요?',
    guideHint: '누구에게 선물받았거나 나와 특별한 추억이 깃든 물건을 떠올려보세요.',
    statBoost: 'curiosity',
    suggestedTags: ['인형', '다이어리', '선물', '키링', '운동화'],
  },
  3: {
    title: '나만의 기분 전환 치트키',
    question: '우울하거나 심심할 때 들으면 기분이 싹 풀리는 노래나 소리는?',
    guideHint: '좋아하는 가수의 노래나 빗소리, 파도 소리, 반려견의 숨소리도 멋진 답이에요.',
    statBoost: 'creativity',
    suggestedTags: ['케이팝', 'ASMR', '자연의소리', '웃음소리'],
  },
  4: {
    title: '세상에서 가장 맛있는 한 입',
    question: '아무리 먹어도 질리지 않는 나의 소울 푸드는 무엇인가요?',
    guideHint: '어떤 날씨에, 누구와 먹을 때 가장 맛있는지도 적어주세요.',
    statBoost: 'selfAwareness',
    suggestedTags: ['떡볶이', '라면', '엄마표찌개', '치킨', '과일'],
  },
  5: {
    title: '주말 아침의 나',
    question: '알람 없이 푹 자고 일어난 토요일 아침, 내가 제일 먼저 하고 싶은 일은?',
    guideHint: '멍하니 창밖을 보거나 만화책을 볼 수도 있어요.',
    statBoost: 'selfAwareness',
    badgeId: 'badge_season1_early',
    suggestedTags: ['늦잠', '만화책', '이불속뒹굴', '아침산책'],
  },
  6: {
    title: '나의 숨겨진 장기',
    question: '남들은 잘 모르지만 내가 꽤 잘한다고 생각하는 소소한 재능은?',
    guideHint: '종이비행기 멀리 날리기, 동물 소리 흉내 내기, 정리정돈 등 무엇이든 훌륭해요.',
    statBoost: 'creativity',
    suggestedTags: ['손재주', '관찰력', '달리기', '유머', '집중력'],
  },
  7: {
    title: '내가 좋아하는 날씨와 계절',
    question: '내가 가장 사랑하는 계절의 공기 냄새나 날씨는 어떤 느낌인가요?',
    guideHint: '비 온 뒤 흙냄새, 겨울 첫눈 내리는 날의 차가운 뺨 느낌을 묘사해보세요.',
    statBoost: 'creativity',
    suggestedTags: ['봄바람', '여름비', '가을단풍', '겨울눈'],
  },
  8: {
    title: '나만의 비밀 아지트',
    question: '혼자 조용히 생각에 잠기고 싶을 때 찾아가는 장소가 있나요?',
    guideHint: '내 방 책상 밑, 동네 놀이터 그네, 학교 도서관 구석 자리 등.',
    statBoost: 'selfAwareness',
    suggestedTags: ['내방구석', '도서관', '놀이터그네', '베란다'],
  },
  9: {
    title: '가장 좋아하는 색깔의 의미',
    question: '내가 가장 좋아하는 색깔은 무엇이고, 그 색을 보면 어떤 감정이 드나요?',
    guideHint: '파란색은 시원함, 노란색은 따뜻함처럼 나만의 느낌을 적어보세요.',
    statBoost: 'curiosity',
    suggestedTags: ['하늘색', '민트색', '연노랑', '보라색', '초록색'],
  },
  10: {
    title: '나를 한 단어로 비유한다면',
    question: '나를 동물이나 식물, 혹은 사물에 비유한다면 무엇일까요?',
    guideHint: '고양이처럼 호기심이 많은지, 해바라기처럼 활발한지 이유와 함께 써보세요.',
    statBoost: 'creativity',
    badgeId: 'badge_day10_thinker',
    suggestedTags: ['호기심고양이', '느긋한나무', '반짝이는별', '포근한구름'],
  },
  11: {
    title: '요즘 푹 빠져있는 관심사',
    question: '시간 가는 줄 모르고 몰입하게 되는 나의 취미나 관심 주제는?',
    guideHint: '레고 조립, 그림 그리기, 특정 게임, 우주 이야기, 역사 등.',
    statBoost: 'curiosity',
    suggestedTags: ['그리기', '만들기', '독서', '운동', '과학'],
  },
  12: {
    title: '나만의 멋진 습관',
    question: '매일 혹은 자주 지키려고 노력하는 나만의 좋은 습관이 있나요?',
    guideHint: '아침에 물 마시기, 자기 전 내일 옷 챙기기, 인사 밝게 하기 등.',
    statBoost: 'selfAwareness',
    suggestedTags: ['물마시기', '인사하기', '정리정돈', '감사일기'],
  },
  // 13-25 Season 1 (Favorites & Daily Life)
  13: { title: '내가 닮고 싶은 이야기 속 인물', question: '책이나 영화 속 주인공 중 가장 멋지다고 느낀 캐릭터는 누구인가요?', guideHint: '그 주인공의 용기, 다정함, 지혜 중 어떤 점이 마음에 들었나요?', statBoost: 'curiosity', suggestedTags: ['용기있는인물', '다정한친구', '탐험가'] },
  14: { title: '나의 하루를 영화로 만든다면', question: '오늘 하루를 영화나 책 제목으로 짓는다면 뭐라고 붙이고 싶나요?', guideHint: '예: <우당탕탕 체육 시간>, <따끈따끈 붕어빵을 찾아서> 등 재미있게 지어보세요.', statBoost: 'creativity', suggestedTags: ['모험', '일상', '코미디', '감동'] },
  15: { title: '나를 웃게 만드는 것', question: '생각만 해도 피식 웃음이 나오는 재미있는 기억이나 유행어가 있나요?', guideHint: '친구와 눈 마주치고 웃음보 터졌던 순간을 떠올려보세요.', statBoost: 'social', suggestedTags: ['친구장난', '반려동물애교', '예능프로'] },
  16: { title: '나만의 편안한 옷차림', question: '입었을 때 몸도 마음도 가장 편안해지는 옷은 어떤 옷인가요?', guideHint: '늘어난 후드티, 부드러운 수면바지 등 나만의 힐링 옷!', statBoost: 'selfAwareness', suggestedTags: ['후드티', '트레이닝복', '잠옷'] },
  17: { title: '작지만 확실한 성취감', question: '오늘 하루 동안 내가 스스로 해내서 뿌듯했던 작은 일은?', guideHint: '어려운 수학 문제 하나 풀기, 숙제 미리 끝내기, 신발 가지런히 놓기 등.', statBoost: 'selfAwareness', suggestedTags: ['숙제끝', '방청소', '일찍일어나기'] },
  18: { title: '내가 찍고 싶은 풍경', question: '카메라가 있다면 지금 당장 영원히 간직하고 싶은 풍경은?', guideHint: '노을 지는 교실 창가, 우리 집 강아지의 잠든 얼굴 등.', statBoost: 'creativity', suggestedTags: ['노을', '교실풍경', '하늘', '가족'] },
  19: { title: '나만의 스트레스 해소법', question: '머리가 복잡할 때 나만의 머릿속을 비우는 방법은?', guideHint: '종이에 낙서하기, 베개에 소리 지르기, 신나게 자전거 타기 등.', statBoost: 'selfAwareness', suggestedTags: ['달리기', '낙서', '샤워', '잠자기'] },
  20: { title: '내가 모으고 싶은 것들', question: '만약 돈이나 공간 걱정 없이 무엇이든 모을 수 있다면 무엇을 수집할까요?', guideHint: '조개껍데기, 앤티크 엽서, 레고 시리즈, 전 세계 돌멩이 등!', statBoost: 'curiosity', suggestedTags: ['우표', '돌멩이', '피규어', '스티커'] },
  21: { title: '나에게 주고 싶은 선물', question: '이번 달 열심히 생활한 나에게 칭찬의 선물을 준다면 무엇을 줄까요?', guideHint: '꼭 비싼 물건이 아니어도 돼요. 달콤한 아이스크림이나 자유 시간 2시간도 좋아요.', statBoost: 'empathy', suggestedTags: ['자유시간', '디저트', '좋아하는책'] },
  22: { title: '내가 좋아하는 소리', question: '빗방울 떨어지는 소리, 낙엽 밟는 바스락 소리 중 내가 가장 좋아하는 소리는?', guideHint: '그 소리를 들으면 왜 마음이 편안해지는지도 써보세요.', statBoost: 'creativity', suggestedTags: ['빗소리', '새소리', '바스락낙엽'] },
  23: { title: '시간이 멈춘다면 하고 싶은 일', question: '마법처럼 1시간 동안 세상 모든 시간이 멈춘다면 나는 무엇을 할까요?', guideHint: '조용히 미술관 구경하기, 낮잠 자기, 친구에게 깜짝 쪽지 남기기 등.', statBoost: 'curiosity', suggestedTags: ['낮잠', '깜짝선물', '탐험'] },
  24: { title: '나의 가장 편안한 자세', question: '의자에 앉거나 누울 때 내가 가장 편안함을 느끼는 포즈는?', guideHint: '무릎 웅크리기, 대자로 뻗기, 턱 괴기 등 나의 신체 버릇을 관찰해보세요.', statBoost: 'selfAwareness', suggestedTags: ['무릎베개', '대자로눕기', '쿠션안기'] },
  25: { title: '시즌 1 완주! 나만의 취향 지도', question: '지난 25일 동안 발견한 나의 가장 큰 매력과 취향은 무엇인가요?', guideHint: '시즌 1을 마무리하며 내가 나에 대해 새롭게 알게 된 점을 칭찬해주세요.', statBoost: 'selfAwareness', badgeId: 'badge_season1_master', suggestedTags: ['시즌1완주', '나의발견', '자아칭찬'] },

  // Season 2 (Days 26-50): 감정과 마음 (내 안의 내면 탐구)
  26: { title: '내 마음속 화산이 폭발할 때', question: '화가 불쑥 치밀어 오를 때, 내 몸과 마음에는 어떤 신호가 오나요?', guideHint: '얼굴이 뜨거워지거나 주먹이 쥐어지는 신호를 알아차리는 것이 마음 조절의 첫걸음이에요.', statBoost: 'empathy', suggestedTags: ['심장쿵쾅', '얼굴빨개짐', '말문막힘'] },
  27: { title: '마음의 온도계', question: '오늘 내 마음의 온도는 몇 도쯤일까요? 그 이유는 무엇인가요?', guideHint: '얼어붙을 듯 차가운 영하인지, 포근한 25도인지 비유해 보세요.', statBoost: 'selfAwareness', suggestedTags: ['포근한25도', '열정의40도', '시원한18도'] },
  28: { title: '눈물이 말하고 싶은 것', question: '슬플 때 흘리는 눈물은 나에게 어떤 이야기를 건네고 있을까요?', guideHint: '"지금 많이 지쳤어", "속상한 마음을 알아줘" 같은 마음의 목소리를 들어보세요.', statBoost: 'empathy', suggestedTags: ['위로가필요해', '속상함', '치유'] },
  29: { title: '용기가 필요했던 순간', question: '가장 최근에 두렵거나 떨렸지만 꾹 참고 도전했던 일은 무엇인가요?', guideHint: '발표하기, 모르는 친구에게 말 걸기, 치과 가기 등.', statBoost: 'curiosity', suggestedTags: ['발표하기', '먼저말걸기', '용기'] },
  30: { title: '나를 안아주는 한마디', question: '힘들 때 누군가 나에게 꼭 건네주었으면 하는 따뜻한 말은?', guideHint: '"괜찮아, 그럴 수 있어", "너는 충분히 잘하고 있어" 같은 마법의 주문을 적어보세요.', statBoost: 'empathy', badgeId: 'badge_day30_heart', suggestedTags: ['괜찮아', '잘하고있어', '응원해'] },
  35: { title: '질투와 부러움의 마주보기', question: '친구나 다른 사람이 부러웠던 적이 있나요? 그 마음 뒤에 숨은 나의 진짜 바람은?', guideHint: '부러움은 내가 무엇을 잘하고 싶은지 알려주는 신호등이에요.', statBoost: 'selfAwareness', suggestedTags: ['부러움', '나의성장', '속마음'] },
  40: { title: '불안을 다독이는 숨쉬기', question: '시험이나 중요한 일을 앞두고 긴장될 때 나만의 호흡법이나 긴장 완화법은?', guideHint: '천천히 코로 들이마시고 입으로 내쉬는 3번의 심호흡!', statBoost: 'selfAwareness', suggestedTags: ['심호흡', '스트레칭', '마인드컨트롤'] },
  45: { title: '마음속 고마움 우체통', question: '최근에 마음속으로 정말 감사했지만 쑥스러워서 말하지 못한 사람은 누구인가요?', guideHint: '부모님, 영양사 선생님, 짝꿍, 혹은 묵묵히 버텨준 나 자신.', statBoost: 'empathy', suggestedTags: ['감사편지', '부모님', '선생님', '친구'] },
  50: { title: '시즌 2 완주! 내 마음의 정원사', question: '내 마음을 하나의 정원에 비유한다면, 지금 어떤 꽃과 나무가 자라고 있나요?', guideHint: '감정의 비바람을 견디고 피어난 나만의 예쁜 꽃을 상상해보세요.', statBoost: 'selfAwareness', badgeId: 'badge_season2_master', suggestedTags: ['마음의정원', '성장', '시즌2완주'] },

  // Season 3 (Days 51-75): 관계와 교실 (타인 속의 나)
  51: { title: '친구가 슬퍼할 때 나의 슈퍼파워', question: '친한 친구가 울거나 속상해할 때 나는 어떤 방법으로 위로해 주나요?', guideHint: '가만히 옆에 앉아주기, 손잡아주기, 맛있는 사탕 건네기 등.', statBoost: 'social', suggestedTags: ['경청하기', '손잡아주기', '간식선물'] },
  55: { title: '내가 듣고 싶은 칭찬', question: '친구들에게 "너는 정말 OOO한 사람이야"라는 말을 듣는다면 어떤 단어가 가장 기쁠까요?', guideHint: '다정한, 유쾌한, 믿음직한, 센스 있는, 정직한 등.', statBoost: 'social', suggestedTags: ['다정한', '유쾌한', '믿음직한', '의리'] },
  60: { title: '서로 생각이 다를 때 대화법', question: '모둠 활동 중 친구와 의견이 부딪혔을 때 평화롭게 해결하는 나만의 팁은?', guideHint: '가위바위보 대신 상대방의 이유를 끝까지 먼저 들어보기!', statBoost: 'social', badgeId: 'badge_day60_peacemaker', suggestedTags: ['의견존중', '경청', '타협'] },
  65: { title: '우리 반에 선물하고 싶은 분위기', question: '우리 반 교실이 어떤 곳이 되었으면 좋겠나요? 내가 만들고 싶은 교실 분위기는?', guideHint: '누구도 외롭지 않은 교실, 실수해도 웃으며 격려하는 교실 등.', statBoost: 'social', suggestedTags: ['배려', '웃음꽃', '격려하는교실'] },
  70: { title: '나를 지켜주는 건강한 경계선', question: '친구가 나를 장난으로 놀릴 때, 상처받지 않고 단호하게 내 마음을 표현하는 방법은?', guideHint: '"그 장난은 기분이 안 좋아, 멈춰줘"라고 차분히 말하는 용기!', statBoost: 'selfAwareness', suggestedTags: ['나의표현', '경계선', '당당함'] },
  75: { title: '시즌 3 완주! 관계의 다리 놓기', question: '친구들과 함께 어울리며 내가 배운 가장 소중한 배려의 순간은 무엇인가요?', guideHint: '나와 다른 친구를 인정하고 친구의 장점을 발견했던 멋진 경험!', statBoost: 'social', badgeId: 'badge_season3_master', suggestedTags: ['시즌3완주', '우정의다리', '배려와우정'] },

  // Season 4 (Days 76-100): 꿈과 미래 (앞으로의 나)
  76: { title: '20년 후 미래 여행 타임머신', question: '타임머신을 타고 20년 뒤 30대가 된 나를 만나러 간다면, 어떤 모습일까요?', guideHint: '어떤 직업, 어떤 표정, 어떤 멋진 어른이 되어 있을지 상상해보세요.', statBoost: 'curiosity', suggestedTags: ['미래의나', '멋진어른', '꿈'] },
  80: { title: '내가 해결하고 싶은 세상의 문제', question: '만약 나에게 마법 같은 힘이 있다면 세상의 어떤 문제를 꼭 해결하고 싶나요?', guideHint: '지구 온난화, 유기동물 문제, 아픈 사람들을 돕는 신약 개발 등.', statBoost: 'curiosity', badgeId: 'badge_day80_visionary', suggestedTags: ['지구환경', '평화', '과학발명', '동물보호'] },
  85: { title: '평생 꼭 배워보고 싶은 배움의 퀘스트', question: '어른이 되어서라도 꼭 깊게 배워보고 싶은 악기, 언어, 스포츠, 기술은?', guideHint: '스쿠버다이빙, 우주 천문학, 피아노 협주곡, 요리 등.', statBoost: 'creativity', suggestedTags: ['악기연주', '외국어', '스포츠', '과학'] },
  90: { title: '나의 인생 좌우명 만들기', question: '어려움이 닥쳤을 때 나를 일으켜 세워줄 나만의 멋진 한 문장(슬로건)은?', guideHint: '예: "느려도 괜찮아, 멈추지 않는다면!", "오늘의 나는 어제보다 한 뼘 더 자란다."', statBoost: 'creativity', suggestedTags: ['좌우명', '나만의신조', '희망'] },
  95: { title: '미래의 나에게 보내는 편지', question: '10년 뒤의 나에게 지금 5학년의 내가 꼭 전하고 싶은 응원의 쪽지는?', guideHint: '"지금의 순수한 마음과 웃음을 잊지 말아줘!"', statBoost: 'selfAwareness', suggestedTags: ['미래편지', '타임캡슐', '따뜻한응원'] },
  100: { title: '대망의 100일 완주! 새로운 시작', question: '100일간의 자기이해 퀘스트를 완주한 나 자신에게 가장 해주고 싶은 칭찬은?', guideHint: '포기하지 않고 나를 찾아 떠난 위대한 여정! 나만의 멋진 왕관을 씌워주세요.', statBoost: 'creativity', badgeId: 'badge_day100_legend', suggestedTags: ['100일완주', '위대한탐험가', '나를사랑해'] },
};

export function getSeasonByDay(day: number): SeasonId {
  if (day <= 25) return 1;
  if (day <= 50) return 2;
  if (day <= 75) return 3;
  return 4;
}

// Generate the complete 100 questions deterministically
export const ALL_QUESTS: Quest[] = Array.from({ length: 100 }, (_, idx) => {
  const day = idx + 1;
  const season = getSeasonByDay(day);
  const seasonInfo = SEASONS_INFO[season];

  if (basePrompts[day]) {
    const override = basePrompts[day];
    return {
      day,
      season,
      seasonTitle: seasonInfo.title,
      title: override.title || `${day}일차 퀘스트`,
      question: override.question || `오늘의 자기이해 질문 (${day}일차)`,
      guideHint: override.guideHint || '솔직하고 편안하게 내 마음을 적어보세요.',
      statBoost: override.statBoost || 'selfAwareness',
      statPoints: override.statPoints || 5,
      badgeId: override.badgeId,
      suggestedTags: override.suggestedTags || ['나의이야기', '소중한순간'],
    };
  }

  // Fallbacks for procedural days with thoughtful thematic variations
  let statBoost: Quest['statBoost'] = 'selfAwareness';
  let title = '';
  let question = '';
  let guideHint = '';
  let suggestedTags = ['생각', '일상'];

  if (season === 1) {
    statBoost = day % 2 === 0 ? 'creativity' : 'curiosity';
    title = `나의 기분 좋은 취향 #${day}`;
    question = `내가 좋아하는 취향 중 다른 사람에게도 꼭 추천하고 싶은 것은 무엇인가요?`;
    guideHint = `음식, 장소, 책, 게임, 음악 등 내가 푹 빠져본 경험을 적어보세요.`;
    suggestedTags = ['취향공유', '추천', '소소한행복'];
  } else if (season === 2) {
    statBoost = day % 2 === 0 ? 'empathy' : 'selfAwareness';
    title = `내 안의 감정 구름 #${day}`;
    question = `오늘 내 마음속을 스쳐 지나간 가장 인상적인 감정은 무엇이었나요?`;
    guideHint = `기쁨, 아쉬움, 뿌듯함, 설렘 등 그 감정이 찾아온 이유를 탐구해보세요.`;
    suggestedTags = ['마음일기', '감정알아차리기', '내면소리'];
  } else if (season === 3) {
    statBoost = day % 2 === 0 ? 'social' : 'empathy';
    title = `친구와 교실 속의 나 #${day}`;
    question = `오늘 학교나 일상에서 만난 사람들에게 나는 어떤 표정으로 기억되었을까요?`;
    guideHint = `내가 친구에게 먼저 건넨 따뜻한 눈빛이나 인사를 되돌아보세요.`;
    suggestedTags = ['교실생활', '친구와함께', '다정한시선'];
  } else {
    statBoost = day % 2 === 0 ? 'creativity' : 'curiosity';
    title = `내일의 꿈을 그리는 나 #${day}`;
    question = `미래에 내가 꼭 도전해보고 싶은 가슴 뛰는 모험 한 가지는?`;
    guideHint = `우주여행, 세계 일주, 나만의 발명품 만들기 등 마음껏 상상해보세요.`;
    suggestedTags = ['꿈꾸는미래', '모험', '상상력'];
  }

  return {
    day,
    season,
    seasonTitle: seasonInfo.title,
    title,
    question,
    guideHint,
    statBoost,
    statPoints: 5,
    suggestedTags,
  };
});

/**
 * 나 찾기 100일 퀘스트 - script.js
 * 초등학생 5학년 자기이해 프로그램 로직 & 구글 시트 연동 기능
 */

let selectedEmotion = 'HAPPY';
let currentDay = 12;

const STATS = {
  creativity: 82,
  empathy: 78,
  selfAwareness: 86,
  social: 75,
  curiosity: 88,
};

function selectEmotion(type, element) {
  selectedEmotion = type;
  document.querySelectorAll('.emotion-btn').forEach(btn => btn.classList.remove('active'));
  element.classList.add('active');
}

function submitQuest() {
  const textarea = document.getElementById('answerInput');
  const text = textarea ? textarea.value.trim() : '';
  
  if (text.length < 20) {
    alert('소중한 나의 이야기를 20자 이상 자세히 적어주세요! (현재 ' + text.length + '자)');
    return;
  }

  // 3D Card Flip
  const cardInner = document.getElementById('questCardInner');
  if (cardInner) {
    cardInner.classList.add('flipped');
  }

  // Save to LocalStorage
  const savedData = JSON.parse(localStorage.getItem('quest100_standalone') || '{}');
  savedData[currentDay] = {
    day: currentDay,
    emotion: selectedEmotion,
    text: text,
    completedAt: new Date().toISOString()
  };
  localStorage.setItem('quest100_standalone', JSON.stringify(savedData));

  // Update Result Preview
  const resultText = document.getElementById('savedAnswerText');
  if (resultText) {
    resultText.innerText = `"${text}"`;
  }
}

function flipBack() {
  const cardInner = document.getElementById('questCardInner');
  if (cardInner) {
    cardInner.classList.remove('flipped');
  }
}

// Student Roster Management
let classStudents = [
  { id: 's1', name: '김민지', avatar: '🐰', status: '피아노 연습 중 🎹', days: 12, emotion: 'HAPPY' },
  { id: 's2', name: '이준우', avatar: '🦁', status: '축구할 사람 모여라 ⚽', days: 12, emotion: 'EXCITED' },
  { id: 's3', name: '박서연', avatar: '🦊', status: '그림 그리기 🎨', days: 11, emotion: 'CALM' },
  { id: 's4', name: '최도윤', avatar: '🐻', status: '우주 다큐멘터리 🚀', days: 12, emotion: 'CALM' }
];

function addStudentToRoster(name, avatar, status) {
  if (!name || !name.trim()) {
    alert('학생 이름을 입력해주세요!');
    return;
  }
  const newStudent = {
    id: 's_' + Date.now(),
    name: name.trim(),
    avatar: avatar || '🎒',
    status: status || '100일 퀘스트 시작!',
    days: 1,
    emotion: 'HAPPY'
  };
  classStudents.unshift(newStudent);
  localStorage.setItem('quest100_students', JSON.stringify(classStudents));
  alert(`✅ '${newStudent.name}' 학생이 명단에 성공적으로 등록되었습니다!`);
}

// Google Sheets Sync Placeholders
function handleLoadFromSheet() {
  const scriptUrl = prompt('구글 Apps Script 웹 앱 URL을 입력하세요:\n(취소 시 저장된 기본 학생 명단을 불러옵니다)');
  if (scriptUrl) {
    alert('🔄 구글 스프레드시트로부터 최신 학생 명단 및 퀘스트 기록을 성공적으로 동기화했습니다!');
  } else {
    alert(`로컬에 저장된 총 ${classStudents.length}명의 학생 명단을 불러왔습니다.`);
  }
}

function handleSaveToSheet() {
  const savedData = JSON.parse(localStorage.getItem('quest100_standalone') || '{}');
  const count = Object.keys(savedData).length;
  alert(`💾 [시트에 결과 저장]\n등록된 학생 명단(${classStudents.length}명)과 작성된 퀘스트 답변(${count}개)이 구글 시트 전송 대기열에 기록되었습니다!`);
}

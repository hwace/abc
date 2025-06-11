// 게임 상태 관리
let gameState = 'start'; // 'start', 'waiting', 'ready', 'result', 'failed'
let startTime = 0;
let gameTimeout = null;

// DOM 요소들
const gameContainer = document.getElementById('gameContainer');
const startScreen = document.getElementById('startScreen');
const waitingScreen = document.getElementById('waitingScreen');
const readyScreen = document.getElementById('readyScreen');
const resultScreen = document.getElementById('resultScreen');
const failedScreen = document.getElementById('failedScreen');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const restartFailBtn = document.getElementById('restartFailBtn');
const reactionTimeSpan = document.getElementById('reactionTime');

// 화면 표시 함수
function showScreen(screenName) {
    // 모든 화면 숨기기
    const screens = [startScreen, waitingScreen, readyScreen, resultScreen, failedScreen];
    screens.forEach(screen => screen.classList.add('hidden'));
    
    // 배경색 초기화
    gameContainer.className = 'game-container';
    
    // 선택한 화면 표시
    switch(screenName) {
        case 'start':
            startScreen.classList.remove('hidden');
            break;
        case 'waiting':
            waitingScreen.classList.remove('hidden');
            gameContainer.classList.add('waiting');
            break;
        case 'ready':
            readyScreen.classList.remove('hidden');
            gameContainer.classList.add('ready');
            break;
        case 'result':
            resultScreen.classList.remove('hidden');
            break;
        case 'failed':
            failedScreen.classList.remove('hidden');
            gameContainer.classList.add('failed');
            break;
    }
}

// 게임 시작 함수
function startGame() {
    gameState = 'waiting';
    showScreen('waiting');
    
    // 5~13초 사이 랜덤 시간 후 초록 화면으로 변경
    const randomDelay = Math.random() * 8000 + 5000; // 5000ms ~ 13000ms
    
    gameTimeout = setTimeout(() => {
        gameState = 'ready';
        showScreen('ready');
        startTime = Date.now(); // 정확한 시작 시간 기록
    }, randomDelay);
}

// 게임 화면 클릭 처리
function handleGameClick() {
    if (gameState === 'waiting') {
        // 빨간 화면에서 클릭 시 실격패
        clearTimeout(gameTimeout);
        gameState = 'failed';
        showScreen('failed');
    } else if (gameState === 'ready') {
        // 초록 화면에서 클릭 시 반응속도 측정
        const endTime = Date.now();
        const reactionTime = endTime - startTime;
        
        reactionTimeSpan.textContent = reactionTime + 'ms';
        gameState = 'result';
        showScreen('result');
    }
}

// 게임 리셋 함수
function resetGame() {
    if (gameTimeout) {
        clearTimeout(gameTimeout);
        gameTimeout = null;
    }
    gameState = 'start';
    startTime = 0;
    showScreen('start');
}

// 이벤트 리스너 등록
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetGame);
restartFailBtn.addEventListener('click', resetGame);

// 게임 화면 클릭 이벤트 (대기/준비 화면에서만)
gameContainer.addEventListener('click', (e) => {
    // 버튼 클릭이 아닌 경우에만 게임 클릭 처리
    if (!e.target.tagName.toLowerCase() === 'button' && 
        (gameState === 'waiting' || gameState === 'ready')) {
        handleGameClick();
    }
});

// 키보드 지원 (스페이스바 또는 엔터키)
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        
        if (gameState === 'start') {
            startGame();
        } else if (gameState === 'waiting' || gameState === 'ready') {
            handleGameClick();
        } else if (gameState === 'result' || gameState === 'failed') {
            resetGame();
        }
    }
});

// 페이지 언로드 시 타이머 정리
window.addEventListener('beforeunload', () => {
    if (gameTimeout) {
        clearTimeout(gameTimeout);
    }
});
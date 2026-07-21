const QUESTIONS = [{
    question: 'Which planet is known as the "Red Planet"?',
    options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
}, {
    question: 'What is the largest ocean on Earth?',
    options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'],
    correct: 3,
}, {
    question: 'Who developed the theory of relativity?',
    options: ['Isaac Newton', 'Albert Einstein', 'Nikola Tesla', 'Stephen Hawking'],
    correct: 1,
}, {
    question: 'What is the chemical symbol for water?',
    options: ['H2O', 'CO2', 'NaCl', 'O2'],
    correct: 0,
}, {
    question: 'Which country has the most population?',
    options: ['USA', 'India', 'China', 'Indonesia'],
    correct: 1,
}, {
    question: 'What is the smallest prime number?',
    options: ['0', '1', '2', '3'],
    correct: 2,
}, {
    question: 'Which animal is known as the "King of the Jungle"?',
    options: ['Tiger', 'Lion', 'Elephant', 'Bear'],
    correct: 1,
}, {
    question: 'What is the capital of Japan?',
    options: ['Seoul', 'Beijing', 'Bangkok', 'Tokyo'],
    correct: 3,
}, {
    question: 'How many continents are there on Earth?',
    options: ['5', '6', '7', '8'],
    correct: 2,
}, {
    question: 'What is the speed of light approximately?',
    options: ['300,000 km/s', '150,000 km/s', '500,000 km/s', '100,000 km/s'],
    correct: 0,
},];

const TOTAL = QUESTIONS.length;
const TIME_PER_QUESTION = 15; // seconds

// ============================================================
//  STATE
// ============================================================
let currentIndex = 0;
let score = 0;
let correctTotal = 0;
let wrongTotal = 0;
let timer = TIME_PER_QUESTION;
let timerInterval = null;
let isAnswered = false;
let isQuizComplete = false;

const questionScreen = document.getElementById('questionScreen');
const resultScreen = document.getElementById('resultScreen');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const nextBtn = document.getElementById('nextBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const questionCounter = document.getElementById('questionCounter');
const progressPercent = document.getElementById('progressPercent');
const progressFill = document.getElementById('progressFill');
const timerDisplay = document.getElementById('timerDisplay');
const timerBarFill = document.getElementById('timerBarFill');

// result elements
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultSubtitle = document.getElementById('resultSubtitle');
const finalScore = document.getElementById('finalScore');
const totalQuestions = document.getElementById('totalQuestions');
const correctCount = document.getElementById('correctCount');
const wrongCount = document.getElementById('wrongCount');
const accuracyDisplay = document.getElementById('accuracyDisplay');
const restartBtn = document.getElementById('restartBtn');

// ============================================================
//  HELPERS
// ============================================================
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}



const shuffledQuestions = shuffleArray([...QUESTIONS]);
function renderQuestion(index) {
    const q = shuffledQuestions[index];
    if (!q) return;

    isAnswered = false;
    nextBtn.disabled = true;
    clearTimer();

    // Update question text
    questionText.textContent = q.question;

    // Build options with letters
    const letters = ['A', 'B', 'C', 'D'];
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.dataset.index = i;
        btn.innerHTML = `
              <span class="letter">${letters[i]}</span>
              <span class="option-text">${opt}</span>
            `;
        btn.addEventListener('click', () => handleOptionClick(i));
        optionsContainer.appendChild(btn);
    });

    // Update progress
    const current = index + 1;
    const pct = Math.round((current / TOTAL) * 100);
    questionCounter.textContent = `Question ${current} / ${TOTAL}`;
    progressPercent.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;

    // Update score badge
    scoreDisplay.textContent = score;

    // Reset & start timer
    timer = TIME_PER_QUESTION;
    updateTimerDisplay();
    startTimer();
}

function startTimer() {
    clearTimer();
    timerInterval = setInterval(() => {
        timer -= 1;
        updateTimerDisplay();

        if (timer <= 0) {
            clearTimer();
            // Time's up — auto-answer as wrong
            if (!isAnswered) {
                handleTimeout();
            }
        }
    }, 1000);
}

function clearTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    timerDisplay.textContent = timer;
    const pct = (timer / TIME_PER_QUESTION) * 100;
    timerBarFill.style.width = `${Math.max(0, pct)}%`;

    // Visual states
    timerDisplay.classList.remove('warning', 'danger');
    timerBarFill.classList.remove('warning', 'danger');

    if (timer <= 4) {
        timerDisplay.classList.add('danger');
        timerBarFill.classList.add('danger');
    } else if (timer <= 7) {
        timerDisplay.classList.add('warning');
        timerBarFill.classList.add('warning');
    }
}
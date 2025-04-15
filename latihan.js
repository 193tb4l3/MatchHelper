// Question bank with different levels and topics
const questionBank = [
    // Easy Questions
    {
        id: 1,
        question: "Berapakah hasil dari 5 + 7?",
        options: ["10", "11", "12", "13"],
        answer: "12",
        explanation: "Penjumlahan sederhana: 5 + 7 = 12",
        level: "easy",
        topic: "aljabar"
    },
    {
        id: 2,
        question: "Jika sebuah persegi memiliki panjang sisi 4 cm, berapakah kelilingnya?",
        options: ["8 cm", "12 cm", "16 cm", "20 cm"],
        answer: "16 cm",
        explanation: "Keliling persegi = 4 × sisi = 4 × 4 cm = 16 cm",
        level: "easy",
        topic: "geometri"
    },
    {
        id: 3,
        question: "Berapakah 50% dari 80?",
        options: ["20", "30", "40", "50"],
        answer: "40",
        explanation: "50% berarti setengah, jadi 80 ÷ 2 = 40",
        level: "easy",
        topic: "aljabar"
    },
    
    // Medium Questions
    {
        id: 4,
        question: "Jika x + 5 = 12, berapakah nilai x?",
        options: ["5", "6", "7", "8"],
        answer: "7",
        explanation: "x = 12 - 5 = 7",
        level: "medium",
        topic: "aljabar"
    },
    {
        id: 5,
        question: "Berapakah hasil dari 3² + 4²?",
        options: ["5", "12", "25", "49"],
        answer: "25",
        explanation: "3² = 9, 4² = 16. Jadi 9 + 16 = 25",
        level: "medium",
        topic: "aljabar"
    },
    {
        id: 6,
        question: "Dalam segitiga siku-siku, jika panjang dua sisi lainnya adalah 3 cm dan 4 cm, berapakah panjang sisi miring?",
        options: ["5 cm", "6 cm", "7 cm", "8 cm"],
        answer: "5 cm",
        explanation: "Menggunakan teorema Pythagoras: √(3² + 4²) = √(9 + 16) = √25 = 5 cm",
        level: "medium",
        topic: "geometri"
    },
    
    // Hard Questions
    {
        id: 7,
        question: "Jika f(x) = 2x² - 3x + 1, berapakah f(2)?",
        options: ["3", "5", "7", "9"],
        answer: "3",
        explanation: "f(2) = 2(2)² - 3(2) + 1 = 8 - 6 + 1 = 3",
        level: "hard",
        topic: "aljabar"
    },
    {
        id: 8,
        question: "Berapakah nilai dari sin(30°)?",
        options: ["0", "0.5", "√2/2", "1"],
        answer: "0.5",
        explanation: "Nilai sin(30°) adalah 1/2 atau 0.5",
        level: "hard",
        topic: "trigonometri"
    },
    {
        id: 9,
        question: "Turunan pertama dari f(x) = 3x² + 2x - 5 adalah...",
        options: ["6x + 2", "3x + 2", "6x - 5", "3x² + 2"],
        answer: "6x + 2",
        explanation: "Turunan dari 3x² adalah 6x, turunan dari 2x adalah 2, turunan dari konstanta adalah 0",
        level: "hard",
        topic: "kalkulus"
    }
];

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const submitBtn = document.getElementById('submit-btn');
const generateBtn = document.getElementById('generate-btn');
const restartBtn = document.getElementById('restart-btn');
const levelBtns = document.querySelectorAll('.level-btn');
const topicSelect = document.getElementById('topic-select');
const questionCount = document.getElementById('question-count');
const timerElement = document.getElementById('timer');
const progressBar = document.querySelector('.progress-fill');
const progressText = document.getElementById('progress-text');
const resultContainer = document.querySelector('.result-container');
const scorePercent = document.getElementById('score-percent');
const correctAnswers = document.getElementById('correct-answers');
const wrongAnswers = document.getElementById('wrong-answers');
const totalTime = document.getElementById('total-time');
const answerReviewContent = document.getElementById('answer-review-content');

// Quiz Variables
let currentQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let score = 0;
let startTime;
let timerInterval;
let quizDuration = 0;

// Event Listeners
generateBtn.addEventListener('click', startQuiz);
prevBtn.addEventListener('click', showPreviousQuestion);
nextBtn.addEventListener('click', showNextQuestion);
submitBtn.addEventListener('click', submitQuiz);
restartBtn.addEventListener('click', resetQuiz);

levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        levelBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Start Quiz Function
function startQuiz() {
    const selectedLevel = document.querySelector('.level-btn.active').dataset.level;
    const selectedTopic = topicSelect.value;
    
    // Filter questions based on selection
    currentQuestions = questionBank.filter(q => {
        const levelMatch = selectedLevel === 'all' || q.level === selectedLevel;
        const topicMatch = selectedTopic === 'all' || q.topic === selectedTopic;
        return levelMatch && topicMatch;
    });
    
    // Shuffle questions
    currentQuestions = shuffleArray(currentQuestions);
    
    if (currentQuestions.length === 0) {
        questionText.textContent = "Tidak ada soal yang tersedia dengan filter yang dipilih. Silakan coba kombinasi lain.";
        optionsContainer.innerHTML = '';
        return;
    }
    
    // Initialize quiz variables
    userAnswers = new Array(currentQuestions.length).fill(null);
    currentQuestionIndex = 0;
    score = 0;
    startTime = new Date();
    
    // Start timer
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    
    // Update UI
    questionCount.textContent = `${currentQuestions.length} soal tersedia`;
    progressText.textContent = `0/${currentQuestions.length}`;
    progressBar.style.width = '0%';
    
    // Enable/disable buttons
    prevBtn.disabled = true;
    nextBtn.disabled = currentQuestions.length <= 1;
    submitBtn.disabled = true;
    
    // Hide result container if shown
    resultContainer.classList.add('hidden');
    
    // Show first question
    showQuestion();
}

// Show Question Function
function showQuestion() {
    const question = currentQuestions[currentQuestionIndex];
    
    questionText.textContent = question.question;
    optionsContainer.innerHTML = '';
    
    // Create option buttons
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.classList.add('option-btn');
        optionBtn.textContent = option;
        
        // Check if this option was previously selected
        if (userAnswers[currentQuestionIndex] === option) {
            optionBtn.classList.add('selected');
        }
        
        optionBtn.addEventListener('click', () => selectOption(option));
        optionsContainer.appendChild(optionBtn);
    });
    
    // Update navigation buttons
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === currentQuestions.length - 1;
    
    // Update progress
    progressText.textContent = `${currentQuestionIndex + 1}/${currentQuestions.length}`;
    progressBar.style.width = `${((currentQuestionIndex + 1) / currentQuestions.length) * 100}%`;
    
    // Enable submit if all questions are answered
    checkAllAnswered();
}

// Select Option Function
function selectOption(selectedOption) {
    // Remove selected class from all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to clicked option
    event.target.classList.add('selected');
    
    // Save user's answer
    userAnswers[currentQuestionIndex] = selectedOption;
    
    // Enable submit button if all questions are answered
    checkAllAnswered();
}

// Check if all questions are answered
function checkAllAnswered() {
    const allAnswered = userAnswers.every(answer => answer !== null);
    submitBtn.disabled = !allAnswered;
}

// Navigation Functions
function showNextQuestion() {
    if (currentQuestionIndex < currentQuestions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// Submit Quiz Function
function submitQuiz() {
    // Stop timer
    clearInterval(timerInterval);
    quizDuration = Math.floor((new Date() - startTime) / 1000);
    
    // Calculate score
    score = 0;
    currentQuestions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
            score++;
        }
    });
    
    // Display results
    showResults();
}

// Show Results Function
function showResults() {
    const percentage = Math.round((score / currentQuestions.length) * 100);
    
    // Update score display
    scorePercent.textContent = percentage;
    correctAnswers.textContent = score;
    wrongAnswers.textContent = currentQuestions.length - score;
    totalTime.textContent = formatTime(quizDuration);
    
    // Set progress circle
    document.querySelector('.score-circle').style.setProperty('--percentage', `${percentage}%`);
    
    // Generate answer review
    answerReviewContent.innerHTML = '';
    currentQuestions.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.answer;
        
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('review-item');
        
        const reviewQuestion = document.createElement('div');
        reviewQuestion.classList.add('review-question');
        reviewQuestion.textContent = `${index + 1}. ${question.question}`;
        
        const reviewAnswer = document.createElement('div');
        reviewAnswer.classList.add('review-answer');
        reviewAnswer.classList.add(isCorrect ? 'correct' : 'wrong');
        reviewAnswer.textContent = `Jawaban Anda: ${userAnswers[index] || 'Tidak dijawab'} ${isCorrect ? '✓' : '✗'}`;
        
        const correctAnswer = document.createElement('div');
        correctAnswer.classList.add('review-answer', 'correct');
        correctAnswer.textContent = `Jawaban Benar: ${question.answer}`;
        
        const reviewExplanation = document.createElement('div');
        reviewExplanation.classList.add('review-explanation');
        reviewExplanation.textContent = `Penjelasan: ${question.explanation}`;
        
        reviewItem.appendChild(reviewQuestion);
        reviewItem.appendChild(reviewAnswer);
        if (!isCorrect) {
            reviewItem.appendChild(correctAnswer);
        }
        reviewItem.appendChild(reviewExplanation);
        
        answerReviewContent.appendChild(reviewItem);
    });
    
    // Show result container
    resultContainer.classList.remove('hidden');
    
    // Scroll to results
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

// Reset Quiz Function
function resetQuiz() {
    currentQuestions = [];
    currentQuestionIndex = 0;
    userAnswers = [];
    score = 0;
    
    // Reset UI
    questionText.textContent = "Pilih tingkat kesulitan dan topik, lalu klik \"Generate Soal\" untuk memulai";
    optionsContainer.innerHTML = '';
    questionCount.textContent = "0 soal tersedia";
    timerElement.textContent = "Waktu: 00:00";
    progressBar.style.width = "0%";
    progressText.textContent = "0/0";
    
    // Reset buttons
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    submitBtn.disabled = true;
    
    // Hide result container
    resultContainer.classList.add('hidden');
}

// Timer Function
function updateTimer() {
    const currentTime = new Date();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    timerElement.textContent = `Waktu: ${formatTime(elapsedSeconds)}`;
}

// Helper Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}


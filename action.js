// action.js

// Load saved selections from localStorage
const selectedTopic = 'kanji';
const selectedQuizType = 'k2h';

// Basic validation - redirect to menu if no selection
if (!selectedTopic || !selectedQuizType) {
  alert('Please select topic and quiz type first.');
  window.location.href = 'index.html';
}

// Filter words by topic
let filteredWords = words.filter((w) => w.type === selectedTopic);

// Shuffle array function to randomize quiz words
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Shuffle filtered words to randomize quiz order
filteredWords = shuffleArray(filteredWords);

// Quiz state
let currentIndex = 0;
let score = 0;

const wordDisplay = document.getElementById('wordDisplay');
const answerInput = document.getElementById('answerInput');
const feedback = document.getElementById('feedback');
const answerForm = document.getElementById('answerForm');
const skipBtn = document.getElementById('skipBtn');
const hintBtn = document.getElementById('hintBtn');
const backBtn = document.getElementById('backBtn');
const answerLabel = document.getElementById('answerLabel');

// Add quiz progress element (ensure exists in quiz.html)
const quizProgress = document.getElementById('quizProgress');

function sanitize(text) {
  return text.trim().toLowerCase();
}

// Update quiz progress display (e.g., Quiz 3 / 10)
function renderQuizProgress() {
  if (currentIndex < filteredWords.length) {
    quizProgress.textContent = `Quiz ${currentIndex + 1} / ${filteredWords.length}`;
    quizProgress.style.visibility = 'visible';
  } else {
    quizProgress.textContent = '';
    quizProgress.style.visibility = 'hidden';
  }
}

// Render current quiz word
function renderWord() {
  feedback.textContent = '\u00A0'; // Non-breaking space for stable height

  renderQuizProgress();

  if (currentIndex >= filteredWords.length) {
    wordDisplay.innerHTML =
      `<p>🎉 You finished the quiz!<br>` +
      `Score: ${score} / ${filteredWords.length}</p>`;
    answerLabel.style.display = 'none';
    answerInput.style.display = 'none';
    answerForm.querySelector('.submitBtn').style.display = 'none';
    skipBtn.style.display = 'none';
    hintBtn.style.display = 'none';
    // Back to Menu button remains visible
    return;
  }

  const currentWord = filteredWords[currentIndex];

  answerInput.value = '';
  answerInput.focus();

  answerLabel.style.display = 'block';
  answerInput.style.display = 'inline-block';
  answerForm.querySelector('.submitBtn').style.display = 'inline-block';
  skipBtn.style.display = 'inline-block';
  answerForm.querySelector('.submitBtn').disabled = false;
  skipBtn.disabled = false;

  if (selectedQuizType === 'k2h') {
    // Show English word
    let displayKanji;
    displayKanji = currentWord.kanji;
    wordDisplay.innerHTML =
      `<span class="english-word">${displayKanji}</span>`;
    answerLabel.textContent = 'Enter Romaji:';
  } else {
    /* nothing here */
  }
}


answerForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const currentWord = filteredWords[currentIndex];
  let userAnswer = sanitize(answerInput.value);

  // If no answer is provided, show feedback and do not advance.
  if (!userAnswer) {
    feedback.style.color = '#bb3e03';
    feedback.textContent = 'Please submit an answer or skip';
    feedback.classList.remove('glow-red'); // Ensure no lingering glow
    return;
  }

  let correctAnswers, isCorrect;

  // Determine the correct answer(s)
  correctAnswers = [sanitize(currentWord.romaji)];

  // Check if the user's answer matches any correct answer
  isCorrect = correctAnswers.some(ans => ans === userAnswer);

  if (isCorrect) {
    feedback.style.color = '#00e676';
    feedback.classList.add('glow-red');
    feedback.textContent = 'Correct! 🎉';
    score++;
    currentIndex++; // Advance index immediately for correct answers
    setTimeout(() => { // Short delay for "Correct!" message
      renderWord();
    }, 800); // Adjust delay if needed
  } else {
    feedback.style.color = '#bb3e03';
    feedback.classList.remove('glow-red');
    feedback.innerHTML = `<small>Incorrect. Try again.</small>`;
  }

});

// Handle skip button
skipBtn.addEventListener('click', () => {
  const currentWord = filteredWords[currentIndex];
  if (selectedQuizType === 'k2h') {
    let romajiToShow = Array.isArray(currentWord.romaji)
      ? currentWord.romaji.join(', ')
      : currentWord.romaji;
    
    let hiraganaToShow = Array.isArray(currentWord.hiragana)
      ? currentWord.hiragana.join(', ')
      : currentWord.hiragana;
    
    let englishToShow = Array.isArray(currentWord.english)
      ? currentWord.english.join(', ')
      : currentWord.english;
    
      
    feedback.style.color = '#ff9659ff';
    feedback.innerHTML = `<small>Answer: </small> <strong>${hiraganaToShow} (${romajiToShow}) (${englishToShow})</strong>`;
  }
  else {
    /* nothing here */
  }
  
  // Also disable submit and skip to force user to submit or skip
  answerForm.querySelector('.submitBtn').disabled = true;
  skipBtn.disabled = true;

  currentIndex++;
  setTimeout(() => { // Longer delay for skiped answers
    renderWord();
  }, 3500);

});

// Handle hint button
hintBtn.addEventListener('click', () => {
  // Show correct answer as hint based on quiz type
  const currentWord = filteredWords[currentIndex];

    const correctStr = Array.isArray(currentWord.english)
    ? currentWord.english.join(', ')
    : currentWord.english;
  
  feedback.style.color = '#ffde59';
  feedback.innerHTML = `<small>Hint: </small> <strong>${correctStr}</strong>`;

  // Disable hint button until submit or skip
  hintBtn.disabled = false;

  // Also disable submit and skip to force user to submit or skip
  answerForm.querySelector('.submitBtn').disabled = false;
  skipBtn.disabled = false;
});

// Handle back to menu button
backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

// Initial render
renderWord();

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const promptText = document.getElementById('prompt-text');
    const choicesContainer = document.getElementById('choices-container');
    const feedbackOverlay = document.getElementById('feedback-overlay');
    const feedbackText = document.getElementById('feedback-text');

    // --- Game Data ---
    const vocabulary = {
        'Dog': 'https://cdn-icons-png.flaticon.com/512/1076/1076928.png',
        'Cat': 'https://cdn-icons-png.flaticon.com/512/1076/1076934.png',
        'Bird': 'https://cdn-icons-png.flaticon.com/512/1076/1076926.png',
        'Fish': 'https://cdn-icons-png.flaticon.com/512/1076/1076937.png',
        'Lion': 'https://cdn-icons-png.flaticon.com/512/1076/1076943.png',
        'Monkey': 'https://cdn-icons-png.flaticon.com/512/1076/1076946.png',
        'Elephant': 'https://cdn-icons-png.flaticon.com/512/1076/1076935.png',
        'Bear': 'https://cdn-icons-png.flaticon.com/512/1076/1076925.png'
    };
    const words = Object.keys(vocabulary);
    let currentCorrectAnswer = '';
    let isRoundInProgress = true;

    // --- Core Functions ---

    function speak(text, lang = 'en-US') {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startNewRound() {
        isRoundInProgress = true;
        choicesContainer.innerHTML = ''; // Clear previous choices
        promptText.textContent = ''; // Clear previous prompt

        // 1. Pick a correct answer
        const shuffledWords = shuffleArray([...words]);
        currentCorrectAnswer = shuffledWords[0];

        // 2. Pick incorrect choices (distractors)
        const distractors = shuffledWords.slice(1, 3); // Get 2 distractors
        const choices = shuffleArray([currentCorrectAnswer, ...distractors]);

        // 3. Ask the question
        const question = `Where is the ${currentCorrectAnswer}?`;
        promptText.textContent = question; // Display for parent
        speak(question);

        // 4. Display choices
        choices.forEach(word => {
            const card = document.createElement('div');
            card.className = 'choice-card';
            card.dataset.word = word; // Store the word in a data attribute

            const img = document.createElement('img');
            img.src = vocabulary[word];
            img.alt = word;
            card.appendChild(img);

            card.addEventListener('click', handleChoice);
            choicesContainer.appendChild(card);
        });
    }

    function handleChoice(event) {
        if (!isRoundInProgress) return; // Prevent multiple clicks after a choice is made

        const clickedWord = event.currentTarget.dataset.word;
        const isCorrect = clickedWord === currentCorrectAnswer;
        isRoundInProgress = false; // Lock the round

        showFeedback(isCorrect, clickedWord);
    }

    function showFeedback(isCorrect, clickedWord) {
        feedbackText.textContent = isCorrect ? '✅' : '❌';
        feedbackOverlay.classList.add('visible');

        if (isCorrect) {
            speak('Well done!');
            // Wait, then start the next round
            setTimeout(() => {
                feedbackOverlay.classList.remove('visible');
                startNewRound();
            }, 1500);
        } else {
            speak(`That's a ${clickedWord}. Try again!`);
            // Wait, then hide feedback and allow another try
            setTimeout(() => {
                feedbackOverlay.classList.remove('visible');
                isRoundInProgress = true; // Unlock the round for another try
            }, 1500);
        }
    }

    // --- Initializer ---
    // A brief welcome and instruction
    setTimeout(() => {
        speak('Let\'s play a game!');
        startNewRound();
    }, 500);
});

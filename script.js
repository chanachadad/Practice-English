document.addEventListener('DOMContentLoaded', () => {
    // Get references to all the necessary DOM elements
    const cardImage = document.getElementById('card-image');
    const cardWord = document.getElementById('card-word');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const card = document.getElementById('card');

    // Data for the flashcards.
    // Image URLs will be added in the next step.
    const wordsData = [
        { word: 'Dog', image: 'https://cdn-icons-png.flaticon.com/512/1076/1076928.png' },
        { word: 'Cat', image: 'https://cdn-icons-png.flaticon.com/512/1076/1076934.png' },
        { word: 'Bird', image: 'https://cdn-icons-png.flaticon.com/512/1076/1076926.png' },
        { word: 'Fish', image: 'https://cdn-icons-png.flaticon.com/512/1076/1076937.png' },
        { word: 'Lion', image: 'https://cdn-icons-png.flaticon.com/512/1076/1076943.png' },
        { word: 'Monkey', image: 'https://cdn-icons-png.flaticon.com/512/1076/1076946.png' }
    ];

    let currentIndex = 0;

    // Function to speak a given text using the browser's speech synthesis
    function speak(text) {
        // Stop any currently playing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set the language to English
        utterance.rate = 0.9; // Slightly slower for clarity

        window.speechSynthesis.speak(utterance);
    }

    // Function to update the card display with the current word and image
    function showCard() {
        const currentWord = wordsData[currentIndex];
        cardImage.src = currentWord.image;
        cardImage.alt = currentWord.word;

        // We can display the word for the parent, or hide it.
        // For now, we'll show it.
        cardWord.textContent = currentWord.word;
    }

    // --- Event Listeners ---

    // Go to the next card
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent card click event from firing
        currentIndex = (currentIndex + 1) % wordsData.length; // Loop back to the start if at the end
        showCard();
    });

    // Go to the previous card
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent card click event from firing
        currentIndex = (currentIndex - 1 + wordsData.length) % wordsData.length; // Loop back to the end if at the start
        showCard();
    });

    // Speak the word when the card (image area) is clicked
    card.addEventListener('click', () => {
        // Make sure there's a word to speak before trying
        if (wordsData[currentIndex] && wordsData[currentIndex].word) {
            speak(wordsData[currentIndex].word);
        }
    });

    // --- Initial Setup ---

    // Display the first card when the page loads
    showCard();
});

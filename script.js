document.addEventListener('DOMContentLoaded', () => {
    const contentIcon = document.getElementById('contentIcon');
    const cardsContainer = document.getElementById('cardsContainer');
    const welcomeModal = document.getElementById('welcomeModal');
    const cardsInner = document.getElementById('cardsInner');
    let cards = Array.from(document.querySelectorAll('.card'));

    // Carousel state
    let current = 0;
    let welcomed = false;

    function updateCarousel() {
        cards.forEach((card, idx) => {
            card.classList.remove('active', 'next', 'prev');
            if (idx === current) {
                card.classList.add('active');
            } else if (idx === (current + 1) % cards.length) {
                card.classList.add('next');
            } else if (idx === (current + 2) % cards.length) {
                card.classList.add('prev');
            }
        });
    }

    // Initial state: hide cards
    cardsContainer.style.display = 'none';
    cardsContainer.classList.remove('active');

    // Toggle cards container when clicking the content icon
    contentIcon.addEventListener('click', () => {
        if (!welcomed) {
            welcomeModal.style.display = 'flex';
            welcomeModal.classList.remove('hide');
            setTimeout(() => {
                welcomeModal.classList.add('hide');
                setTimeout(() => {
                    welcomeModal.style.display = 'none';
                    welcomed = true;
                    cardsContainer.style.display = 'flex';
                    setTimeout(() => {
                        cardsContainer.classList.add('active');
                        cardsContainer.classList.add('show-cards');
                        contentIcon.classList.add('active');
                        updateCarousel();
                    }, 10);
                }, 500); // match the CSS transition duration
            }, 1000); // how long to show the welcome
            return;
        }
        // Toggle cards
        if (cardsContainer.style.display === 'none') {
            cardsContainer.style.display = 'flex';
            setTimeout(() => {
                cardsContainer.classList.add('active');
                cardsContainer.classList.add('show-cards');
                contentIcon.classList.add('active');
                updateCarousel();
            }, 10);
        } else {
            cardsContainer.classList.remove('active');
            cardsContainer.classList.remove('show-cards');
            contentIcon.classList.remove('active');
            setTimeout(() => {
                cardsContainer.style.display = 'none';
            }, 400);
        }
    });

    function bounceActiveCard() {
        const activeCard = cards[current];
        activeCard.classList.remove('bounce');
        // Force reflow to restart animation
        void activeCard.offsetWidth;
        activeCard.classList.add('bounce');
    }

    // Carousel slide logic (click and drag or click on next card)
    let startX = 0;
    let isDragging = false;

    function isCardsActive() {
        return cardsContainer.classList.contains('active');
    }

    cardsContainer.addEventListener('mousedown', (e) => {
        if (!isCardsActive()) return;
        isDragging = true;
        startX = e.clientX;
    });
    document.addEventListener('mouseup', (e) => {
        if (!isDragging || !isCardsActive()) return;
        isDragging = false;
        let diff = e.clientX - startX;
        if (diff < -50) {
            current = (current + 1) % cards.length;
            updateCarousel();
            bounceActiveCard();
        } else if (diff > 50) {
            current = (current - 1 + cards.length) % cards.length;
            updateCarousel();
            bounceActiveCard();
        }
    });

    // Touch events for mobile
    cardsContainer.addEventListener('touchstart', (e) => {
        if (!isCardsActive()) return;
        isDragging = true;
        startX = e.touches[0].clientX;
    });
    document.addEventListener('touchend', (e) => {
        if (!isDragging || !isCardsActive()) return;
        isDragging = false;
        let endX = e.changedTouches[0].clientX;
        let diff = endX - startX;
        if (diff < -50) {
            current = (current + 1) % cards.length;
            updateCarousel();
            bounceActiveCard();
        } else if (diff > 50) {
            current = (current - 1 + cards.length) % cards.length;
            updateCarousel();
            bounceActiveCard();
        }
    });

    // Optional: click on next/prev card to slide
    cards.forEach((card, idx) => {
        card.addEventListener('click', (e) => {
            if (!isCardsActive()) return;
            if (card.classList.contains('next')) {
                current = (current + 1) % cards.length;
                updateCarousel();
                bounceActiveCard();
            } else if (card.classList.contains('prev')) {
                current = (current - 1 + cards.length) % cards.length;
                updateCarousel();
                bounceActiveCard();
            }
        });
    });

    // Close cards when clicking outside
    document.addEventListener('click', (e) => {
        if (!contentIcon.contains(e.target) && 
            !cardsContainer.contains(e.target) && 
            cardsContainer.classList.contains('active')) {
            contentIcon.classList.remove('active');
            cardsContainer.classList.remove('active');
        }
    });

    // Add pulse effect to card-action-icon on click
    document.querySelectorAll('.card-action-icon').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            btn.classList.remove('pulse');
            void btn.offsetWidth; // force reflow
            btn.classList.add('pulse');
        });
    });

    // Theme toggle logic
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}); 
import { initLanguageSystem } from './language.js';
let blogPosts = []; // Globale Variable für Blogposts


// Countdown Timer
function updateCountdown() {
    const betaDate = new Date('2025-08-01T00:00:00').getTime();
    const now = new Date().getTime();
    const distance = betaDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: document.querySelector('section.features').offsetTop,
                behavior: 'smooth'
            });
        });
    }
}

// Form Submission
function setupForm() {
    const form = document.querySelector('form[name="notify"]');
    const emailInput = document.getElementById('beta-email');
    const messageDiv = document.getElementById('form-message');
    const submitButton = document.getElementById('notify-button');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = emailInput.value.trim();
        messageDiv.style.display = 'none';
        emailInput.classList.remove('error');

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailInput.classList.add('error');
            showMessage('Bitte gib eine gültige E-Mail-Adresse ein', 'error');
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Wird gesendet...';

        const formData = new FormData(form);

        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData).toString()
        })
            .then(() => {
                showMessage('Erfolgreich angemeldet! Du erhältst bald weitere Infos.', 'success');
                emailInput.value = '';

                // 🎉 Konfetti
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            })
            .catch(() => {
                showMessage('Netzwerkfehler – bitte versuche es später erneut', 'error');
            })
            .finally(() => {
                submitButton.style.opacity = '0.6';
                submitButton.style.cursor = 'not-allowed';
                submitButton.textContent = 'Danke!';
            });
    });

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.style.color = type === 'success' ? '#88d3ce' : '#ff6b6b';
        messageDiv.style.display = 'block';
    }
}


// FAQ Accordion
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Blog
// Funktion zum Anzeigen des neuesten Blogposts
function displayLatestBlogPost() {
    if (blogPosts.length === 0) return;

    const latestPost = blogPosts[0]; // Neuester Post ist der erste im Array

    document.getElementById('latest-blog-title').textContent = latestPost.title;
    document.getElementById('latest-blog-excerpt').textContent = latestPost.excerpt;
    document.getElementById('latest-blog-date').textContent = latestPost.date;
    document.getElementById('latest-blog-link').href = latestPost.link;

    // Bild nur aktualisieren wenn vorhanden
    const blogImage = document.getElementById('latest-blog-image');
    if (blogImage && latestPost.image) {
        blogImage.src = latestPost.image;
        blogImage.alt = latestPost.title;
    }
}


// Beispiel für API-Aufruf (optional)
async function fetchLatestBlogPost() {
    try {
        const response = await fetch('https://api.example.com/blog/latest');
        const data = await response.json();

        if (data && data.length > 0) {
            // Daten aktualisieren
            blogPosts.unshift(data[0]); // Neuesten Post an den Anfang des Arrays setzen
            displayLatestBlogPost();
        }
    } catch (error) {
        console.error('Fehler beim Laden der Blogposts:', error);
    }
}



// Initialisierung
document.addEventListener('DOMContentLoaded', async () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);

    setupScrollIndicator();
    setupForm();
    setupFAQ();
    initLanguageSystem();
});



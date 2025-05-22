// Formular Handling
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Hier würde normalerweise der Formularversand erfolgen
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    console.log('Formular abgeschickt:', formData);

    // Erfolgsmeldung anzeigen
    alert('Thank you for your message! We will contact you soon.');
    this.reset();
});

// Sprachumschaltung (wie auf anderen Seiten)
document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('.language-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // Hier würde die Sprache umgeschaltet werden
    });
});
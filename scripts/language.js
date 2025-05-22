let translations = {};
let blogPosts = [];
let currentLanguage = 'de';

// Lädt Übersetzungen und Blog-Posts
async function loadResources(lang) {
    try {
        console.log(`${location.origin}/blog_posts.json`)
        // Übersetzungen laden
        const translationsResponse = await fetch(`${location.origin}/translations/${lang}.json`);
        if (!translationsResponse.ok) throw new Error('Translations not found');
        translations[lang] = await translationsResponse.json();

        // Blog-Posts laden (nur beim ersten Mal)
        if (blogPosts.length === 0) {
            const blogResponse = await fetch(`${location.origin}/blog_posts.json`);
            if (!blogResponse.ok) throw new Error('Blog posts not found');
            blogPosts = await blogResponse.json();
        }

        return { translations: translations[lang], blogPosts };
    } catch (error) {
        console.error('Error loading resources:', error);
        return {};
    }
}

// Aktualisiert UI-Elemente mit Übersetzungen
function updateTranslatedElements(lang) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = getTranslation(key, lang);

        if (translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
}

// Holt Übersetzung für einen bestimmten Schlüssel
export function getTranslation(key, lang = currentLanguage) {
    try {
        return key.split('.').reduce((obj, i) => obj?.[i], translations[lang] || {});
    } catch {
        return null;
    }
}

// Blog-Posts laden (für beide Seiten)
export async function loadBlogPosts() {
    try {
        const response = await fetch(`${location.origin}/blog_posts.json`);
        if (!response.ok) throw new Error('Blog posts not found');
        blogPosts = await response.json();
        return blogPosts;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogPosts = [];
        return [];
    }
}

// Für die Hauptseite (index.html)
export function updateFeaturedBlogPost(lang = currentLanguage) {
    if (blogPosts.length === 0) return;

    const latestPost = blogPosts[blogPosts.length - 1];
    const elements = {
        title: document.getElementById('latest-blog-title'),
        date: document.getElementById('latest-blog-date'),
        excerpt: document.getElementById('latest-blog-excerpt'),
        link: document.getElementById('latest-blog-link'),
        image: document.getElementById('latest-blog-image')
    };

    if (latestPost.title && elements.title) {
        elements.title.textContent = latestPost.title[lang] || latestPost.title.de;
    }

    if (latestPost.date && elements.date) {
        elements.date.textContent = latestPost.date[lang] || latestPost.date.de;
    }

    if (latestPost.excerpt && elements.excerpt) {
        elements.excerpt.textContent = latestPost.excerpt[lang] || latestPost.excerpt.de;
    }

    if (elements.link && latestPost.link) {
        elements.link.href = latestPost.link;
    }

    if (elements.image && latestPost.image) {
        elements.image.src = latestPost.image;
        elements.image.alt = latestPost.title[lang] || latestPost.title.de;
    }
}

// Für die Blog-Seite (blog.html)
export function renderBlogPage(lang = currentLanguage) {
    
    const container = document.getElementById('blogPostsContainer');
    const sortSelect = document.getElementById('sortSelect');

    if (!container || blogPosts.length === 0) return;

    // Event Listener für Sortierung (nur 1x hinzufügen!)
    if (sortSelect && !sortSelect.dataset.listenerAttached) {
        sortSelect.addEventListener('change', () => renderBlogPage(lang));
        sortSelect.dataset.listenerAttached = 'true';
    }

    // Sortierlogik
    let sortedPosts = [...blogPosts]; // Kopie machen, nicht mutieren

    const sortBy = sortSelect?.value || 'date-newest';
    console.log(("renderBlogPage"))
    console.log(sortBy)
    switch (sortBy) {
        case 'date-newest':
            sortedPosts.sort((a, b) => new Date(b.date.date_iso) - new Date(a.date.date_iso));
            break;
        case 'date-oldest':
            sortedPosts.sort((a, b) => new Date(a.date.date_iso) - new Date(b.date.date_iso));
            break;
        case 'title':
            sortedPosts.sort((a, b) =>
                (a.title[lang] || a.title.de).localeCompare(b.title[lang] || b.title.de)
            );
            break;
        case 'category':
            sortedPosts.sort((a, b) =>
                (a.category[lang] || a.category.de).localeCompare(b.category[lang] || b.category.de)
            );
            break;
    }

    // Render HTML
    container.innerHTML = sortedPosts.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title[lang] || post.title.de}">
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-date">${post.date[lang] || post.date.de}</span>
                    <span class="blog-card-category">${post.category[lang] || post.category.de}</span>
                </div>
                <a href="${post.link}" class="blog-card-title-link">
                    <h2 class="blog-card-title">${post.title[lang] || post.title.de}</h2>
                </a>
                <p class="blog-card-excerpt">${post.excerpt[lang] || post.excerpt.de}</p>
                <a href="${post.link}" class="blog-card-link">
                    ${getTranslation('read_more_link', lang) || 'Weiterlesen →'}
                </a>
            </div>
        </article>
    `).join('');
}


// Wechselt die Sprache
export async function switchLanguage(lang) {
    if (!translations[lang]) {
        await loadResources(lang);
    }

    currentLanguage = lang;
    document.documentElement.lang = lang;

    localStorage.setItem('preferredLanguage', lang);

    // UI aktualisieren
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    updateTranslatedElements(lang);
    updateFeaturedBlogPost(lang);

    // Blog-Seite spezifische Updates
    if (typeof renderBlogPage === 'function' && document.getElementById('blogPostsContainer')) {
        renderBlogPage(lang);
    }
}

// Initialisiert das Sprachsystem
export async function initLanguageSystem() {
    await loadBlogPosts();

    const savedLang = localStorage.getItem('preferredLanguage') || 'de';

    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });

    await switchLanguage(savedLang);

    // 👇 Sortierung aktivieren (nach initialem Rendern!)
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && !sortSelect.dataset.listenerAttached) {
        sortSelect.addEventListener('change', () => {
            renderBlogPage(savedLang); // Neu rendern bei Änderung
        });
        sortSelect.dataset.listenerAttached = 'true';
    }
}

// Automatische Ausführung
(async function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSystem);
    } else {
        await initLanguageSystem();
    }
})();

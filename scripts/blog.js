import { loadBlogPosts } from './language.js';
// Konfiguration
const postsPerPage = 6; // Anzahl der Blogposts pro Seite
let currentPage = 1;
let blogPosts = [];



// Blogposts rendern
function renderBlogPosts() {
    const container = document.getElementById('blogPostsContainer');
    if (!container) return;

    // Berechne Start- und Endindex für die aktuelle Seite
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const postsToShow = blogPosts.slice(startIndex, endIndex);

    // Leere den Container
    container.innerHTML = '';

    // Füge Blogposts hinzu
    postsToShow.forEach(post => {
        const postElement = document.createElement('article');
        postElement.className = 'blog-card';
        postElement.innerHTML = `
             <div class="blog-card-image">
                 <img src="${post.image}" alt="${post.title}">
             </div>
             <div class="blog-card-content">
                 <div class="blog-card-meta">
                     <span class="blog-card-date">${post.date}</span>
                     <span class="blog-card-category">${post.category}</span>
                 </div>
                 <h2 class="blog-card-title">${post.title}</h2>
                 <p class="blog-card-excerpt">${post.excerpt}</p>
                 <a href="${post.link}" class="blog-card-link">Zum Artikel</a>
             </div>
         `;
        container.appendChild(postElement);
    });
}

// Pagination rendern
function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    const totalPages = Math.ceil(blogPosts.length / postsPerPage);

    // Verstecke Pagination wenn nur eine Seite vorhanden ist
    if (totalPages <= 1) {
        container.style.display = 'none';
        return;
    }

    // Zeige Pagination
    container.style.display = 'flex';
    container.innerHTML = '';

    // Vorherige Seite Button
    if (currentPage > 1) {
        const prevLink = document.createElement('a');
        prevLink.className = 'blog-page-link';
        prevLink.href = '#';
        prevLink.innerHTML = '←';
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage--;
            renderBlogPosts();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        container.appendChild(prevLink);
    }

    // Seitenzahlen
    for (let i = 1; i <= totalPages; i++) {
        const pageLink = document.createElement('a');
        pageLink.className = `blog-page-link ${i === currentPage ? 'active' : ''}`;
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            renderBlogPosts();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        container.appendChild(pageLink);
    }

    // Nächste Seite Button
    if (currentPage < totalPages) {
        const nextLink = document.createElement('a');
        nextLink.className = 'blog-page-link';
        nextLink.href = '#';
        // nextLink.innerHTML = '→';
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage++;
            renderBlogPosts();
            renderPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        container.appendChild(nextLink);
    }
}

// Initialisierung beim Laden der Seite
document.addEventListener('DOMContentLoaded', async () => {

    await loadBlogPosts(); // Blogposts laden
});
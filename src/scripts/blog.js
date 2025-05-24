let posts = [];
let visiblePosts = 6;
let currentSort = 'date-newest';
let currentFilter = 'all';
let translations = {}
const lang = document.documentElement.lang || 'de';

async function loadTranslations() {
    try {
        const gerRes = await fetch('/_data/translations/de.json');
        translations["de"] = await gerRes.json();

        const enRes = await fetch('/_data/translations/en.json');
        translations["en"] = await enRes.json();
        
        
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

async function loadPosts() {
    try {
        const res = await fetch('/_data/blog_posts.json');
        posts = await res.json();
        
        initTags();
        renderPosts();
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

function initTags() {
    
    const tagsContainer = document.getElementById('filterTags');
    if (!tagsContainer) return;

    // Get all unique categories
    const categories = [...new Set(posts.map(post => post.category[lang]))];
    
    // Create "All" tag
    const allTag = document.createElement('span');
    allTag.className = 'filter-tag active';
    console.log(translations["de"])
    allTag.textContent = translations[lang].blog_all_categories;
    allTag.dataset.category = 'all';
    allTag.addEventListener('click', () => filterPosts('all'));
    tagsContainer.appendChild(allTag);
    
    // Create category tags
    categories.forEach(category => {
        const tag = document.createElement('span');
        tag.className = 'filter-tag';
        tag.textContent = category;
        tag.dataset.category = category;
        tag.addEventListener('click', () => filterPosts(category));
        tagsContainer.appendChild(tag);
    });
}

function filterPosts(category) {
    currentFilter = category;
    
    // Update active tag
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.classList.toggle('active', tag.dataset.category === category);
    });
    
    renderPosts();
}

function renderPosts() {
    const container = document.getElementById('blogPostsContainer');
    const countEl = document.getElementById('blogCount');
    
    // Filter and sort posts
    let filtered = currentFilter === 'all' 
        ? [...posts] 
        : posts.filter(post => post.category[lang] === currentFilter);
    
    filtered = sortPosts(filtered, currentSort);
    
    // Update count
    if (countEl) {
        countEl.textContent = `${filtered.length} ${translations[lang].blog_posts_found}`;
    }
    
    // Show only visible posts
    const postsToShow = filtered.slice(0, visiblePosts);
    
    container.innerHTML = postsToShow.map(post => `
        <article class="blog-card">
            <div class="blog-card-image">
                <img src="/${post.image}" alt="${post.title[lang]}" loading="lazy" />
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span class="blog-card-date">${post.date[lang]}</span>
                    <span class="blog-card-category">${post.category[lang]}</span>
                </div>
                <a href="/${lang}/blog/${post.slug}.html" class="blog-card-title-link">
                    <h2 class="blog-card-title">${post.title[lang]}</h2>
                </a>
                <p class="blog-card-excerpt">${post.excerpt[lang]}</p>
                <a href="/${lang}/blog/${post.slug}.html" class="blog-card-link">
                    ${getReadMoreText()}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                </a>
            </div>
        </article>
    `).join('');
    
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = filtered.length > visiblePosts ? 'block' : 'none';
    }
}

function sortPosts(posts, sortMethod) {
    let sorted = [...posts];
    
    switch (sortMethod) {
        case 'date-oldest':
            sorted.sort((a, b) => new Date(a.date.date_iso) - new Date(b.date.date_iso));
            break;
        case 'title':
            sorted.sort((a, b) => a.title[lang].localeCompare(b.title[lang]));
            break;
        case 'category':
            sorted.sort((a, b) => a.category[lang].localeCompare(b.category[lang]));
            break;
        case 'date-newest':
        default:
            sorted.sort((a, b) => new Date(b.date.date_iso) - new Date(a.date.date_iso));
    }
    
    return sorted;
}

function getReadMoreText() {
    return lang === 'en' ? 'Read more' : 'Weiterlesen';
}

function setupEventListeners() {
    // Sort select
    document.getElementById('sortSelect')?.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderPosts();
    });
    
    // Search functionality
    document.getElementById('blogSearch')?.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search logic here
    });
    
    // Load more button
    document.getElementById('loadMoreBtn')?.addEventListener('click', () => {
        visiblePosts += 6;
        renderPosts();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    setupEventListeners();
    await loadTranslations();
    await loadPosts();
});
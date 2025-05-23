let posts = [];

async function loadPosts() {
  const res = await fetch('/_data/blog_posts.json');
  posts = await res.json();
  renderPosts();
}

function renderPosts() {
  const container = document.getElementById('blogPostsContainer');
  const sort = document.getElementById('sortSelect')?.value || 'date-newest';

  let sorted = [...posts];
  switch (sort) {
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

  container.innerHTML = sorted.map(post => `
    <article class="blog-card">
      <div class="blog-card-image">
        <img src="/${post.image}" alt="${post.title[lang]}" />
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
        <a href="/${lang}/blog/${post.slug}.html" class="blog-card-link">${getReadMoreText()}</a>
      </div>
    </article>
  `).join('');
}

function getReadMoreText() {
  return lang === 'en' ? 'Read more →' : 'Weiterlesen →';
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('sortSelect')?.addEventListener('change', renderPosts);
  loadPosts();
});

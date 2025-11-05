const quoteCard = document.getElementById('quoteCard');
const quoteOriginalEl = document.getElementById('quoteOriginal');
const quoteTranslationEl = document.getElementById('quoteTranslation');
const quoteDescriptionEl = document.getElementById('quoteDescription');
const quoteAuthorEl = document.getElementById('quoteAuthor');
const quoteCultureEl = document.getElementById('quoteCulture');
const quoteCategoryEl = document.getElementById('quoteCategory');
const quoteTagsEl = document.getElementById('quoteTags');
const quoteResourcesEl = document.getElementById('quoteResources');

const displayDuration = 9000; // time quote stays visible
const transitionDuration = 1200; // fade-out duration before switching
let cycleTimer = null;
let quotes = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
});

async function loadQuotes() {
  try {
    const response = await fetch('data.json', { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Unable to load quotes: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('The quote collection is empty or malformed.');
    }
    quotes = shuffle(data.slice());
    currentIndex = 0;
    setQuoteContent(quotes[currentIndex]);
    requestAnimationFrame(() => quoteCard.classList.add('visible'));
    scheduleNextQuote();
  } catch (error) {
    console.error(error);
    quoteOriginalEl.textContent = 'The whispers are silent for a moment.';
    quoteTranslationEl.textContent = '';
    quoteDescriptionEl.textContent = 'We could not open the book of wisdom. Please refresh to try again.';
    quoteAuthorEl.textContent = '';
    quoteCultureEl.textContent = '';
    quoteCategoryEl.textContent = '';
    renderTags([]);
    renderResources([]);

    clearTimeout(cycleTimer);
    cycleTimer = null;
    requestAnimationFrame(() => quoteCard.classList.add('visible'));
  }
}

function setQuoteContent(quote) {
  quoteOriginalEl.textContent = quote.quoteText || '';
  quoteTranslationEl.textContent = quote.quoteTextEN && quote.quoteTextEN !== quote.quoteText
    ? quote.quoteTextEN
    : '';
  quoteDescriptionEl.textContent = quote.quoteDescription || '';
  quoteAuthorEl.textContent = quote.author || '';
  quoteCultureEl.textContent = quote.culture || '';
  quoteCategoryEl.textContent = quote.category || '';

  renderTags(Array.isArray(quote.tags) ? quote.tags : []);
  renderResources(Array.isArray(quote.resources) ? quote.resources : []);
}

function renderTags(tags) {
  quoteTagsEl.innerHTML = '';
  tags.forEach((tag) => {
    const item = document.createElement('li');
    item.textContent = `#${tag}`;
    quoteTagsEl.appendChild(item);
  });
}

function renderResources(resources) {
  quoteResourcesEl.innerHTML = '';
  resources.forEach((link, index) => {
    if (typeof link !== 'string') return;
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.rel = 'noopener';
    anchor.textContent = `Resource ${index + 1}`;
    quoteResourcesEl.appendChild(anchor);
  });
  if (!quoteResourcesEl.children.length) {
    quoteResourcesEl.innerHTML = '<span class="no-resources">No external references provided.</span>';
  }
}

function scheduleNextQuote() {
  clearTimeout(cycleTimer);
  cycleTimer = setTimeout(() => {
    quoteCard.classList.remove('visible');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      if (currentIndex === 0) {
        quotes = shuffle(quotes.slice());
      }
      setQuoteContent(quotes[currentIndex]);
      requestAnimationFrame(() => quoteCard.classList.add('visible'));
      scheduleNextQuote();
    }, transitionDuration);
  }, displayDuration);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

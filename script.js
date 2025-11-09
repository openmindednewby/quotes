const quoteContainer = document.querySelector('.quote-container');
const quoteOriginalEl = document.getElementById('quoteOriginal');
const quoteTranslationEl = document.getElementById('quoteTranslation');
const quoteMetaEl = document.getElementById('quoteMeta');

const displayDuration = 8000; // time quote stays visible
const transitionDuration = 600; // fade-out duration before switching
const bundledQuotes = Array.isArray(window.QUOTES_DATA) ? window.QUOTES_DATA : null;
let cycleTimer = null;
let quotes = [];
let currentIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
});

async function loadQuotes() {
  try {
    if (!bundledQuotes || bundledQuotes.length === 0) {
      throw new Error('The bundled quote dataset is unavailable.');
    }
    initializeQuotes(bundledQuotes);
  } catch (error) {
    console.error(error);

    quoteOriginalEl.textContent = 'The whispers are silent for a moment.';
    quoteTranslationEl.textContent = '';
    quoteMetaEl.textContent = 'We could not open the book of wisdom. Please refresh to try again.';

    clearTimeout(cycleTimer);
    cycleTimer = null;
    requestAnimationFrame(() => quoteContainer.classList.add('visible'));
  }
}

function initializeQuotes(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('The quote collection is empty or malformed.');
  }

  quotes = shuffle(data.slice());
  currentIndex = 0;
  setQuoteContent(quotes[currentIndex]);
  requestAnimationFrame(() => quoteContainer.classList.add('visible'));
  scheduleNextQuote();
}

function setQuoteContent(quote) {
  quoteOriginalEl.textContent = quote.quoteText || '';
  quoteTranslationEl.textContent = quote.quoteTextEN && quote.quoteTextEN !== quote.quoteText
    ? quote.quoteTextEN
    : '';
  const metaParts = [quote.author, quote.culture, quote.category]
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter(Boolean);
  quoteMetaEl.textContent = metaParts.join(' • ');
}

function scheduleNextQuote() {
  clearTimeout(cycleTimer);
  cycleTimer = setTimeout(() => {
    quoteContainer.classList.remove('visible');
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % quotes.length;
      if (currentIndex === 0) {
        quotes = shuffle(quotes.slice());
      }
      setQuoteContent(quotes[currentIndex]);
      requestAnimationFrame(() => quoteContainer.classList.add('visible'));
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

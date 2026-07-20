// Configuration to get news from GNews API
const API_KEY = 'a701391abe66db73345acae6eb8a4cf1'; // Personal API key for GNews
const URL = `https://gnews.io/api/v4/top-headlines?category=general&lang=en&apikey=${API_KEY}`;

// Our class is called "news-item" and we will use it to render the news in the DOM
const newsList = document.getElementById('news-list');
// If the refresh button is clicked, we will call the fetchNews function to get the latest news
const refreshButton = document.getElementById('refresh-button');
// Shows today's date in the top banner
const dateTimeElement = document.getElementById('current-date');

function updateDateTime() {
    if (!dateTimeElement) return;
    const today = new Date();
    dateTimeElement.textContent = today.toLocaleDateString('en-EN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
updateDateTime(); // Initial call to set the date and time immediately

// Using async/await to fetch news from the GNews API
async function fetchNews() {
    try {
        // Show a loading message while fetching the news
        newsList.innerHTML = '<p class="loading-text">Cargando últimas noticias...</p>';
        
        const response = await fetch(URL);
        // Check if the response is OK (status code 200-299) and throw an error if not
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }
        
        // Parse from JSON data to JavaScript object
        const data = await response.json();
        
        // Clear the news list before adding new articles
        newsList.innerHTML = '';

        // Check if API returned articles, if not, show a message
        if (!data.articles || data.articles.length === 0) {
            newsList.innerHTML = '<p class="error-text">No se encontraron noticias en este momento.</p>';
            return;
        }

        // With a forEach loop, we will iterate over the articles and create a list item for each one
        data.articles.forEach(article => {
            const listItem = document.createElement('li');
            listItem.className = 'news-item';

            // Organize the content of each news item, including the image, title, description, source, and publication date
            listItem.innerHTML = `
                ${article.image ? `<img src="${article.image}" alt="${article.title}" class="news-item-img">` : ''}
                <div class="news-item-content">
                    <h3 class="news-item-title">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>
                    </h3>
                    <p class="news-item-description">${article.description || ''}</p>
                    <div class="news-item-meta">
                        <span class="news-source">${article.source.name}</span>
                        <span class="news-date">${new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
            // Once the list item is created, we append it to the news list in the DOM
            newsList.appendChild(listItem);
        });
    // If there is an error during the fetch or processing of the news, we catch it and log it to the console, and show an error message in the DOM
    } catch (error) {
        console.error('Error al cargar GNews:', error);
        newsList.innerHTML = '<p class="error-text">Hubo un problema al cargar las noticias. Inténtalo de nuevo.</p>';
    }
}

// Listeners for the DOMContentLoaded event and the refresh button click event to call the fetchNews function
document.addEventListener('DOMContentLoaded', () => {
    fetchNews(); // Fetch news when the page loads
    updateDateTime(); // Update the date and time
});

refreshButton.addEventListener('click', fetchNews);
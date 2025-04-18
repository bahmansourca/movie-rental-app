document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Charger les films
    loadMovies();

    // Gérer la recherche
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(handleSearch, 300));

    // Gérer les filtres
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadMovies(button.dataset.genre);
        });
    });

    // Gérer la déconnexion
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

async function loadMovies(genre = '') {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/movies', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors du chargement des films');
        }

        const movies = await response.json();
        displayMovies(movies, genre);
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors du chargement des films');
    }
}

function displayMovies(movies, genre = '') {
    const moviesGrid = document.getElementById('moviesGrid');
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();

    const filteredMovies = movies.filter(movie => {
        const matchesGenre = !genre || movie.genre === genre;
        const matchesSearch = movie.titre.toLowerCase().includes(searchTerm);
        return matchesGenre && matchesSearch;
    });

    if (filteredMovies.length === 0) {
        moviesGrid.innerHTML = '<p class="empty-message">Aucun film trouvé</p>';
        return;
    }

    moviesGrid.innerHTML = filteredMovies.map(movie => `
        <div class="movie-card">
            <img src="${movie.imgPath}" alt="${movie.titre}">
            <div class="movie-info">
                <h3>${movie.titre}</h3>
                <p>${movie.genre}</p>
                <p>${movie.annee_sortie}</p>
                <p>${movie.langue_originale}</p>
                <div class="movie-actions">
                    <button class="rent-btn" onclick="rentMovie('${movie._id}')" ${movie.copies_disponibles === 0 ? 'disabled' : ''}>
                        Louer (${movie.copies_disponibles} disponibles)
                    </button>
                    <a href="${movie.trailer}" target="_blank" class="trailer-btn">
                        Bande-annonce
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

async function rentMovie(movieId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/films/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ film_id: movieId })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erreur lors de la location du film');
        }

        alert('Film loué avec succès !');
        loadMovies();
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la location du film');
    }
}

function handleSearch() {
    loadMovies();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
} 
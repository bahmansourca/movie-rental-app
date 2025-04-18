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
        const response = await fetch('/api/films');
        const movies = await response.json();
        
        const moviesGrid = document.querySelector('.movies-grid');
        moviesGrid.innerHTML = '';
        
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.innerHTML = `
                <img src="${movie.image_path}" alt="${movie.title}" class="movie-image">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-genre">${movie.genre}</p>
                    <button class="rent-button" onclick="rentMovie(${movie.id})">Louer</button>
                </div>
            `;
            moviesGrid.appendChild(movieCard);
        });
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du chargement des films');
    }
}

async function rentMovie(filmId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch('/api/films/rent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ film_id: filmId })
        });
        
        if (response.ok) {
            alert('Film loué avec succès !');
            loadMovies();
        } else {
            const error = await response.json();
            alert(error.message || 'Erreur lors de la location');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la location');
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
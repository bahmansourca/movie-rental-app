document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    
    // Réinitialiser le message d'erreur
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    // Validation des champs
    if (!name || !email || !password) {
        errorMessage.textContent = 'Tous les champs sont requis';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Veuillez entrer une adresse email valide';
        errorMessage.style.display = 'block';
        return;
    }
    
    // Validation du mot de passe
    if (password.length < 6) {
        errorMessage.textContent = 'Le mot de passe doit contenir au moins 6 caractères';
        errorMessage.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            window.location.href = 'login.html';
        } else {
            errorMessage.textContent = data.message || 'Erreur lors de l\'inscription';
            errorMessage.style.display = 'block';
        }
    } catch (error) {
        console.error('Erreur:', error);
        errorMessage.textContent = 'Erreur de connexion au serveur';
        errorMessage.style.display = 'block';
    }
}); 
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        if (response.ok) {
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            window.location.href = 'login.html';
        } else {
            const error = await response.json();
            alert(error.message || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de l\'inscription');
    }
}); 
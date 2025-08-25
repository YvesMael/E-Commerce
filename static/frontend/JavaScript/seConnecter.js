document.getElementById('formSeConnecter').addEventListener('submit', function(e) {
    e.preventDefault();

    const adresseIP = "http://localhost:8000";
    const username = document.getElementById('tel').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password ) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const formData = new FormData();
    formData.append('username', username);  // Utilisé comme identifiant
    formData.append('password', password);

    fetch(`${adresseIP}/backend/seConnecter/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Connexion reussie !");
        } else {
            alert("Erreur lors de la connexion.");
        }
        return response.json();
    })
    .then(data => {
        console.log("Données reçues de connexion:", data);
        localStorage.setItem('connexion', data.token);
        window.location.href = data.redirect_url;
    })
    .catch(() => {
        alert("Erreur réseau.");
    });
});

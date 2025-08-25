document.getElementById('formCreerCompte').addEventListener('submit', function(e) {
    e.preventDefault();

    const adresseIP = "http://localhost:8000";
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const adresse = document.getElementById('adresse').value.trim();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    if (!nom || !telephone || !prenom || !password || !password2) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    if (password !== password2) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    const formData = new FormData();
    formData.append('username', telephone);  // Utilisé comme identifiant
    formData.append('first_name', prenom);
    formData.append('last_name', nom);
    formData.append('telephone', telephone);
    formData.append('adresse', adresse);
    formData.append('password', password);
    formData.append('password2', password2);

    fetch(`${adresseIP}/backend/creerCompte/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            alert("Compte créé avec succès !");
        } else {
            alert("Erreur lors de la création du compte.");
        }
    })
    .catch(() => {
        alert("Erreur réseau.");
    });
});

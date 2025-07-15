document.getElementById('formCreerCompte').addEventListener('submit', function(e) {
    const adresseIP = "http://localhost:8000";
    e.preventDefault();
    console.log("Requête de création de compte envoyée");
    const nom = document.getElementById('nom').value;
    const telephone = document.getElementById('telephone').value;
    const adresse = document.getElementById('adresse').value;
    const password = document.getElementById('password').value.trim();
    const password2 = document.getElementById('password2').value.trim();

    if (!telephone || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
    }
    if (password !== password2) {
        alert("Les mots de passe ne correspondent pas.");
        return;
    }

    const formData = new FormData();
    formData.append('tel', telephone);
    formData.append('password', password);
    formData.append('nom', nom);
    formData.append('adresse', adresse);
    const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    console.log("Données du formulaire préparées pour l'envoi", formData);
    fetch(`${adresseIP}/backend/creerCompte/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
        },
        body: formData
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('popup-success').style.display = 'block';
            setTimeout(() => {
                document.getElementById('popup-success').style.display = 'none';
                document.getElementById('nom').value = '';
                document.getElementById('telephone').value = '';
                document.getElementById('adresse').value = '';
                document.getElementById('password').value = '';
                document.getElementById('password2').value = '';
            }, 2500);
        } else {
            alert("Erreur lors de la création du compte. Veuillez réessayer.");
        }
    })
    .catch(() => {
        alert("Erreur réseau.");
    });
});
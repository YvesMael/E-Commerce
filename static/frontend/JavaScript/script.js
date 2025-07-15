document.addEventListener("DOMContentLoaded", () => {

  const adresseIP = "http://localhost:8000";
  
  function updatePanierCount() {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    document.getElementById("panier-count").textContent = panier.length;
  }

  // Mets à jour au chargement
  updatePanierCount();

  // Animation intro-gateaux
  const intro = document.querySelector('.intro-gateaux');
  function onScrollIntro() {
    const rect = intro.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      intro.classList.add('visible');
      window.removeEventListener('scroll', onScrollIntro);
    }
  }
  window.addEventListener('scroll', onScrollIntro);
  onScrollIntro();

  // Animation barre-anim (gateaux)
  const barre = document.querySelector('.barre-anim');
  function onScrollBarre() {
    const rect = barre.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      barre.classList.add('visible');
      window.removeEventListener('scroll', onScrollBarre);
    }
  }
  window.addEventListener('scroll', onScrollBarre);
  onScrollBarre();

  // Animation intro-chocolats
  const introChocolats = document.querySelector('.intro-chocolats');
  function onScrollIntroChocolats() {
    const rect = introChocolats.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      introChocolats.classList.add('visible');
      window.removeEventListener('scroll', onScrollIntroChocolats);
    }
  }
  window.addEventListener('scroll', onScrollIntroChocolats);
  onScrollIntroChocolats();

  // Animation barre-anim-chocolats
  const barreChocolats = document.querySelector('.barre-anim-chocolats');
  function onScrollBarreChocolats() {
    const rect = barreChocolats.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      barreChocolats.classList.add('visible');
      window.removeEventListener('scroll', onScrollBarreChocolats);
    }
  }
  window.addEventListener('scroll', onScrollBarreChocolats);
  onScrollBarreChocolats();

  // Animation intro-appareils
  const introAppareils = document.querySelector('.intro-appareils');
  function onScrollIntroAppareils() {
    const rect = introAppareils.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      introAppareils.classList.add('visible');
      window.removeEventListener('scroll', onScrollIntroAppareils);
    }
  }
  window.addEventListener('scroll', onScrollIntroAppareils);
  onScrollIntroAppareils();

  // Animation barre-anim-appareils
  const barreAppareils = document.querySelector('.barre-anim-appareils');
  function onScrollBarreAppareils() {
    const rect = barreAppareils.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      barreAppareils.classList.add('visible');
      window.removeEventListener('scroll', onScrollBarreAppareils);
    }
  }
  window.addEventListener('scroll', onScrollBarreAppareils);
  onScrollBarreAppareils();

  function showPopup(message) {
    const popup = document.getElementById('popup-success');
    popup.textContent = message;
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
    }, 2000);
  }

  fetch(`${adresseIP}/backend/produits/`)
    .then(response => response.json())
    .then(data => {
      console.log("Données reçues :", data.data);
      const container = document.getElementById("product-grid");
      const container2 = document.getElementById("chocolats-grid"); // ceci pour l'affichage des chocolats
      const container3 = document.getElementById("appareils-grid"); // ceci pour l'affichage des chocolats
      container.innerHTML = "";
      container2.innerHTML = "";
      container3.innerHTML = "";

      if (!data.data || (!data.data.gateaux.length && !data.data.chocolats.length)) {
        container.innerHTML = "<p>Aucun produit disponible.</p>";
        container2.innerHTML = "<p>Aucun chocolat disponible.</p>";
        container3.innerHTML = "<p>Aucun appareil disponible.</p>";
        return;
      }

      // Affichage des gâteaux
      data.data.gateaux.forEach((produit) => {
          const div = document.createElement("div");
          div.classList.add("product-card");

          div.innerHTML = `
            <img src="${produit.image}" alt="Produit">
            <h4 class="titre-produit" title="${produit.libelle}">${produit.libelle}</h4>
            <p>Prix unitaire: ${produit.prixUnitaire} Frs</p>
            <div class="qte">Quantite: <input type="number" class="qte-input" name="qte" min=1 placeholder="Ex: 1"></div>
            <button class="ajouter-btn">Ajouter au panier</button>
          `;
          // Ajoute l'eventListener ici, avec la bonne référence produit
          div.querySelector('.ajouter-btn').addEventListener('click', function () {
              const quantiteInput = div.querySelector('.qte-input');
              const quantite = parseInt(quantiteInput.value);

              if (quantite > 0) {
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                // Cherche si le produit existe déjà dans le panier
                const idx = panier.findIndex(item => item.id === produit.id && item.categorie === produit.categorie);
                if (idx !== -1) {
                    // Produit déjà présent, on modifie la quantité
                    panier[idx].quantite = quantite;
                    localStorage.setItem("panier", JSON.stringify(panier));
                    showPopup("Quantité modifiée dans le panier !");
                    updatePanierCount();
                } else {
                    // Nouveau produit, on ajoute
                    panier.push({
                        "id": produit['id'],
                        "categorie": produit['categorie'],
                        "image": produit['image'],
                        "libelle": produit['libelle'],
                        "prixUnitaire": produit['prixUnitaire'],
                        "quantite": quantite
                    });
                    localStorage.setItem("panier", JSON.stringify(panier));
                    showPopup("Produit ajouté au panier !");
                    updatePanierCount();
                }
            } else {
                showPopup("Veuillez entrer une quantité valide.");
            }
          });
          container.appendChild(div);
      });

      // Même chose pour les chocolats
      data.data.chocolats.forEach((produit) => {
          const div = document.createElement("div");
          div.classList.add("product-card");

          div.innerHTML = `
            <img src="${produit.image}" alt="Produit">
            <h4 class="titre-produit" title="${produit.libelle}">${produit.libelle}</h4>
            <p>Prix unitaire: ${produit.prixUnitaire} Frs</p>
            <div class="qte">Quantite: <input type="number" class="qte-input" name="qte" min=1 placeholder="Ex: 1"></div>
            <button class="ajouter-btn">Ajouter au panier</button>
          `;
          div.querySelector('.ajouter-btn').addEventListener('click', function () {
              const quantiteInput = div.querySelector('.qte-input');
              const quantite = parseInt(quantiteInput.value);

              if (quantite > 0) {
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                // Cherche si le produit existe déjà dans le panier
                const idx = panier.findIndex(item => item.id === produit.id && item.categorie === produit.categorie);
                if (idx !== -1) {
                    // Produit déjà présent, on modifie la quantité
                    panier[idx].quantite = quantite;
                    localStorage.setItem("panier", JSON.stringify(panier));
                    showPopup("Quantité modifiée dans le panier !");
                    updatePanierCount();
                } else {
                    // Nouveau produit, on ajoute
                    panier.push({
                        "id": produit['id'],
                        "categorie": produit['categorie'],
                        "image": produit['image'],
                        "libelle": produit['libelle'],
                        "prixUnitaire": produit['prixUnitaire'],
                        "quantite": quantite
                    });
                    localStorage.setItem("panier", JSON.stringify(panier));
                    showPopup("Produit ajouté au panier !");
                    updatePanierCount();
                }
            } else {
                showPopup("Veuillez entrer une quantité valide.");
            }
          });
          container2.appendChild(div);
      });

      // Affichage des appareils
      data.data.appareils.forEach((produit) => {
          const div = document.createElement("div");
          div.classList.add("product-card");

          div.innerHTML = `
            <img src="${produit.image}" alt="Produit">
            <h4 class="titre-produit" title="${produit.libelle}">${produit.libelle}</h4>
            <p>Prix unitaire: ${produit.prixUnitaire} Frs</p>
            <div class="qte">Quantite: <input type="number" class="qte-input" name="qte" min=1 placeholder="Ex: 1"></div>
            <button class="ajouter-btn">Ajouter au panier</button>
          `;
          // Ajoute l'eventListener ici, avec la bonne référence produit
          div.querySelector('.ajouter-btn').addEventListener('click', function () {
              const quantiteInput = div.querySelector('.qte-input');
              const quantite = parseInt(quantiteInput.value);

              if (quantite > 0) {
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                // Cherche si le produit existe déjà dans le panier
                const idx = panier.findIndex(item => item.id === produit.id && item.categorie === produit.categorie);
                if (idx !== -1) {
                    // Produit déjà présent, on modifie la quantité
                    panier[idx].quantite = quantite;
                    localStorage.setItem("panier", JSON.stringify(panier));
                    showPopup("Quantité modifiée dans le panier !");
                    updatePanierCount();
                } else {
                    // Nouveau produit, on ajoute
                    panier.push({
                        "id": produit['id'],
                        "categorie": produit['categorie'],
                        "image": produit['image'],
                        "libelle": produit['libelle'],
                        "prixUnitaire": produit['prixUnitaire'],
                        "quantite": quantite
                    });
                    localStorage.setItem("panier", JSON.stringify(panier));
                    showPopup("Produit ajouté au panier !");
                    updatePanierCount();
                }
            } else {
                showPopup("Veuillez entrer une quantité valide.");
            }
          });
          container3.appendChild(div);
      });
      
      document.getElementById("btn-panier").addEventListener('click', ()=> {
          const popup = document.getElementById("popup-panier");
          const liste = document.getElementById("liste-produits-panier");
          liste.innerHTML = ""; // Vide avant d’ajouter
          let panier = JSON.parse(localStorage.getItem("panier")) || [];
          if (panier.length <1) {
              let elem = document.createElement("h3");
              elem.textContent = "Aucun produit";
              liste.appendChild(elem);              
          }else{
            panier.forEach((produit, index) => {
              const item = document.createElement("li");
              item.innerHTML = `
                <span>${produit.libelle} - Quantité: ${produit.quantite}</span>
                <button class="retirer-btn" data-index="${index}" style="background:var(--primary-color);color:#fff;border:none;border-radius:6px;padding:4px 10px;cursor:pointer;margin-left:10px;">Retirer</button>
              `;
              liste.appendChild(item);
            });
            // Ajoute les eventListeners pour retirer
            liste.querySelectorAll('.retirer-btn').forEach(btn => {
              btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-index'));
                let panier = JSON.parse(localStorage.getItem("panier")) || [];
                panier.splice(idx, 1);
                localStorage.setItem("panier", JSON.stringify(panier));
                updatePanierCount();
                showPopup("Produit retiré du panier !");
                document.getElementById("btn-panier").click();
              });
            });
          }
        
          popup.style.display = "block";
      })

      document.getElementById("nav-panier").addEventListener('click', function(e) {
          e.preventDefault();
          document.getElementById("btn-panier").click();
      });

      document.getElementById("fermer").addEventListener('click', ()=>{
          document.getElementById("popup-panier").style.display = "none";
      });
        
      document.getElementById("soumettrePanier").addEventListener('click', ()=>{
          const donnees = new FormData();
          donnees.append('panier', localStorage.getItem("panier")||[]);
          
          fetch(`${adresseIP}/enregistrerCommande/`, {
              method: 'POST',
              headers: {
                'X-CSRFToken': csrftoken,
              },
              body:donnees,
          })
          .then(reponse => reponse.json())
          .then( data =>{
              console.log(data.message);
          })
          .catch(error =>{
              console.log(error);
          })
          document.getElementById("popup-panier").style.display = "none";
      });

      window.addEventListener('click', function(event) {
          const popup = document.getElementById("popup-panier");
        
          if (event.target === popup) {
            popup.style.display = "none";
          }
      });
                

  })
  .catch(error => {
    console.error("Erreur lors de la récupération des produits :", error);
    document.getElementById("product-grid").innerHTML = "<p>Erreur de chargement.</p>";
  });


  // Planifier un événement
  document.getElementById('planifier-btn').addEventListener('click', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const event = document.getElementById('event').value.trim();
    const date = document.getElementById('date').value;

    if (!email || !event || !date) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('event', event);
    formData.append('date', date);

    fetch(`${adresseIP}/planifier-event/`, {
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
                document.getElementById('email').value = '';
                document.getElementById('event').value = '';
                document.getElementById('date').value = '';
            }, 2500);
        } else {
            alert("Erreur lors de l'envoi. Veuillez réessayer.");
        }
    })
    .catch(() => {
        alert("Erreur réseau.");
    });
});

});


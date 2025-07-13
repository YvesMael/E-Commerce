// const panier = [];
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:8000/produits/")
      .then(response => response.json())
      .then(data => {
        const container = document.getElementById("product-grid");
        const container2 = document.getElementById("chocolats-grid"); // ceci pour l'affichage des chocolats
        container.innerHTML = "";
        container2.innerHTML = "";

        if (data.data == null) {
          container.innerHTML = "<p>Aucun produit disponible.</p>";
          container2.innerHTML = "<p>Aucun chocolat disponible.</p>";
          return;
        }

         data.data.forEach(produit => {
            const div = document.createElement("div");
            div.classList.add("product-card");
  
            div.innerHTML = `
              <img src="${produit.image}" alt="Produit">
              <h4 class="titre-produit" title="${produit.libelle}">${produit.libelle}</h4>
              <p>Prix unitaire: ${produit.prixUnitaire} Frs</p>
              <div class="qte">Quantite: <input type="number" class="qte-input" name="qte" min=1 placeholder="Ex: 1"></div>
              <button class="ajouter-btn">Ajouter au panier</button>
            `;
            container.appendChild(div);
        });

        // affichage de la liste des chocolats
        data.data.forEach(produit => {
            const div = document.createElement("div");
            div.classList.add("product-card");
  
            div.innerHTML = `
              <img src="${produit.image}" alt="Produit">
              <h4 class="titre-produit" title="${produit.libelle}">${produit.libelle}</h4>
              <p>Prix unitaire: ${produit.prixUnitaire} Frs</p>
              <div class="qte">Quantite: <input type="number" class="qte-input" name="qte" min=1 placeholder="Ex: 1"></div>
              <button class="ajouter-btn">Ajouter au panier</button>
            `;
            // container.appendChild(div);
            container2.appendChild(div);
        });

        document.querySelectorAll('.ajouter-btn').forEach((btn, idx) => {
            btn.addEventListener('click', function () {
                const produitDiv = this.closest('.product-card');
                const quantiteInput = produitDiv.querySelector('.qte-input');
                const quantite = parseInt(quantiteInput.value);
                
                const leProduit = data.data[idx];
                

                if (quantite > 0) {
                  let panier = JSON.parse(localStorage.getItem("panier")) || [];
                  panier.push({
                    "id":leProduit['id'],
                    "categorie":leProduit['categorie'],
                    "image":leProduit['image'],
                    "libelle":leProduit['libelle'],
                    "prixUnitaire":leProduit['prixUnitaire'],
                    "quantite":quantite
                  });

                  localStorage.setItem("panier", JSON.stringify(panier));
                  console.log("le produit:", leProduit);
                  console.log("Produit ajouté :", leProduit.libelle, "| Quantité :", quantite);
                  console.log("contenu panier", JSON.parse(localStorage.getItem("panier")));
                } else {
                alert("Veuillez entrer une quantité valide.");
                }
            });
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
                item.textContent = `${produit.libelle} - Quantité: ${produit.quantite}`;
                liste.appendChild(item);
              });
            }
          
            popup.style.display = "block";
        })

        document.getElementById("fermer").addEventListener('click', ()=>{
            document.getElementById("popup-panier").style.display = "none";
        });
          
        document.getElementById("soumettrePanier").addEventListener('click', ()=>{
            const donnees = new FormData();
            donnees.append('panier', localStorage.getItem("panier")||[]);
            
            fetch("http://localhost:8000/enregistrerCommande/", {
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
});



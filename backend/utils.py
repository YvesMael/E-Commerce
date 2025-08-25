# utils.py
from django.core.mail import send_mail
from django.conf import settings
from .models import LigneCommande

def envoyer_mail_panier(panier):
    client = panier.client
    utilisateur = client.utilisateur

    lignes = LigneCommande.objects.filter(panier=panier)

    if not lignes.exists():
        return  # Rien à envoyer

    produits_info = ""
    for ligne in lignes:
        produits_info += f"- {ligne.produit.libelle} (quantité: {ligne.quantite})\n"

    sujet = "Nouvelle commande passée"
    message = (
        f"Bonjour,\n\n"
        f"Un nouveau panier vient d'être soumis par :\n"
        f"Nom: {utilisateur.first_name} {utilisateur.last_name}\n"
        f"Téléphone: {utilisateur.telephone}\n"
        f"Adresse: {utilisateur.adresse}\n\n"
        f"Produits commandés :\n{produits_info}\n"
        f"Date de soumission : {panier.dateSoumission.strftime('%d/%m/%Y %H:%M')}"
    )

    send_mail(
        sujet,
        message,
        settings.DEFAULT_FROM_EMAIL,
        ['maeltchouassi@gmail.com'],  # Ou une autre adresse (admin par exemple)
        fail_silently=False,
    )

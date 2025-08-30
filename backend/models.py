from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.core.validators import MaxValueValidator
from PIL import Image
from phonenumber_field.modelfields import PhoneNumberField


class Utilisateur(AbstractUser):
    telephone = PhoneNumberField()
    adresse = models.CharField(max_length=250)

class Vendeur(models.Model):
    utilisateur = models.OneToOneField('Utilisateur', primary_key=True, on_delete=models.CASCADE, related_name="utilisateurVendeur")

class Client(models.Model):
    utilisateur = models.OneToOneField('Utilisateur', primary_key=True, on_delete=models.CASCADE, related_name="utilisateurClient") 

class Categorie(models.Model):
    nom = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nom

class Produit(models.Model):
    image = models.ImageField(upload_to='media/', default='defaut.jpg')
    libelle = models.CharField(max_length=250)
    ancienPrix = models.PositiveIntegerField()
    prixUnitaire = models.PositiveIntegerField()
    quantite = models.PositiveIntegerField()
    dateAJout = models.DateField(validators=[MaxValueValidator(now().date())])
    categorie = models.ForeignKey(to=Categorie, null=True, on_delete=models.SET_NULL)
    vendeur = models.ForeignKey('Vendeur', on_delete=models.CASCADE)

    IMAGE_MAX_SIZE = (400, 400)
    
    def resize_image(self):
        image = Image.open(self.image)
        image.thumbnail(self.IMAGE_MAX_SIZE)
        image.save(self.image.path)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.resize_image()

    def modifierQuantite(self, qte_reduite):
        if self.quantite<qte_reduite:
            return False
        self.quantite = self.quantite - qte_reduite
        return True
        
class Panier(models.Model):  # d'apres l'implementation qui a ete faite dans la vue, on aurait pu renommer Panier en Commande
    client = models.ForeignKey('Client', on_delete=models.CASCADE)
    etat = models.BooleanField(default=False) #Pour savoir si la commande est livree (validee) ou pas. Par defaut apres creation elle n'est pas livree (logique)
    dateSoumission = models.DateTimeField(auto_now=True)

    def valider(self):
        self.etat = True

class LigneCommande(models.Model):
    panier = models.ForeignKey('Panier', on_delete=models.CASCADE)
    produit = models.ForeignKey('Produit', on_delete=models.CASCADE)
    quantite = models.PositiveIntegerField()

    class Meta:
        unique_together = ('panier','produit')

    @staticmethod
    def ajouter_produit(panier, produit, quantite=1):
        ligne, created = LigneCommande.objects.get_or_create(
            panier=panier,
            produit=produit,
            defaults={'quantite': quantite}
        )
        if not created:
            ligne.quantite = quantite
            ligne.save()
        return ligne
    



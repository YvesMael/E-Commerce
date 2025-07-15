from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.core.validators import MaxValueValidator
from PIL import Image

class Utilisateur(AbstractUser):
    telephone = models.IntegerField(unique=True)
    adresse = models.CharField(max_length=250)

class Vendeur(models.Model):
    utilisateur = models.OneToOneField('Utilisateur', primary_key=True, on_delete=models.CASCADE, related_name="utilisateurVendeur")

class Client(Utilisateur):
    utilisateur = models.OneToOneField('Utilisateur', primary_key=True, on_delete=models.CASCADE, related_name="utilisateurClient") 

class Categorie(models.Model):
    nom = models.CharField(max_length=100, unique=True)

class Produit(models.Model):
    image = models.ImageField(upload_to='media/', default='defaut.jpg')
    libelle = models.CharField(max_length=250)
    prixUnitaire = models.PositiveIntegerField()
    quantite = models.PositiveIntegerField()
    dateAJout = models.DateField(validators=[MaxValueValidator(now().date())])
    categorie = models.ForeignKey(to=Categorie, to_field="nom", null=True, on_delete=models.SET_NULL)
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
        
class Panier(models.Model):
    client = models.OneToOneField('Client', on_delete=models.CASCADE)
    etat = models.BooleanField(default=False)

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
    



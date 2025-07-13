from rest_framework import serializers
from .models import Produit, Utilisateur
from django.contrib.auth import get_user_model

class ProduitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Produit
        fields = ('id','categorie','image','libelle','prixUnitaire')

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'



# create type Enfant(
#     Prenom varchar(20),
#     Age int
# );
# create type Voiture(
#     Marque varchar(20),
#     Type varchar(20),
#     Couleur varchar(20)
# );
# create type Personne(
#     NSec int,
#     Nom vachar(20),
#     Adresse varchar(20),
#     Enfants List(Enfant),
#     Voitures List(Voiture)
# );
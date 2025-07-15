from rest_framework import serializers
from .models import Produit, Utilisateur
from django.contrib.auth import get_user_model

class ProduitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Produit
        fields = ('id','categorie','image','libelle','prixUnitaire')

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = ['username', 'first_name', 'last_name', 'telephone', 'adresse', 'password']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

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
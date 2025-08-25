from rest_framework import serializers
from .models import Produit, Utilisateur, Client

class ProduitSerializer(serializers.ModelSerializer):

    class Meta:
        model = Produit
        fields = ('id','categorie','image','libelle','prixUnitaire')

class UtilisateurSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Utilisateur
        fields = [
            'username',
            'first_name',
            'last_name',
            'telephone',
            'adresse',
            'password',
            'password2',
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = Utilisateur(**validated_data)
        user.set_password(password)
        user.save()
        return user

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

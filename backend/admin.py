from django.contrib import admin
from .models import Produit, Categorie, Utilisateur, Vendeur, Client

admin.site.register(Produit)
admin.site.register(Categorie)
admin.site.register(Utilisateur)
admin.site.register(Vendeur)
admin.site.register(Client)

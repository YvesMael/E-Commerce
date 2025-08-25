from django.contrib import admin
from .models import Produit, Categorie, Utilisateur, Vendeur, Client, Panier

class PanierAdmin(admin.ModelAdmin):
    list_display = ('client_first_name', 'client_telephone', 'dateSoumission', 'etat_livraison')

    def client_first_name(self, obj):
        return obj.client.utilisateur.first_name
    client_first_name.short_description = 'Prénom Client'  # Nom affiché dans l’interface admin

    def client_telephone(self, obj):
        return obj.client.utilisateur.telephone
    client_telephone.short_description = "Telephone Client"

    def etat_livraison(self, obj):
        return "Livree" if obj.etat else "Pas Livree"

admin.site.register(Panier, PanierAdmin)
admin.site.register(Produit)
admin.site.register(Categorie)
admin.site.register(Utilisateur)
admin.site.register(Vendeur)
admin.site.register(Client)

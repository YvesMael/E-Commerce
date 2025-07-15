from django.urls import path
from .views import ProduitListAPIView, PanierAPIView, listeproduits, creerCompte
from django.conf.urls.static import static
from django.conf import settings

app_name = 'backend'
urlpatterns = [
    path('produits/', listeproduits),
    path('creerCompte/', creerCompte),
    path('enregistrerCommande/', PanierAPIView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
from django.urls import path
from .views import ProduitListAPIView, PanierAPIView, listeproduits, creerCompte, LoginAPIView, LogoutAPIView
from django.conf.urls.static import static
from django.conf import settings

app_name = 'backend'
urlpatterns = [
    path('creerCompte/', creerCompte),
    path('seConnecter/', LoginAPIView.as_view()),
    path('produits/', listeproduits),
    path('enregistrerCommande/', PanierAPIView.as_view()),
    path('deconnexion/', LogoutAPIView.as_view())
    # path('getPanier/', PanierAPIView.as_view(), name='panier'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
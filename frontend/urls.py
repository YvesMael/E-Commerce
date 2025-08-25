from django.urls import path
from .views import accueil, connexion, creer_compte
from django.conf import settings
from django.conf.urls.static import static

app_name = 'frontend'
urlpatterns = [
    path('accueil/', accueil, name="accueil"),
    path('connexion/', connexion, name="connexion"),
    path('creer_compte/', creer_compte, name="creer-compte"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
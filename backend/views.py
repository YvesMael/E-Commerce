from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from .models import Produit, Panier, LigneCommande, Utilisateur, Client
from .serializers import ProduitSerializer, UtilisateurSerializer, ClientSerializer
import json
from django.urls import reverse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from .utils import envoyer_mail_panier

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def creerCompte(request):
    serializer = UtilisateurSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        utilisateur = serializer.save()
        Client.objects.create(utilisateur = utilisateur)
        return Response({'message': 'Compte créé avec succès !'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listeproduits(request):
    try:
        listeGateaux = Produit.objects.filter(categorie='Gateaux')
        listeChocolats = Produit.objects.filter(categorie='Chocolat')
        listeAppareils = Produit.objects.filter(categorie='Appareils')
        if not listeGateaux and not listeChocolats and not listeAppareils:
            return Response({'data': None, 'message': 'Aucun produit'})
        listeGateauxSerializer = ProduitSerializer(instance=listeGateaux, many=True)
        listeChocolatsSerializer = ProduitSerializer(instance=listeChocolats, many=True)
        listeAppareilsSerializer = ProduitSerializer(instance=listeAppareils, many=True)
        listeSerializer = {
            'gateaux': listeGateauxSerializer.data,
            'chocolats': listeChocolatsSerializer.data,
            'appareils': listeAppareilsSerializer.data
        }
        return Response({'data': listeSerializer, 'message': 'Liste des produits'})
    except Exception as e:
        return Response({'message': 'erreur: ' + str(e)})

class LoginAPIView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id, 'username': user.username, 'redirect_url': reverse('frontend:accueil')})
        else:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)
 
class LogoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Supprime le token de l'utilisateur pour invalider la session
        try:
            request.user.auth_token.delete()
            print("deconnexion reussie")
        except (AttributeError, Token.DoesNotExist):
            pass
        
        # Appelle logout() pour les sessions Django (optionnel si tu n'utilises pas les sessions)
        logout(request)

        return Response({'message': 'Déconnexion réussie','redirect_url':reverse('frontend:accueil')}, status=status.HTTP_200_OK)

class ProduitListAPIView(APIView):
    def get(self):
        try:
            liste = Produit.objects.all()
            if liste.__len__() == 0:
                return Response({'data':None, 'message':'Aucun produit'})
            listeSerializer = ProduitSerializer(instance=liste, many=True)
            return Response({'data':listeSerializer.data, 'message':'Liste des produits'})
        except Exception as e:
            return Response({'message':'erreur: '+str(e)})
        
class UnProduitAPIView(APIView):
    def get(self, request, pk):
        leProduit = Produit.objects.get(id=pk)
        if leProduit:
            return Response({'data':leProduit,'message':'le produit a bien ete retourne'})
        else: return Response({'message':'le produit n\'existe pas'})
    
    def put(self, request, pk):
        leProduit = Produit.objects.get(id=pk)
        leProduit = self

class PanierAPIView(APIView):
    @parser_classes([MultiPartParser, FormParser])
    @permission_classes([IsAuthenticated])
    def post(self, request):
        client = Client.objects.get(utilisateur__pk=request.user.id)
        try:
            lesProduits_json = request.POST.get('panier')
            lesProduits = json.loads(lesProduits_json)
            # quantite = request.POST.get('quantite')
            # panier = Panier.objects.get_or_create(client=client, defaults={'etat':True})  # j'utilisais ceci lorsque chaque client n'avait qu'un seul panier 
            panier = Panier.objects.create(client=client)
            for produit in lesProduits:
                produit_obj = Produit.objects.get(pk=produit['id'])
                LigneCommande.ajouter_produit(panier=panier, produit=produit_obj, quantite=produit['quantite'])
            envoyer_mail_panier(panier)
            return Response({'message':'succes', 'redirect_url':reverse('frontend:accueil')})
        except Exception as e:
            return Response({'message':'erreur: '+str(e)})
    
    @permission_classes([IsAuthenticated])
    def get(request):
        try:
            lignesCommandes = LigneCommande.objects.select_related('panier', 'produit').filter(panier__client=request.user.id)
            lesProduits = ProduitSerializer(instance=[ligneCom.produit for ligneCom in lignesCommandes], many=True)
            return Response({'data':lesProduits,'message':'La liste des produits de ton panier'})
        except Exception as e:
            return Response({'message':'erreur: '+str(e)})

from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.response import Response
from .models import Produit, Panier, LigneCommande, Utilisateur
from .serializers import ProduitSerializer, UtilisateurSerializer
import json
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import authenticate

@api_view(['POST'])
def creerCompte(request):
    print("Requete de creation de compte: ", request.data)
    nouvelUtilisateur = {
        'username': 'Mon',
        'first_name': request.data.get('nom'),
        'last_name': request.data.get('nom'),
        'telephone': int(request.data.get('tel')),
        'adresse': request.data.get('adresse'),
        'password': request.data.get('password'),
        'password': request.data.get('password2')
    }
    print("Nouvel utilisateur User: ", nouvelUtilisateur)
    nouvelUtilisateurSerialiser = UtilisateurSerializer(data=nouvelUtilisateur)
    print("Nouvel utilisateur: ", nouvelUtilisateurSerialiser.error_messages)
    if nouvelUtilisateurSerialiser.is_valid(raise_exception=True):
        user = nouvelUtilisateurSerialiser.save()
        user.set_password(nouvelUtilisateur['password'])
        user.save()
        return Response({'message':'creation de compte reussie, vous etes connecte'})
    return Response({'message':'Echec de creation de compte'})

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
            token = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'user_id': user.id, 'username': user.username})
        else:
            return Response({'error': 'Identifiants invalides'}, status=status.HTTP_401_UNAUTHORIZED)
 
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
    def post(request):
        try:
            lesProduits_json = request.POST.get('panier')
            lesProduits = json.loads(lesProduits_json)
            # quantite = request.POST.get('quantite')
            panier = Panier.objects.get_or_create(client=request.user.id, defaults={'etat':True})
            for produit in lesProduits:
                LigneCommande.ajouter_produit(panier=panier.id, produit=produit['id'], quantite=produit['quantite'])
            return Response({'message':'succes'})
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

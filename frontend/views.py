from django.shortcuts import render

def accueil(request):
    return render(request, 'frontend/index.html')

def connexion(request):
    return render(request, 'frontend/connexion.html')

def creer_compte(request):
    return render(request, 'frontend/creer_compte.html')
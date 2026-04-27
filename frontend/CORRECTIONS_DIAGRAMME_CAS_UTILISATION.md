# Corrections du Diagramme de Cas d'Utilisation

## 🔄 Mise à jour récente (Authentification requise pour les produits)

### Changements appliqués
- **"Parcourir tous les véhicules"** : Déplacé de la section "sans connexion" vers "avec connexion"
  - Nécessite maintenant `<<include>>` vers "Se connecter"
  - Seuls les clients connectés peuvent accéder à la page `/products`
  
- **"Voir détails d'un véhicule"** : Déplacé de la section "sans connexion" vers "avec connexion"
  - Nécessite maintenant `<<include>>` vers "Se connecter"
  - Seuls les clients connectés peuvent voir les détails d'un produit

- **Résultat** : Seuls "Consulter page d'accueil" et "Utiliser le chatbot IA" restent accessibles sans connexion

## ✅ Problèmes identifiés et corrigés

### 1. **Relation incorrecte : "Payer en ligne" → "Consulter historique"**
   - **Problème** : Le diagramme montrait que "Payer en ligne" inclut "Consulter les historique de commande" avec une note "(commande visible après paiement)"
   - **Correction** : "Consulter mes commandes" est maintenant **indépendant** du paiement. Les deux incluent seulement "Se connecter"
   - **Raison** : Un client peut consulter son historique à tout moment après connexion, pas seulement après un paiement

### 2. **Fonctionnalités manquantes - Client**
   - ✅ **"Se déconnecter"** : Ajouté comme cas d'utilisation pour le client connecté
   - ✅ **"Filtrer les véhicules"** : Ajouté avec généralisation (Filtrer par Carburant, Filtrer par Marque)
   - ✅ **"Consulter Description/Photo/Caractéristique"** : Ajouté comme généralisation de "Voir détails"

### 3. **Fonctionnalités manquantes - Admin**
   - ✅ **"Consulter Dashboard"** : Ajouté (présent dans `/admin/page.tsx`)
   - ✅ **"Gérer les clients"** : Ajouté avec "Supprimer client" comme sous-cas
   - ✅ **"Supprimer une annonce"** : Ajouté comme sous-cas de "Gérer les annonces"
   - ✅ **"Confirmé", "En livraison", "Livrés"** : Ajoutés comme généralisation de "Changer statut commande"
   - ❌ **"Réinitialiser et synchroniser données"** : Supprimé du diagramme (fonctionnalité technique non représentée)

### 4. **Relations corrigées**
   - ✅ **"Voir détails" → "Créer une commande"** : Changé en `<<extend>>` (optionnel) au lieu de `<<include>>`
   - ✅ **"Parcourir véhicules" → "Filtrer"** : Changé en `<<extend>>` (optionnel) au lieu de `<<include>>`
   - ✅ **"Filtrer les véhicules"** : Ajouté `<<include>>` vers "Se connecter" (les filtres nécessitent la connexion selon le code)
   - ✅ **"Voir détails"** : Ajouté `<<include>>` vers "Se connecter" (nécessaire pour créer une commande)
   - ✅ Tous les cas d'utilisation Admin incluent maintenant "Se connecter"

## 📋 Structure complète du nouveau diagramme

### **Acteurs**
- `Client` (peut être connecté ou non)
- `Admin`
- `Service IA chatbot` (système externe)
- `Système de paiement virtuel` (système externe)

**Note** : Le diagramme utilise un seul acteur "Client" pour simplifier. Les relations `<<include>>` vers "Se connecter" indiquent quels cas d'utilisation nécessitent une authentification.

### **Cas d'utilisation Client (sans connexion)**
1. Consulter page d'accueil
2. Utiliser le chatbot IA
   - Poser questions détaillées (extension)

### **Cas d'utilisation Client (avec connexion)**
1. Se connecter
2. Créer un compte (peut étendre → Se connecter)
3. Se déconnecter
4. **Parcourir tous les véhicules** (nécessite connexion)
   - Filtrer les véhicules (extension)
     - Filtrer par Carburant
     - Filtrer par Marque
5. **Voir détails d'un véhicule** (nécessite connexion)
   - Consulter Description
   - Consulter Photo
   - Consulter caractéristique
6. Créer une commande (inclut → Se connecter)
7. Payer la commande - paiement virtuel (inclut → Se connecter)
8. Consulter mes commandes (inclut → Se connecter)


### **Cas d'utilisation Admin**
1. Consulter Dashboard (inclut → Se connecter)
2. Gérer les clients (inclut → Se connecter)
   - Supprimer client
3. Gérer les annonces (inclut → Se connecter)
   - Créer une annonce
   - Modifier une annonce
   - Supprimer une annonce
4. Gérer les ventes (inclut → Se connecter)
   - Voir liste des commandes
   - Changer statut commande
     - Confirmé
     - En livraison
     - Livrés

## 🔗 Relations importantes

### **<<include>>** (toujours exécuté)
- `Parcourir véhicules` → `Se connecter` ⚠️ **NOUVEAU**
- `Parcourir véhicules` → `Voir détails`
- `Voir détails` → `Se connecter` ⚠️ **NOUVEAU**
- `Créer commande` → `Se connecter`
- `Créer commande` → `Payer la commande`
- `Payer la commande` → `Se connecter`
- `Consulter mes commandes` → `Se connecter`
- `Filtrer les véhicules` → `Se connecter`
- Tous les cas Admin → `Se connecter`

### **<<extend>>** (conditionnel/optionnel)
- `Créer un compte` → `Se connecter` (peut se connecter après inscription)
- `Parcourir véhicules` → `Filtrer les véhicules` (filtres optionnels)
- `Voir détails` → `Créer une commande` (peut créer commande depuis détails)
- `Utiliser chatbot IA` → `Poser questions détaillées` (questions détaillées optionnelles)

### **Associations directes**
- `Client` → `Consulter page d'accueil` (accessible sans connexion)
- `Client` → `Utiliser le chatbot IA` (accessible sans connexion)
- `Client connecté` → `Parcourir tous les véhicules` ⚠️ **NOUVEAU**
- `Client connecté` → `Voir détails d'un véhicule` ⚠️ **NOUVEAU**

### **Généralisation** (héritage)
- `Client connecté` → `Client`
- `Filtrer par Carburant` → `Filtrer les véhicules`
- `Filtrer par Marque` → `Filtrer les véhicules`
- `Consulter Description` → `Voir détails`
- `Consulter Photo` → `Voir détails`
- `Consulter caractéristique` → `Voir détails`
- `Confirmé` → `Changer statut commande`
- `En livraison` → `Changer statut commande`
- `Livrés` → `Changer statut commande`

## 📁 Fichiers

- **Nouveau diagramme complet** : `diagramme_cas_utilisation_complet.puml`
- **Ancien diagramme** : `diagramme_cas_utilisation_corrige.puml` (conservé pour référence)

## 🎯 Utilisation

Copie le contenu de `diagramme_cas_utilisation_complet.puml` dans draw.io pour visualiser le diagramme complet et corrigé.


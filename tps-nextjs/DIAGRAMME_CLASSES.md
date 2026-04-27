# Diagramme de Classes - Auto Excellence Showroom

## Diagramme UML en format PlantUML

```plantuml
@startuml
!theme plain
skinparam classAttributeIconSize 0

' ============================================
' MODÈLES DE DONNÉES (MongoDB/Mongoose)
' ============================================

class Product {
  -_id: String
  +marque: String
  +description: String
  +prix: Number
  +etat: String
  +kilometrage: Number
  +carburant: String
  +image: String
  +images: String[]
  +annee?: Number
  +couleur?: String
  +transmission?: String
  +puissance?: Number
  +portes?: Number
  +siege?: Number
  +createdAt: Date
  +updatedAt: Date
}

class Commande {
  -_id: String
  +produitId: String
  +marque: String
  +prix: Number
  +statut: String
  +dateCommande: Date
  +client: ClientInfo
}

class ClientInfo {
  +nom: String
  +prenom?: String
  +email: String
  +telephone: String
  +adresse?: String
  +ville?: String
  +codePostal?: String
}

class User {
  -_id: String
  +prenom: String
  +nom: String
  +email: String
  +password: String
  +role: String
  +createdAt: Date
  +updatedAt: Date
  +comparePassword(password: String): Boolean
}

class Sale {
  -_id: String
  +carId: ObjectId
  +buyerId: ObjectId
  +saleDate: Date
  +price: Number
}

' ============================================
' COMPOSANTS REACT (Frontend)
' ============================================

class Navbar {
  +links: Link[]
  +isOpen: Boolean
  +setIsOpen(Boolean): void
  +render(): JSX.Element
}

class Footer {
  +render(): JSX.Element
}

class HomePage {
  +products: Product[]
  +loading: Boolean
  +fetchProducts(): void
  +render(): JSX.Element
}

class ProductDetailsPage {
  +product: Product
  +loading: Boolean
  +fetchProduct(id: String): void
  +render(): JSX.Element
}

class CommandePage {
  +product: Product
  +formData: FormData
  +errors: Object
  +submitting: Boolean
  +handleSubmit(): void
  +validateForm(): Boolean
  +render(): JSX.Element
}

class AdminDashboard {
  +stats: Stats
  +loading: Boolean
  +fetchStats(): void
  +render(): JSX.Element
}

class VentesPage {
  +commandes: Commande[]
  +loading: Boolean
  +filtreStatut: String
  +recherche: String
  +updatingStatus: String
  +fetchCommandes(): void
  +handleStatusChange(id: String, statut: String): void
  +render(): JSX.Element
}

' ============================================
' ROUTES API (Backend)
' ============================================

class ProductsAPI {
  +GET(): Product[]
  +POST(product: Product): Product
  +GET(id: String): Product
  +PUT(id: String, data: Object): Product
  +DELETE(id: String): void
}

class CommandeAPI {
  +POST(commande: Commande): Commande
  +GET(email: String): Commande[]
}

class AdminCommandeAPI {
  +PUT(id: String, statut: String): Commande
}

class AdminVentesAPI {
  +GET(): Commande[]
}

class AdminStatsAPI {
  +GET(): Stats
}

class AuthAPI {
  +POST(credentials: Object): Token
  +POST(user: User): User
}

' ============================================
' TYPES ET INTERFACES
' ============================================

class Stats {
  +totalClients: Number
  +totalAnnonces: Number
  +annoncesDisponibles: Number
  +annoncesVendues: Number
  +totalVentes: Number
  +totalRevenue: Number
}

class FormData {
  +nom: String
  +prenom: String
  +email: String
  +telephone: String
  +adresse: String
  +ville: String
  +codePostal: String
  +acceptConditions: Boolean
}

' ============================================
' RELATIONS
' ============================================

Product "1" --> "*" Commande : produitId
Commande "1" --> "1" ClientInfo : contient
User "1" --> "*" Sale : buyerId
Product "1" --> "*" Sale : carId

HomePage --> Product : utilise
ProductDetailsPage --> Product : affiche
CommandePage --> Product : référence
CommandePage --> Commande : crée
VentesPage --> Commande : gère
AdminDashboard --> Stats : affiche

ProductsAPI --> Product : manipule
CommandeAPI --> Commande : manipule
AdminCommandeAPI --> Commande : modifie
AdminVentesAPI --> Commande : récupère
AdminStatsAPI --> Stats : génère
AuthAPI --> User : authentifie

@enduml
```

## Diagramme UML en format Mermaid (pour GitHub/Markdown)

```mermaid
classDiagram
    class Product {
        -String _id
        +String marque
        +String description
        +Number prix
        +String etat
        +Number kilometrage
        +String carburant
        +String image
        +String[] images
        +Number annee
        +String couleur
        +String transmission
        +Number puissance
        +Number portes
        +Number siege
        +Date createdAt
        +Date updatedAt
    }

    class Commande {
        -String _id
        +String produitId
        +String marque
        +Number prix
        +String statut
        +Date dateCommande
        +ClientInfo client
    }

    class ClientInfo {
        +String nom
        +String prenom
        +String email
        +String telephone
        +String adresse
        +String ville
        +String codePostal
    }

    class User {
        -String _id
        +String prenom
        +String nom
        +String email
        +String password
        +String role
        +Date createdAt
        +Date updatedAt
        +Boolean comparePassword(String)
    }

    class Sale {
        -String _id
        +ObjectId carId
        +ObjectId buyerId
        +Date saleDate
        +Number price
    }

    class HomePage {
        +Product[] products
        +Boolean loading
        +void fetchProducts()
    }

    class CommandePage {
        +Product product
        +FormData formData
        +Object errors
        +Boolean submitting
        +void handleSubmit()
        +Boolean validateForm()
    }

    class VentesPage {
        +Commande[] commandes
        +Boolean loading
        +String filtreStatut
        +String recherche
        +void fetchCommandes()
        +void handleStatusChange()
    }

    class ProductsAPI {
        +Product[] GET()
        +Product POST(Product)
        +Product GET(String)
        +Product PUT(String, Object)
        +void DELETE(String)
    }

    class CommandeAPI {
        +Commande POST(Commande)
        +Commande[] GET(String)
    }

    class AdminCommandeAPI {
        +Commande PUT(String, String)
    }

    class AdminStatsAPI {
        +Stats GET()
    }

    Product "1" --> "*" Commande : produitId
    Commande "1" --> "1" ClientInfo : contient
    User "1" --> "*" Sale : buyerId
    Product "1" --> "*" Sale : carId
    
    HomePage --> Product
    CommandePage --> Product
    CommandePage --> Commande
    VentesPage --> Commande
    ProductsAPI --> Product
    CommandeAPI --> Commande
    AdminCommandeAPI --> Commande
```

## Description des Classes Principales

### Modèles de Données (MongoDB)

#### **Product**
Représente un véhicule dans le showroom.
- Attributs principaux : marque, description, prix, état, kilométrage
- Attributs optionnels : année, couleur, transmission, puissance, portes, sièges
- Relations : lié à plusieurs Commandes via `produitId`

#### **Commande**
Représente une commande d'achat de véhicule.
- Contient les informations du produit commandé
- Contient les informations du client (ClientInfo)
- Statut : "en_attente" ou "confirmée"
- Relation : référence un Product via `produitId`

#### **ClientInfo**
Informations du client intégrées dans Commande.
- Données personnelles : nom, prénom, email, téléphone
- Données d'adresse : adresse, ville, code postal

#### **User**
Représente un utilisateur du système (client ou admin).
- Authentification : email, password (hashé)
- Rôle : "user" ou "admin"
- Méthode : comparePassword() pour vérifier le mot de passe

#### **Sale**
Représente une vente complétée (historique).
- Référence un Product (carId) et un User (buyerId)
- Date de vente et prix

### Composants Frontend (React)

#### **HomePage**
Page d'accueil affichant les produits en vedette.
- Charge et affiche les 6 premiers produits
- Navigation vers la liste complète

#### **CommandePage**
Page de création de commande.
- Formulaire de saisie des informations client
- Validation des données
- Création de la commande avec statut "en_attente"

#### **VentesPage**
Dashboard admin pour gérer les commandes.
- Liste des commandes avec filtres
- Changement de statut des commandes
- Recherche par client/marque/email

#### **AdminDashboard**
Tableau de bord administrateur.
- Statistiques globales (clients, ventes, revenus)

### Routes API (Next.js)

#### **ProductsAPI**
Gestion CRUD des produits.
- GET : liste tous les produits
- POST : créer un produit
- GET(id) : récupérer un produit
- PUT(id) : modifier un produit
- DELETE(id) : supprimer un produit

#### **CommandeAPI**
Gestion des commandes.
- POST : créer une commande
- GET(email) : récupérer les commandes d'un client

#### **AdminCommandeAPI**
Gestion admin des commandes.
- PUT(id, statut) : modifier le statut d'une commande

#### **AdminVentesAPI**
Récupération des ventes pour l'admin.
- GET : liste toutes les commandes

#### **AdminStatsAPI**
Génération des statistiques.
- GET : retourne les stats globales

## Relations Principales

1. **Product → Commande** : Un produit peut avoir plusieurs commandes (1 à plusieurs)
2. **Commande → ClientInfo** : Une commande contient les infos d'un client (composition)
3. **User → Sale** : Un utilisateur peut avoir plusieurs ventes (1 à plusieurs)
4. **Product → Sale** : Un produit peut être vendu plusieurs fois (1 à plusieurs)

## Notes Techniques

- **MongoDB/Mongoose** : Tous les modèles utilisent Mongoose pour la persistance
- **Next.js API Routes** : Les routes API sont des fonctions serverless
- **React Components** : Composants fonctionnels avec hooks (useState, useEffect)
- **TypeScript** : Interfaces définies pour le typage fort
- **Validation** : Validation côté client et serveur



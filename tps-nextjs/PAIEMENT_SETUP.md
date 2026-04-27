# Configuration du Paiement en Ligne - Stripe

## 📋 Fonctionnalités Implémentées

✅ Intégration complète de Stripe Checkout dans le processus de commande
✅ Création automatique de session de paiement après validation du formulaire
✅ Vérification du paiement après retour de Stripe
✅ Mise à jour automatique du statut de commande après paiement réussi
✅ Page de succès avec confirmation du paiement
✅ Gestion de l'annulation du paiement

## 🔧 Configuration Requise

### 1. Variables d'Environnement

Ajoutez ces variables dans votre fichier `.env.local` :

```env
# Stripe Keys (obtenez-les sur https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Installation des Dépendances

Stripe est déjà installé dans `package.json`. Si besoin :

```bash
npm install stripe
```

### 3. Obtenir les Clés Stripe

1. Créez un compte sur [Stripe](https://stripe.com)
2. Allez dans le [Dashboard](https://dashboard.stripe.com)
3. Récupérez vos clés API dans **Developers > API keys**
4. Utilisez les clés de **test** pour le développement

## 🔄 Flux de Paiement

1. **Client remplit le formulaire de commande**
   - Validation des champs
   - Création de la commande avec statut "en_attente"

2. **Redirection vers Stripe Checkout**
   - Création d'une session Stripe
   - Redirection vers la page de paiement Stripe

3. **Paiement sur Stripe**
   - Client saisit ses informations de carte
   - Stripe traite le paiement

4. **Retour sur le site**
   - Si succès : redirection vers `/payment/success`
   - Si annulation : retour vers la page de commande

5. **Vérification et Confirmation**
   - Vérification du statut de paiement
   - Mise à jour de la commande : statut "confirmée"
   - Marquer le produit comme "Vendu"

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
- `src/app/api/payment/create-checkout/route.ts` - Création session Stripe
- `src/app/api/payment/verify/route.ts` - Vérification paiement
- `src/app/payment/success/page.tsx` - Page de succès

### Fichiers Modifiés
- `src/app/commande/[id]/page.tsx` - Intégration du paiement
- `src/models/Commande.ts` - Ajout champs paiement (paymentId, paymentStatus, paidAt)

## 🧪 Test en Mode Développement

### Cartes de Test Stripe

Utilisez ces cartes pour tester :

**Paiement réussi :**
- Numéro : `4242 4242 4242 4242`
- Date : n'importe quelle date future
- CVC : n'importe quel 3 chiffres
- Code postal : n'importe quel code

**Paiement refusé :**
- Numéro : `4000 0000 0000 0002`

**3D Secure (nécessite authentification) :**
- Numéro : `4000 0025 0000 3155`

### Tester le Flux

1. Allez sur une page produit
2. Cliquez sur "Commander"
3. Remplissez le formulaire
4. Cliquez sur "Procéder au paiement"
5. Utilisez une carte de test
6. Vérifiez la confirmation

## 🔐 Sécurité

- ✅ Les clés secrètes Stripe restent côté serveur
- ✅ Validation des données avant création de session
- ✅ Vérification du statut de paiement avant confirmation
- ✅ HTTPS requis en production

## 📝 Notes Importantes

- En **mode test**, aucun paiement réel n'est effectué
- Les commandes sont créées avec statut "en_attente" avant le paiement
- Après paiement réussi, le statut passe à "confirmée"
- Le produit est marqué "Vendu" uniquement après paiement confirmé

## 🚀 Déploiement en Production

1. Obtenez vos clés Stripe **live** (pas de test)
2. Configurez les variables d'environnement en production
3. Mettez à jour `NEXT_PUBLIC_BASE_URL` avec votre domaine
4. Configurez les webhooks Stripe pour une vérification automatique
5. Testez avec de petits montants avant de passer en production complète

## 🆘 Support

En cas de problème :
- Vérifiez les logs de la console navigateur
- Vérifiez les logs serveur Next.js
- Consultez le [Dashboard Stripe](https://dashboard.stripe.com) pour les logs de paiement



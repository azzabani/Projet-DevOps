# 💳 Guide des Cartes de Test Stripe

## 🎯 Mode Test

Lorsque vous utilisez les clés de **test** Stripe (commençant par `sk_test_`), vous pouvez utiliser des cartes de test pour simuler des paiements sans effectuer de vrais paiements.

## ✅ Cartes de Test pour Paiements Réussis

### Carte Visa Standard (Succès)
- **Numéro :** `4242 4242 4242 4242`
- **Date d'expiration :** N'importe quelle date future (ex: `12/34`)
- **CVC :** N'importe quel 3 chiffres (ex: `123`)
- **Code postal :** N'importe quel code postal valide

### Autres Cartes de Test (Succès)
- **Visa (Débit) :** `4000 0566 5566 5556`
- **Mastercard :** `5555 5555 5555 4444`
- **American Express :** `3782 822463 10005`

## ❌ Cartes de Test pour Simuler des Erreurs

### Carte Refusée (Insufficient Funds)
- **Numéro :** `4000 0000 0000 9995`
- **Message :** "Your card has insufficient funds."

### Carte Refusée (Generic Decline)
- **Numéro :** `4000 0000 0000 0002`
- **Message :** "Your card was declined."

### Carte Expirée
- **Numéro :** `4000 0000 0000 0069`
- **Message :** "Your card has expired."

### CVC Incorrect
- **Numéro :** `4000 0000 0000 0127`
- **Message :** "Your card's security code is incorrect."

## 🔧 Comment Utiliser

1. **Remplissez le formulaire** avec vos informations (ou utilisez le bouton "Remplir avec données de test")
2. **Cliquez sur "Redirection vers le paiement"**
3. **Sur la page Stripe Checkout**, utilisez une des cartes de test ci-dessus
4. **Entrez n'importe quelle date d'expiration future** (ex: 12/34)
5. **Entrez n'importe quel CVC** (ex: 123)
6. **Entrez n'importe quel code postal** (ex: 75001)

## ⚠️ Important

- Ces cartes **ne fonctionnent QUE** avec les clés de test Stripe (`sk_test_...`)
- Aucun vrai paiement ne sera effectué
- Les transactions apparaîtront dans votre dashboard Stripe en mode test
- Pour passer en production, utilisez les clés live (`sk_live_...`) et de vraies cartes

## 📚 Documentation Officielle

Pour plus d'informations, consultez la [documentation Stripe sur les cartes de test](https://stripe.com/docs/testing).



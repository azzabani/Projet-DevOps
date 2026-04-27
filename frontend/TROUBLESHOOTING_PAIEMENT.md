# 🔧 Dépannage - Erreur de Paiement

## Erreur : "Une erreur est survenue lors du traitement de votre commande"

### ✅ Vérifications à faire

#### 1. **Vérifier la configuration Stripe**

Assurez-vous que votre fichier `.env.local` contient :

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Comment obtenir votre clé Stripe :**
1. Allez sur https://dashboard.stripe.com
2. Créez un compte ou connectez-vous
3. Allez dans **Developers > API keys**
4. Copiez la **Secret key** (commence par `sk_test_` pour le mode test)
5. Collez-la dans `.env.local`

#### 2. **Redémarrer le serveur**

Après avoir ajouté/modifié `.env.local`, **redémarrez** votre serveur Next.js :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
npm run dev
```

#### 3. **Vérifier les logs de la console**

Ouvrez la **console du navigateur** (F12) et regardez les erreurs :
- Erreurs en rouge indiquent le problème exact
- Les messages commençant par "❌" sont des erreurs serveur

#### 4. **Vérifier les logs serveur**

Dans le terminal où tourne `npm run dev`, regardez les messages :
- `🟡 API Commande appelée` = La commande est en cours
- `✅ Commande créée` = La commande a été créée
- `❌ Erreur...` = Il y a une erreur

### 🔍 Erreurs courantes et solutions

#### Erreur : "Configuration Stripe manquante"
**Solution :** Ajoutez `STRIPE_SECRET_KEY` dans `.env.local` et redémarrez le serveur

#### Erreur : "Données manquantes"
**Solution :** Vérifiez que tous les champs du formulaire sont remplis

#### Erreur : "Prix invalide"
**Solution :** Le prix doit être un nombre positif supérieur à 0.50€

#### Erreur : "Erreur lors de la création de la session de paiement"
**Solutions possibles :**
- Vérifiez que votre clé Stripe est valide
- Vérifiez votre connexion internet
- Vérifiez que vous utilisez une clé de **test** (commence par `sk_test_`)

#### Erreur : "Erreur lors de la création de la commande"
**Solutions possibles :**
- Vérifiez que MongoDB est démarré
- Vérifiez la connexion à MongoDB dans `lib/mongodb.ts`
- Vérifiez que le modèle Commande est correctement importé

### 🧪 Mode test sans Stripe (temporaire)

Si vous voulez tester sans Stripe, vous pouvez modifier temporairement le code pour contourner le paiement :

Dans `src/app/commande/[id]/page.tsx`, remplacez la partie paiement par :

```typescript
// Mode test : passer directement à la confirmation
if (res.ok && data.commande) {
  router.push(`/success?commandeId=${data.commande._id}`);
}
```

⚠️ **Attention :** Ceci est uniquement pour le développement. En production, vous DEVEZ utiliser Stripe.

### 📞 Support

Si le problème persiste :
1. Vérifiez tous les logs (navigateur + serveur)
2. Copiez les messages d'erreur exacts
3. Vérifiez que MongoDB et Next.js sont bien démarrés
4. Vérifiez que toutes les dépendances sont installées : `npm install`

### ✅ Checklist de vérification

- [ ] `.env.local` existe et contient `STRIPE_SECRET_KEY`
- [ ] La clé Stripe commence par `sk_test_` (mode test)
- [ ] Le serveur Next.js a été redémarré après modification de `.env.local`
- [ ] MongoDB est démarré et accessible
- [ ] Tous les champs du formulaire sont remplis
- [ ] Le prix du produit est valide (> 0)
- [ ] La console du navigateur ne montre pas d'erreurs
- [ ] Les logs serveur ne montrent pas d'erreurs



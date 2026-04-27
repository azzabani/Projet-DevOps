from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import json
import re
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import stripe

# ------------------------------
# 🔑 Charger fichier .env
# ------------------------------
load_dotenv()

# ------------------------------
# ⚡ Créer l'application Flask
# ------------------------------
app = Flask(__name__)
CORS(app)

# ------------------------------
# 🔐 Clé API GROQ
# ------------------------------
api_key = os.getenv("GROQ_API")
if not api_key:
    raise ValueError("❌ La clé GROQ_API n'est pas configurée dans .env !")
print("✅ Clé API GROQ chargée.")

client_groq = Groq(api_key=api_key)

# ------------------------------
# 🔐 Clé Stripe
# ------------------------------
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
if not stripe.api_key:
    raise ValueError("❌ La clé STRIPE_SECRET_KEY n'est pas configurée dans .env !")
print("✅ Clé Stripe chargée.")

# ------------------------------
# 🗄 Connexion MongoDB
# ------------------------------
try:
    mongo_client = MongoClient("mongodb://localhost:27017/")
    db = mongo_client["chatDB"]
    messages_collection = db["messages"]
    print("✅ Connexion MongoDB réussie.")
except Exception as e:
    print("❌ Erreur MongoDB :", e)

# ------------------------------
# 📄 Charger infos.txt
# ------------------------------
try:
    with open("infos.txt", "r", encoding="utf-8") as f:
        INFOS = f.read()
    print("✅ Fichier infos.txt chargé.")
except:
    INFOS = "Informations non disponibles."
    print("❌ Impossible de lire infos.txt.")

# ------------------------------
# 🔎 Extraire les annonces JSON (si présentes) pour réponses rapides
# ------------------------------
PRODUCTS_BY_MARQUE = {}
try:
    # Rechercher un bloc JSON array dans le fichier (après la section 'NOUVELLES ANNONCES')
    m = re.search(r"NOUVELLES ANNONCES AJOUT[EÉ]ES[\s\S]*?\[([\s\S]*?)\]\s*$", INFOS, re.IGNORECASE)
    json_block = None
    if m:
        # Re-extract full array including brackets
        start = m.start(0) + m.group(0).find('[')
        json_block = INFOS[start:]
    else:
        # Fallback: try to find the first '[' and last ']' in the file
        s = INFOS.find('[')
        e = INFOS.rfind(']')
        if s != -1 and e != -1 and e > s:
            json_block = INFOS[s:e+1]

    if json_block:
        try:
            products = json.loads(json_block)
            for p in products:
                marque = str(p.get('marque','')).strip()
                prix = p.get('prix')
                if marque:
                    PRODUCTS_BY_MARQUE[marque.lower()] = p
            print(f"✅ {len(PRODUCTS_BY_MARQUE)} annonces extraites pour réponses rapides.")
        except Exception as e:
            print("⚠️ Impossible d'analyser le bloc JSON des annonces :", e)
    else:
        print("⚠️ Aucun bloc JSON d'annonces trouvé dans infos.txt.")
except Exception as e:
    print("⚠️ Erreur lors de l'extraction des annonces :", e)

# ------------------------------
# 🤖 API CHATBOT
# ------------------------------
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json
        question = data.get("message", "").strip()

        if not question:
            return jsonify({"reply": "❌ Veuillez poser une question valide."})

        # --- Vérification rapide : si la question demande le prix d'une marque connue, répondre directement ---
        ql = question.lower()
        for marque_lower, product in PRODUCTS_BY_MARQUE.items():
            if marque_lower in ql and ("prix" in ql or "combien" in ql or "coûte" in ql or "donne" in ql):
                prix = product.get('prix')
                if prix is not None:
                    reply = f"Le prix de {product.get('marque')} est {prix} €."
                    # Enregistrer et répondre
                    messages_collection.insert_one({
                        "question": question,
                        "reply": reply,
                        "source": "chatbot"
                    })
                    return jsonify({"reply": reply})

        # Si question courte du type 'prix Opel Astra', tenter une correspondance partielle
        if "prix" in ql or "combien" in ql or "coûte" in ql:
            for marque_lower, product in PRODUCTS_BY_MARQUE.items():
                # match on tokens (split by spaces) to reduce false positives
                tokens = re.split(r"\W+", marque_lower)
                if any(t in ql for t in tokens if t):
                    prix = product.get('prix')
                    if prix is not None:
                        reply = f"Le prix de {product.get('marque')} est {prix} €."
                        messages_collection.insert_one({
                            "question": question,
                            "reply": reply,
                            "source": "chatbot"
                        })
                        return jsonify({"reply": reply})

        # Prompt envoyé à GROQ
        prompt = f"""
### SYSTEME
Tu es un assistant virtuel professionnel pour Auto Excellence Showroom.

### INFORMATIONS
{INFOS}

### QUESTION UTILISATEUR
{question}

Réponds clairement en français.
"""

        # Indiquer explicitement d'utiliser les informations fournies pour les faits
        prompt = (
            "Tu dois utiliser en priorité la section INFORMATIONS ci-dessus pour toute donnée factuelle (prix, état, kilométrage, année, etc.). "
            "Si l'information demandée se trouve dans les données, réponds directement avec la valeur demandée. "
            "Ne donne pas d'informations inventées.\n\n" + prompt
        )

        # Appel GROQ
        response = client_groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )

        reply = response.choices[0].message.content

        # Enregistrement MongoDB
        messages_collection.insert_one({
            "question": question,
            "reply": reply,
            "source": "chatbot"
        })
        print("💾 Message enregistré dans MongoDB.")

        return jsonify({"reply": reply})

    except Exception as e:
        print("❌ Erreur backend :", e)
        return jsonify({"error": str(e)}), 500

# ------------------------------
# 💳 API PAIEMENT STRIPE
# ------------------------------
@app.route("/pay", methods=["POST"])
def pay():
    try:
        data = request.get_json()
        product_id = data.get("productId")
        amount = data.get("amount", 2000)  # montant en cents par défaut

        if not product_id:
            return jsonify({"error": "productId manquant"}), 400

        # Création d'une session Stripe Checkout
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {'name': f'Produit {product_id}'},
                    'unit_amount': amount,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url="http://localhost:3000/success",
            cancel_url="http://localhost:3000/cancel",
        )

        return jsonify({"url": session.url})

    except Exception as e:
        print("❌ Erreur Stripe :", e)
        return jsonify({"error": str(e)}), 500

# ------------------------------
# 🚀 Run server
# ------------------------------
if __name__ == "__main__":
    print("🚀 Serveur Flask lancé : http://127.0.0.1:5000")
    app.run(port=5000, debug=True)

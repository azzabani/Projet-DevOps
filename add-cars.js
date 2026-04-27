const mongoose = require('mongoose');

// Connexion à MongoDB
DATABASE_URL="mongodb://localhost:27017/nextjs_crud"

const productSchema = new mongoose.Schema({
  marque: { type: String, required: true },
  description: { type: String, required: true },
  prix: { type: Number, required: true },
  etat: { type: String, required: true },
  kilometrage: { type: Number, required: true },
  carburant: { type: String, required: true },
  image: { type: String, required: true },
  images: { type: [String], default: [] },
  annee: { type: Number },
  couleur: { type: String },
  transmission: { type: String },
  puissance: { type: Number },
  portes: { type: Number },
  siege: { type: Number }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

const newCars = [
  {
    marque: "Peugeot 308",
    description: "Berline compacte, très fiable, entretien régulier",
    prix: 8500,
    etat: "Occasion",
    kilometrage: 145000,
    carburant: "Diesel",
    image: "assets/308 pegot.jpg",
    annee: 2015,
    couleur: "Gris",
    transmission: "Manuelle",
    puissance: 110,
    portes: 5,
    siege: 5
  },
  {
    marque: "Renault Megane",
    description: "Voiture pratique, climatisation, bon état général",
    prix: 7800,
    etat: "Occasion",
    kilometrage: 168000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=Renault+Megane",
    annee: 2014,
    couleur: "Bleu",
    transmission: "Manuelle",
    puissance: 105,
    portes: 5,
    siege: 5
  },
  {
    marque: "Citroën C5",
    description: "Berline spacieuse, confortable pour longs trajets",
    prix: 9200,
    etat: "Occasion",
    kilometrage: 132000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=Citroen+C5",
    annee: 2016,
    couleur: "Noir",
    transmission: "Automatique",
    puissance: 120,
    portes: 5,
    siege: 5
  },
  {
    marque: "Fiat 500X",
    description: "SUV compact moderne, intérieur soigné",
    prix: 10500,
    etat: "Occasion",
    kilometrage: 95000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=Fiat+500X",
    annee: 2017,
    couleur: "Blanc",
    transmission: "Manuelle",
    puissance: 115,
    portes: 5,
    siege: 5
  },
  {
    marque: "Volkswagen Passat",
    description: "Berline robuste, sécurité optimale, climatisation",
    prix: 11000,
    etat: "Occasion",
    kilometrage: 125000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=VW+Passat",
    annee: 2016,
    couleur: "Gris métal",
    transmission: "Manuelle",
    puissance: 130,
    portes: 5,
    siege: 5
  },
  {
    marque: "Toyota Verso",
    description: "Monospace 7 places, très spacieux et fiable",
    prix: 9800,
    etat: "Occasion",
    kilometrage: 156000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=Toyota+Verso",
    annee: 2015,
    couleur: "Argent",
    transmission: "Manuelle",
    puissance: 112,
    portes: 5,
    siege: 7
  },
  {
    marque: "Opel Astra",
    description: "Berline économe, parfait pour trajets quotidiens",
    prix: 7500,
    etat: "Occasion",
    kilometrage: 175000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=Opel+Astra",
    annee: 2013,
    couleur: "Noir",
    transmission: "Manuelle",
    puissance: 100,
    portes: 5,
    siege: 5
  },
  {
    marque: "Mazda CX-5",
    description: "SUV élégant, traction intégrale, confortable",
    prix: 12500,
    etat: "Occasion",
    kilometrage: 108000,
    carburant: "Diesel",
    image: "https://via.placeholder.com/400x300?text=Mazda+CX5",
    annee: 2018,
    couleur: "Rouge",
    transmission: "Automatique",
    puissance: 150,
    portes: 5,
    siege: 5
  }
];

async function addCars() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connecté à MongoDB');
    
    // Ajouter les voitures
    const result = await Product.insertMany(newCars);
    console.log(`✅ ${result.length} voitures ajoutées avec succès!`);
    
    result.forEach((car, index) => {
      console.log(`${index + 1}. ${car.marque} - ${car.prix}€ - ${car.kilometrage}km`);
    });
    
    await mongoose.disconnect();
    console.log('✅ Déconnecté de MongoDB');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

addCars();

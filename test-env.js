require('dotenv').config({ path: '.env.local' });

console.log('🔍 TEST VARIABLES D\'ENVIRONNEMENT');
console.log('='.repeat(50));

// Vérifier Stripe
console.log('\n💳 STRIPE:');
console.log('STRIPE_SECRET_KEY définie:', !!process.env.STRIPE_SECRET_KEY);
console.log('Longueur:', process.env.STRIPE_SECRET_KEY?.length || 0);
console.log('Début:', process.env.STRIPE_SECRET_KEY?.substring(0, 20) + '...');
console.log('Format correct:', process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? '✅' : '❌');

console.log('\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY définie:', !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
console.log('Début:', process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 20) + '...');

// Vérifier MongoDB
console.log('\n🔗 MONGODB:');
console.log('MONGODB_URI définie:', !!process.env.MONGODB_URI);
if (process.env.MONGODB_URI) {
  console.log('Format:', process.env.MONGODB_URI.startsWith('mongodb://') ? '✅ mongodb://' : 
              process.env.MONGODB_URI.startsWith('mongodb+srv://') ? '✅ mongodb+srv://' : '❌');
  console.log('URI:', process.env.MONGODB_URI);
}

// Vérifier App URL
console.log('\n🌐 APPLICATION:');
console.log('NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL);

console.log('\n' + '='.repeat(50));
console.log('✅ Test terminé');
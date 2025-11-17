// Script to add images to existing events in Firestore
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../src/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Event images mapped by category
const eventImages = {
  'cat_music': 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop',
  'cat_sports': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  'cat_workshop': 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
  'cat_conference': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
  'cat_food': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
  'cat_art': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
  'cat_tech': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop'
};

async function addImagesToEvents() {
  try {
    console.log('🔄 Fetching events from Firestore...');
    const eventsSnapshot = await db.collection('events').get();
    
    console.log(`📊 Found ${eventsSnapshot.docs.length} events`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const doc of eventsSnapshot.docs) {
      const data = doc.data();
      
      // Skip if event already has an image
      if (data.image || data.image_url) {
        console.log(`⏭️  Skipping ${doc.id} - already has an image`);
        skippedCount++;
        continue;
      }
      
      // Get image URL based on category
      const category = data.category || 'default';
      const imageUrl = eventImages[category] || eventImages['default'];
      
      // Update the event with the image
      await doc.ref.update({
        image: imageUrl
      });
      
      console.log(`✅ Added image to ${doc.id} (${data.title}) - Category: ${category}`);
      updatedCount++;
    }
    
    console.log('\n📊 Summary:');
    console.log(`   ✅ Updated: ${updatedCount} events`);
    console.log(`   ⏭️  Skipped: ${skippedCount} events (already had images)`);
    console.log(`   📝 Total: ${eventsSnapshot.docs.length} events`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding images to events:', error);
    process.exit(1);
  }
}

addImagesToEvents();

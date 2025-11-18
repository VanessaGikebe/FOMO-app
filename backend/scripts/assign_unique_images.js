// Script to assign unique images to all events
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '../src/serviceAccountKey.json');
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Diverse collection of event images from Unsplash - all unique
const eventImages = {
  music: [
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=400&fit=crop',
  ],
  sports: [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=400&fit=crop',
  ],
  workshop: [
    'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=800&h=400&fit=crop',
  ],
  conference: [
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560523159-4a9692d222ef?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
  ],
  food: [
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529417305485-480f579e1358?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800&h=400&fit=crop',
  ],
  art: [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1577083552431-6e5fd01988ec?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&h=400&fit=crop',
  ],
  tech: [
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
  ],
  business: [
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=400&fit=crop',
  ],
  fitness: [
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1522898467493-49726bf28798?w=800&h=400&fit=crop',
  ],
  education: [
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop',
  ]
};

// Map category IDs to image arrays
const categoryImageMap = {
  'cat_music': 'music',
  'cat_sports': 'sports',
  'cat_workshop': 'workshop',
  'cat_conference': 'conference',
  'cat_food': 'food',
  'cat_art': 'art',
  'cat_tech': 'tech',
  'cat_business': 'business',
  'cat_fitness': 'fitness',
  'cat_education': 'education',
  'Technology': 'tech',
  'cat_work': 'workshop'
};

async function assignUniqueImages() {
  try {
    console.log('🔄 Fetching events from Firestore...');
    const eventsSnapshot = await db.collection('events').get();
    
    console.log(`📊 Found ${eventsSnapshot.docs.length} events\n`);
    
    // Track which images have been used
    const usedImages = new Set();
    const categoryCounters = {};
    let updatedCount = 0;
    
    for (const doc of eventsSnapshot.docs) {
      const data = doc.data();
      const category = data.category || 'Technology';
      
      // Get the image array for this category
      const imageKey = categoryImageMap[category] || 'tech';
      const imageArray = eventImages[imageKey];
      
      // Initialize counter for this category if not exists
      if (!categoryCounters[imageKey]) {
        categoryCounters[imageKey] = 0;
      }
      
      // Get next available image for this category
      const imageIndex = categoryCounters[imageKey] % imageArray.length;
      let imageUrl = imageArray[imageIndex];
      
      // If image is already used, try next images until we find an unused one
      let attempts = 0;
      while (usedImages.has(imageUrl) && attempts < imageArray.length) {
        categoryCounters[imageKey]++;
        const nextIndex = categoryCounters[imageKey] % imageArray.length;
        imageUrl = imageArray[nextIndex];
        attempts++;
      }
      
      // Mark this image as used
      usedImages.add(imageUrl);
      categoryCounters[imageKey]++;
      
      // Update the event with the unique image
      await doc.ref.update({
        image: imageUrl
      });
      
      console.log(`✅ ${doc.id}: ${data.title} - ${category}`);
      updatedCount++;
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} events`);
    console.log(`   🎨 Unique images: ${usedImages.size}`);
    console.log(`   📝 Total events: ${eventsSnapshot.docs.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error assigning unique images:', error);
    process.exit(1);
  }
}

assignUniqueImages();

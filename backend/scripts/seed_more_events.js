// Script to seed more events with realistic KSH prices
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

// Event categories with images
const categories = {
  'cat_music': {
    name: 'Music',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop'
  },
  'cat_sports': {
    name: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop'
  },
  'cat_workshop': {
    name: 'Workshop',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop'
  },
  'cat_conference': {
    name: 'Conference',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop'
  },
  'cat_food': {
    name: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=400&fit=crop'
  },
  'cat_art': {
    name: 'Art & Culture',
    image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop'
  },
  'cat_tech': {
    name: 'Technology',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop'
  },
  'cat_business': {
    name: 'Business',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=400&fit=crop'
  },
  'cat_fitness': {
    name: 'Fitness & Wellness',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=400&fit=crop'
  },
  'cat_education': {
    name: 'Education',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop'
  }
};

// Kenyan venues
const venues = [
  'KICC Nairobi',
  'Kenyatta International Convention Centre',
  'Sarit Centre Nairobi',
  'Village Market',
  'The Alchemist Bar',
  'Carnivore Restaurant',
  'Nairobi National Museum',
  'Alliance Française',
  'Uhuru Gardens',
  'Karen Blixen Museum',
  'Two Rivers Mall',
  'Westgate Mall',
  'Panari Hotel',
  'Radisson Blu Hotel',
  'Villa Rosa Kempinski',
  'Safari Park Hotel',
  'Bomas of Kenya',
  'Ngong Racecourse',
  'Kasarani Stadium',
  'Nyayo National Stadium'
];

// Sample events data
const eventsData = [
  // Music Events
  { category: 'cat_music', title: 'Sauti Sol Live Concert', description: 'Experience Kenya\'s finest band live with all their greatest hits. A night of Afro-pop excellence.', price: 2500, capacity: 500 },
  { category: 'cat_music', title: 'Nairobi Jazz Festival', description: 'Annual jazz festival featuring local and international artists in a beautiful outdoor setting.', price: 3000, capacity: 1000 },
  { category: 'cat_music', title: 'Gospel Praise Night', description: 'An evening of powerful worship and praise with leading gospel artists from Kenya.', price: 1500, capacity: 800 },
  { category: 'cat_music', title: 'Afrobeats Party', description: 'Dance all night to the hottest Afrobeats, Amapiano, and African dance music.', price: 1000, capacity: 300 },
  { category: 'cat_music', title: 'Classical Orchestra Evening', description: 'The Nairobi Orchestra performs timeless classical masterpieces.', price: 3500, capacity: 400 },
  
  // Sports Events
  { category: 'cat_sports', title: 'Nairobi Marathon 2025', description: 'Join thousands of runners in Kenya\'s premier marathon event through the city streets.', price: 2000, capacity: 5000 },
  { category: 'cat_sports', title: 'KPL Football Match', description: 'Exciting Kenya Premier League match featuring top local football clubs.', price: 1000, capacity: 10000 },
  { category: 'cat_sports', title: 'Rugby Sevens Tournament', description: 'International rugby sevens tournament at RFUEA Grounds.', price: 1500, capacity: 3000 },
  { category: 'cat_sports', title: 'Fitness Bootcamp Weekend', description: 'Intensive 2-day outdoor fitness bootcamp with professional trainers.', price: 5000, capacity: 50 },
  { category: 'cat_sports', title: 'Cycling Tour Karura Forest', description: 'Guided mountain biking tour through Karura Forest trails.', price: 2500, capacity: 30 },
  
  // Workshop Events
  { category: 'cat_workshop', title: 'Digital Marketing Masterclass', description: 'Learn SEO, social media marketing, and content strategy from industry experts.', price: 8000, capacity: 100 },
  { category: 'cat_workshop', title: 'Photography Workshop', description: 'Hands-on photography training covering composition, lighting, and editing.', price: 6000, capacity: 25 },
  { category: 'cat_workshop', title: 'Entrepreneurship Bootcamp', description: '3-day intensive program for aspiring and early-stage entrepreneurs.', price: 15000, capacity: 60 },
  { category: 'cat_workshop', title: 'Cooking Class: Kenyan Cuisine', description: 'Learn to prepare authentic Kenyan dishes from professional chefs.', price: 4000, capacity: 20 },
  { category: 'cat_workshop', title: 'Public Speaking Workshop', description: 'Develop confidence and skills in public speaking and presentations.', price: 5000, capacity: 40 },
  
  // Conference Events
  { category: 'cat_conference', title: 'East Africa Tech Summit', description: 'Premier technology conference featuring leaders in innovation and startups.', price: 12000, capacity: 500 },
  { category: 'cat_conference', title: 'Healthcare Innovation Forum', description: 'Conference on digital health, medical technology, and healthcare delivery.', price: 10000, capacity: 300 },
  { category: 'cat_conference', title: 'Sustainable Business Conference', description: 'Discuss ESG, sustainability, and green business practices.', price: 9000, capacity: 250 },
  { category: 'cat_conference', title: 'Women in Leadership Summit', description: 'Empowering women leaders across industries with networking and insights.', price: 7000, capacity: 400 },
  { category: 'cat_conference', title: 'Finance & Investment Forum', description: 'Expert insights on investment opportunities, fintech, and financial markets.', price: 15000, capacity: 200 },
  
  // Food & Drink Events
  { category: 'cat_food', title: 'Nairobi Food Festival', description: 'Taste cuisines from around Kenya and the world at this food lover\'s paradise.', price: 1500, capacity: 2000 },
  { category: 'cat_food', title: 'Wine Tasting Evening', description: 'Sample premium wines from around the world with expert sommeliers.', price: 4000, capacity: 80 },
  { category: 'cat_food', title: 'Street Food Night Market', description: 'Enjoy diverse street food offerings from local vendors in a vibrant atmosphere.', price: 1000, capacity: 500 },
  { category: 'cat_food', title: 'BBQ & Grill Masterclass', description: 'Learn grilling techniques and recipes from award-winning chefs.', price: 3500, capacity: 30 },
  { category: 'cat_food', title: 'Coffee Cupping Experience', description: 'Discover Kenyan coffee through professional tasting and brewing sessions.', price: 2000, capacity: 25 },
  
  // Art & Culture Events
  { category: 'cat_art', title: 'Contemporary Art Exhibition', description: 'Showcase of modern Kenyan artists exploring identity, culture, and society.', price: 1500, capacity: 200 },
  { category: 'cat_art', title: 'Theatre Performance: Kenyan Stories', description: 'Original theatrical production celebrating Kenyan narratives and heritage.', price: 2000, capacity: 300 },
  { category: 'cat_art', title: 'Poetry Open Mic Night', description: 'Share your poetry or enjoy performances from talented spoken word artists.', price: 1000, capacity: 100 },
  { category: 'cat_art', title: 'Traditional Dance Festival', description: 'Experience the rich diversity of Kenyan traditional dances and music.', price: 1500, capacity: 400 },
  { category: 'cat_art', title: 'Film Screening & Discussion', description: 'Watch award-winning African films followed by director Q&A sessions.', price: 1200, capacity: 150 },
  
  // Technology Events
  { category: 'cat_tech', title: 'AI & Machine Learning Workshop', description: 'Hands-on workshop on artificial intelligence and machine learning applications.', price: 10000, capacity: 80 },
  { category: 'cat_tech', title: 'Hackathon Weekend', description: '48-hour coding challenge with prizes for innovative tech solutions.', price: 3000, capacity: 150 },
  { category: 'cat_tech', title: 'Blockchain Summit Kenya', description: 'Explore blockchain technology, cryptocurrency, and Web3 innovations.', price: 8000, capacity: 200 },
  { category: 'cat_tech', title: 'UX/UI Design Bootcamp', description: 'Learn user experience and interface design principles and tools.', price: 12000, capacity: 50 },
  { category: 'cat_tech', title: 'Cybersecurity Conference', description: 'Latest trends and best practices in cybersecurity and data protection.', price: 9000, capacity: 250 },
  
  // Business Events
  { category: 'cat_business', title: 'Startup Pitch Competition', description: 'Entrepreneurs pitch their startups to investors for funding opportunities.', price: 2000, capacity: 300 },
  { category: 'cat_business', title: 'Business Networking Mixer', description: 'Connect with professionals, entrepreneurs, and business leaders.', price: 3000, capacity: 200 },
  { category: 'cat_business', title: 'Real Estate Investment Forum', description: 'Insights on property investment opportunities in Kenya and East Africa.', price: 7000, capacity: 250 },
  { category: 'cat_business', title: 'E-commerce & Retail Summit', description: 'Strategies for online retail, logistics, and customer experience.', price: 6000, capacity: 180 },
  { category: 'cat_business', title: 'Leadership Excellence Workshop', description: 'Develop leadership skills and learn from successful business leaders.', price: 8000, capacity: 100 },
  
  // Fitness & Wellness Events
  { category: 'cat_fitness', title: 'Yoga Retreat Weekend', description: 'Rejuvenating yoga and meditation retreat in a serene natural setting.', price: 12000, capacity: 40 },
  { category: 'cat_fitness', title: 'Mental Health Awareness Seminar', description: 'Learn about mental wellness, stress management, and self-care.', price: 2500, capacity: 150 },
  { category: 'cat_fitness', title: 'CrossFit Challenge', description: 'High-intensity fitness competition testing strength and endurance.', price: 3000, capacity: 100 },
  { category: 'cat_fitness', title: 'Nutrition & Wellness Workshop', description: 'Expert guidance on healthy eating, meal planning, and nutrition.', price: 4000, capacity: 60 },
  { category: 'cat_fitness', title: 'Marathon Training Program', description: '12-week structured training program for marathon preparation.', price: 15000, capacity: 50 },
  
  // Education Events
  { category: 'cat_education', title: 'Career Fair 2025', description: 'Meet employers, explore career opportunities, and network with recruiters.', price: 1000, capacity: 1000 },
  { category: 'cat_education', title: 'Study Abroad Fair', description: 'Learn about international education opportunities and scholarships.', price: 1500, capacity: 500 },
  { category: 'cat_education', title: 'Financial Literacy Workshop', description: 'Learn personal finance, budgeting, investing, and wealth creation.', price: 3000, capacity: 100 },
  { category: 'cat_education', title: 'STEM Education Conference', description: 'Advancing science, technology, engineering, and math education in Kenya.', price: 5000, capacity: 300 },
  { category: 'cat_education', title: 'Skills Development Bootcamp', description: 'Practical training in digital skills for career advancement.', price: 8000, capacity: 80 }
];

// Function to generate random date within next 3 months
function getRandomFutureDate() {
  const now = new Date();
  const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  const randomTime = now.getTime() + Math.random() * (threeMonthsLater.getTime() - now.getTime());
  return new Date(randomTime);
}

async function seedEvents() {
  try {
    console.log('🌱 Starting to seed events...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const eventData of eventsData) {
      try {
        const startDate = getRandomFutureDate();
        const endDate = new Date(startDate.getTime() + (3 + Math.floor(Math.random() * 5)) * 60 * 60 * 1000);
        
        const event = {
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          price: eventData.price,
          capacity: eventData.capacity,
          venue: venues[Math.floor(Math.random() * venues.length)],
          start_date: admin.firestore.Timestamp.fromDate(startDate),
          end_date: admin.firestore.Timestamp.fromDate(endDate),
          created_at: admin.firestore.Timestamp.now(),
          status: 'published',
          organizer_id: 'user_organizer_1',
          image: categories[eventData.category].image,
          attendee_count: 0
        };
        
        await db.collection('events').add(event);
        console.log(`✅ Created: ${event.title} (${categories[eventData.category].name}) - KSH ${event.price}`);
        successCount++;
        
      } catch (error) {
        console.error(`❌ Error creating event "${eventData.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📊 Seeding Complete!');
    console.log(`   ✅ Success: ${successCount} events created`);
    console.log(`   ❌ Errors: ${errorCount} events failed`);
    console.log(`   📝 Total attempted: ${eventsData.length} events`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

seedEvents();

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function loadServiceAccountFromFile(p) {
  try {
    const raw = fs.readFileSync(p, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

function initAdmin() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({ credential: admin.credential.cert(parsed) });
      return;
    } catch (err) {
      console.error('Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const p = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    const sa = loadServiceAccountFromFile(p);
    if (sa) {
      admin.initializeApp({ credential: admin.credential.cert(sa) });
      return;
    }
  }

  const possible = path.resolve(process.cwd(), 'serviceAccountKey.json');
  const possible2 = path.resolve(__dirname, '..', 'serviceAccountKey.json');
  const sa = loadServiceAccountFromFile(possible) || loadServiceAccountFromFile(possible2) || loadServiceAccountFromFile(path.resolve(__dirname, '..', 'src', 'serviceAccountKey.json'));
  if (sa) {
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    return;
  }

  console.warn('No service account JSON found locally; falling back to Application Default Credentials.');
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

async function safeSet(docRef, data) {
  // merge = true to avoid destructive overwrites
  await docRef.set(data, { merge: true });
}

async function main() {
  initAdmin();
  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();

  console.log('Seeding Firestore with sample collections/documents...');

  // 1. User Roles
  const roles = [
    { id: 'attendee', name: 'attendee' },
    { id: 'organizer', name: 'organizer' },
    { id: 'moderator', name: 'moderator' },
  ];
  for (const r of roles) {
    await safeSet(db.collection('user_roles').doc(r.id), { role_id: r.id, role_name: r.name });
  }
  console.log('- user_roles seeded');

  // 2. Users (3 sample users)
  const users = [
    {
      id: 'user_organizer_1',
      fullName: 'Alice Organizer',
      email: 'alice.organizer@example.com',
      passwordHash: 'placeholder',
      role: 'organizer',
      createdAt: now,
      profilePic: '',
      status: 'active',
    },
    {
      id: 'user_attendee_1',
      fullName: 'Bob Attendee',
      email: 'bob.attendee@example.com',
      passwordHash: 'placeholder',
      role: 'attendee',
      createdAt: now,
      profilePic: '',
      status: 'active',
    },
    {
      id: 'user_moderator_1',
      fullName: 'Mona Moderator',
      email: 'mona.moderator@example.com',
      passwordHash: 'placeholder',
      role: 'moderator',
      createdAt: now,
      profilePic: '',
      status: 'active',
    },
  ];
  for (const u of users) {
    await safeSet(db.collection('users').doc(u.id), u);
  }
  console.log('- users seeded');

  // 3. User Sessions (sample)
  await safeSet(db.collection('user_sessions').doc('session_1'), {
    session_id: 'session_1',
    user_id: users[1].id,
    login_time: now,
    logout_time: null,
    ip_address: '127.0.0.1',
  });
  console.log('- user_sessions seeded');

  // 4. Event categories
  const categories = [
    { id: 'cat_music', name: 'Music', description: 'Concerts and live music' },
    { id: 'cat_workshop', name: 'Workshops', description: 'Hands-on classes' },
  ];
  for (const c of categories) {
    await safeSet(db.collection('event_categories').doc(c.id), c);
  }
  console.log('- event_categories seeded');

  // 5. Events
  const event1 = {
    event_id: 'evt_1',
    organizer_id: users[0].id,
    title: 'Summer Concert',
    description: 'An outdoor musical event',
    category: 'cat_music',
    venue: 'Central Park',
    start_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 3600 * 1000)),
    end_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 3600 * 1000 + 3 * 3600 * 1000)),
    price: 25.0,
    capacity: 500,
    status: 'published',
    created_at: now,
  };
  await safeSet(db.collection('events').doc(event1.event_id), event1);
  console.log('- events seeded');

  // Additional sample events to give event-goers options
  const event2 = {
    event_id: 'evt_2',
    organizer_id: users[0].id,
    title: 'Coding Bootcamp',
    description: 'A hands-on weekend bootcamp covering fullstack JavaScript development.',
    category: 'cat_workshop',
    venue: 'Tech Hub Auditorium',
    image_url: 'https://example.com/bootcamp.jpg',
    start_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 3600 * 1000)),
    end_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 14 * 24 * 3600 * 1000 + 8 * 3600 * 1000)),
    price: 150.0,
    capacity: 120,
    status: 'published',
    created_at: now,
  };
  const event3 = {
    event_id: 'evt_3',
    organizer_id: users[1].id,
    title: 'Jazz Night Live',
    description: 'An evening of smooth jazz featuring local and international artists.',
    category: 'cat_music',
    venue: 'The Alchemist Bar',
    image_url: 'https://example.com/jazznight.jpg',
    start_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 3600 * 1000)),
    end_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 3 * 24 * 3600 * 1000 + 4 * 3600 * 1000)),
    price: 15.0,
    capacity: 200,
    status: 'published',
    created_at: now,
  };
  const event4 = {
    event_id: 'evt_4',
    organizer_id: users[0].id,
    title: 'Food Festival Nairobi',
    description: 'Celebrate culinary diversity with over 50 food vendors and live entertainment.',
    category: 'cat_music',
    venue: 'Uhuru Gardens',
    image_url: 'https://example.com/foodfest.jpg',
    start_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 3600 * 1000)),
    end_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 3600 * 1000 + 8 * 3600 * 1000)),
    price: 5.0,
    capacity: 1000,
    status: 'published',
    created_at: now,
  };
  const event5 = {
    event_id: 'evt_5',
    organizer_id: users[2].id,
    title: 'Startup Pitch Competition',
    description: 'Watch innovative startups pitch their ideas to top investors.',
    category: 'cat_workshop',
    venue: 'iHub Nairobi',
    image_url: 'https://example.com/pitch.jpg',
    start_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 21 * 24 * 3600 * 1000)),
    end_date: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 21 * 24 * 3600 * 1000 + 6 * 3600 * 1000)),
    price: 10.0,
    capacity: 300,
    status: 'published',
    created_at: now,
  };

  const extraEvents = [event2, event3, event4, event5];
  for (const e of extraEvents) {
    await safeSet(db.collection('events').doc(e.event_id), e);
  }
  console.log('- additional events seeded');

  // Event images for the additional events
  await safeSet(db.collection('event_images').doc('img_evt_2'), {
    image_id: 'img_evt_2',
    event_id: 'evt_2',
    image_url: 'https://example.com/bootcamp.jpg',
    is_featured: true,
  });
  await safeSet(db.collection('event_images').doc('img_evt_3'), {
    image_id: 'img_evt_3',
    event_id: 'evt_3',
    image_url: 'https://example.com/jazznight.jpg',
    is_featured: true,
  });
  await safeSet(db.collection('event_images').doc('img_evt_4'), {
    image_id: 'img_evt_4',
    event_id: 'evt_4',
    image_url: 'https://example.com/foodfest.jpg',
    is_featured: true,
  });
  await safeSet(db.collection('event_images').doc('img_evt_5'), {
    image_id: 'img_evt_5',
    event_id: 'evt_5',
    image_url: 'https://example.com/pitch.jpg',
    is_featured: true,
  });
  console.log('- additional event images seeded');

  // Event tags and mapping for extra events
  await safeSet(db.collection('event_tags').doc('tag_workshop'), { tag_id: 'tag_workshop', tag_name: 'Workshop' });
  await safeSet(db.collection('event_tags').doc('tag_jazz'), { tag_id: 'tag_jazz', tag_name: 'Jazz' });
  await safeSet(db.collection('event_tags').doc('tag_food'), { tag_id: 'tag_food', tag_name: 'Food' });
  await safeSet(db.collection('event_tags').doc('tag_startup'), { tag_id: 'tag_startup', tag_name: 'Startup' });

  await safeSet(db.collection('event_tag_mapping').doc('evt_2_tag_workshop'), { event_id: 'evt_2', tag_id: 'tag_workshop' });
  await safeSet(db.collection('event_tag_mapping').doc('evt_3_tag_jazz'), { event_id: 'evt_3', tag_id: 'tag_jazz' });
  await safeSet(db.collection('event_tag_mapping').doc('evt_4_tag_food'), { event_id: 'evt_4', tag_id: 'tag_food' });
  await safeSet(db.collection('event_tag_mapping').doc('evt_5_tag_startup'), { event_id: 'evt_5', tag_id: 'tag_startup' });
  console.log('- additional event tags/mapping seeded');

  // Tickets & payments for extra events (sample purchases)
  await safeSet(db.collection('tickets').doc('ticket_evt2_1'), {
    ticket_id: 'ticket_evt2_1',
    event_id: 'evt_2',
    user_id: users[1].id,
    purchase_date: now,
    price_paid: 150.0,
    payment_status: 'paid',
  });
  await safeSet(db.collection('payments').doc('payment_evt2_1'), {
    payment_id: 'payment_evt2_1',
    ticket_id: 'ticket_evt2_1',
    transaction_id: 'txn_evt2_1',
    amount: 150.0,
    payment_method: 'card',
    payment_date: now,
    status: 'completed',
  });

  await safeSet(db.collection('tickets').doc('ticket_evt3_1'), {
    ticket_id: 'ticket_evt3_1',
    event_id: 'evt_3',
    user_id: users[1].id,
    purchase_date: now,
    price_paid: 15.0,
    payment_status: 'paid',
  });
  await safeSet(db.collection('payments').doc('payment_evt3_1'), {
    payment_id: 'payment_evt3_1',
    ticket_id: 'ticket_evt3_1',
    transaction_id: 'txn_evt3_1',
    amount: 15.0,
    payment_method: 'mpesa',
    payment_date: now,
    status: 'completed',
  });

  console.log('- sample tickets/payments for extra events seeded');

  // 6. Event images
  await safeSet(db.collection('event_images').doc('img_evt_1'), {
    image_id: 'img_evt_1',
    event_id: event1.event_id,
    image_url: 'https://example.com/banner1.jpg',
    is_featured: true,
  });

  // 7. Event tags and mapping
  await safeSet(db.collection('event_tags').doc('tag_music'), { tag_id: 'tag_music', tag_name: 'Music' });
  await safeSet(db.collection('event_tag_mapping').doc(`${event1.event_id}_tag_music`), {
    event_id: event1.event_id,
    tag_id: 'tag_music',
  });
  console.log('- event tags/images seeded');

  // 8. Tickets & payments
  await safeSet(db.collection('tickets').doc('ticket_1'), {
    ticket_id: 'ticket_1',
    event_id: event1.event_id,
    user_id: users[1].id,
    purchase_date: now,
    price_paid: 25.0,
    payment_status: 'paid',
  });
  await safeSet(db.collection('payments').doc('payment_1'), {
    payment_id: 'payment_1',
    ticket_id: 'ticket_1',
    transaction_id: 'txn_12345',
    amount: 25.0,
    payment_method: 'card',
    payment_date: now,
    status: 'completed',
  });
  console.log('- tickets/payments seeded');

  // 9. Refunds (empty example)
  await safeSet(db.collection('refunds').doc('refund_1'), {
    refund_id: 'refund_1',
    ticket_id: 'ticket_1',
    reason: 'Change of plans',
    refund_status: 'requested',
    requested_at: now,
    processed_at: null,
  });

  // 10. Support tickets & reviews
  await safeSet(db.collection('support_tickets').doc('support_1'), {
    ticket_id: 'support_1',
    user_id: users[1].id,
    subject: 'Issue with ticket',
    message: 'I cannot download my ticket',
    status: 'open',
    created_at: now,
    resolved_by: null,
  });
  await safeSet(db.collection('reviews').doc('review_1'), {
    review_id: 'review_1',
    event_id: event1.event_id,
    user_id: users[1].id,
    rating: 5,
    comment: 'Great event!',
    created_at: now,
  });
  console.log('- support_tickets/reviews seeded');

  // 11. Notifications & Messages
  await safeSet(db.collection('notifications').doc('notif_1'), {
    notification_id: 'notif_1',
    user_id: users[1].id,
    message: 'Your ticket is confirmed',
    type: 'info',
    is_read: false,
    created_at: now,
  });
  await safeSet(db.collection('messages').doc('msg_1'), {
    message_id: 'msg_1',
    sender_id: users[1].id,
    receiver_id: users[0].id,
    content: 'Is the event family friendly?',
    timestamp: now,
    is_read: false,
  });

  // 12. Favourites, Cart, Event Views, Search History
  await safeSet(db.collection('favourites').doc('fav_1'), {
    fav_id: 'fav_1',
    user_id: users[1].id,
    event_id: event1.event_id,
    created_at: now,
  });
  await safeSet(db.collection('cart').doc('cart_1'), {
    cart_id: 'cart_1',
    user_id: users[1].id,
    event_id: event1.event_id,
    quantity: 2,
    added_at: now,
  });
  await safeSet(db.collection('event_views').doc('view_1'), {
    view_id: 'view_1',
    user_id: users[1].id,
    event_id: event1.event_id,
    viewed_at: now,
  });
  await safeSet(db.collection('search_history').doc('search_1'), {
    search_id: 'search_1',
    user_id: users[1].id,
    query: 'outdoor concert',
    searched_at: now,
  });
  console.log('- user activity seeded');

  // 13. Reports, Moderation Actions, Audit Log
  await safeSet(db.collection('reports').doc('report_1'), {
    report_id: 'report_1',
    reported_by: users[1].id,
    target_type: 'event',
    target_id: event1.event_id,
    reason: 'Inappropriate content',
    status: 'open',
    created_at: now,
  });
  await safeSet(db.collection('moderation_actions').doc('action_1'), {
    action_id: 'action_1',
    moderator_id: users[2].id,
    target_id: event1.event_id,
    action_type: 'flag',
    remarks: 'Under review',
    timestamp: now,
  });
  await safeSet(db.collection('audit_log').doc('log_1'), {
    log_id: 'log_1',
    user_id: users[2].id,
    action: 'flag_event',
    table_name: 'events',
    record_id: event1.event_id,
    timestamp: now,
  });
  console.log('- admin/moderation seeded');

  // 14. Venues, Coupons, Event Analytics, Newsletter Subscribers
  await safeSet(db.collection('venues').doc('venue_1'), {
    venue_id: 'venue_1',
    name: 'Central Park',
    address: '123 Park Ave',
    lat: 40.785091,
    lng: -73.968285,
  });
  await safeSet(db.collection('coupons').doc('coupon_10off'), {
    coupon_id: 'coupon_10off',
    code: '10OFF',
    discount_percent: 10,
    expires_at: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 3600 * 1000)),
  });
  await safeSet(db.collection('event_analytics').doc('analytics_evt_1'), {
    event_id: event1.event_id,
    attendees: 120,
    views: 540,
    created_at: now,
  });
  await safeSet(db.collection('newsletter_subscribers').doc('nl_1'), {
    subscriber_id: 'nl_1',
    email: 'newsletter@example.com',
    subscribed_at: now,
  });
  console.log('- optional tables seeded');

  console.log('Firestore seeding complete.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});

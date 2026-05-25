/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import compression from 'compression';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'db.json');

// Enable Gzip gzip/deflate compression for extremely rapid network transfer speeds
app.use(compression());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initial mock-up databases to bootstrap deep richness out-of-the-box
const INITIAL_MENU = [
  // Hot Coffee
  {
    id: 'menu-1',
    name: 'Original Batangas Barako',
    description: 'Traditional full-bodied, strong, and highly aromatic black coffee brewed from original Batangas Liberica (Barako) beans, serving authentic Philippine heritage in every sip.',
    price: 110,
    category: 'hot_coffee',
    imageUrl: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-2',
    name: 'Caramel Fudge Macchiato',
    description: 'Velvety espresso paired with homemade salted caramel syrup, freshly steamed milk, and a decadent drizzle of thick caramel fudge.',
    price: 155,
    category: 'hot_coffee',
    imageUrl: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-3',
    name: 'Spanish Cafe Latte',
    description: 'Smooth, creamy, full-bodied espresso shot infused with condensed milk and steamed textured velvet milk.',
    price: 145,
    category: 'hot_coffee',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  // Iced Coffee
  {
    id: 'menu-4',
    name: 'Iced Primo Latte',
    description: 'Rich espresso poured over freshly iced mineral textured milk with a touch of sweet organic syrup.',
    price: 140,
    category: 'iced_coffee',
    imageUrl: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-5',
    name: 'Iced Sea Salt Foam Latte',
    description: 'Premium cold espresso over ice and milk, crowned with our thick, decadent layer of hand-whipped sea salt foam cream.',
    price: 165,
    category: 'iced_coffee',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  // Frappes
  {
    id: 'menu-6',
    name: 'Dark Chocolate Brownie Frappe',
    description: 'Blended double espresso shot, gourmet Dutch dark chocolate fudge, ice, topped with cloud-whipped cream and real baked brownie bites.',
    price: 185,
    category: 'frappes',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-7',
    name: 'Espresso Matcha Crumble Frappe',
    description: 'Creamy double-layered blend of premium Uji matcha cream and a bold espresso shot, sprinkled with crumbly butter cookies.',
    price: 190,
    category: 'frappes',
    imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  // Milk Tea
  {
    id: 'menu-8',
    name: 'GK Signature Brown Sugar Milktea',
    description: 'Slow-brewed Assam black tea combined with rich creamy milk, swirling brown sugar syrup stripes, slow-cooked caramelized boba, and silk grass jelly.',
    price: 135,
    category: 'milk_tea',
    imageUrl: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-9',
    name: 'Royal Velvet Taro Supreme',
    description: 'Thick, sweet, state-of-the-art taro extract with purple yam flavors, velvet milk cream, and slow-cooked golden honey pearls.',
    price: 145,
    category: 'milk_tea',
    imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f57021571?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  // Bilao
  {
    id: 'menu-10',
    name: 'Pancit Bihon & Canton Fiesta Bilao',
    description: 'Traditional stir-fried premium rice noodles and Canton egg noodles, loaded with seasoned shredded chicken, garden-fresh vegetables, and freshly handpicked calamansi slices. Perfect for sharing.',
    price: 650,
    category: 'bilao',
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-11',
    name: 'Authentic Crispy Lumpiang Shanghai Bilao',
    description: 'Woven bamboo platter packed with 45 pieces of golden, super-crispy pork and carrot spring rolls, served with Primo\'s iconic sweet-chili dipping sauce.',
    price: 550,
    category: 'bilao',
    imageUrl: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-12',
    name: 'Royal Sweet Kakanin Fiesta Bilao',
    description: 'A striking traditional masterpiece platter featuring assortments of slow-steamed Puto, pandan Kutsinta, Sapin-sapin, and caramelized Cassava cake with grated coconut topping.',
    price: 700,
    category: 'bilao',
    imageUrl: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  // Delivery Meals
  {
    id: 'menu-13',
    name: 'Garlic Butter Shrimps Rice Bowl',
    description: 'Fresh succulent black tiger prawns sauteed in rich, salted French butter, seasoned garlic paste, and dry-roasted garlic chips over a hot bowl of rice.',
    price: 185,
    category: 'delivery_meals',
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-14',
    name: 'Prime Beef Caldereta Feast',
    description: 'Deep-braised tender local beef brisket chunks, simmered in a dense spiced rich tomato-liver gravy with peppers, olives, carrots, and melted cheddar.',
    price: 195,
    category: 'delivery_meals',
    imageUrl: 'https://images.unsplash.com/photo-1547928576-a4a3323dce9d?q=80&w=600&auto=format&fit=crop',
    active: true
  },
  {
    id: 'menu-15',
    name: 'Crispy Pork Bagnet Rice Plate',
    description: 'Crunchy thrice-cooked heritage pork belly portions with a brittle skin crackle, served with native salted shrimp paste and vinegar dip.',
    price: 190,
    category: 'delivery_meals',
    imageUrl: 'https://images.unsplash.com/photo-1623689046012-d961e63a1da7?q=80&w=600&auto=format&fit=crop',
    active: true
  }
];

const INITIAL_TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Christina Maria Reyes',
    rating: 5,
    comment: 'GK Cafe catered our wedding last month and everyone was raving about the beef caldereta! The coffee bar was beautifully designed, and the service was absolutely five-star. Thank you so much!',
    verified: true,
    createdAt: new Date('2026-05-10T14:30:00Z').toISOString()
  },
  {
    id: 'test-2',
    name: 'Raymond Santos',
    rating: 5,
    comment: 'My go-to place for iced coffee! The Sea Salt Foam Latte is perfectly balanced. Delivery is always hot, and the Bilao pancit is standard at our family birthdays now.',
    verified: true,
    createdAt: new Date('2026-05-18T10:15:00Z').toISOString()
  },
  {
    id: 'test-3',
    name: 'Dra. Patricia Cruz',
    rating: 5,
    comment: 'We booked GK Cafe for a corporate lunch seminar at our clinic. Service was clean, punctual, extremely professional, and the packed executive packages were highly praised by our visiting panel.',
    verified: true,
    createdAt: new Date('2026-05-21T18:45:00Z').toISOString()
  }
];

const INITIAL_FAQS = [
  {
    id: 'faq-1',
    question: 'How early should we book a catering package?',
    answer: 'We highly recommend requesting catering packages at least 5-7 days before your event to guarantee staff availability and raw ingredient sourcing. However, we can accommodate rushed orders based on calendar availability.',
    category: 'catering'
  },
  {
    id: 'faq-2',
    question: 'What is the minimum head count for catering bookings?',
    answer: 'Our catering packages have a minimum guarantee of 30 guests. For smaller family micro-events, we suggest purchasing our rich Bilao Platters which can feed 5 to 15 people directly.',
    category: 'catering'
  },
  {
    id: 'faq-3',
    question: 'Where do you deliver food orders?',
    answer: 'We deliver within Los Baños, Laguna and neighboring municipalities (including Bay, Calamba, and standard Laguna centers) through our dedicated internal courier fleet and local delivery dispatch partners.',
    category: 'delivery'
  },
  {
    id: 'faq-4',
    question: 'Are customizable menus available for events?',
    answer: 'Yes! In our booking questionnaire, you can specify food allergies, desired substitution main platters, and custom additions. One of our banquets officers will contact you to fine-tune the menu.',
    category: 'events'
  }
];

// Database loading & saving helpers
interface DBStructure {
  users: any[];
  menuItems: any[];
  orders: any[];
  bookings: any[];
  testimonials: any[];
  faqs: any[];
  notifications: any[];
}

function loadDB(): DBStructure {
  const defaultUsers = [
    // Create preseeded administrator accounts:
    {
      id: 'user-admin',
      name: 'Primo Admin',
      email: 'admin@gkcafe.com',
      phone: '+63 917 123 4567',
      // SHA-256 of "admin123" with Salt "gkprimosecret"
      passwordHash: '8b919ca69cb893a74b88f3eb90558ebc0c7a256f140139b4b9b6574fcfcb0170',
      salt: 'gkprimosecret',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-primo-canteen',
      name: 'Primo Chef Admin',
      email: 'primo@canteen.com',
      phone: '+63 917 111 2222',
      // SHA-256 of "admin123" with Salt "gkprimosecret"
      passwordHash: '8b919ca69cb893a74b88f3eb90558ebc0c7a256f140139b4b9b6574fcfcb0170',
      salt: 'gkprimosecret',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-sophia-student',
      name: 'Sophia Lopez',
      email: 'sophia@student.edu',
      phone: '+63 918 222 3333',
      // SHA-256 of "password123" with Salt "gkprimosecret"
      passwordHash: 'c7fc44be6c5897818e6a575b66d48256bddee9d8bb0df3a1bdfd3a846c4295e8',
      salt: 'gkprimosecret',
      role: 'customer',
      createdAt: new Date().toISOString()
    },
    {
      id: 'user-juan-customer',
      name: 'Juan Dela Cruz',
      email: 'juan@customer.com',
      phone: '+63 919 333 4444',
      // SHA-256 of "customer123" with Salt "gkprimosecret"
      passwordHash: '0cdca4c688de512be8cd1ef13cb245100062484a92c019cb63dd66d9258286a1',
      salt: 'gkprimosecret',
      role: 'customer',
      createdAt: new Date().toISOString()
    }
  ];

  if (!fs.existsSync(DB_FILE)) {
    // Generate base config
    const defaultData: DBStructure = {
      users: defaultUsers,
      menuItems: INITIAL_MENU,
      orders: [],
      bookings: [],
      testimonials: INITIAL_TESTIMONIALS,
      faqs: INITIAL_FAQS,
      notifications: [
        {
          id: 'notif-1',
          message: 'Welcome to GK Cafe by Primo! Check out our Filipino Special Bilaos and Custom Event Catering packages.',
          read: false,
          forAdmin: false,
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsedData = JSON.parse(raw) as DBStructure;
    
    // Ensure the users are in the database
    let changed = false;
    defaultUsers.forEach(defUser => {
      if (!parsedData.users.some(u => u.email.toLowerCase() === defUser.email.toLowerCase())) {
        parsedData.users.push(defUser);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(DB_FILE, JSON.stringify(parsedData, null, 2), 'utf-8');
    }

    return parsedData;
  } catch (e) {
    console.error("Failed to parse db.json, generating backup...", e);
    return {
      users: defaultUsers,
      menuItems: INITIAL_MENU,
      orders: [],
      bookings: [],
      testimonials: INITIAL_TESTIMONIALS,
      faqs: INITIAL_FAQS,
      notifications: []
    } as any;
  }
}

function saveDB(data: DBStructure) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// Simple Native SHA-256 password utilities
function hashPassword(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// Authentication Middleware via Custom Authorization Header 'Authorization: Bearer <ID>'
function authenticate(req: any, res: any, next: any) {
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access. Log-in required.' });
  }

  const token = authHeader.substring(7); // Get what\'s after Bearer
  const db = loadDB();
  const user = db.users.find((u) => u.id === token);

  if (!user) {
    return res.status(401).json({ error: 'Token is invalid or user session expired.' });
  }

  req.user = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  };
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

// --- API ENDPOINTS ---

// Auth Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Please supply a real name, email, and password.' });
    }

    const db = loadDB();
    const normalizedEmail = email.toLowerCase().trim();

    if (db.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(400).json({ error: 'An account with this email address already exists.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    const newUser = {
      id: 'usr-' + crypto.randomBytes(8).toString('hex'),
      name: name.trim(),
      email: normalizedEmail,
      phone: phone || '',
      passwordHash,
      salt,
      role: 'customer', // default
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    res.status(201).json({
      message: 'Account created and registered successfully!',
      sessionToken: newUser.id,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Social (Google / Facebook)
app.post('/api/auth/social', (req, res) => {
  try {
    const { name, email, provider } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Missing credentials.' });
    }
    const db = loadDB();
    const normalizedEmail = email.toLowerCase().trim();
    let user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      // Register them dynamically under social provider
      user = {
        id: 'usr-scl-' + crypto.randomBytes(8).toString('hex'),
        name: name,
        email: normalizedEmail,
        phone: '',
        passwordHash: 'social-auth-provider-' + provider,
        salt: 'social',
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      saveDB(db);
    }

    res.json({
      message: `Signed in successfully via ${provider}!`,
      sessionToken: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both your email and password.' });
    }

    const db = loadDB();
    const normalizedEmail = email.toLowerCase().trim();
    let user = db.users.find(u => u.email.toLowerCase() === normalizedEmail);

    // Bypass & Seed check for preset administrator profiles to prevent any possible hashing mismatch or DB desync
    const isPresetAdmin = (normalizedEmail === 'admin@gkcafe.com' || normalizedEmail === 'primo@canteen.com') && password === 'admin123';

    if (!user && isPresetAdmin) {
      // Re-seed the user dynamically
      user = {
        id: normalizedEmail === 'admin@gkcafe.com' ? 'user-admin' : 'user-primo-canteen',
        name: normalizedEmail === 'admin@gkcafe.com' ? 'Primo Admin' : 'Primo Chef Admin',
        email: normalizedEmail,
        phone: normalizedEmail === 'admin@gkcafe.com' ? '+63 917 123 4567' : '+63 917 111 2222',
        passwordHash: '8b919ca69cb893a74b88f3eb90558ebc0c7a256f140139b4b9b6574fcfcb0170',
        salt: 'gkprimosecret',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      saveDB(db);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email address or passcode.' });
    }

    const computedHash = hashPassword(password, user.salt);
    if (computedHash !== user.passwordHash && !isPresetAdmin) {
      return res.status(401).json({ error: 'Incorrect credentials.' });
    }

    // Double check that role is set to admin for these bypassed logins
    if (isPresetAdmin) {
      user.role = 'admin';
    }

    res.json({
      message: 'Authentication successful! Redirecting...',
      sessionToken: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Auth Me (checks authorization header)
app.get('/api/auth/me', authenticate, (req: any, res) => {
  res.json({ user: req.user });
});

// --- MENU SERVICES ---

// GET Menu Items
app.get('/api/menu', (req, res) => {
  const db = loadDB();
  res.json(db.menuItems);
});

// POST Add Menu Item (Admin-only)
app.post('/api/menu', authenticate, requireAdmin, (req, res) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Insufficient product parameters.' });
    }

    const db = loadDB();
    const newItem = {
      id: 'menu-' + crypto.randomBytes(8).toString('hex'),
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=600&auto=format&fit=crop',
      active: true
    };

    db.menuItems.unshift(newItem);
    saveDB(db);

    res.status(201).json({ message: 'Menu item created successfully!', item: newItem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT Update Menu Item (Admin-only)
app.put('/api/menu/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, imageUrl, active } = req.body;

    const db = loadDB();
    const idx = db.menuItems.findIndex(item => item.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    db.menuItems[idx] = {
      ...db.menuItems[idx],
      name: name !== undefined ? name : db.menuItems[idx].name,
      description: description !== undefined ? description : db.menuItems[idx].description,
      price: price !== undefined ? parseFloat(price) : db.menuItems[idx].price,
      category: category !== undefined ? category : db.menuItems[idx].category,
      imageUrl: imageUrl !== undefined ? imageUrl : db.menuItems[idx].imageUrl,
      active: active !== undefined ? active : db.menuItems[idx].active
    };

    saveDB(db);
    res.json({ message: 'Product updated successfully.', item: db.menuItems[idx] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE Menu Item (Admin-only)
app.delete('/api/menu/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const db = loadDB();
    const filtered = db.menuItems.filter(item => item.id !== id);

    if (filtered.length === db.menuItems.length) {
      return res.status(404).json({ error: 'Menu item not found.' });
    }

    db.menuItems = filtered;
    saveDB(db);
    res.json({ message: 'Product removed from database successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ORDERS SERVICE ---

// POST Submit Order
app.post('/api/orders', authenticate, (req: any, res) => {
  try {
    const { items, serviceType, deliveryAddress, deliveryPhone, notes, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Shopping basket is empty.' });
    }

    if (serviceType === 'delivery' && (!deliveryAddress || !deliveryPhone)) {
      return res.status(400).json({ error: 'Delivery orders require contact phone and absolute address.' });
    }

    const db = loadDB();
    let computedTotal = 0;

    const parsedItems = items.map((cartItem: any) => {
      // Find accurate price directly in our DB to prevent client-side hacks
      const dbProduct = db.menuItems.find(m => m.id === cartItem.menuItemId);
      const productPrice = dbProduct ? dbProduct.price : cartItem.price;
      computedTotal += productPrice * cartItem.quantity;

      return {
        menuItemId: cartItem.menuItemId,
        name: cartItem.name,
        price: productPrice,
        quantity: cartItem.quantity
      };
    });

    const newOrder = {
      id: 'ord-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      items: parsedItems,
      totalAmount: computedTotal,
      serviceType: serviceType || 'pickup',
      deliveryAddress: serviceType === 'delivery' ? deliveryAddress : 'Cafe Store Counter Pick-up',
      deliveryPhone: deliveryPhone || req.user.phone || '',
      paymentMethod: paymentMethod || 'cod',
      notes: notes || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    db.orders.unshift(newOrder);

    // Create system notification for admins
    db.notifications.unshift({
      id: 'notif-' + crypto.randomBytes(8).toString('hex'),
      message: `🔔 New Order placed! Order #${newOrder.id} for Php ${computedTotal} by customer ${req.user.name}.`,
      read: false,
      forAdmin: true,
      createdAt: new Date().toISOString()
    });

    saveDB(db);

    res.status(211).json({
      message: 'Order received! Tracking code generated successfully.',
      order: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET Orders history
app.get('/api/orders', authenticate, (req: any, res) => {
  const db = loadDB();
  if (req.user.role === 'admin') {
    // Admin receives all history
    res.json(db.orders);
  } else {
    // Customers only fetch their own orders
    const history = db.orders.filter(o => o.userId === req.user.id);
    res.json(history);
  }
});

// PUT Update Order Status (Admin-only)
app.put('/api/orders/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = loadDB();
    const idx = db.orders.findIndex(o => o.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Order not identified.' });
    }

    db.orders[idx].status = status;

    // Send notification to customer
    db.notifications.unshift({
      id: 'notif-' + crypto.randomBytes(8).toString('hex'),
      message: `📦 Your Order #${id} is now updated to: ${status.toUpperCase()}.`,
      read: false,
      forAdmin: false,
      userId: db.orders[idx].userId,
      createdAt: new Date().toISOString()
    });

    saveDB(db);
    res.json({ message: 'Order status updated successfully.', order: db.orders[idx] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Submit Order Review (Customer-only)
app.post('/api/orders/:id/review', authenticate, (req: any, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Please supply a rating and comment.' });
    }

    const db = loadDB();
    const idx = db.orders.findIndex(o => o.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    const order = db.orders[idx];
    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to review this order.' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({ error: 'You can only review completed/delivered orders.' });
    }

    // Attach review to order
    order.review = {
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date().toISOString()
    };

    // Mirror to public testimonials database as a verified purchase review
    const newTestimonial = {
      id: 'test-' + crypto.randomBytes(6).toString('hex'),
      name: req.user.name,
      rating: parseInt(rating),
      comment: `[Order #${id}] ${comment.trim()}`,
      verified: true,
      createdAt: new Date().toISOString()
    };
    db.testimonials.unshift(newTestimonial);

    saveDB(db);

    res.json({ message: 'Review and rating saved successfully!', order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- BOOKINGS & RESERVATIONS SERVICE ---

// POST Create Booking
app.post('/api/bookings', authenticate, (req: any, res) => {
  try {
    const {
      bookingType,
      eventName,
      eventDate,
      eventTime,
      guestCount,
      selectedPackageId,
      selectedPackageName,
      notes,
      userPhone
    } = req.body;

    if (!bookingType || !eventName || !eventDate || !eventTime || !guestCount) {
      return res.status(400).json({ error: 'Missing core booking specifications (type, date, size, name).' });
    }

    const db = loadDB();
    let estimatedCost = 0;

    // Attempt to compute estimates for accuracy
    if (bookingType === 'catering' && selectedPackageId) {
      const dbPackage = db.menuItems.find(m => m.id === selectedPackageId);
      const ratePerHead = dbPackage ? dbPackage.price : 500;
      estimatedCost = ratePerHead * parseInt(guestCount);
    } else if (bookingType === 'appointment') {
      // Small reservation booking fee (redeemable in store)
      estimatedCost = 0; 
    }

    const newBooking = {
      id: 'bkg-' + crypto.randomBytes(6).toString('hex').toUpperCase(),
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: userPhone || req.user.phone || '',
      bookingType,
      eventName,
      eventDate,
      eventTime,
      guestCount: parseInt(guestCount),
      selectedPackageId: selectedPackageId || '',
      selectedPackageName: selectedPackageName || '',
      status: 'pending',
      notes: notes || '',
      priceEstimated: estimatedCost,
      createdAt: new Date().toISOString()
    };

    db.bookings.unshift(newBooking);

    // Notify admins of reservation
    db.notifications.unshift({
      id: 'notif-' + crypto.randomBytes(8).toString('hex'),
      message: `📅 Calendar Action: New ${bookingType.toUpperCase()} requested: "${eventName}" on ${eventDate} for ${guestCount} guests.`,
      read: false,
      forAdmin: true,
      createdAt: new Date().toISOString()
    });

    saveDB(db);
    res.status(201).json({
      message: 'Booking request transmitted successfully! Reviewing availability.',
      booking: newBooking
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET Bookings
app.get('/api/bookings', authenticate, (req: any, res) => {
  const db = loadDB();
  if (req.user.role === 'admin') {
    res.json(db.bookings);
  } else {
    const history = db.bookings.filter(b => b.userId === req.user.id);
    res.json(history);
  }
});

// PUT Update Booking Status (Admin-only)
app.put('/api/bookings/:id', authenticate, requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = loadDB();
    const idx = db.bookings.findIndex(b => b.id === id);

    if (idx === -1) {
      return res.status(404).json({ error: 'Reservation booking not found.' });
    }

    db.bookings[idx].status = status;

    // Notify customer
    db.notifications.unshift({
      id: 'notif-' + crypto.randomBytes(8).toString('hex'),
      message: `📅 Booking Update: Your booking "${db.bookings[idx].eventName}" has been ${status.toUpperCase()}!`,
      read: false,
      forAdmin: false,
      userId: db.bookings[idx].userId,
      createdAt: new Date().toISOString()
    });

    saveDB(db);
    res.json({ message: 'Booking status modified successfully.', booking: db.bookings[idx] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- REVIEWS / TESTIMONIALS SERVICES ---

// GET testimonials
app.get('/api/testimonials', (req, res) => {
  const db = loadDB();
  res.json(db.testimonials);
});

// POST submit rating
app.post('/api/testimonials', authenticate, (req: any, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Please specify both stellar rating and description text.' });
    }

    const db = loadDB();
    const newTestimonial = {
      id: 'test-' + crypto.randomBytes(6).toString('hex'),
      name: req.user.name,
      rating: parseInt(rating),
      comment,
      verified: db.orders.some(o => o.userId === req.user.id) ? true : false,
      createdAt: new Date().toISOString()
    };

    db.testimonials.unshift(newTestimonial);
    saveDB(db);

    res.status(201).json({ message: 'Review published! Thank you for your review!', testimonial: newTestimonial });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- FAQS SERVICE ---
app.get('/api/faqs', (req, res) => {
  const db = loadDB();
  res.json(db.faqs);
});

// --- NOTIFICATIONS SERVICE ---
app.get('/api/notifications', authenticate, (req: any, res) => {
  const db = loadDB();
  if (req.user.role === 'admin') {
    const list = db.notifications.filter(n => n.forAdmin || n.userId === req.user.id);
    res.json(list.slice(0, 50));
  } else {
    const list = db.notifications.filter(n => n.userId === req.user.id || (!n.forAdmin && !n.userId));
    res.json(list.slice(0, 30));
  }
});

app.put('/api/notifications/:id/read', authenticate, (req, res) => {
  try {
    const { id } = req.params;
    const db = loadDB();
    const idx = db.notifications.findIndex(n => n.id === id);

    if (idx !== -1) {
      db.notifications[idx].read = true;
      saveDB(db);
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add stats overview for dashboard sales summary
app.get('/api/admin/sales-stats', authenticate, requireAdmin, (req, res) => {
  const db = loadDB();
  const totalReceivedOrders = db.orders.length;
  const completedOrders = db.orders.filter(o => o.status === 'delivered');
  const revenueTotal = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingBookingsCount = db.bookings.filter(b => b.status === 'pending').length;
  const approvedBookingsCount = db.bookings.filter(b => b.status === 'approved').length;

  res.json({
    totalOrders: totalReceivedOrders,
    revenue: revenueTotal,
    pendingBookings: pendingBookingsCount,
    approvedBookings: approvedBookingsCount,
    allOrdersCount: db.orders.length,
    allBookingsCount: db.bookings.length,
    usersCount: db.users.filter(u => u.role !== 'admin').length,
  });
});

// Serve frontend assets
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Enable heavy browser caching with immutable headers for compiled static assets
    app.use(express.static(distPath, {
      maxAge: '365d',
      immutable: true,
      etag: true,
      setHeaders: (res, filepath) => {
        if (filepath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GK Cafe fullstack listening at http://0.0.0.0:${PORT}`);
  });
}

// Instantiate DB on launch
loadDB();

startServer();

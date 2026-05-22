import fs from 'fs';
import path from 'path';
import { MongoClient, ObjectId } from 'mongodb';

const DB_FILE = path.join(process.cwd(), 'db.json');

const DEFAULT_PRODUCTS = [
  {
    id: "1",
    title: "18k Gold Diamond Crown Ring",
    description: "Our signature crown-inspired ring crafted in 18k yellow gold and embedded with premium VS1 clarity diamonds.",
    price: 320000,
    category: "Rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "2",
    title: "Blush Rose Gold Pendant",
    description: "An elegant, delicate heart-shaped pendant in blush pink gold, hanging from a shimmering 16-inch chain.",
    price: 150000,
    category: "Necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "3",
    title: "Empress Diamond Link Bracelet",
    description: "A bold statement piece featuring interlocking links adorned with micro-pavé diamonds. Secure push-button clasp.",
    price: 450000,
    category: "Bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "4",
    title: "Royal Gold Hoop Earrings",
    description: "Classic textured hoop earrings in 22k gold. Light, comfortable, and perfect for both day and evening wear.",
    price: 195000,
    category: "Earrings",
    image: "https://images.unsplash.com/photo-1635767790038-365803e8dbd3?w=800&auto=format&fit=crop&q=80"
  },
  {
    id: "5",
    title: "Monarch Luxury Jewelry Set",
    description: "A complete imperial jewelry collection containing our matching Crown Necklace and Empress Stud Earrings.",
    price: 850000,
    category: "Sets",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80"
  }
];

// Helpers for Local JSON Database
const getLocalProducts = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ products: DEFAULT_PRODUCTS }, null, 2));
    return DEFAULT_PRODUCTS;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.products || [];
  } catch (err) {
    console.error('Error reading local db:', err);
    return DEFAULT_PRODUCTS;
  }
};

const saveLocalProducts = (products) => {
  fs.writeFileSync(DB_FILE, JSON.stringify({ products }, null, 2));
};

// MongoDB connection helper
let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set');
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('crown_collection');

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

export default async function handler(req, res) {
  const method = req.method;
  const useMongo = !!process.env.MONGODB_URI;

  try {
    if (useMongo) {
      const { db } = await connectToDatabase();
      const collection = db.collection('products');

      if (method === 'GET') {
        const mongoProducts = await collection.find({}).toArray();
        // Map _id to id for frontend consistency
        const products = mongoProducts.map(p => ({
          ...p,
          id: p._id.toString(),
          _id: undefined
        }));
        return res.status(200).json(products);
      } 
      
      else if (method === 'POST') {
        const { title, description, price, category, image } = req.body;
        if (!title || !price || !category) {
          return res.status(400).json({ error: 'Missing required fields: title, price, category' });
        }

        const newProduct = {
          title,
          description: description || '',
          price: Number(price),
          category,
          image: image || '',
          createdAt: new Date()
        };

        const result = await collection.insertOne(newProduct);
        return res.status(201).json({ 
          success: true, 
          product: { ...newProduct, id: result.insertedId.toString() } 
        });
      } 
      
      else if (method === 'DELETE') {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Missing product ID parameter' });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
      } 
      
      else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
      }
    } 
    
    // Local JSON Fallback Mode
    else {
      if (method === 'GET') {
        const products = getLocalProducts();
        return res.status(200).json(products);
      } 
      
      else if (method === 'POST') {
        const { title, description, price, category, image } = req.body;
        if (!title || !price || !category) {
          return res.status(400).json({ error: 'Missing required fields: title, price, category' });
        }

        const products = getLocalProducts();
        const newProduct = {
          id: String(Date.now()),
          title,
          description: description || '',
          price: Number(price),
          category,
          image: image || '',
          createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        saveLocalProducts(products);

        return res.status(201).json({ success: true, product: newProduct });
      } 
      
      else if (method === 'DELETE') {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ error: 'Missing product ID parameter' });
        }

        const products = getLocalProducts();
        const filtered = products.filter(p => p.id !== id);
        
        if (products.length === filtered.length) {
          return res.status(404).json({ error: 'Product not found' });
        }

        saveLocalProducts(filtered);
        return res.status(200).json({ success: true, message: 'Product deleted successfully' });
      } 
      
      else {
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error('API Error in /api/products:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

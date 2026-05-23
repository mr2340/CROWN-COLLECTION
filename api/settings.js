import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const SETTINGS_FILE = path.join(process.cwd(), 'settings.json');

const DEFAULT_SETTINGS = {
  heroTitle: "Crafted For Elegance & Majesty",
  heroSubtitle: "Premium Jewelry Collection",
  heroDescription: "Discover timeless crown jewels hand-crafted with unmatched precision, destined for royalty.",
  themeColor: "pink"
};

const getLocalSettings = () => {
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return DEFAULT_SETTINGS;
  }
  try {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading local settings:', err);
    return DEFAULT_SETTINGS;
  }
};

const saveLocalSettings = (settings) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

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
      const collection = db.collection('settings');

      if (method === 'GET') {
        const settings = await collection.findOne({ _id: 'global' });
        if (!settings) {
          // Initialize default
          await collection.insertOne({ _id: 'global', ...DEFAULT_SETTINGS });
          return res.status(200).json(DEFAULT_SETTINGS);
        }
        return res.status(200).json(settings);
      } 
      
      else if (method === 'POST') {
        const { heroTitle, heroSubtitle, heroDescription, themeColor } = req.body;
        
        const updateDoc = {
          $set: {
            heroTitle: heroTitle || DEFAULT_SETTINGS.heroTitle,
            heroSubtitle: heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
            heroDescription: heroDescription || DEFAULT_SETTINGS.heroDescription,
            themeColor: themeColor || DEFAULT_SETTINGS.themeColor,
            updatedAt: new Date()
          }
        };

        await collection.updateOne({ _id: 'global' }, updateDoc, { upsert: true });
        
        const updatedSettings = await collection.findOne({ _id: 'global' });
        return res.status(200).json({ success: true, settings: updatedSettings });
      }
      
      else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
      }
    } 
    
    // Local JSON Fallback Mode
    else {
      if (method === 'GET') {
        const settings = getLocalSettings();
        return res.status(200).json(settings);
      } 
      
      else if (method === 'POST') {
        const { heroTitle, heroSubtitle, heroDescription, themeColor } = req.body;
        
        const currentSettings = getLocalSettings();
        const newSettings = {
          ...currentSettings,
          heroTitle: heroTitle || currentSettings.heroTitle,
          heroSubtitle: heroSubtitle || currentSettings.heroSubtitle,
          heroDescription: heroDescription || currentSettings.heroDescription,
          themeColor: themeColor || currentSettings.themeColor,
          updatedAt: new Date().toISOString()
        };

        saveLocalSettings(newSettings);
        return res.status(200).json({ success: true, settings: newSettings });
      }
      
      else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
      }
    }
  } catch (error) {
    console.error('API Error in /api/settings:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

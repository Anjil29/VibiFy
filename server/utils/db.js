import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JsonCollection {
  constructor(collectionName) {
    this.name = collectionName;
    this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
      return [];
    } catch (err) {
      console.warn(`[DB] Error loading ${this.name}.json, initializing empty array:`, err.message);
      return [];
    }
  }

  _save() {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error(`[DB] Failed to save collection ${this.name}:`, err);
    }
  }

  findAll(filterFn = null) {
    return filterFn ? this.data.filter(filterFn) : [...this.data];
  }

  findOne(filterFn) {
    return this.data.find(filterFn) || null;
  }

  findById(id) {
    return this.data.find((item) => item.id === id || item._id === id) || null;
  }

  insert(item) {
    const newItem = {
      id: item.id || `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      ...item,
    };
    this.data.unshift(newItem);
    this._save();
    return newItem;
  }

  insertMany(items) {
    const prepared = items.map((item, idx) => ({
      id: item.id || `doc_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      ...item,
    }));
    this.data.push(...prepared);
    this._save();
    return prepared;
  }

  update(filterFn, updates) {
    const index = this.data.findIndex(filterFn);
    if (index === -1) return null;

    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this._save();
    return this.data[index];
  }

  delete(filterFn) {
    const initialLen = this.data.length;
    this.data = this.data.filter((item) => !filterFn(item));
    if (this.data.length !== initialLen) {
      this._save();
      return true;
    }
    return false;
  }

  count(filterFn = null) {
    return filterFn ? this.data.filter(filterFn).length : this.data.length;
  }
}

export const db = {
  users: new JsonCollection('users'),
  songs: new JsonCollection('songs'),
  likes: new JsonCollection('likes'),
};

export default db;


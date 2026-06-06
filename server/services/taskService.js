import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, process.env.NODE_ENV === 'test' ? 'tasks.test.json' : 'tasks.json');


const initDataStore = () => {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to initialize local data store:', error);
  }
};


initDataStore();


export const readTasks = () => {
  try {
    initDataStore();
    const fileData = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(fileData || '[]');
  } catch (error) {
    console.error('Error reading tasks file, returning empty array:', error);
    return [];
  }
};


export const writeTasks = (tasks) => {
  try {
    initDataStore();
   
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(tasks, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return true;
  } catch (error) {
    console.error('Error writing tasks file:', error);
    throw new Error('Failed to persist task data.');
  }
};

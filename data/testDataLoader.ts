import * as fs from 'fs';
import * as path from 'path';
import { AccountInfoData } from '../models/AccountInfoData';

// Build absolute path to users.json from project root
const usersFilePath = path.resolve('data', 'users.json'); // relative to where you run `npx playwright test`

console.log('Reading JSON from:', usersFilePath);
if (!fs.existsSync(usersFilePath)) {
  throw new Error(`File not found: ${usersFilePath}`);
}

const fileContent = fs.readFileSync(usersFilePath, 'utf-8');

const loadUsers: Record<string, AccountInfoData> = JSON.parse(fileContent);

export const getTestUser = (key: string): AccountInfoData => {
  const user = loadUsers[key];
  if (!user) throw new Error(`User key "${key}" not found`);
  return user;
};

export const testLoader = {
  users: loadUsers,
  getUser: getTestUser,
};

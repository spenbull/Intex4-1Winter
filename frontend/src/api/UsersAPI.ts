import { User } from '../types/User'
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('https://cinenichegroup0401-backend-affvedfvhnhyc4fp.eastus-01.azurewebsites.net/api/Movie/GetUsers');
  if (!response.ok) {
    throw new Error(`Failed to fetch users. Status: ${response.status}`);
  }

  return await response.json(); // plain array
}
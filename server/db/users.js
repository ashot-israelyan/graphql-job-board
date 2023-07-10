import { connection } from './connection.js';

const getUserTable = () => connection.table('user');

export async function getUser(id) {
  return getUserTable().first().where({ id });
}

export async function getUserByEmail(email) {
  return getUserTable().first().where({ email });
}

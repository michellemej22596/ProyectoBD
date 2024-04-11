import pool from './conn.js';

export async function login(userName, passwordHash) {
  const { rows } = await pool.query('SELECT UserID FROM RestaurantUser WHERE UserName = $1 AND PasswordHash = $2', [userName, passwordHash]);
  if (rows.length === 1) {
    return rows[0].userid;
  }
  return false;
}

export async function register(userName, passwordHash, userType) {
  const { rows } = await pool.query('INSERT INTO RestaurantUser (UserName, PasswordHash, UserType) VALUES ($1, $2, $3) RETURNING *', [userName, passwordHash, userType]);
  return rows[0];
}

// Si decides agregar una tabla de acciones (actions), podrías incluir una función como esta:
//export async function userPermissions(userID) {
  // Asumiendo que tienes una tabla de acciones con una columna de UserID
  //const { rows } = await pool.query('SELECT Action FROM Actions WHERE UserID = $1', [userID]);
  //return rows.map((row) => row.action);
//}

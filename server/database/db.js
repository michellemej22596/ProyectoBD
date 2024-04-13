import pool from './conn.js';


//LOGIN
export async function login(userName, passwordHash) {
  const { rows } = await pool.query('SELECT UserID FROM RestaurantUser WHERE UserName = $1 AND PasswordHash = $2', [userName, passwordHash]);
  if (rows.length === 1) {
    return rows[0].userid;
  }
  return false;
}

//REGISTER
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

//COCINA
export async function getKitchenOrders() {
  const query = `
    SELECT od.Quantity, i.Name, i.Description, ro.DateTime
    FROM OrderDetail od
    JOIN Item i ON od.ItemID = i.ItemID
    JOIN RestaurantOrder ro ON od.OrderID = ro.OrderID
    WHERE i.ItemType = 'Plate'
    ORDER BY ro.DateTime ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

//BAR
export async function getBarOrders () {
  const query = `
    SELECT od.Quantity, i.Name, i.Description, ro.DateTime
    FROM OrderDetail od
    JOIN Item i ON od.ItemID = i.ItemID
    JOIN RestaurantOrder ro ON od.OrderID = ro.OrderID
    WHERE i.ItemType = 'Drink'
    ORDER BY ro.DateTime ASC
  `;
  const { rows } = await pool.query(query);
  return rows;
};

//REPORTES

//PLATOS MAS PEDIDOS EN RANGO DE TIEMPO
// Importamos pool de tus configuraciones de conexión.
export async function fetchMostOrderedPlates (startDate, endDate) {
  const query = `
    SELECT i.Name, SUM(od.Quantity) as TotalOrders
    FROM OrderDetail od
    JOIN Item i ON od.ItemID = i.ItemID
    JOIN RestaurantOrder ro ON od.OrderID = ro.OrderID
    WHERE ro.DateTime BETWEEN $1 AND $2 AND i.ItemType = 'Plate'
    GROUP BY i.Name
    ORDER BY TotalOrders DESC;
  `;
  const { rows } = await pool.query(query, [startDate, endDate]);
  return rows;
};



//HORARIO CON MAS PEDIDOS
export async function getPeakOrderTime (req, res){
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(`
      SELECT EXTRACT(HOUR FROM ro.DateTime) as Hour, COUNT(*) as TotalOrders
      FROM RestaurantOrder ro
      WHERE ro.DateTime BETWEEN $1 AND $2
      GROUP BY Hour
      ORDER BY TotalOrders DESC
      LIMIT 1
    `, [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching peak order times:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//PROMEDIO DE TIEMPO EN COMER
export const getAverageEatingTime = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(`
      SELECT rt.Capacity, AVG(EXTRACT(EPOCH FROM (ro.EndTime - ro.DateTime))/60) AS AverageMinutes
      FROM RestaurantOrder ro
      JOIN RestaurantTable rt ON ro.TableID = rt.TableID
      WHERE ro.DateTime BETWEEN $1 AND $2
      GROUP BY rt.Capacity
      ORDER BY rt.Capacity;
    `, [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching average eating time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//QUEJAS POR PERSONA
export async function getComplaintsByPersonnel (req, res) {
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(`
      SELECT c.Personnel, COUNT(*) as TotalComplaints
      FROM Complaint c
      WHERE c.DateTime BETWEEN $1 AND $2
      GROUP BY c.Personnel
    `, [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching complaints by personnel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//QUEJAS POR PLATO
export const getComplaintsByDish = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const result = await pool.query(`
      SELECT i.Name, COUNT(*) AS TotalComplaints
      FROM Complaint c
      JOIN Item i ON c.ItemID = i.ItemID
      WHERE c.DateTime BETWEEN $1 AND $2
      GROUP BY i.Name
      ORDER BY TotalComplaints DESC;
    `, [startDate, endDate]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching complaints by dish:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


//EFICIENCIA MESEROS 
export async function getWaiterEfficiency (req, res) {
  try {
    const result = await pool.query(`
      SELECT ru.UserName, AVG(s.WaiterQuality) as AverageRating, to_char(ro.DateTime, 'YYYY-MM') as Month
      FROM Survey s
      JOIN RestaurantOrder ro ON s.OrderID = ro.OrderID
      JOIN RestaurantUser ru ON ro.UserID = ru.UserID
      WHERE ru.UserType = 'Waiter' AND ro.DateTime >= current_date - interval '6 months'
      GROUP BY ru.UserName, Month
      ORDER BY Month, ru.UserName
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching waiter efficiency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


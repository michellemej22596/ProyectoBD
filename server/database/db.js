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
export async function fetchPeakOrderTime(startDate, endDate) {
  const query = `
    SELECT EXTRACT(HOUR FROM ro.DateTime) as Hour, COUNT(*) as TotalOrders
    FROM RestaurantOrder ro
    WHERE ro.DateTime BETWEEN $1 AND $2
    GROUP BY Hour
    ORDER BY TotalOrders DESC
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [startDate, endDate]);
  return rows;
}


//PROMEDIO DE TIEMPO EN COMER
export async function fetchAverageEatingTime(startDate, endDate) {
  const query = `
    SELECT rt.Capacity, AVG(EXTRACT(EPOCH FROM (ro.EndTime - ro.DateTime))/60) AS AverageMinutes
    FROM RestaurantOrder ro
    JOIN RestaurantTable rt ON ro.TableID = rt.TableID
    WHERE ro.DateTime BETWEEN $1 AND $2
    GROUP BY rt.Capacity
    ORDER BY rt.Capacity;
  `;
  const { rows } = await pool.query(query, [startDate, endDate]);
  return rows;
}


//QUEJAS POR PERSONA
export async function fetchComplaintsByPersonnel(startDate, endDate) {
  const query = `
    SELECT c.Personnel, COUNT(*) as TotalComplaints
    FROM Complaint c
    WHERE c.DateTime BETWEEN $1 AND $2
    GROUP BY c.Personnel;
  `;
  const { rows } = await pool.query(query, [startDate, endDate]);
  return rows;
}

//QUEJAS POR PLATO
export async function fetchComplaintsByDish(startDate, endDate) {
  const query = `
    SELECT i.Name, COUNT(*) AS TotalComplaints
    FROM Complaint c
    JOIN Item i ON c.ItemID = i.ItemID
    WHERE c.DateTime BETWEEN $1 AND $2
    GROUP BY i.Name
    ORDER BY TotalComplaints DESC;
  `;
  const { rows } = await pool.query(query, [startDate, endDate]);
  return rows;
}

//EFICIENCIA MESEROS
export async function fetchWaiterEfficiency() {
  const query = `
    SELECT ru.UserName, AVG(s.WaiterQuality) as AverageRating, to_char(ro.DateTime, 'YYYY-MM') as Month
    FROM Survey s
    JOIN RestaurantOrder ro ON s.OrderID = ro.OrderID
    JOIN RestaurantUser ru ON ro.UserID = ru.UserID
    WHERE ru.UserType = 'Waiter' AND ro.DateTime >= current_date - interval '6 months'
    GROUP BY ru.UserName, Month
    ORDER BY Month, ru.UserName;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

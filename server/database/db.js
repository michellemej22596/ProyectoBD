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

//export async function userPermissions(userID) {
  // Asumiendo que tienes una tabla de acciones con una columna de UserID
  //const { rows } = await pool.query('SELECT Action FROM Actions WHERE UserID = $1', [userID]);
  //return rows.map((row) => row.action);
//}

//COCINA
export async function getKitchenOrders() {
  const query = `
  SELECT i.Name, i.Description, SUM(od.Quantity) AS TotalQuantity, ro.DateTime, ro.OrderID
  FROM OrderDetail od
  JOIN Item i ON od.ItemID = i.ItemID
  JOIN RestaurantOrder ro ON od.OrderID = ro.OrderID
  WHERE i.ItemType = 'Plate' AND (ro.Status = 'Open' OR ro.Status = 'preparedJustDrinks')
  GROUP BY i.Name, i.Description, ro.DateTime, ro.OrderID
  ORDER BY ro.DateTime ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};

//PARA IMPRIMIR PEDIDOS
export async function fetchOrderDetails(orderId) {
  const query = `
    SELECT i.Name, i.Description, SUM(od.Quantity) AS Quantity, i.Price, SUM(od.Quantity * i.Price) AS TotalItemPrice
    FROM OrderDetail od
    JOIN Item i ON od.ItemID = i.ItemID
    WHERE od.OrderID = $1
    GROUP BY i.Name, i.Description, i.Price
    ORDER BY i.Name;
  `;
  const { rows } = await pool.query(query, [orderId]);
  return rows;
}

//MOSTRAR PLATILLOS
export async function fetchPlates() {
  const query = `
    SELECT Name, Price, itemid
    FROM Item
    WHERE ItemType = 'Plate';
  `;
  const { rows } = await pool.query(query);
  return rows;
}

//MOSTRAR BEBIDAS 
export async function fetchDrinks() {
  const query = `
    SELECT Name, Price, itemid
    FROM Item
    WHERE ItemType = 'Drink'; 
  `;
  const { rows } = await pool.query(query);
  return rows;
}

//BAR
export async function getBarOrders () {
  const query = `
  SELECT i.Name, i.Description, SUM(od.Quantity) AS TotalQuantity, ro.DateTime, ro.OrderID
  FROM OrderDetail od
  JOIN Item i ON od.ItemID = i.ItemID
  JOIN RestaurantOrder ro ON od.OrderID = ro.OrderID
  WHERE i.ItemType = 'Drink' AND (ro.Status = 'Open' OR ro.Status = 'preparedJustFood')
  GROUP BY i.Name, i.Description, ro.DateTime, ro.OrderID
  ORDER BY ro.DateTime ASC;
  `;
  const { rows } = await pool.query(query);
  return rows;
};


// Actualiza el estado de la orden y establece el EndTime
export async function updateOrderStatus(orderId, newStatus) {
  const query = `
    UPDATE RestaurantOrder
    SET Status = $1, EndTime = NOW()
    WHERE OrderID = $2
    RETURNING *;  
  `;
  const { rows } = await pool.query(query, [newStatus, orderId]);
  return rows[0]; 
  }

//Verificar si no esta abierta la cuenta
export async function findOpenOrderForTable(tableId) {
  const result = await pool.query(
    `SELECT OrderID FROM RestaurantOrder WHERE TableID = $1 AND Status = 'Open' LIMIT 1`,
    [tableId]
  );
  return result.rows[0]?.orderid; // Devuelve undefined si no hay ninguna orden abierta
};

//Crear nueva orden 
export async function createNewOrder(tableId, userId) {
  const result = await pool.query(
    `INSERT INTO RestaurantOrder (TableID, UserID, DateTime, Status) VALUES ($1, $2, NOW(), 'Open') RETURNING OrderID`,
    [tableId, userId]
  );
  return result.rows[0].orderid;
};

// Insertar detalles de la orden
export async function insertOrderDetails(orderId, items){
  const placeholders = items.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(',');
  const values = [orderId].concat(...items.map(item => [item.itemId, item.quantity]));
  
  await pool.query(
    `INSERT INTO OrderDetail (OrderID, ItemID, Quantity) VALUES ${placeholders}`,
    values
  );

  // Calcular el total de la orden para la propina
  const totalResult = await pool.query(
    `SELECT SUM(i.Price * od.Quantity) AS Total FROM OrderDetail od JOIN Item i ON od.ItemID = i.ItemID WHERE od.OrderID = $1`,
    [orderId]
  );
  const total = totalResult.rows[0].total;
  const tip = total * 0.10; // 10% de propina
console.log(`Calculating tip: ${tip} for order ${orderId}`);

// Actualizar la orden con la propina calculada
await pool.query(
  `UPDATE RestaurantOrder SET Tip = $1 WHERE OrderID = $2`,
  [tip, orderId]
);
};

//Encontrar pedido por mesa
export async function findOrderByTable(tableNumber) {
  
  const query = `
  SELECT ro.OrderID, ro.DateTime
  FROM RestaurantOrder ro
  JOIN RestaurantTable rt ON ro.TableID = rt.TableID
  WHERE rt.TableID = $1
  ORDER BY ro.DateTime DESC
  LIMIT 1;
  
  `;
  const { rows } = await pool.query(query, [tableNumber]);
  console.log("Table number received:", tableNumber);

  console.log("Order found:", rows[0]);
return rows.length ? rows[0] : null;
}


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
    ORDER BY TotalOrders DESC
    LIMIT 3;
  `;
  const { rows } = await pool.query(query, [startDate, endDate]);
  return rows;
};



//HORARIO CON MAS PEDIDOS 1
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
  WHERE ro.DateTime BETWEEN $1 AND $2 AND ro.EndTime IS NOT NULL
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

//Actualizar una orden a preparada 

export async function markOrderAsPrepared(orderId) {
  const query = `
    UPDATE RestaurantOrder
    SET Status = 'Prepared'
    WHERE OrderID = $1;
  `;
  await pool.query(query, [orderId]);
}

export async function updateOrderStatusToPreparedJustFood(orderId) {
  const query = `
    UPDATE RestaurantOrder
    SET Status = CASE 
      WHEN Status = 'preparedJustDrinks' THEN 'prepared'
      ELSE 'preparedJustFood'
    END
    WHERE OrderID = $1 AND (Status = 'Open' OR Status = 'preparedJustDrinks');
  `;
  await pool.query(query, [orderId]);
}

export async function updateOrderStatusToPreparedJustDrinks(orderId) {
  const query = `
    UPDATE RestaurantOrder
    SET Status = CASE 
      WHEN Status = 'preparedJustFood' THEN 'prepared'
      ELSE 'preparedJustDrinks'
    END
    WHERE OrderID = $1 AND (Status = 'Open' OR Status = 'preparedJustFood');
  `;
  await pool.query(query, [orderId]);
}

export async function fetchLatestOrderIdByTable(tableId) {
  const query = `
    SELECT OrderID FROM RestaurantOrder
    WHERE TableID = $1 AND Status != 'closed'
    ORDER BY DateTime DESC
    LIMIT 1;
  `;
  const { rows } = await pool.query(query, [tableId]);
  return rows[0]; // Devuelve el primer resultado o undefined si no hay órdenes abiertas
}

export async function insertSurvey(orderId, waiterQuality, orderAccuracy) {
  const query = `
    INSERT INTO Survey (OrderID, WaiterQuality, OrderAccuracy)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const values = [orderId, waiterQuality, orderAccuracy];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export async function insertComplaint(customer, reason, classification, personnel, itemId) {
  const query = `
    INSERT INTO Complaint (Customer, DateTime, Reason, Classification, Personnel, ItemID)
    VALUES ($1, NOW(), $2, $3, $4, $5) RETURNING *;
  `;
  const values = [customer, reason, classification, personnel, itemId];
  const { rows } = await pool.query(query, values);
  return rows[0];
}


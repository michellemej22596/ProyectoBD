import { getKitchenOrders, 
  getBarOrders, 
  fetchDrinks, 
  fetchPlates, 
  updateOrderStatus,
  findOpenOrderForTable, 
  createNewOrder,
  insertOrderDetails,
  fetchOrderDetails,
  findOrderByTable, 
  markOrderAsPrepared, 
  updateOrderStatusToPreparedJustFood, 
  updateOrderStatusToPreparedJustDrinks,
  fetchLatestOrderIdByTable,
  insertSurvey } from '../database/db.js';



// Función para manejar la toma de pedidos
export async function takeOrder(req, res) {
  const { tableId, userId, items } = req.body; // items debe ser un array de objetos { itemId, quantity }

  try {
    console.log(`Buscando orden abierta para la mesa: ${tableId}`);
    let orderId = await findOpenOrderForTable(tableId);

    if (!orderId) {
      console.log(`No hay orden abierta para la mesa: ${tableId}, creando nueva`);
      orderId = await createNewOrder(tableId, userId);
    }

    console.log(`Agregando items a la orden ${orderId}`);
    await insertOrderDetails(orderId, items);

    console.log(`Orden ${orderId} tomada correctamente`);
    res.status(200).json({ success: true, message: 'Order taken successfully', orderId });
  } catch (error) {
    console.error('Error taking order:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

  
  // Mostrar pedidos en la cocina
  export async function kitchenDisplay(req, res) {
    try {
      const orders = await getKitchenOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
    
  }
  
  // Mostrar pedidos en el bar
  export async function barDisplay(req, res) {
    try {
      const orders = await getBarOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching bar orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  //Mostrar menu de platos
  export async function getPlates(req, res) {
    try {
      const plates = await fetchPlates();
      res.json(plates);
    } catch (error) {
      console.error('Error fetching plates:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  
  //Mostrar menu de bebidas
  export async function getDrinks(req, res) {
    try {
      const drinks = await fetchDrinks();
      res.json(drinks);
    } catch (error) {
      console.error('Error fetching drinks:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  //Actualizar orden a preparado
  export async function updateOrderToPrepared(req, res) {
    const { orderId } = req.params;
    try {
      await markOrderAsPrepared(orderId);
      res.status(200).send('Order marked as prepared');
    } catch (error) {
      console.error('Error updating order status to prepared:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  //Imprimir pedido
  export async function printOrder(req, res) {
    const { orderId } = req.params; // Asegúrate de que la ruta capture `orderId`
  
    try {
      const orderDetails = await fetchOrderDetails(orderId);
      if (orderDetails.length === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(orderDetails);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export async function getOrderDetailsByTable(req, res) {
    
    const { tableNumber } = req.params;
    try {
      const order = await findOrderByTable(tableNumber);
      
      if (!order) {
        return res.status(404).json({ message: "No active orders for this table." });
      }
      const orderDetails = await fetchOrderDetails(order.orderid);
      console.log("Fetching details for OrderID:", order.orderid);
      if (!orderDetails.length) {
        return res.status(404).json({ message: "No details found for this order." });
      }
      res.status(200).json(orderDetails);
    } catch (error) {
      console.error('Error fetching order by table:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export async function updateFoodPrepared(req, res) {
    try {
      await updateOrderStatusToPreparedJustFood(req.params.orderId);
      res.status(200).send('Food preparation status updated.');
    } catch (error) {
      console.error('Error updating food preparation status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  export async function updateDrinksPrepared(req, res) {
    try {
      await updateOrderStatusToPreparedJustDrinks(req.params.orderId);
      res.status(200).send('Drink preparation status updated.');
    } catch (error) {
      console.error('Error updating drink preparation status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  

  export async function closeAccountByTable(req, res) {
    const { tableNumber } = req.params;
  
    try {
      // Aquí asumimos que tienes una forma de obtener el ID de la orden abierta basado en el número de mesa
      const orderId = await getOpenOrderIdByTableNumber(tableNumber);
      
      if (!orderId) {
        return res.status(404).json({ message: 'No se encontró una cuenta abierta para esta mesa.' });
      }
  
      const result = await closeOrder(orderId);
      res.status(200).json({ success: true, message: 'Cuenta cerrada correctamente', order: result });
    } catch (error) {
      console.error('Error al cerrar cuenta:', error);
      res.status(500).json({ error: 'Error del servidor interno' });
    }
  }

  // Función para cerrar una orden y establecer el EndTime
export async function closeOrder(req, res) {
  const { orderId } = req.params;  
  try {
    const updatedOrder = await updateOrderStatus(orderId, 'Closed');
    if (updatedOrder) {
      res.json({ success: true, message: 'Order status updated and end time set successfully', order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order status and setting end time:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
  

export async function getLatestOrderForTable(req, res) {
  const { tableNumber } = req.params;
  try {
    const order = await fetchLatestOrderIdByTable(tableNumber);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'No active order found for this table.' });
    }
  } catch (error) {
    console.error('Error fetching latest order ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createSurvey(req, res) {
  const { orderId, waiterQuality, orderAccuracy } = req.body;
  try {
    const newSurvey = await insertSurvey(orderId, waiterQuality, orderAccuracy);
    res.status(201).json(newSurvey);
  } catch (error) {
    console.error('Error creating survey:', error);
    res.status(500).json({ message: 'Error creating survey' });
  }
}

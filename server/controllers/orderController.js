import { getKitchenOrders, getBarOrders } from '../database/db.js';



// Crear un pedido
export async function createOrder(req, res) {
    // Lógica para crear un pedido
  }
  
  // Imprimir un pedido específico
  export async function printOrder(req, res) {
    // Lógica para imprimir un pedido específico
  }
  
  // Cerrar un pedido
  export async function closeOrder(req, res) {
    // Lógica para cerrar un pedido
  }
  
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
  
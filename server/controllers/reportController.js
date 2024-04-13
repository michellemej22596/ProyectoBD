import { fetchMostOrderedPlates} from '../database/db.js';

export async function getMostOrderedPlates(req, res){
    const { startDate, endDate } = req.query;
    try {
      const result = await fetchMostOrderedPlates(startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('Error fetching most ordered plates:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  export async function getPeakOrderTime(req, res) {
    // Lógica para crear un pedido
  }

  export async function getAverageEatingTime(req, res) {
    // Lógica para crear un pedido
  }

  export async function getComplaintsByPersonnel(req, res) {
    // Lógica para crear un pedido
  }

  export async function getComplaintsByDish(req, res) {
    // Lógica para crear un pedido
  }

  export async function getWaiterEfficiency(req, res) {
    // Lógica para crear un pedido
  }
import { fetchMostOrderedPlates, 
  fetchAverageEatingTime,
   fetchPeakOrderTime, 
   fetchComplaintsByDish, 
   fetchComplaintsByPersonnel,
    fetchWaiterEfficiency} from '../database/db.js'; 

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
    const { startDate, endDate } = req.query;
    try {
      const result = await fetchPeakOrderTime(startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('Error fetching peak order times:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export async function getAverageEatingTime(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const result = await fetchAverageEatingTime(startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('Error fetching average eating time:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export async function getComplaintsByPersonnel(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const result = await fetchComplaintsByPersonnel(startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('Error fetching complaints by personnel:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export async function getComplaintsByDish(req, res) {
    const { startDate, endDate } = req.query;
    try {
      const result = await fetchComplaintsByDish(startDate, endDate);
      res.json(result);
    } catch (error) {
      console.error('Error fetching complaints by dish:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  export async function getWaiterEfficiency(req, res) {
    try {
      const result = await fetchWaiterEfficiency();
      res.json(result);
    } catch (error) {
      console.error('Error fetching waiter efficiency:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
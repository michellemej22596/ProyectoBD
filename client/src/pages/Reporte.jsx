import React, { useState } from 'react';

const Reporte = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reports, setReports] = useState({
    mostOrderedPlates: [],
    peakOrderTime: [],
    averageEatingTime: [],
    complaintsByPersonnel: [],
    complaintsByDish: [],
    waiterEfficiency: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      const urls = [
        `/report/mostOrderedPlates?startDate=${startDate}&endDate=${endDate}`,
        `/report//peakOrderTime?startDate=${startDate}&endDate=${endDate}`,
        `/report/averageEatingTime?startDate=${startDate}&endDate=${endDate}`,
        `/report/complaintsByPersonnel?startDate=${startDate}&endDate=${endDate}`,
        `/report/complaintsByDish?startDate=${startDate}&endDate=${endDate}`,
        `/report/waiterEfficiency?startDate=${startDate}&endDate=${endDate}`
      ];  
      const responses = await Promise.all(urls.map(url => fetch(url)));
      const data = await Promise.all(responses.map(res => res.json()));
      setReports({
        mostOrderedPlates: data[0],
        peakOrderTime: data[1],
        averageEatingTime: data[2],
        complaintsByPersonnel: data[3],
        complaintsByDish: data[4],
        waiterEfficiency: data[5]
      });
    } catch (error) {
      console.error('Error fetching report data:', error);
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Reportes</h1>
      <div>
        <label>
          Fecha de inicio:
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          Fecha de fin:
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <button onClick={fetchReportData} disabled={!startDate || !endDate}>Generar Reportes</button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div>
          <h2>Platos más pedidos</h2>
          <ul>
            {reports.mostOrderedPlates.map((plate, index) => (
              <li key={index}>{plate.Name}: {plate.TotalOrders}</li>
            ))}
          </ul>
          <h2>Horario con más pedidos</h2>
          <ul>
            {reports.peakOrderTime.map((time, index) => (
              <li key={index}>{time.Hour}: {time.TotalOrders}</li>
            ))}
          </ul>
          <h2>Promedio de tiempo de comida por cantidad de comensales</h2>
          <ul>
            {reports.averageEatingTime.map((time, index) => (
              <li key={index}>{time.Capacity} personas: {time.AverageMinutes} minutos</li>
            ))}
          </ul>
          <h2>Quejas agrupadas por personal</h2>
          <ul>
            {reports.complaintsByPersonnel.map((complaint, index) => (
              <li key={index}>{complaint.Personnel}: {complaint.TotalComplaints}</li>
            ))}
          </ul>
          <h2>Quejas agrupadas por plato</h2>
          <ul>
            {reports.complaintsByDish.map((dish, index) => (
              <li key={index}>{dish.Name}: {dish.TotalComplaints}</li>
            ))}
          </ul>
          <h2>Eficiencia de los meseros</h2>
          <ul>
            {reports.waiterEfficiency.map((efficiency, index) => (
              <li key={index}>{efficiency.UserName} ({efficiency.Month}): {efficiency.AverageRating}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Reporte;
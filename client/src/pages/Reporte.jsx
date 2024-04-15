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

  const buttonStyle = {
    margin: '10px',
    width: '220px',
    height: '50px',
    backgroundColor: '#78281F',
    color: 'white',
    fontSize: '14px',
    textAlign: 'center',
    padding: '10px 0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      const urls = [
        `http://localhost:3000/reports/mostOrderedPlates?startDate=${startDate}&endDate=${endDate}`,
        `http://localhost:3000/reports/peakOrderTime?startDate=${startDate}&endDate=${endDate}`,
        `http://localhost:3000/reports/averageEatingTime?startDate=${startDate}&endDate=${endDate}`,
        `http://localhost:3000/reports/complaintsByPersonnel?startDate=${startDate}&endDate=${endDate}`,
        `http://localhost:3000/reports/complaintsByDish?startDate=${startDate}&endDate=${endDate}`,
        `http://localhost:3000/reports/waiterEfficiency?startDate=${startDate}&endDate=${endDate}`
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
        <button onClick={fetchReportData} style={buttonStyle} disabled={!startDate || !endDate}>Generar Reportes</button>
      </div>
      {!loading && !error && (
  <div>
    <h2>Platos más pedidos</h2>
    <ul>
      {reports.mostOrderedPlates.map((plate, index) => (
        <li key={`plate-${index}`}>{plate.name}: {plate.totalorders} pedidos</li>
      ))}
    </ul>
    <h2>Horario con más pedidos</h2>
    <ul>
      {reports.peakOrderTime.map((time, index) => (
        <li key={`time-${index}`}>Hora: {time.hour}, Total de pedidos: {time.totalorders}</li>
      ))}
    </ul>
    <h2>Promedio de tiempo de comida por cantidad de comensales</h2>
    <ul>
      {reports.averageEatingTime.map((time, index) => (
        <li key={`eating-time-${index}`}>{time.Capacity} personas: {parseFloat(time.AverageMinutes).toFixed(2)} minutos</li>
      ))}
    </ul>
    <h2>Quejas agrupadas por personal</h2>
    <ul>
      {reports.complaintsByPersonnel.map((complaint, index) => (
        <li key={`complaint-personnel-${index}`}>
          {complaint.personnel}: {complaint.totalcomplaints} quejas
        </li>
      ))}
    </ul>
    <h2>Quejas agrupadas por plato</h2>
    <ul>
      {reports.complaintsByDish.map((dish, index) => (
        <li key={`complaint-dish-${index}`}>{dish.name}: {dish.totalcomplaints} quejas</li>
      ))}
    </ul>
    <h2>Eficiencia de los meseros</h2>
    <ul>
  {reports.waiterEfficiency.map((efficiency, index) => (
    <li key={`efficiency-${index}`}>
      Usuario: {efficiency.username}, Mes: ({efficiency.month}), Calificación de satisfacción: {parseFloat(efficiency.averagerating).toFixed(2)}
    </li>
  ))}
</ul>
  </div>
)}
    </div>
  );
};

export default Reporte;

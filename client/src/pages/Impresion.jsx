import React, { useState } from 'react';
import jsPDF from 'jspdf'; // Importa jsPDF

function Impresion() {
  const [tableNumber, setTableNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState('');

  const fetchOrderDetailsByTable = async (tableNumber) => {
    const response = await fetch(`http://localhost:3000/orders/table/${tableNumber}`);
    const data = await response.json();
    if (response.ok) {
      setOrderDetails(data);
    } else {
      setError('Pedido no encontrado o error en la solicitud');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!tableNumber) {
      setError('Por favor ingrese un número de mesa válido');
      return;
    }
    fetchOrderDetailsByTable(tableNumber);
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20; // Iniciar posición Y después del título
  
    // Centrar título
    const title = `Pedido para la Mesa: ${tableNumber}`;
    const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const titleOffset = (pageWidth - titleWidth) / 2;
    doc.text(title, titleOffset, 10); // Posición Y fija para el título
  
    orderDetails.forEach((item, index) => {
      const itemText = `${item.name} - ${item.quantity} unidades - Descripción: ${item.description} - Precio Total: $${item.totalitemprice}`;
      const textWidth = doc.getStringUnitWidth(itemText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const margin = 20;
  
      // Verifica si el texto es más largo que el ancho de la página con márgenes
      if (textWidth > (pageWidth - (margin * 2))) {
        const splitText = doc.splitTextToSize(itemText, pageWidth - (margin * 2));
        splitText.forEach((line, lineIndex) => {
          doc.text(line, margin, yPosition + (10 * lineIndex));
        });
        yPosition += (10 * splitText.length); // Aumenta Y por cada línea de texto dividido
      } else {
        // Si el texto entra en una sola línea, centra el texto horizontalmente
        const textOffset = (pageWidth - textWidth) / 2;
        doc.text(itemText, textOffset, yPosition);
        yPosition += 10; // Aumenta Y por una línea
      }
    });
  
    doc.save(`Pedido_Mesa_${tableNumber}.pdf`);
  };
  
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


  return (
    <div>
      <h1>Impresión del Pedido</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Ingrese número de mesa"
        />
        <button type="submit" style={buttonStyle}>Mostrar Pedido</button>
      </form>
      {error && <p>{error}</p>}
      {orderDetails && (
        <div>
          <h2>Detalles del Pedido para la Mesa: {tableNumber}</h2>
          {orderDetails.map((detail, index) => (
            <div key={index}>
              <p>{detail.name} - {detail.quantity} unidades - {detail.description}</p>
              <p>Precio unitario: ${detail.price} - Precio total: ${detail.totalitemprice}</p>
            </div>
          ))}
          <button onClick={generatePdf} style={buttonStyle}>Generar PDF</button>
        </div>
      )}
    </div>
  );
}

export default Impresion;


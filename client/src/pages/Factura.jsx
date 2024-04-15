import React, { useState } from 'react';
import jsPDF from 'jspdf';

function Factura() {
  const [tableNumber, setTableNumber] = useState('');
  const [orderDetails, setOrderDetails] = useState([]);
  const [error, setError] = useState('');

  const fetchOrderDetailsByTable = async (tableNumber) => {
    try {
      const response = await fetch(`http://localhost:3000/orders/table/${tableNumber}`);
      if (!response.ok) {
        throw new Error('Pedido no encontrado o error en la solicitud');
      }
      const data = await response.json();
      setOrderDetails(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!tableNumber) {
      setError('Por favor ingrese un número de mesa válido');
      return;
    }
    fetchOrderDetailsByTable(tableNumber);
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Ruta de la imagen desde la carpeta public
    const imagePath = '/images/Logo.png'; // Asegúrate de que el nombre del archivo y la ruta son correctos

    fetch(imagePath)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          
          // Añadir imagen
          doc.addImage(base64data, 'PNG', pageWidth / 2 - 30, 15, 60, 30);
          
          let yPosition = 60; // La posición Y debajo de la imagen

          // Encabezado del PDF
          doc.setFontSize(18);
          const title = `Factura para la Mesa: ${tableNumber}`;
          doc.text(title, pageWidth / 2, 50, { align: 'center' });

          // Subtítulo y detalles
          doc.setFontSize(12);
          doc.text("Detalles del Pedido:", 14, yPosition);
          yPosition += 10;

          doc.setFontSize(10);
          orderDetails.forEach((item, index) => {
            const itemText = `${item.name} - ${item.quantity}x - Descripción: ${item.description} - Precio Total: $${item.totalPrice}`;
            doc.text(itemText, 14, yPosition);
            yPosition += 10;
          });

          doc.save(`Factura_Mesa_${tableNumber}.pdf`);
        };
        reader.readAsDataURL(blob);
      })
      .catch(err => {
        console.error('Error al cargar la imagen:', err);
      });
  };

  return (
    <div>
      <h1>Impresión del Pedido</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Ingrese número de mesa"
        />
        <button type="submit">Mostrar Pedido</button>
      </form>
      {error && <p>{error}</p>}
      {orderDetails.length > 0 && (
        <div>
          <h2>Detalles del Pedido para la Mesa: {tableNumber}</h2>
          {orderDetails.map((detail, index) => (
            <div key={index}>
              <p>{detail.name} - {detail.quantity} unidades - {detail.description}</p>
              <p>Precio unitario: ${detail.price} - Precio total: ${detail.totalPrice}</p>
            </div>
          ))}
          <button onClick={generatePdf}>Generar PDF</button>
        </div>
      )}
    </div>
  );
}

export default Factura;

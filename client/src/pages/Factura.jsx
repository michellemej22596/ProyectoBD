import React, { useState } from 'react';
import jsPDF from 'jspdf';

function Factura() {
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerNit, setCustomerNit] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
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

  const closeOrder = async () => {
    try {
      // Obtener el OrderID basado en el número de mesa
      const orderResponse = await fetch(`http://localhost:3000/orders/orders/latest/${tableNumber}`);
      const orderData = await orderResponse.json();
  
      if (!orderResponse.ok) {
        throw new Error(orderData.message || 'No se encontró una orden activa para esta mesa.');
      }
  
      // Cerrar la cuenta utilizando el OrderID obtenido
      const closeResponse = await fetch(`http://localhost:3000/orders/order/${orderData.orderid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Closed' })
      });
      const closeData = await closeResponse.json();
  
      if (!closeResponse.ok) {
        throw new Error(closeData.message || 'Error al cerrar la cuenta.');
      }
  
      alert('La cuenta ha sido cerrada exitosamente. Ahora puedes generar el pdf de tu factura');
    } catch (error) {
      console.error('Error closing order:', error);
      setError(error.message);
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
    let yPosition = 60; // Comenzar un poco más abajo para dar espacio al logo
  
    // Agrega la imagen de logo al PDF
    doc.addImage('/images/Logo.png', 'PNG', 5, 10, 40, 20); // Ajusta las dimensiones según sea necesario
    
    // Establece una fuente para el título
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Factura', pageWidth / 2, 50, { align: 'center' });
    
    // Restablece la fuente para el cuerpo del texto
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    // Agrega detalles del cliente
    doc.text(`Mesa: ${tableNumber}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Cliente: ${customerName}`, 10, yPosition);
    yPosition += 10;
    doc.text(`NIT: ${customerNit}`, 10, yPosition);
    yPosition += 10;
    doc.text(`Dirección: ${customerAddress}`, 10, yPosition);
    yPosition += 10;
  
    // Detalles de la orden
    let totalAmount = 0;
    doc.setFont(undefined, 'bold');
    doc.text('Detalle de la Orden:', 10, yPosition);
    yPosition += 10;
    doc.setFont(undefined, 'normal');
  
    // Itera a través de los detalles del pedido para añadirlos
    orderDetails.forEach((item) => {
      const itemText = `${item.name} - ${item.quantity} unidades - $${item.price}`;
      doc.text(itemText, 10, yPosition);
      yPosition += 10;
      totalAmount += item.quantity * item.price;
    });
  
    // Agrega el total de la factura
    doc.setFont(undefined, 'bold');
    doc.text(`Total a pagar: $${totalAmount.toFixed(2)}`, 10, yPosition);
  
    // Finalmente guarda el PDF
    doc.save(`Factura_Mesa_${tableNumber}.pdf`);
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
      <h1>Generar factura</h1>
      <h3>Ten en cuenta que al generar la factura, automáticamente cerrarás la cuenta y no se podrá modificar en el futuro. </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Ingrese número de mesa"
        />

        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Ingrese el nombre del cliente"
        />

        <input
          type="text"
          value={customerNit}
          onChange={(e) => setCustomerNit(e.target.value)}
          placeholder="Ingrese el NIT del cliente"
        />

        <input
          type="text"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          placeholder="Ingrese la dirección de facturación"
        />

        <button type="submit" style={buttonStyle}>Mostrar Factura</button>
        <button onClick={() => { closeOrder(); }} style={buttonStyle}>Cerrar Factura</button>

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

export default Factura;

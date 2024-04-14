import React from 'react';
import { jsPDF } from "jspdf";

const PrintOrder = ({ orderDetails }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    doc.text('Detalle del Pedido', 20, 20);
    orderDetails.forEach((item, index) => {
      const position = 30 + (10 * index);
      doc.text(`${item.name} - Cantidad: ${item.quantity} - Precio: ${item.price}`, 20, position);
    });

    // Guardar el documento generado
    doc.save('pedido.pdf');
  };

  return (
    <div>
      <h1>Pedido</h1>
      {orderDetails.map((item, index) => (
        <div key={index}>
          <p>{item.name} - Cantidad: {item.quantity} - Precio: ${item.price}</p>
        </div>
      ))}
      <button onClick={generatePDF}>Imprimir Pedido</button>
    </div>
  );
};

export default PrintOrder;

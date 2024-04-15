import '../styles/Button.css';
import '../styles/App.css';
import '../styles/Input.css';
import React, { useState, useEffect } from 'react';

function Pedidos() {
  const [tableId, setTableId] = useState('');
  const [plates, setPlates] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Cargar el userID desde el almacenamiento local al cargar el componente
  useEffect(() => {
    const storedUserId = localStorage.getItem('access_token');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Cargar menú de platos
  useEffect(() => {
    fetch('http://localhost:3000/orders/plates')
      .then((response) => response.json())
      .then(setPlates)
      .catch((error) => console.error('Error fetching plates:', error));
  }, []);

  // Cargar menú de bebidas
  useEffect(() => {
    fetch('http://localhost:3000/orders/drinks')
      .then((response) => response.json())
      .then(setDrinks)
      .catch((error) => console.error('Error fetching drinks:', error));
  }, []);

  // Función para manejar la adición de un ítem al pedido
  const handleAddItem = (item, type) => {
    const quantity = parseInt(item.quantity) || 0;
    if (quantity > 0) {
      const newItem = {
        itemId: item.itemid, // asegúrate de que es 'itemid' y que esta propiedad está presente en el objeto 'item'
        quantity,
        type
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  // Función para enviar el pedido
  const handleSubmitOrder = async () => {
    if (!tableId || selectedItems.length === 0 || !userId) {
      alert('Please make sure all fields are filled correctly.');
      return;
    }

    const orderData = {
      tableId: parseInt(tableId),
      userId: parseInt(userId),
      items: selectedItems.map(item => ({
        itemId: parseInt(item.itemId), // asegúrate de que es 'itemId' y que coincide con lo que has utilizado arriba
        quantity: parseInt(item.quantity)
      }))
    };

    try {
      const response = await fetch('http://localhost:3000/orders/takeOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Order has been successfully taken!');
        setSelectedItems([]); // Limpiar los ítems seleccionados tras enviar el pedido
        // Otras acciones después del éxito
      } else {
        throw new Error(result.error || 'An error occurred while submitting the order.');
      }
    } catch (error) {
      console.error('Error taking order:', error);
      alert(`Error taking order: ${error.message}`);
    }
  };

  return (
      <div className="pedido-container">
        <h1 className="pedido-title">Tomar Pedido</h1>
        <div className="pedido-input-group">
          <input
            className="custom-input" // Input.css
            type="text"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            placeholder="No. de mesa"
          />
        </div>
        {plates.map((plate) => (
          <div key={plate.itemid} className="pedido-item">
            <span>{plate.name}</span>
            <input
              className="custom-input" // Usando la misma clase para mantener el estilo
              type="number"
              min="1"
              placeholder="Cantidad"
              onChange={(e) => handleAddItem({ ...plate, quantity: e.target.value }, 'plate')}
            />
          </div>
        ))}
        {drinks.map((drink) => (
          <div key={drink.itemid} className="pedido-item">
            <span>{drink.name}</span>
            <input
              className="custom-input" // Usando la misma clase para mantener el estilo
              type="number"
              min="1"
              placeholder="Quantity"
              onChange={(e) => handleAddItem({ ...drink, quantity: e.target.value }, 'drink')}
            />
          </div>
        ))}
        <button
          className="custom-button" // Button.css
          onClick={handleSubmitOrder}
        >
          Submit Order
        </button>
      </div>
    );
  }
  

export default Pedidos;

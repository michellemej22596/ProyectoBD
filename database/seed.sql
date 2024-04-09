-- Insertar usuarios
INSERT INTO RestaurantUser (UserName, PasswordHash, UserType) VALUES
('user1', 'hash1', 'Admin'),
('user2', 'hash2', 'Waiter'),
('user3', 'hash3', 'Chef');

-- Insertar áreas
INSERT INTO Area (Name, IsSmoking) VALUES
('Main Hall', FALSE),
('Smoking Area', TRUE),
('Outdoor', FALSE);

-- Insertar mesas
INSERT INTO RestaurantTable (AreaID, Capacity, IsMovable) VALUES
(1, 4, FALSE),
(2, 2, TRUE),
(3, 6, FALSE);

-- Insertar órdenes
INSERT INTO "Order" (TableID, UserID, DateTime, Status, Tip) VALUES
(1, 2, '2024-04-09 12:00:00', 'In Progress', 5.00),
(2, 2, '2024-04-09 12:30:00', 'Completed', 3.50),
(3, 2, '2024-04-09 13:00:00', 'In Progress', NULL);

-- Insertar ítems
INSERT INTO Item (Name, Description, Price, ItemType) VALUES
('Pizza Margherita', 'Classic pizza with tomato sauce, mozzarella, and basil', 8.50, 'Plate'),
('Coca Cola', 'Refreshing soft drink', 2.00, 'Drink'),
('Caesar Salad', 'Romaine lettuce, croutons, and parmesan cheese with Caesar dressing', 6.75, 'Plate');

-- Insertar detalles de órdenes
INSERT INTO OrderDetail (OrderID, ItemID, Quantity) VALUES
(1, 1, 2),
(1, 2, 3),
(2, 3, 1),
(3, 1, 1),
(3, 3, 1);

-- Insertar facturas
INSERT INTO Invoice (OrderID, CustomerNit, CustomerName, CustomerAddress, DateTime) VALUES
(2, '123456789', 'John Doe', '123 Main St, Anytown', '2024-04-09 13:30:00');

-- Insertar pagos
INSERT INTO Payment (InvoiceID, Type, Amount) VALUES
(1, 'Credit Card', 14.75);

-- Insertar encuestas
INSERT INTO Survey (OrderID, WaiterQuality, OrderAccuracy) VALUES
(2, 5, 4);

-- Insertar quejas
INSERT INTO Complaint (Customer, DateTime, Reason, Classification, Personnel, ItemID) VALUES
('Jane Doe', '2024-04-09 14:00:00', 'Late delivery', 3, 'Waiter', 1);

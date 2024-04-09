CREATE TABLE RestaurantUser (
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL, -- Cambiado a PasswordHash y almacenará el hash de la contraseña.
    UserType VARCHAR(255) NOT NULL
);

CREATE TABLE Area (
    AreaID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    IsSmoking BOOLEAN NOT NULL
);

CREATE TABLE RestaurantTable (
    TableID SERIAL PRIMARY KEY,
    AreaID INT NOT NULL,
    Capacity INT NOT NULL,
    IsMovable BOOLEAN NOT NULL,
    FOREIGN KEY (AreaID) REFERENCES Area(AreaID)
);

CREATE TABLE Order (
    OrderID SERIAL PRIMARY KEY,
    TableID INT NOT NULL,
    UserID INT NOT NULL,
    DateTime TIMESTAMP NOT NULL, -- Cambiado a TIMESTAMP
    Status VARCHAR(255) NOT NULL,
    Tip FLOAT,
    FOREIGN KEY (TableID) REFERENCES RestaurantTable(TableID),
    FOREIGN KEY (UserID) REFERENCES RestaurantUser(UserID)
);

CREATE TABLE Item (
    ItemID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price FLOAT NOT NULL,
    ItemType VARCHAR(255) NOT NULL -- 'Plate' o 'Drink'
);

CREATE TABLE OrderDetail (
    OrderDetailID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Order(OrderID),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
);

CREATE TABLE Invoice (
    InvoiceID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    CustomerNit VARCHAR(255),
    CustomerName VARCHAR(255) NOT NULL,
    CustomerAddress TEXT NOT NULL,
    DateTime TIMESTAMP NOT NULL, -- Cambiado a TIMESTAMP
    FOREIGN KEY (OrderID) REFERENCES Order(OrderID)
);

CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL,
    Type VARCHAR(255) NOT NULL,
    Amount FLOAT NOT NULL,
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID)
);

CREATE TABLE Survey (
    SurveyID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    WaiterQuality INT NOT NULL CHECK (WaiterQuality BETWEEN 1 AND 5),
    OrderAccuracy INT NOT NULL CHECK (OrderAccuracy BETWEEN 1 AND 5),
    FOREIGN KEY (OrderID) REFERENCES Order(OrderID)
);

CREATE TABLE Complaint (
    ComplaintID SERIAL PRIMARY KEY,
    Customer VARCHAR(255) NOT NULL,
    DateTime TIMESTAMP NOT NULL, -- Cambiado a TIMESTAMP
    Reason VARCHAR(255) NOT NULL,
    Classification INT NOT NULL CHECK (Classification BETWEEN 1 AND 5),
    Personnel VARCHAR(255),
    ItemID INT, -- Cambiado para permitir que la queja sea sobre cualquier ítem, no solo platos.
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
);

-- Índice para la tabla Order en las columnas TableID y UserID
CREATE INDEX idx_order_tableid_userid ON "Order"(TableID, UserID);

-- Índice para la tabla OrderDetail en las columnas OrderID y ItemID
CREATE INDEX idx_orderdetail_orderid_itemid ON OrderDetail(OrderID, ItemID);

-- Índice para la tabla Invoice en la columna OrderID
CREATE INDEX idx_invoice_orderid ON Invoice(OrderID);

-- Índice para la tabla Payment en la columna InvoiceID
CREATE INDEX idx_payment_invoiceid ON Payment(InvoiceID);


-- Actualización de Estado de Mesa
CREATE OR REPLACE FUNCTION update_table_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Status = 'Pagada' THEN
        UPDATE RestaurantTable
        SET Available = TRUE
        WHERE TableID = NEW.TableID;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_table_status
AFTER UPDATE ON "Order"
FOR EACH ROW
WHEN (OLD.Status <> 'Pagada' AND NEW.Status = 'Pagada')
EXECUTE FUNCTION update_table_status();

-- Registro de actividades 
CREATE OR REPLACE FUNCTION log_order_activity()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO OrderActivityLog(OrderID, ActionType, ActionTimestamp, UserID)
    VALUES (NEW.OrderID, TG_OP, CURRENT_TIMESTAMP, NEW.UserID);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_order_activity
AFTER INSERT OR UPDATE OR DELETE ON "Order"
FOR EACH ROW
EXECUTE FUNCTION log_order_activity();

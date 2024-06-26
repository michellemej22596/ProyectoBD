DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'michimejia') THEN
        CREATE ROLE michimejia WITH LOGIN PASSWORD 'password';
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'silvia') THEN
        CREATE ROLE silvia WITH LOGIN PASSWORD 'password';
    END IF;
END
$$;
CREATE TABLE RestaurantUser (
    UserID SERIAL PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL, 
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

CREATE TABLE RestaurantOrder (
    OrderID SERIAL PRIMARY KEY,
    TableID INT NOT NULL,
    UserID INT NOT NULL,
    DateTime TIMESTAMP NOT NULL, 
    Status VARCHAR(255) NOT NULL,
    Tip FLOAT,
    FOREIGN KEY (TableID) REFERENCES RestaurantTable(TableID),
    FOREIGN KEY (UserID) REFERENCES RestaurantUser(UserID)
);

ALTER TABLE RestaurantOrder
ADD COLUMN EndTime TIMESTAMP;

CREATE TABLE Item (
    ItemID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price FLOAT NOT NULL,
    ItemType VARCHAR(255) NOT NULL 
);

CREATE TABLE OrderDetail (
    OrderDetailID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    ItemID INT NOT NULL,
    Quantity INT NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES RestaurantOrder(OrderID),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
);

CREATE TABLE Invoice (
    InvoiceID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    CustomerNit VARCHAR(255),
    CustomerName VARCHAR(255) NOT NULL,
    CustomerAddress TEXT NOT NULL,
    DateTime TIMESTAMP NOT NULL, 
    FOREIGN KEY (OrderID) REFERENCES RestaurantOrder(OrderID)
);

CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    Type VARCHAR(255) NOT NULL,
    Amount FLOAT NOT NULL
);

CREATE TABLE InvoicePayment (
    InvoicePaymentID SERIAL PRIMARY KEY,
    InvoiceID INT NOT NULL,
    PaymentID INT NOT NULL,
    FOREIGN KEY (InvoiceID) REFERENCES Invoice(InvoiceID),
    FOREIGN KEY (PaymentID) REFERENCES Payment(PaymentID)
);

CREATE TABLE Survey (
    SurveyID SERIAL PRIMARY KEY,
    OrderID INT NOT NULL,
    WaiterQuality INT NOT NULL CHECK (WaiterQuality BETWEEN 1 AND 5),
    OrderAccuracy INT NOT NULL CHECK (OrderAccuracy BETWEEN 1 AND 5),
    FOREIGN KEY (OrderID) REFERENCES RestaurantOrder(OrderID)
);

CREATE TABLE Complaint (
    ComplaintID SERIAL PRIMARY KEY,
    Customer VARCHAR(255) NOT NULL,
    DateTime TIMESTAMP NOT NULL, 
    Reason VARCHAR(255) NOT NULL,
    Classification INT NOT NULL CHECK (Classification BETWEEN 1 AND 5),
    Personnel VARCHAR(255),
    ItemID INT, 
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
);

CREATE TABLE OrderActivityLog (
    LogID SERIAL PRIMARY KEY,
    OrderID INT,
    ActionType VARCHAR(255),
    ActionTimestamp TIMESTAMP,
    UserID INT,
    FOREIGN KEY (OrderID) REFERENCES RestaurantOrder(OrderID),
    FOREIGN KEY (UserID) REFERENCES RestaurantUser(UserID)
);

-- Índice para la tabla Order en las columnas TableID y UserID
CREATE INDEX idx_order_tableid_userid ON RestaurantOrder(TableID, UserID);

-- Índice para la tabla OrderDetail en las columnas OrderID y ItemID
CREATE INDEX idx_orderdetail_orderid_itemid ON OrderDetail(OrderID, ItemID);

-- Índice para la tabla Invoice en la columna OrderID
CREATE INDEX idx_invoice_orderid ON Invoice(OrderID);

-- Índice para la tabla InvoicePayment en la columna InvoiceID
CREATE INDEX idx_payment_invoiceid ON InvoicePayment(InvoiceID);


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
AFTER UPDATE ON RestaurantOrder
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
AFTER INSERT OR UPDATE OR DELETE ON RestaurantOrder
FOR EACH ROW
EXECUTE FUNCTION log_order_activity();

-- Función para registrar la actividad de creación de un pedido
CREATE OR REPLACE FUNCTION log_creation_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserta un registro en OrderActivityLog con la información del pedido creado
    INSERT INTO OrderActivityLog (OrderID, ActionType, ActionTimestamp, UserID)
    VALUES (NEW.OrderID, 'CREATED', CURRENT_TIMESTAMP, NEW.UserID);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger que se activa después de insertar un nuevo pedido en RestaurantOrder
CREATE TRIGGER trigger_log_creation_activity
AFTER INSERT ON RestaurantOrder
FOR EACH ROW
EXECUTE FUNCTION log_creation_activity();

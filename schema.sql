CREATE TABLE Usuario (
    UsuarioID INT PRIMARY KEY,
    UsuarioNombre VARCHAR(255),
    Contraseña VARCHAR(255),
    TipoUsuario VARCHAR(255)
);

CREATE TABLE Área (
    AreaID INT PRIMARY KEY,
    Nombre VARCHAR(255),
    EsFumadores BOOLEAN
);

CREATE TABLE Mesa (
    MesaID INT PRIMARY KEY,
    AreaID INT,
    Capacidad INT,
    EsMovible BOOLEAN,
    FOREIGN KEY (AreaID) REFERENCES Área(AreaID)
);

CREATE TABLE Pedido (
    PedidoID INT PRIMARY KEY,
    MesaID INT,
    UsuarioID INT,
    FechaHora DATETIME,
    Estado VARCHAR(255),
    Propina FLOAT,
    FOREIGN KEY (MesaID) REFERENCES Mesa(MesaID),
    FOREIGN KEY (UsuarioID) REFERENCES Usuario(UserID)
);

CREATE TABLE PedidoDetalle (
    PedidoID INT,
    PlatoID INT,
    BebidaID INT,
    Cantidad INT,
    FOREIGN KEY (PedidoID) REFERENCES Pedido(PedidoID),
    FOREIGN KEY (PlatoID) REFERENCES Plato(PlatoID),
    FOREIGN KEY (BebidaID) REFERENCES Bebida(BebidaID)
);

CREATE TABLE Plato (
    PlatoID INT PRIMARY KEY,
    Nombre VARCHAR(255),
    Descripción TEXT,
    Precio FLOAT
);

CREATE TABLE Bebida (
    BebidaID INT PRIMARY KEY,
    Nombre VARCHAR(255),
    Descripción TEXT,
    Precio FLOAT
);

CREATE TABLE Factura (
    FacturaID INT PRIMARY KEY,
    PedidoID INT,
    ClienteNit VARCHAR(255),
    ClienteNombre VARCHAR(255),
    ClienteDirección TEXT,
    FechaHora DATETIME,
    FOREIGN KEY (PedidoID) REFERENCES Pedido(PedidoID)
);

CREATE TABLE FormaPago (
    FormaPagoID INT PRIMARY KEY,
    FacturaID INT,
    Tipo VARCHAR(255),
    Monto FLOAT,
    FOREIGN KEY (FacturaID) REFERENCES Factura(FacturaID)
);

CREATE TABLE Encuesta (
    EncuestaID INT PRIMARY KEY,
    PedidoID INT,
    CalidadMesero INT,
    ExactitudPedido INT,
    FOREIGN KEY (PedidoID) REFERENCES Pedido(PedidoID)
);

CREATE TABLE Queja (
    QuejaID INT PRIMARY KEY,
    Cliente VARCHAR(255),
    FechaHora DATETIME,
    Motivo VARCHAR(255),
    Clasificación INT,
    Personal VARCHAR(255),
    PlatoID INT,
    FOREIGN KEY (PlatoID) REFERENCES Plato(PlatoID)
);

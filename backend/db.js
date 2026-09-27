const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./inovapan.db");

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_CLIENTE (
            ID_CLIENTE INTEGER PRIMARY KEY AUTOINCREMENT,
            NM_CLIENTE TEXT NOT NULL,
            DS_EMAIL TEXT,
            NR_TELEFONE TEXT NOT NULL,
            DS_ENDERECO TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_PRODUTO (
            ID_PRODUTO INTEGER PRIMARY KEY AUTOINCREMENT,
            NM_PRODUTO TEXT NOT NULL,
            DS_DESCRICAO TEXT,
            VL_PRECO REAL NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_PEDIDO (
            ID_PEDIDO INTEGER PRIMARY KEY AUTOINCREMENT,
            ID_CLIENTE INTEGER NOT NULL,
            DT_PEDIDO DATETIME DEFAULT CURRENT_TIMESTAMP,
            VL_TOTAL REAL NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS TB_ITEM_PEDIDO (
            ID_ITEM INTEGER PRIMARY KEY AUTOINCREMENT,
            ID_PEDIDO INTEGER NOT NULL,
            ID_PRODUTO INTEGER NOT NULL,
            QT_PRODUTO INTEGER NOT NULL,
            VL_UNITARIO REAL NOT NULL,
            VL_TOTAL_ITEM REAL NOT NULL
        )
    `);

});

module.exports = db;

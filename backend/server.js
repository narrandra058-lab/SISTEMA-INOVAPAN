const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
    res.json({
        mensagem: "API InovaPan funcionando"
    });
});


// CLIENTES

app.post("/clientes", (req, res) => {
    const {
        nm_cliente,
        ds_email,
        nr_telefone,
        ds_endereco
    } = req.body;

    if (!nm_cliente || !nr_telefone) {
        return res.status(400).json({
            erro: "Nome e telefone são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO TB_CLIENTE
        (NM_CLIENTE, DS_EMAIL, NR_TELEFONE, DS_ENDERECO)
        VALUES (?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            nm_cliente,
            ds_email,
            nr_telefone,
            ds_endereco
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.status(201).json({
                mensagem: "Cliente cadastrado com sucesso.",
                id_cliente: this.lastID
            });
        }
    );
});


app.get("/clientes", (req, res) => {

    const busca = req.query.busca || "";

    const sql = `
        SELECT *
        FROM TB_CLIENTE
        WHERE NM_CLIENTE LIKE ?
        ORDER BY NM_CLIENTE
    `;

    db.all(sql, [`%${busca}%`], (erro, clientes) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json(clientes);
    });
});


// PRODUTOS

app.post("/produtos", (req, res) => {

    const {
        nm_produto,
        ds_descricao,
        vl_preco
    } = req.body;

    if (!nm_produto || vl_preco === undefined) {
        return res.status(400).json({
            erro: "Nome e preço são obrigatórios."
        });
    }

    const sql = `
        INSERT INTO TB_PRODUTO
        (NM_PRODUTO, DS_DESCRICAO, VL_PRECO)
        VALUES (?, ?, ?)
    `;

    db.run(
        sql,
        [
            nm_produto,
            ds_descricao,
            vl_preco
        ],
        function (erro) {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            res.status(201).json({
                mensagem: "Produto cadastrado com sucesso.",
                id_produto: this.lastID
            });
        }
    );
});


app.get("/produtos", (req, res) => {

    const sql = `
        SELECT *
        FROM TB_PRODUTO
        ORDER BY NM_PRODUTO
    `;

    db.all(sql, [], (erro, produtos) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json(produtos);
    });
});


// PEDIDOS

app.post("/pedidos", (req, res) => {

    const {
        id_cliente,
        itens
    } = req.body;

    if (!id_cliente || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({
            erro: "Cliente e itens do pedido são obrigatórios."
        });
    }

    let totalPedido = 0;

    const buscarProduto = (item, callback) => {

        db.get(
            "SELECT * FROM TB_PRODUTO WHERE ID_PRODUTO = ?",
            [item.id_produto],
            (erro, produto) => {

                if (erro) {
                    return callback(erro);
                }

                if (!produto) {
                    return callback(
                        new Error("Produto não encontrado.")
                    );
                }

                const totalItem =
                    item.qt_produto * produto.VL_PRECO;

                totalPedido += totalItem;

                callback(null, {
                    id_produto: produto.ID_PRODUTO,
                    quantidade: item.qt_produto,
                    valor_unitario: produto.VL_PRECO,
                    valor_total: totalItem
                });
            }
        );
    };

    const resultados = [];
    let processados = 0;

    itens.forEach((item) => {

        buscarProduto(item, (erro, resultado) => {

            if (erro) {
                return res.status(400).json({
                    erro: erro.message
                });
            }

            resultados.push(resultado);
            processados++;

            if (processados === itens.length) {

                db.run(
                    `
                    INSERT INTO TB_PEDIDO
                    (ID_CLIENTE, VL_TOTAL)
                    VALUES (?, ?)
                    `,
                    [id_cliente, totalPedido],
                    function (erroPedido) {

                        if (erroPedido) {
                            return res.status(500).json({
                                erro: erroPedido.message
                            });
                        }

                        const idPedido = this.lastID;

                        resultados.forEach((item) => {

                            db.run(
                                `
                                INSERT INTO TB_ITEM_PEDIDO
                                (
                                    ID_PEDIDO,
                                    ID_PRODUTO,
                                    QT_PRODUTO,
                                    VL_UNITARIO,
                                    VL_TOTAL_ITEM
                                )
                                VALUES (?, ?, ?, ?, ?)
                                `,
                                [
                                    idPedido,
                                    item.id_produto,
                                    item.quantidade,
                                    item.valor_unitario,
                                    item.valor_total
                                ]
                            );

                        });

                        res.status(201).json({
                            mensagem: "Pedido cadastrado com sucesso.",
                            id_pedido: idPedido,
                            vl_total: totalPedido
                        });
                    }
                );
            }
        });
    });
});


app.get("/pedidos", (req, res) => {

    const sql = `
        SELECT
            P.ID_PEDIDO,
            P.ID_CLIENTE,
            C.NM_CLIENTE,
            P.DT_PEDIDO,
            P.VL_TOTAL
        FROM TB_PEDIDO P
        INNER JOIN TB_CLIENTE C
            ON C.ID_CLIENTE = P.ID_CLIENTE
        ORDER BY P.ID_PEDIDO DESC
    `;

    db.all(sql, [], (erro, pedidos) => {

        if (erro) {
            return res.status(500).json({
                erro: erro.message
            });
        }

        res.json(pedidos);
    });
});


app.get("/pedidos/:id", (req, res) => {

    const id = req.params.id;

    db.get(
        `
        SELECT
            P.ID_PEDIDO,
            P.ID_CLIENTE,
            C.NM_CLIENTE,
            P.DT_PEDIDO,
            P.VL_TOTAL
        FROM TB_PEDIDO P
        INNER JOIN TB_CLIENTE C
            ON C.ID_CLIENTE = P.ID_CLIENTE
        WHERE P.ID_PEDIDO = ?
        `,
        [id],
        (erro, pedido) => {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            if (!pedido) {
                return res.status(404).json({
                    erro: "Pedido não encontrado."
                });
            }

            db.all(
                `
                SELECT
                    I.ID_PRODUTO,
                    PR.NM_PRODUTO,
                    I.QT_PRODUTO,
                    I.VL_UNITARIO,
                    I.VL_TOTAL_ITEM
                FROM TB_ITEM_PEDIDO I
                INNER JOIN TB_PRODUTO PR
                    ON PR.ID_PRODUTO = I.ID_PRODUTO
                WHERE I.ID_PEDIDO = ?
                `,
                [id],
                (erroItens, itens) => {

                    if (erroItens) {
                        return res.status(500).json({
                            erro: erroItens.message
                        });
                    }

                    res.json({
                        pedido,
                        itens
                    });
                }
            );
        }
    );
});


app.delete("/pedidos/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM TB_ITEM_PEDIDO WHERE ID_PEDIDO = ?",
        [id],
        (erro) => {

            if (erro) {
                return res.status(500).json({
                    erro: erro.message
                });
            }

            db.run(
                "DELETE FROM TB_PEDIDO WHERE ID_PEDIDO = ?",
                [id],
                function (erroPedido) {

                    if (erroPedido) {
                        return res.status(500).json({
                            erro: erroPedido.message
                        });
                    }

                    if (this.changes === 0) {
                        return res.status(404).json({
                            erro: "Pedido não encontrado."
                        });
                    }

                    res.json({
                        mensagem: "Pedido excluído com sucesso."
                    });
                }
            );
        }
    );
});


app.listen(PORT, () => {
    console.log(`InovaPan rodando na porta ${PORT}`);
});

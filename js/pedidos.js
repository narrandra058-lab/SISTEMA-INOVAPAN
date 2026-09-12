let carrinho = [];


function adicionarAoCarrinho(
    nome,
    preco
) {

    const produtoExistente =
        carrinho.find(
            item => item.nome === nome
        );


    if (produtoExistente) {

        produtoExistente.quantidade++;

    } else {

        carrinho.push({

            nome: nome,

            preco: Number(preco),

            quantidade: 1

        });

    }


    atualizarCarrinho();

}


function removerDoCarrinho(
    nome
) {

    const produto =
        carrinho.find(
            item => item.nome === nome
        );


    if (!produto) return;


    produto.quantidade--;


    if (produto.quantidade <= 0) {

        carrinho =
            carrinho.filter(
                item =>
                    item.nome !== nome
            );

    }


    atualizarCarrinho();

}


function atualizarCarrinho() {

    const container =
        document.getElementById(
            "itensCarrinho"
        );


    const subtotalElemento =
        document.getElementById(
            "subtotalPedido"
        );


    const totalElemento =
        document.getElementById(
            "totalPedido"
        );


    if (!container) return;


    if (carrinho.length === 0) {

        container.innerHTML = `

            <div class="carrinho-vazio">

                <i class="bi bi-basket"
                   style="font-size:30px;">
                </i>

                <br><br>

                Nenhum produto adicionado.

            </div>

        `;

    } else {

        container.innerHTML =
            carrinho.map(
                item => `

                <div class="d-flex
                            justify-content-between
                            align-items-center
                            mb-3">

                    <div>

                        <strong
                            style="font-size:11px;">

                            ${item.nome}

                        </strong>

                        <br>

                        <small>

                            ${item.quantidade}
                            x
                            ${formatarMoeda(item.preco)}

                        </small>

                    </div>


                    <div>

                        <button
                            class="btn btn-sm"
                            onclick="removerDoCarrinho('${item.nome}')">

                            −

                        </button>


                        <button
                            class="btn btn-sm"
                            onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">

                            +

                        </button>

                    </div>

                </div>

            `
            ).join("");

    }


    const total =
        carrinho.reduce(
            (soma, item) =>
                soma +
                item.preco *
                item.quantidade,
            0
        );


    subtotalElemento.textContent =
        formatarMoeda(total);


    totalElemento.textContent =
        formatarMoeda(total);

}


function finalizarPedido() {

    if (carrinho.length === 0) {

        alert(
            "Adicione pelo menos um produto ao pedido."
        );

        return;

    }


    const cliente =
        document.getElementById(
            "clientePedido"
        )?.value;


    if (!cliente) {

        alert(
            "Selecione um cliente."
        );

        return;

    }


    const pedidos =
        obterPedidos();


    const total =
        carrinho.reduce(
            (soma, item) =>
                soma +
                item.preco *
                item.quantidade,
            0
        );


    pedidos.push({

        id:
            Date.now(),

        cliente:
            cliente,

        itens:
            carrinho,

        total:
            total,

        data:
            new Date().toLocaleDateString(
                "pt-BR"
            )

    });


    localStorage.setItem(
        "inovapan_pedidos",
        JSON.stringify(pedidos)
    );


    alert(
        "Pedido registrado com sucesso!"
    );


    carrinho = [];

    atualizarCarrinho();

}

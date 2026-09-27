const formPedido = document.getElementById("formPedido");
const clientePedido = document.getElementById("clientePedido");
const produtoPedido = document.getElementById("produtoPedido");
const quantidadePedido = document.getElementById("quantidadePedido");
const listaPedidos = document.getElementById("listaPedidos");

async function carregarClientes() {
    const clientes = await apiFetch("/clientes");

    clientePedido.innerHTML =
        '<option value="">Selecione o cliente</option>';

    clientes.forEach(cliente => {
        clientePedido.innerHTML += `
            <option value="${cliente.ID_CLIENTE}">
                ${cliente.NM_CLIENTE}
            </option>
        `;
    });
}

async function carregarProdutos() {
    const produtos = await apiFetch("/produtos");

    produtoPedido.innerHTML =
        '<option value="">Selecione o produto</option>';

    produtos.forEach(produto => {
        produtoPedido.innerHTML += `
            <option value="${produto.ID_PRODUTO}">
                ${produto.NM_PRODUTO} - R$ ${Number(produto.VL_PRECO).toFixed(2)}
            </option>
        `;
    });
}

async function carregarPedidos() {
    try {
        const pedidos = await apiFetch("/pedidos");

        listaPedidos.innerHTML = "";

        pedidos.forEach(pedido => {
            listaPedidos.innerHTML += `
                <tr>
                    <td>${pedido.ID_PEDIDO}</td>
                    <td>${pedido.NM_CLIENTE}</td>
                    <td>${pedido.DT_PEDIDO}</td>
                    <td>R$ ${Number(pedido.VL_TOTAL).toFixed(2)}</td>
                    <td>
                        <button
                            class="btn btn-sm btn-info"
                            onclick="verPedido(${pedido.ID_PEDIDO})">
                            Detalhes
                        </button>

                        <button
                            class="btn btn-sm btn-danger"
                            onclick="excluirPedido(${pedido.ID_PEDIDO})">
                            Excluir
                        </button>
                    </td>
                </tr>
            `;
        });

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os pedidos.");
    }
}

formPedido.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const pedido = {
        id_cliente: Number(clientePedido.value),
        itens: [
            {
                id_produto: Number(produtoPedido.value),
                qt_produto: Number(quantidadePedido.value)
            }
        ]
    };

    try {

        await apiFetch("/pedidos", {
            method: "POST",
            body: JSON.stringify(pedido)
        });

        alert("Pedido cadastrado com sucesso.");

        formPedido.reset();

        carregarPedidos();

    } catch (erro) {
        console.error(erro);
        alert(erro.message);
    }
});

async function verPedido(id) {

    try {

        const resultado = await apiFetch(`/pedidos/${id}`);

        let mensagem =
            `Pedido: ${resultado.pedido.ID_PEDIDO}\n` +
            `Cliente: ${resultado.pedido.NM_CLIENTE}\n` +
            `Total: R$ ${Number(resultado.pedido.VL_TOTAL).toFixed(2)}\n\n` +
            `Itens:\n`;

        resultado.itens.forEach(item => {
            mensagem +=
                `${item.NM_PRODUTO} - ` +
                `${item.QT_PRODUTO} unidade(s)\n`;
        });

        alert(mensagem);

    } catch (erro) {
        alert(erro.message);
    }
}

async function excluirPedido(id) {

    if (!confirm("Deseja excluir este pedido?")) {
        return;
    }

    try {

        await apiFetch(`/pedidos/${id}`, {
            method: "DELETE"
        });

        alert("Pedido excluído com sucesso.");

        carregarPedidos();

    } catch (erro) {
        alert(erro.message);
    }
}

async function iniciar() {
    try {
        await carregarClientes();
        await carregarProdutos();
        await carregarPedidos();
    } catch (erro) {
        console.error(erro);
    }
}

iniciar();

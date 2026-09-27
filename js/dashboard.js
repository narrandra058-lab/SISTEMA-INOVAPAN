async function carregarDashboard() {
    try {
        const clientes = await apiFetch("/clientes");
        const produtos = await apiFetch("/produtos");
        const pedidos = await apiFetch("/pedidos");

        const totalClientes = document.getElementById("totalClientes");
        const totalProdutos = document.getElementById("totalProdutos");
        const totalPedidos = document.getElementById("totalPedidos");
        const totalVendas = document.getElementById("totalVendas");

        if (totalClientes) {
            totalClientes.textContent = clientes.length;
        }

        if (totalProdutos) {
            totalProdutos.textContent = produtos.length;
        }

        if (totalPedidos) {
            totalPedidos.textContent = pedidos.length;
        }

        if (totalVendas) {
            const vendas = pedidos.reduce(
                (total, pedido) => total + Number(pedido.VL_TOTAL),
                0
            );

            totalVendas.textContent =
                `R$ ${vendas.toFixed(2)}`;
        }

    } catch (erro) {
        console.error(erro);
    }
}

carregarDashboard();

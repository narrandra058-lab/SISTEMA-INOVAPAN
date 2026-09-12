// ========================================
// INOVAPAN - APLICAÇÃO PRINCIPAL
// ========================================


// -----------------------------
// PROTEÇÃO DAS PÁGINAS
// -----------------------------

function protegerPagina() {

    const pagina =
        window.location.pathname
            .split("/")
            .pop();

    const paginasPublicas = [
        "",
        "index.html",
        "login.html"
    ];

    if (
        !paginasPublicas.includes(pagina) &&
        !localStorage.getItem("inovapan_usuario")
    ) {

        window.location.href = "login.html";

    }

}


// -----------------------------
// SAIR
// -----------------------------

function sairSistema() {

    localStorage.removeItem("inovapan_usuario");

    window.location.href = "login.html";

}


// -----------------------------
// FORMATAR MOEDA
// -----------------------------

function formatarMoeda(valor) {

    return Number(valor).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// -----------------------------
// DADOS
// -----------------------------

function obterClientes() {

    return JSON.parse(
        localStorage.getItem("inovapan_clientes") || "[]"
    );

}


function obterProdutos() {

    return JSON.parse(
        localStorage.getItem("inovapan_produtos") || "[]"
    );

}


function obterPedidos() {

    return JSON.parse(
        localStorage.getItem("inovapan_pedidos") || "[]"
    );

}


// -----------------------------
// DASHBOARD
// -----------------------------

function atualizarDashboard() {

    const clientes = obterClientes();
    const produtos = obterProdutos();
    const pedidos = obterPedidos();

    const elementoClientes =
        document.getElementById("totalClientes");

    const elementoProdutos =
        document.getElementById("totalProdutos");

    const elementoPedidos =
        document.getElementById("totalPedidos");

    const elementoVendas =
        document.getElementById("totalVendas");


    if (elementoClientes) {

        elementoClientes.textContent =
            clientes.length;

    }


    if (elementoProdutos) {

        elementoProdutos.textContent =
            produtos.length;

    }


    if (elementoPedidos) {

        elementoPedidos.textContent =
            pedidos.length;

    }


    if (elementoVendas) {

        const vendas =
            pedidos.reduce(
                (total, pedido) =>
                    total + Number(pedido.total || 0),
                0
            );

        elementoVendas.textContent =
            formatarMoeda(vendas);

    }

}


// -----------------------------
// INICIALIZAÇÃO
// -----------------------------

document.addEventListener(
    "DOMContentLoaded",
    function() {

        protegerPagina();

        atualizarDashboard();

    }
);

const formProduto = document.getElementById("formProduto");
const listaProdutos = document.getElementById("listaProdutos");

async function carregarProdutos() {
    try {
        const produtos = await apiFetch("/produtos");

        listaProdutos.innerHTML = "";

        produtos.forEach(produto => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${produto.ID_PRODUTO}</td>
                <td>${produto.NM_PRODUTO}</td>
                <td>${produto.DS_DESCRICAO || ""}</td>
                <td>R$ ${Number(produto.VL_PRECO).toFixed(2)}</td>
            `;

            listaProdutos.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os produtos.");
    }
}

if (formProduto) {
    formProduto.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const produto = {
            nm_produto: document.getElementById("nomeProduto").value,
            ds_descricao: document.getElementById("descricaoProduto").value,
            vl_preco: Number(
                document.getElementById("precoProduto").value
            )
        };

        try {
            await apiFetch("/produtos", {
                method: "POST",
                body: JSON.stringify(produto)
            });

            alert("Produto cadastrado com sucesso.");

            formProduto.reset();

            carregarProdutos();

        } catch (erro) {
            console.error(erro);
            alert(erro.message);
        }
    });
}

carregarProdutos();

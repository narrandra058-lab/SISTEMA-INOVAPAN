const formProduto =
    document.getElementById("formProduto");


const buscaProduto =
    document.getElementById("buscarProduto");


const filtroCategoria =
    document.getElementById("filtroCategoria");


function salvarProduto() {

    const produtos =
        obterProdutos();


    produtos.push({

        id: Date.now(),

        nome:
            document.getElementById(
                "nomeProduto"
            ).value,

        descricao:
            document.getElementById(
                "descricaoProduto"
            ).value,

        preco:
            Number(
                document.getElementById(
                    "precoProduto"
                ).value
            ),

        categoria:
            document.getElementById(
                "categoriaProduto"
            ).value

    });


    localStorage.setItem(
        "inovapan_produtos",
        JSON.stringify(produtos)
    );

}


formProduto?.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        salvarProduto();

        formProduto.reset();


        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById(
                    "modalProduto"
                )
            );

        modal.hide();

    }
);

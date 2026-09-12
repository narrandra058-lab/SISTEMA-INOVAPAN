const formCliente =
    document.getElementById("formCliente");

const listaClientes =
    document.getElementById("listaClientes");

const buscarCliente =
    document.getElementById("buscarCliente");


function renderizarClientes(
    filtro = ""
) {

    const clientes =
        obterClientes();

    const filtrados =
        clientes.filter(cliente =>
            cliente.nome
                .toLowerCase()
                .includes(filtro.toLowerCase())
        );


    if (filtrados.length === 0) {

        listaClientes.innerHTML = `
            <tr>
                <td colspan="5"
                    class="text-center">
                    Nenhum cliente cadastrado.
                </td>
            </tr>
        `;

        return;

    }


    listaClientes.innerHTML =
        filtrados.map(
            (cliente, index) => `

            <tr>

                <td>
                    <strong>
                        ${cliente.nome}
                    </strong>
                </td>

                <td>
                    ${cliente.telefone}
                </td>

                <td>
                    ${cliente.email || "-"}
                </td>

                <td>
                    ${cliente.endereco}
                </td>

                <td>

                    <button
                        class="btn btn-sm"
                        onclick="excluirCliente(${index})">

                        <i class="bi bi-trash"
                           style="color:#b75b50;">
                        </i>

                    </button>

                </td>

            </tr>

        `
        ).join("");

}


formCliente?.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const clientes =
            obterClientes();


        clientes.push({

            nome:
                document.getElementById(
                    "nomeCliente"
                ).value,

            telefone:
                document.getElementById(
                    "telefoneCliente"
                ).value,

            email:
                document.getElementById(
                    "emailCliente"
                ).value,

            endereco:
                document.getElementById(
                    "enderecoCliente"
                ).value

        });


        localStorage.setItem(
            "inovapan_clientes",
            JSON.stringify(clientes)
        );


        formCliente.reset();


        const modal =
            bootstrap.Modal.getInstance(
                document.getElementById(
                    "modalCliente"
                )
            );

        modal.hide();


        renderizarClientes();

    }
);


function excluirCliente(index) {

    const clientes =
        obterClientes();

    clientes.splice(index, 1);

    localStorage.setItem(
        "inovapan_clientes",
        JSON.stringify(clientes)
    );

    renderizarClientes();

}


buscarCliente?.addEventListener(
    "input",
    function() {

        renderizarClientes(
            this.value
        );

    }
);


renderizarClientes();

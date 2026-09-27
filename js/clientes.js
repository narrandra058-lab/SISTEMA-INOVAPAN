const formCliente = document.getElementById("formCliente");
const listaClientes = document.getElementById("listaClientes");
const pesquisaCliente = document.getElementById("pesquisaCliente");
const contadorClientes = document.getElementById("contadorClientes");

async function carregarClientes() {
    try {
        const busca = pesquisaCliente ? pesquisaCliente.value : "";

        const clientes = await apiFetch(
            `/clientes?busca=${encodeURIComponent(busca)}`
        );

        listaClientes.innerHTML = "";

        clientes.forEach(cliente => {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${cliente.ID_CLIENTE}</td>
                <td>${cliente.NM_CLIENTE}</td>
                <td>${cliente.NR_TELEFONE}</td>
                <td>${cliente.DS_EMAIL || ""}</td>
                <td>${cliente.DS_ENDERECO || ""}</td>
            `;

            listaClientes.appendChild(linha);
        });

        if (contadorClientes) {
            contadorClientes.textContent = clientes.length;
        }

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível carregar os clientes.");
    }
}


if (formCliente) {
    formCliente.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        const cliente = {
            nm_cliente: document.getElementById("nomeCliente").value,
            nr_telefone: document.getElementById("telefoneCliente").value,
            ds_email: document.getElementById("emailCliente").value,
            ds_endereco: document.getElementById("enderecoCliente").value
        };

        try {

            await apiFetch("/clientes", {
                method: "POST",
                body: JSON.stringify(cliente)
            });

            alert("Cliente cadastrado com sucesso.");

            formCliente.reset();

            carregarClientes();

        } catch (erro) {
            console.error(erro);
            alert(erro.message);
        }
    });
}


if (pesquisaCliente) {
    pesquisaCliente.addEventListener("input", carregarClientes);
}


carregarClientes();

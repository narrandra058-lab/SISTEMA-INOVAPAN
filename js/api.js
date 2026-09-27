const API_URL = "http://localhost:3000";

async function apiFetch(endpoint, options = {}) {
    const resposta = await fetch(
        `${API_URL}${endpoint}`,
        {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.erro || "Erro na API.");
    }

    return dados;
}

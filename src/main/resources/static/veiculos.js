
// Função global para criar tabela de veículos
window.criarTabelaVeiculo = function (dados) {
    const tabela = document.createElement("table");
    tabela.classList.add("tabela-dados");

    // Cabeçalho
    const cabecalho = document.createElement("tr");
    cabecalho.innerHTML = "<th>Placa</th><th>Cor</th><th>Preço</th><th>Ano</th>";
    tabela.appendChild(cabecalho);

    // Linhas
    dados.forEach(veiculo => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${veiculo.placa}</td>
            <td>${veiculo.cor}</td>
            <td>${veiculo.preco}</td>
            <td>${veiculo.ano}</td>
        `;
        tabela.appendChild(linha);
    });

    return tabela;
};

// Inicializa eventos
window.inicializarEventosVeiculo = function () {
    const novoVeiculoBtn = document.getElementById("novo-veiculo");
    if (novoVeiculoBtn) {
        novoVeiculoBtn.addEventListener("click", () => {
            const modal = document.getElementById("modal-content-veiculo");
            if (modal) modal.style.display = "block";
        });
    }

    const fecharModalBtn = document.getElementById("close-modal");
    if (fecharModalBtn) {
        fecharModalBtn.addEventListener("click", () => {
            const modal = document.getElementById("modal-content-veiculo");
            if (modal) modal.style.display = "none";
        });
    }

    const fabricanteSelect = document.querySelector("#fabricante-modelo");
    if (fabricanteSelect) {
        fabricanteSelect.addEventListener("change", event => {
            const fabricanteId = event.target.value;
            if (typeof carregarModelos === "function") {
                carregarModelos(fabricanteId);
            } else {
                console.warn("Função carregarModelos não está definida.");
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarEventosVeiculo();
});

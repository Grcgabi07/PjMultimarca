
// Função para criar a tabela de veículos
window.criarTabelaVeiculo = function (dados) {
    const tabela = document.createElement("table");
    tabela.classList.add("tabela-dados");

    // Cabeçalho
    const cabecalho = document.createElement("tr");
    cabecalho.innerHTML = `
        <th>Placa</th>
        <th>Cor</th>
        <th>Preço</th>
        <th>Ano</th>
        <th>Modelo</th>
        <th>Ação</th>
    `;
    tabela.appendChild(cabecalho);

    // Linhas
    dados.forEach(veiculo => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${veiculo.placa}</td>
            <td>${veiculo.cor}</td>
            <td>R$ ${veiculo.preco}</td>
            <td>${veiculo.ano}</td>
            <td>${veiculo.modelo ? veiculo.modelo.nome : "N/A"}</td>
        `;

        // Coluna de ações
        const tdAcoes = document.createElement("td");
        tdAcoes.style.display = "flex";
        tdAcoes.style.gap = "8px";

        // Botão Editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn", "edit");
        btnEditar.addEventListener("click", () => abrirModalVeiculo(veiculo));

        // Botão Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.classList.add("btn", "delete");
        btnExcluir.addEventListener("click", async () => {
            const confirmar = confirm(`Deseja excluir o veículo com placa ${veiculo.placa}?`);
            if (!confirmar) return;

            try {
                const resposta = await fetch(`http://localhost:8080/api/veiculos/${veiculo.id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                if (resposta.ok) {
                    linha.remove();
                    alert("Veículo excluído com sucesso!");
                } else {
                    const erro = await resposta.json();
                    alert(`Erro ao excluir: ${erro.message || resposta.statusText}`);
                }
            } catch (erro) {
                alert(`Erro de conexão: ${erro.message}`);
            }
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        linha.appendChild(tdAcoes);
        tabela.appendChild(linha);
    });

    return tabela;
};

// Função para abrir modal e carregar modelos
async function abrirModalVeiculo(veiculo = null) {
    document.getElementById("modal").style.display = "block";

    // Oculta outros modais e mostra apenas o de veículos
    document.getElementById("modal-content-fabricante").style.display = "none";
    document.getElementById("modal-content-modelo").style.display = "none";
    document.getElementById("modal-content-veiculo").style.display = "block";

    // Carregar modelos no select
    const modeloSelect = document.getElementById("modelo-veiculo");
    modeloSelect.innerHTML = '<option value="" disabled selected>Selecione um modelo</option>';

    try {
        const modelos = await getData("http://localhost:8080/api/modelos");
        modelos.forEach(mod => {
            const option = document.createElement("option");
            option.value = mod.id;
            option.textContent = mod.nome;
            modeloSelect.appendChild(option);
        });
    } catch (erro) {
        alert("Erro ao carregar modelos: " + erro.message);
    }

    // Se for edição, preencher os campos
    if (veiculo) {
        document.getElementById("placa-veiculo").value = veiculo.placa;
        document.getElementById("cor-veiculo").value = veiculo.cor;
        document.getElementById("preco-veiculo").value = veiculo.preco;
        document.getElementById("ano-veiculo").value = veiculo.ano;
        document.getElementById("descricao-veiculo").value = veiculo.descricao;
        modeloSelect.value = veiculo.modelo ? veiculo.modelo.id : "";
        document.getElementById("form-veiculo").setAttribute("data-edit-id", veiculo.id);
    } else {
        document.getElementById("form-veiculo").removeAttribute("data-edit-id");
        document.getElementById("form-veiculo").reset();
    }
}

// Fecha modal ao clicar no X
document.getElementById("close-modal").addEventListener("click", () => {
    document.getElementById("modal").style.display = "none";
});

// Botão "Adicionar Veículo"
document.getElementById("novo-veiculo").addEventListener("click", () => abrirModalVeiculo());

// Evento para carregar tabela de veículos
document.getElementById("bt-veiculo").addEventListener("click", async () => {
    setMostrarOcutarElemento(true, ".section");
    setRemoverElementos(".tabela-dados");

    const secVeiculos = document.querySelector("#veiculos");
    secVeiculos.style.display = "block";

    const dadosVeiculos = await getData("http://localhost:8080/api/veiculos");
    if (dadosVeiculos.ok === false) {
        secVeiculos.innerHTML = "<p>Erro ao carregar dados dos Veículos</p>";
        return;
    }
    secVeiculos.appendChild(criarTabelaVeiculo(dadosVeiculos));
});

// Evento para salvar veículo
document.getElementById("form-veiculo").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = this.getAttribute("data-edit-id");
    const placa = document.getElementById("placa-veiculo").value.trim();
    const cor = document.getElementById("cor-veiculo").value.trim();
    const preco = document.getElementById("preco-veiculo").value.trim();
    const ano = document.getElementById("ano-veiculo").value.trim();
    const descricao = document.getElementById("descricao-veiculo").value.trim();
    const modeloId = document.getElementById("modelo-veiculo").value;

    if (!placa || !cor || !preco || !ano || !modeloId) {
        alert("Preencha todos os campos obrigatórios.");
        return;
    }

    let url = "http://localhost:8080/api/veiculos";
    let method = "POST";

    if (id) {
        url = `http://localhost:8080/api/veiculos/${id}`;
        method = "PUT";
    }

    try {
        const resposta = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placa, cor, preco, ano, descricao, modeloId }),
        });

        if (resposta.ok) {
            alert(id ? "Veículo atualizado com sucesso!" : "Veículo adicionado com sucesso!");
            this.removeAttribute("data-edit-id");
            document.getElementById("modal").style.display = "none";
            this.reset();

            // Atualiza a tabela
            const secVeiculos = document.querySelector("#veiculos");
            secVeiculos.innerHTML = "";
            const dadosVeiculos = await getData("http://localhost:8080/api/veiculos");
            secVeiculos.appendChild(criarTabelaVeiculo(dadosVeiculos));
        } else {
            const erro = await resposta.json();
            alert(`Erro: ${erro.message || resposta.statusText}`);
        }
    } catch (erro) {
        alert(`Erro de conexão: ${erro.message}`);
    }
});

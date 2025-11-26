
// Função para criar a tabela de modelos
const criarTabelaModelo = (dados) => {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Título da tabela
    const trTitle = document.createElement("tr");
    const thTitle = document.createElement("th");
    thTitle.textContent = "Modelos";
    thTitle.colSpan = 4;
    thTitle.classList.add("titulo-tabela");
    trTitle.appendChild(thTitle);
    thead.appendChild(trTitle);

    // Cabeçalho
    const cabecalho = ["MODELO", "FABRICANTE", "PAÍS DE ORIGEM", "AÇÃO"];
    const trCabecalho = document.createElement("tr");
    cabecalho.forEach((campo) => {
        const th = document.createElement("th");
        th.textContent = campo;
        trCabecalho.appendChild(th);
    });
    thead.appendChild(trCabecalho);

    // Corpo da tabela
    dados.forEach((item) => {
        const tr = document.createElement("tr");

        // Modelo
        const tdModelo = document.createElement("td");
        tdModelo.textContent = item.nome;
        tr.appendChild(tdModelo);

        // Fabricante
        const tdFabricante = document.createElement("td");
        tdFabricante.textContent = item.fabricante ? item.fabricante.nome : "N/A";
        tr.appendChild(tdFabricante);

        // País de origem
        const tdPais = document.createElement("td");
        tdPais.textContent = item.fabricante ? item.fabricante.paisOrigem : "N/A";
        tr.appendChild(tdPais);

        // Coluna de ações
        const tdAcoes = document.createElement("td");
        tdAcoes.style.display = "flex";
        tdAcoes.style.gap = "8px";
        tdAcoes.style.justifyContent = "center";

        // Botão Editar
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn", "edit");
        btnEditar.style.cursor = "pointer";
        btnEditar.addEventListener("click", function () {
            abrirModalModelo(item);
        });

        // Botão Excluir
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.classList.add("btn", "delete");
        btnExcluir.style.cursor = "pointer";
        btnExcluir.addEventListener("click", async function () {
            const confirmar = confirm(`Tem certeza que deseja excluir o modelo com ID ${item.id}?`);
            if (!confirmar) return;

            try {
                const resposta = await fetch(`http://localhost:8080/api/modelos/${item.id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });

                if (resposta.ok) {
                    tr.remove();
                    alert(`Modelo com ID ${item.id} deletado com sucesso.`);
                } else {
                    const erro = await resposta.json();
                    alert(`Erro ao deletar: ${erro.message || resposta.statusText}`);
                }
            } catch (erro) {
                alert(`Erro de conexão: ${erro.message}`);
            }
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });

    table.classList.add("tabela-dados");
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
};

// Função para abrir modal de modelos e carregar fabricantes
async function abrirModalModelo(item) {
    document.getElementById("modal").style.display = "block";

    // Oculta outros modais e mostra apenas o de modelos
    document.getElementById("modal-content-fabricante").style.display = "none";
    document.getElementById("modal-content-veiculo").style.display = "none";
    document.getElementById("modal-content-modelo").style.display = "block";

    // Carregar fabricantes no select
    const fabricanteSelect = document.getElementById("fabricante-modelo");
    fabricanteSelect.innerHTML = '<option value="" disabled selected>Selecione um fabricante</option>';

    try {
        const fabricantes = await getData("http://localhost:8080/api/fabricantes");
        fabricantes.forEach(fab => {
            const option = document.createElement("option");
            option.value = fab.id;
            option.textContent = fab.nome;
            fabricanteSelect.appendChild(option);
        });
    } catch (erro) {
        alert("Erro ao carregar fabricantes: " + erro.message);
    }

    // Preenche os campos com os dados do modelo
    document.getElementById("nome-modelo").value = item.nome;
    fabricanteSelect.value = item.fabricante ? item.fabricante.id : "";

    // Salva ID para edição
    document.getElementById("form-modelo").setAttribute("data-edit-id", item.id);
}

// Fecha modal ao clicar no X
document.getElementById("close-modal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

// Evento para carregar tabela de modelos
const btnModelo = document.getElementById("bt-modelo");

if (btnModelo) {
    btnModelo.addEventListener("click", async () => {
        setMostrarOcutarElemento(true, ".section");
        setRemoverElementos(".tabela-dados");

        const secModelos = document.querySelector("#modelos");
        if (!secModelos) return;

        secModelos.style.display = "block";

        const dadosModelos = await getData("http://localhost:8080/api/modelos");
        if (dadosModelos.ok === false) {
            secModelos.innerHTML = "<p>Erro ao carregar dados dos Modelos</p>";
            return;
        }
        secModelos.appendChild(criarTabelaModelo(dadosModelos));
    });
}

// Evento para salvar edição ou adicionar novo modelo
document.getElementById("form-modelo").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = this.getAttribute("data-edit-id");
    const nome = document.getElementById("nome-modelo").value.trim();
    const fabricanteId = document.getElementById("fabricante-modelo").value;

    if (!nome || !fabricanteId) {
        alert("Preencha todos os campos.");
        return;
    }

    let url = "http://localhost:8080/api/modelos";
    let method = "POST";

    if (id) {
        url = `http://localhost:8080/api/modelos/${id}`;
        method = "PUT";
    }

    try {
        const resposta = await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, fabricanteId }),
        });

        if (resposta.ok) {
            alert(id ? "Modelo atualizado com sucesso!" : "Modelo adicionado com sucesso!");
            this.removeAttribute("data-edit-id");
            document.getElementById("modal").style.display = "none";
            this.reset();

            // Atualiza a tabela
            const secModelos = document.querySelector("#modelos");
            secModelos.innerHTML = ""; // Limpa
            const dadosModelos = await getData("http://localhost:8080/api/modelos");
            secModelos.appendChild(criarTabelaModelo(dadosModelos));
        } else {
            const erro = await resposta.json();
            alert(`Erro: ${erro.message || resposta.statusText}`);
        }
    } catch (erro) {
        alert(`Erro de conexão: ${erro.message}`);
    }
});

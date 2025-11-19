const criarTabelaModelo = (dados) => {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Título da tabela
    const trTitle = document.createElement("tr");
    const thTitle = document.createElement("th");
    thTitle.textContent = "Modelos";
    thTitle.colSpan = 4; // Agora são 4 colunas
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

        // Botão Deletar
        const tdAcao = document.createElement("td");
        tdAcao.innerHTML = '<button class="btn delete">Deletar</button>';
        tdAcao.querySelector("button").addEventListener("click", async () => {
            const confirmacao = confirm(`Deseja excluir o modelo ${item.nome}?`);
            if (!confirmacao) return;

            try {
                const resposta = await fetch(`http://localhost:8080/api/modelos/${item.id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                if (resposta.ok) {
                    tr.remove();
                    alert(`Modelo ${item.nome} deletado com sucesso.`);
                } else {
                    const erro = await resposta.json();
                    alert(`Erro ao deletar: ${erro.message || resposta.statusText}`);
                }
            } catch (erro) {
                alert(`Erro de conexão: ${erro.message}`);
            }
        });

        tr.appendChild(tdAcao);
        tbody.appendChild(tr);
    });

    table.classList.add("tabela-dados");
    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
};

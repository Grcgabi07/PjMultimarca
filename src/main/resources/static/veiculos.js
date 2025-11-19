

// ============================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================

document.addEventListener("DOMContentLoaded", inicializarEventosVeiculo);

// ============================================================
// FUNÇÃO PRINCIPAL PARA INICIALIZAR EVENTOS DO VEÍCULO
// ============================================================

function inicializarEventosVeiculo() {
    // ============================================================
    // Função para carregar todos os dados relacionados ao veículo
    // ============================================================
    function carregarDadosVeiculo() {
        // Lógica para carregar os dados do veículo
    }

    // ============================================================
    // EVENTO PARA ABRIR MODAL DE EDIÇÃO DO VEÍCULO
    // ============================================================
    document.querySelector("#editarVeiculo").addEventListener("click", function(event) {
        event.preventDefault();
        document.querySelector("#modal-editar-veiculo").style.display = "block";
        carregarDadosVeiculo();
    });

    // ============================================================
    // EVENTO PARA FECHAR MODAL
    // ============================================================
    document.querySelector("#fecharModalVeiculo").addEventListener("click", function(event) {
        event.preventDefault();
        document.querySelector("#modal-editar-veiculo").style.display = "none";
    });

    // ============================================================
    // EVENTO PARA VALIDAR PLACA (FORMATO MERCOSUL)
    // ============================================================
    document.querySelector("#placaVeiculo").addEventListener("input", function(event) {
        let valor = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (valor.length > 7) valor = valor.slice(0, 7);
        event.target.value = valor;
    });

    // ============================================================
    // EVENTO PARA VERIFICAR SE PLACA JÁ EXISTE NO SISTEMA
    // ============================================================
    document.querySelector("#placaVeiculo").addEventListener("blur", async function(event) {
        const placa = event.target.value;
        if (placa.length === 7) {
            const response = await fetch(`/api/verificarPlaca/${placa}`);
            const existe = await response.json();
            if (existe) {
                alert("Placa já cadastrada no sistema. Verifique se o veículo já existe.");
                event.target.style.borderColor = "red";
            } else {
                event.target.style.borderColor = "green";
            }
        }
    });

    // ============================================================
    // EVENTO PARA SALVAR ALTERAÇÕES DO VEÍCULO
    // ============================================================
    document.querySelector("#salvarVeiculo").addEventListener("click", async function(event) {
        event.preventDefault();
        const modelo = document.querySelector("#modeloVeiculo").value;
        const ano = document.querySelector("#anoVeiculo").value;
        const placa = document.querySelector("#placaVeiculo").value;

        const dados = { modelo, ano, placa };

        const response = await fetch("/api/salvarVeiculo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        const resultado = await response.json();
        if (resultado.sucesso) {
            alert("Veículo salvo com sucesso!");
            document.querySelector("#modal-editar-veiculo").style.display = "none";
        } else {
            alert("Erro ao salvar veículo: " + resultado.mensagem);
        }
    });
}

// ============================================================
// FUNÇÕES DE VALIDAÇÃO DE VEÍCULO
// ============================================================

function validarPlaca(placa) {
    const regex = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/; // Formato Mercosul
    return regex.test(placa);
}

function validarAno(ano) {
    const anoAtual = new Date().getFullYear();
    return ano >= 1900 && ano <= anoAtual;
}

function validarModelo(modelo) {
    return modelo.trim().length > 0;
}

// ============================================================
// FUNÇÃO PARA LIMPAR CAMPOS DO FORMULÁRIO
// ============================================================

function limparFormularioVeiculo() {
    document.querySelector("#placaVeiculo").value = "";
    document.querySelector("#modeloVeiculo").value = "";
    document.querySelector("#anoVeiculo").value = "";
}

// ============================================================
// EVENTO PARA INICIALIZAR AO CARREGAR A PÁGINA
// ============================================================

document.addEventListener("DOMContentLoaded", function() {
    inicializarEventosVeiculo();
});

// ============================================================
// FUNÇÕES PARA CARREGAR FABRICANTES E MODELOS
// ============================================================

async function carregarFabricantes() {
    const response = await fetch("/api/fabricantes");
    const fabricantes = await response.json();
    const selectFabricante = document.querySelector("#fabricanteVeiculo");
    selectFabricante.innerHTML = "";
    fabricantes.forEach(fabricante => {
        const option = document.createElement("option");
        option.value = fabricante.id;
        option.textContent = fabricante.nome;
        selectFabricante.appendChild(option);
    });
}

async function carregarModelos(fabricanteId) {
    const response = await fetch(`/api/modelos/${fabricanteId}`);
    const modelos = await response.json();
    const selectModelo = document.querySelector("#modeloVeiculo");
    selectModelo.innerHTML = "";
    modelos.forEach(modelo => {
        const option = document.createElement("option");
        option.value = modelo.id;
        option.textContent = modelo.nome;
        selectModelo.appendChild(option);
    });
}

// ============================================================
// EVENTOS PARA ATUALIZAR MODELOS AO SELECIONAR FABRICANTE
// ============================================================

document.querySelector("#fabricanteVeiculo").addEventListener("change", function(event) {
    const fabricanteId = event.target.value;
    carregarModelos(fabricanteId);
});

// ============================================================
// FUNÇÃO PARA VALIDAR CAMPOS DO VEÍCULO
// ============================================================

function validarCamposVeiculo() {
    const placa = document.querySelector("#placaVeiculo").value.trim();
    const modelo = document.querySelector("#modeloVeiculo").value.trim();
    const ano = document.querySelector("#anoVeiculo").value.trim();

    if (!validarPlaca(placa)) {
        return { valido: false, mensagem: "Placa inválida. Use o formato ABC1D23 (Mercosul)." };
    }

    if (!validarAno(parseInt(ano))) {
        return { valido: false, mensagem: "Ano inválido. Informe um ano entre 1900 e o atual." };
    }

    if (!validarModelo(modelo)) {
        return { valido: false, mensagem: "Modelo não pode estar vazio." };
    }

    return { valido: true, mensagem: "" };
}

// ============================================================
// FUNÇÃO PARA LIMPAR FORMULÁRIO DE VEÍCULO
// ============================================================

function limparFormularioVeiculo() {
    document.querySelector("#placaVeiculo").value = "";
    document.querySelector("#modeloVeiculo").value = "";
    document.querySelector("#anoVeiculo").value = "";
}

// ============================================================
// EVENTO PARA CARREGAR FABRICANTES AO ABRIR MODAL
// ============================================================

document.querySelector("#abrirModalVeiculo").addEventListener("click", async function() {
    await carregarFabricantes();
    document.querySelector("#modal-editar-veiculo").style.display = "block";
});

// ============================================================
// FUNÇÃO PARA CARREGAR FABRICANTES
// ============================================================

async function carregarFabricantes() {
    const response = await fetch("/api/fabricantes");
    const fabricantes = await response.json();
    const selectFabricante = document.querySelector("#fabricanteVeiculo");
    selectFabricante.innerHTML = "<option value=''>Selecione</option>";

    fabricantes.forEach(fabricante => {
        const option = document.createElement("option");
        option.value = fabricante.id;
        option.textContent = fabricante.nome;
        selectFabricante.appendChild(option);
    });
}

// ============================================================
// FUNÇÃO PARA CARREGAR MODELOS COM BASE NO FABRICANTE
// ============================================================

async function carregarModelos(fabricanteId) {
    const response = await fetch(`/api/modelos/${fabricanteId}`);
    const modelos = await response.json();
    const selectModelo = document.querySelector("#modeloVeiculo");
    selectModelo.innerHTML = "<option value=''>Selecione</option>";

    modelos.forEach(modelo => {
        const option = document.createElement("option");
        option.value = modelo.id;
        option.textContent = modelo.nome;
        selectModelo.appendChild(option);
    });
}

// ============================================================
// EVENTO PARA ATUALIZAR MODELOS AO SELECIONAR FABRICANTE
// ============================================================

document.querySelector("#fabricanteVeiculo").addEventListener("change", function(event) {
    const fabricanteId = event.target.value;
    if (fabricanteId) {
        carregarModelos(fabricanteId);
    }
});

   // ============================================================
// FUNÇÃO PARA VALIDAR CAMPOS DO VEÍCULO
// ============================================================

function validarCamposVeiculo() {
    const placa = document.querySelector("#placaVeiculo").value.trim();
    const modelo = document.querySelector("#modeloVeiculo").value.trim();
    const ano = document.querySelector("#anoVeiculo").value.trim();

    if (!validarPlaca(placa)) {
        return { valido: false, mensagem: "Placa inválida. Use o formato ABC1D23 (Mercosul)." };
    }

    if (!validarAno(parseInt(ano))) {
        return { valido: false, mensagem: "Ano inválido. Informe um ano entre 1900 e o atual." };
    }

    if (!validarModelo(modelo)) {
        return { valido: false, mensagem: "Modelo não pode estar vazio." };
    }

    return { valido: true, mensagem: "" };
}

// ============================================================
// FUNÇÃO PARA LIMPAR FORMULÁRIO DE VEÍCULO
// ============================================================

function limparFormularioVeiculo() {
    document.querySelector("#placaVeiculo").value = "";
    document.querySelector("#modeloVeiculo").value = "";
    document.querySelector("#anoVeiculo").value = "";
}

// ============================================================
// EVENTO PARA CARREGAR FABRICANTES AO ABRIR MODAL
// ============================================================

document.querySelector("#abrirModalVeiculo").addEventListener("click", async function() {
    await carregarFabricantes();
    document.querySelector("#modal-editar-veiculo").style.display = "block";
});

// ============================================================
// FUNÇÃO PARA CARREGAR FABRICANTES
// ============================================================

async function carregarFabricantes() {
    const response = await fetch("/api/fabricantes");
    const fabricantes = await response.json();
    const selectFabricante = document.querySelector("#fabricanteVeiculo");
    selectFabricante.innerHTML = "<option value=''>Selecione</option>";

    fabricantes.forEach(fabricante => {
        const option = document.createElement("option");
        option.value = fabricante.id;
        option.textContent = fabricante.nome;
        selectFabricante.appendChild(option);
    });
}

// ============================================================
// FUNÇÃO PARA CARREGAR MODELOS COM BASE NO FABRICANTE
// ============================================================

async function carregarModelos(fabricanteId) {
    const response = await fetch(`/api/modelos/${fabricanteId}`);
    const modelos = await response.json();
    const selectModelo = document.querySelector("#modeloVeiculo");
    selectModelo.innerHTML = "<option value=''>Selecione</option>";

    modelos.forEach(modelo => {
        const option = document.createElement("option");
        option.value = modelo.id;
        option.textContent = modelo.nome;
        selectModelo.appendChild(option);
    });
}

// ============================================================
// EVENTO PARA ATUALIZAR MODELOS AO SELECIONAR FABRICANTE
// ============================================================

document.querySelector("#fabricanteVeiculo").addEventListener("change", function(event) {
    const fabricanteId = event.target.value;
    if (fabricanteId) {
        carregarModelos(fabricanteId);
    }
});
 // ============================================================
// FUNÇÃO PARA CARREGAR LISTA DE VEÍCULOS NA TABELA
// ============================================================

async function carregarListaVeiculos() {
    const response = await fetch("/api/veiculos");
    const veiculos = await response.json();

    const tabela = document.querySelector("#tabelaVeiculos tbody");
    tabela.innerHTML = "";

    veiculos.forEach(veiculo => {
        const tr = document.createElement("tr");

        const tdPlaca = document.createElement("td");
        tdPlaca.textContent = veiculo.placa;
        tr.appendChild(tdPlaca);

        const tdModelo = document.createElement("td");
        tdModelo.textContent = veiculo.modelo;
        tr.appendChild(tdModelo);

        const tdAno = document.createElement("td");
        tdAno.textContent = veiculo.ano;
        tr.appendChild(tdAno);

        const tdAcoes = document.createElement("td");
        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn-editar");
        btnEditar.addEventListener("click", function() {
            abrirModalEdicao(veiculo);
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.classList.add("btn-excluir");
        btnExcluir.addEventListener("click", function() {
            excluirVeiculo(veiculo.id);
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        tr.appendChild(tdAcoes);

        tabela.appendChild(tr);
    });
}

// ============================================================
// FUNÇÃO PARA ABRIR MODAL DE EDIÇÃO COM DADOS DO VEÍCULO
// ============================================================

function abrirModalEdicao(veiculo) {
    document.querySelector("#placaVeiculo").value = veiculo.placa;
    document.querySelector("#modeloVeiculo").value = veiculo.modelo;
    document.querySelector("#anoVeiculo").value = veiculo.ano;
    document.querySelector("#modal-editar-veiculo").style.display = "block";
}

// ============================================================
// FUNÇÃO PARA EXCLUIR VEÍCULO
// ============================================================

async function excluirVeiculo(id) {
    if (!confirm("Deseja realmente excluir este veículo?")) return;

    const response = await fetch(`/api/excluirVeiculo/${id}`, {
        method: "DELETE"
    });

    const resultado = await response.json();
    if (resultado.sucesso) {
        alert("Veículo excluído com sucesso!");
        carregarListaVeiculos();
    } else {
        alert("Erro ao excluir veículo: " + resultado.mensagem);
    }
}

// ============================================================
// EVENTO PARA CARREGAR LISTA AO INICIAR
// ============================================================

document.addEventListener("DOMContentLoaded", carregarListaVeiculos);

// ============================================================
// FUNÇÃO PARA GERAR TABELA DE VEÍCULOS DINAMICAMENTE
// ============================================================

function gerarTabelaVeiculos(veiculos) {
    const tabela = document.querySelector("#tabelaVeiculos tbody");
    tabela.innerHTML = "";

    veiculos.forEach(veiculo => {
        const tr = document.createElement("tr");

        // Coluna Placa
        const tdPlaca = document.createElement("td");
        tdPlaca.textContent = veiculo.placa;
        tr.appendChild(tdPlaca);

        // Coluna Modelo
        const tdModelo = document.createElement("td");
        tdModelo.textContent = veiculo.modelo;
        tr.appendChild(tdModelo);

        // Coluna Ano
        const tdAno = document.createElement("td");
        tdAno.textContent = veiculo.ano;
        tr.appendChild(tdAno);

        // Coluna Ações
        const tdAcoes = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "Editar";
        btnEditar.classList.add("btn-editar");
        btnEditar.addEventListener("click", () => abrirModalEdicao(veiculo));

        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "Excluir";
        btnExcluir.classList.add("btn-excluir");
        btnExcluir.addEventListener("click", () => excluirVeiculo(veiculo.id));

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);
        tr.appendChild(tdAcoes);

        tabela.appendChild(tr);
    });
}

// ============================================================
// FUNÇÃO PARA ATUALIZAR LISTA DE VEÍCULOS
// ============================================================

async function atualizarListaVeiculos() {
    const response = await fetch("/api/veiculos");
    const veiculos = await response.json();
    gerarTabelaVeiculos(veiculos);
}

// ============================================================
// EVENTO PARA ATUALIZAR LISTA AO CARREGAR PÁGINA
// ============================================================

document.addEventListener("DOMContentLoaded", atualizarListaVeiculos);

// ============================================================
// FUNÇÃO PARA ABRIR MODAL DE CADASTRO DE VEÍCULO
// ============================================================

function abrirModalCadastro() {
    limparCamposFormularioVeiculo();
    document.querySelector("#modal-editar-veiculo").style.display = "block";
}

// ============================================================
// EVENTO PARA BOTÃO DE NOVO VEÍCULO
// ============================================================

document.querySelector("#btnNovoVeiculo").addEventListener("click", abrirModalCadastro);

// ============================================================
// FINAL DO SCRIPT
// ============================================================

// ============================================================
// FUNÇÃO PARA FILTRAR VEÍCULOS POR PLACA OU MODELO
// ============================================================

document.querySelector("#filtroVeiculo").addEventListener("input", async function(event) {
    const termo = event.target.value.toLowerCase();

    const response = await fetch("/api/veiculos");
    const veiculos = await response.json();

    const filtrados = veiculos.filter(v =>
        v.placa.toLowerCase().includes(termo) ||
        v.modelo.toLowerCase().includes(termo)
    );

    gerarTabelaVeiculos(filtrados);
});

// ============================================================
// FUNÇÃO PARA FECHAR MODAL AO CLICAR NO BOTÃO DE CANCELAR
// ============================================================

document.querySelector("#btnCancelarModal").addEventListener("click", function() {
    document.querySelector("#modal-editar-veiculo").style.display = "none";
});

// ============================================================
// FUNÇÃO PARA FECHAR MODAL AO CLICAR FORA DA ÁREA DO MODAL
// ============================================================

window.addEventListener("click", function(event) {
    const modal = document.querySelector("#modal-editar-veiculo");
    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// ============================================================
// FINAL DO SCRIPT - TODAS AS FUNÇÕES E EVENTOS CARREGADOS
// ============================================================

console.log("Script de gerenciamento de veículos carregado com sucesso!");
 // ============================================================
// EVENTO PARA RECARREGAR LISTA DE VEÍCULOS APÓS QUALQUER AÇÃO
// ============================================================

document.addEventListener("updateListaVeiculos", atualizarListaVeiculos);

// ============================================================
// FINAL DO SCRIPT - TODAS AS FUNÇÕES E EVENTOS CARREGADOS
// ============================================================

console.log("Sistema de gerenciamento de veículos finalizado.");

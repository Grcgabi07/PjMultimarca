
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const CLOSE_MODAL_BUTTON = document.getElementById("close-modal");
    const btnHome = document.getElementById("bt-home");
    const btnFabricante = document.getElementById("bt-fabricante");
    const btnNovoFabricante = document.getElementById("novo-fabricante");
    const btnNovoModelo = document.getElementById("novo-modelo");
    const btnNovoVeiculo = document.getElementById("novo-veiculo");
    const formFabricante = document.getElementById("form-fabricante");
    const tituloModalFabricante = document.getElementById("modal-title-fabricante");

    // Variável global para armazenar ID do fabricante em edição
    let fabricanteEmEdicao = null;

    // Função para abrir modal
    function abrirModal(selector) {
        setMostrarOcutarElemento(true, ".modal-content");
        if (modal) modal.style.display = "block";
        setMostrarOcutarElemento(false, selector);
    }

    // Fechar modal
    if (CLOSE_MODAL_BUTTON && modal && formFabricante) {
        CLOSE_MODAL_BUTTON.addEventListener("click", () => {
            modal.style.display = "none";
            fabricanteEmEdicao = null;
            formFabricante.removeAttribute("data-edit-id");
        });
    }

    // Botão Home
    if (btnHome) {
        btnHome.addEventListener("click", () => setMostrarOcutarElemento(true, ".section"));
    }

    // Botão Fabricantes
    if (btnFabricante) {
        btnFabricante.addEventListener("click", async () => {
            setMostrarOcutarElemento(true, ".section");
            setRemoverElementos(".tabela-dados");

            const secFabricantes = document.querySelector("#fabricantes");
            if (!secFabricantes) return;

            secFabricantes.style.display = "block";

            const dadosFabricante = await getData("http://localhost:8080/api/fabricantes");
            if (dadosFabricante.ok === false) {
                secFabricantes.innerHTML = "<p>Erro ao carregar dados dos Fabricantes</p>";
                return;
            }
            secFabricantes.appendChild(criarTabelaFabricante(dadosFabricante));
        });
    }

    // Atualizar título no modal (verificação segura)
    if (tituloModalFabricante) {
        tituloModalFabricante.textContent = "Adicionar Novo Fabricante";
    }

    // Botão Novo Fabricante
    if (btnNovoFabricante) {
        btnNovoFabricante.addEventListener("click", async () => {
            abrirModal("#modal-content-fabricante");
            if (tituloModalFabricante) {
                tituloModalFabricante.textContent = "Adicionar Novo Fabricante";
            }

            // Carregar países no select
            const dadosPaises = await getData("http://localhost:8080/paises.json");
            const selectPais = document.getElementById("pais-fabricante");
            if (!selectPais) return;

            setRemoverElementos("#pais-fabricante option");
            dadosPaises.forEach(pais => {
                const option = document.createElement("option");
                option.value = pais.sigla;
                option.textContent = pais.nome_pais;
                selectPais.appendChild(option);
            });
        });
    }


    //let resultado;
    //if (fabricanteEmEdicao) {
        //resultado = await putData("http://localhost:8080/api/fabricantes/${fabricanteEmEdicao}", Fabricante)
       // } else {
      //      resultado = await postData("http://localhost:8080/api/fabricantes",Fabricantes) ;
      //  }
    

    // Submit do formulário Fabricante (POST ou PUT)
    if (formFabricante) {
        formFabricante.addEventListener("submit", async function (event) {
            event.preventDefault();

            const id = this.getAttribute("data-edit-id");
            const nome = document.getElementById("nome-fabricante")?.value.trim();
            const paisOrigem = document.getElementById("pais-fabricante")?.value;

            if (!nome || !paisOrigem) {
                alert("Preencha todos os campos.");
                return;
            }

            let url = "http://localhost:8080/api/fabricantes";
            let method = "POST";

            if (id) {
                url = `http://localhost:8080/api/fabricantes/${id}`;
                method = "PUT";
            }

            const resposta = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, paisOrigem })
            });

            if (resposta.ok) {
                alert(id ? "Fabricante atualizado com sucesso!" : "Fabricante adicionado com sucesso!");
                this.removeAttribute("data-edit-id");
                if (modal) modal.style.display = "none";
                this.reset();
                btnFabricante?.click(); // Recarrega tabela
            } else {
                alert("Erro ao salvar fabricante.");
            }
        });
    }



    // Botão Novo Modelo
    if (btnNovoModelo) {
        btnNovoModelo.addEventListener("click", async () => {
            abrirModal("#modal-content-modelo");

            const dadosFabricantes = await getData("http://localhost:8080/api/fabricantes");
            const selectFabricante = document.getElementById("fabricante-modelo");
            if (!selectFabricante) return;

            setRemoverElementos("#fabricante-modelo option");
            dadosFabricantes.forEach(fabricante => {
                const option = document.createElement("option");
                option.value = fabricante.id;
                option.textContent = fabricante.nome;
                option.ariaLabel = fabricante.paisOrigem;
                selectFabricante.appendChild(option);
            });
        });
    }

    // Botão Novo Veículo
    if (btnNovoVeiculo) {
        btnNovoVeiculo.addEventListener("click", async () => {
            abrirModal("#modal-content-veiculo");

            const dadosModelos = await getData("http://localhost:8080/api/modelos");
            const selectModelo = document.getElementById("modelo-veiculo");
            if (!selectModelo) return;

            setRemoverElementos("#modelo-veiculo option");
            dadosModelos.forEach(modelo => {
                const option = document.createElement("option");
                option.value = modelo.id;
                option.textContent = modelo.nome;
                option.ariaLabel = modelo.fabricante?.nome || "Sem fabricante";
                selectModelo.appendChild(option);
            });
        });
    }
});

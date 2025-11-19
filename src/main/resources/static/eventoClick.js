const modal = document.getElementById("modal");
const CLOSE_MODAL_BUTTON = document.getElementById("close-modal");


// Evento de clique no botão fabricantes
document.getElementById("bt-fabricante").addEventListener("click", async function(event) {
    setMostrarOcutarElemento(true, ".section");
    setRemoverElementos(".tabela-dados");
    document.querySelector("#fabricantes").style.display = "block";
    const dadosFabricante = await getData("http://localhost:8080/api/fabricantes");
    if(dadosFabricante.ok === false) {
        document.querySelector("#fabricantes").innerHTML = "<p>Erro ao carregar dados dos Fabrincantes</p>";
        document.querySelector("#fabricantes").style.color = "red";
        return;
    }
    document.querySelector("#fabricantes").appendChild(criarTabelaFabricante(dadosFabricante));
});
 
// Evento de clique no botão modelos
document.getElementById("bt-modelo").addEventListener("click", async function(event) {
    setMostrarOcutarElemento(true, ".section");
    setRemoverElementos(".tabela-dados");
    document.querySelector("#modelos").style.display = "block";
    const dadosModelo = await getData("http://localhost:8080/api/modelos");
    if(dadosModelo.ok === false) {
        document.querySelector("#modelos").innerHTML = "<p>Erro ao carregar dados dos Modelos</p>";
        document.querySelector("#modelos").style.color = "red";
        return;
    }
    document.querySelector("#modelos").appendChild(criarTabelaModelo(dadosModelo));
});

// Evento de clique no botão veículos
document.getElementById("bt-veiculo").addEventListener("click", async function(event) {
    setMostrarOcutarElemento(true, ".section");
    setRemoverElementos(".tabela-dados");
    document.querySelector("#veiculos").style.display = "block";
    const dadosVeiculo = await getData("http://localhost:8080/api/veiculos");
    document.querySelector("#veiculos").appendChild(criarTabelaVeiculo(dadosVeiculo));

});


//evento de clique botão enviar formulario fabricante
document.getElementById("form-fabricante").addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome_fabricante = document.getElementById("nome-fabricante").value;
    const pais_origem = document.getElementById("pais-fabricante").value;


    const require = await fetch("http://localhost:8080/api/fabricantes", {
        method: "POST",
        
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
             nome: nome_fabricante,
             paisOrigem: pais_origem
        })
    });

    if (require.status === 409) {
        alert("Conflito: O fabricante já existe ou há um problema com os dados enviados.");
    } else if (require.ok) {
        alert("Fabricante adicionado com sucesso!");
        modal.style.display = "none";
    } else {
        alert("Erro ao adicionar fabricante.");
    }
});



//evento de clique botão enviar formulario modelo
document.getElementById("form-modelo").addEventListener("submit", async function(event) {

    event.preventDefault();
    const nome_modelo = document.getElementById("nome-modelo").value;
    const fabricante_id = document.getElementById("fabricante-modelo").value;
    const require = await fetch("http://localhost:8080/api/modelos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
             nome: nome_modelo,
             fabricante: {
                id: fabricante_id
            }
        })
    });
    if (require.status === 409) {
        alert("Conflito: O modelo já existe ou há um problema com os dados enviados.");
        console.log(nome_modelo, fabricante_id);
    } else if (require.ok) {
        alert("Modelo adicionado com sucesso!" + nome_modelo, fabricante_id);
        modal.style.display = "none";
    } else {
        alert("Erro ao adicionar modelo.");
    }
});


//evento de clique botão enviar formulario veículo
document.getElementById("form-veiculo").addEventListener("submit", async function(event) {
    event.preventDefault();
    const placa_veiculo = document.getElementById("placa-veiculo").value;
    const cor_veiculo = document.getElementById("cor-veiculo").value;
    const preco_veiculo = document.getElementById("preco-veiculo").value;
    const ano_veiculo = document.getElementById("ano-veiculo").value;
    const descricao_veiculo = document.getElementById("descricao-veiculo").value;
    const modelo_id = document.getElementById("modelo-veiculo").value;

    const require = await fetch("http://localhost:8080/api/veiculos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
             placa: placa_veiculo,
             cor: cor_veiculo,
             valor: preco_veiculo,
             ano: ano_veiculo,
             descricao: descricao_veiculo,
             modelo: {
                id: modelo_id
            }
        }),    

    });

    console.log(placa_veiculo, cor_veiculo, preco_veiculo, ano_veiculo, descricao_veiculo, modelo_id);

    if (require.status === 409) {
        alert("Conflito: O veículo já existe ou há um problema com os dados enviados.");
    } else if (require.ok) {
        alert("Veículo adicionado com sucesso!");
        modal.style.display = "none";
    } else {
        alert("Erro ao adicionar veículo.");
    }
});

//carga dos fabricantes para o select do formulario modelo
document.getElementById("novo-modelo").addEventListener("click", async function() {
    setMostrarOcutarElemento(true, ".modal-content");
    
            const dadosFabricantes = await getData("http://localhost:8080/api/fabricantes");
        if (dadosFabricantes.status === 400 || dadosFabricantes.error) {
            alert("Erro ao carregar fabricantes para o formulário de modelo.");
            return;
        }

        dadosFabricantes.forEach(function(fabricante) {
            const option = document.createElement("option");
            option.value = fabricante.id;
            option.textContent = fabricante.nome;
            option.ariaLabel = fabricante.paisOrigem;
            document.getElementById("fabricante-modelo").appendChild(option);
        });

        modal.style.display = "block";
        setMostrarOcutarElemento(false, ".modal-content-modelo");
} );
    const selectFabricante = document.getElementById("fabricante-modelo");



//evento de clique no botão fechar modal
CLOSE_MODAL_BUTTON.addEventListener("click", function() {
    modal.style.display = "none";
});

//evento de clique no botão adicionar fabricante
document.getElementById("novo-fabricante").addEventListener("click", async function(event) {
    setMostrarOcutarElemento(true, ".modal-content");
    modal.style.display = "block";
    setMostrarOcutarElemento(false, "#modal-content-fabricante");

    //carregar json com nomes e paises do arquivo externo json
 
    const dadosPaises = await getData("http://localhost:8080/paises.json");
    const selectPais = document.getElementById("pais-fabricante");
    setRemoverElementos("#pais-fabricante option");
    dadosPaises.forEach(function(pais) {    
        const option = document.createElement("option");
        option.value = pais.sigla;
        option.textContent = pais.nome_pais;
        selectPais.appendChild(option);
    });
 
    modal.style.display = "block";
    setMostrarOcutarElemento(false, "#modal-content-fabricante");
 });

 //evento de clique no botão adicionar modelo
 document.getElementById("novo-modelo").addEventListener("click", async function(event) {
    setMostrarOcutarElemento(true, ".modal-content");
    modal.style.display = "block";
    setMostrarOcutarElemento(false, "#modal-content-modelo");
 } );

 //evento de clique no botão adicionar veículo
 document.getElementById("novo-veiculo").addEventListener("click", async function(event) {
    setMostrarOcutarElemento(true, ".modal-content");
    modal.style.display = "block";
    setMostrarOcutarElemento(false, "#modal-content-veiculo");

    const dadosModelos = await getData("http://localhost:8080/api/modelos");
    if (dadosModelos.status === 400 || dadosModelos.error) {
        alert("Erro ao carregar modelos para o formulário de veículo.");
        return;
    }

    const dadosFabricantes = await getData("http://localhost:8080/api/fabricantes");
    if (dadosFabricantes.status === 400 || dadosFabricantes.error) {
        alert("Erro ao carregar fabricantes para o formulário de veículo.");
        return;
    }

    dadosModelos.forEach(function(modelo) {
        const option = document.createElement("option");
        option.value = modelo.id;
        option.textContent = modelo.nome;
        option.ariaLabel = modelo.fabricante.nome;
        document.getElementById("modelo-veiculo").appendChild(option);
    });
      
      document.addEventListener("DOMContentLoaded", () => {
    const modalDelete = document.getElementById("modal-delete");
    const confirmBtn = document.getElementById("confirm-delete");
    const cancelBtn = document.getElementById("cancel-delete");
    const deleteMessage = document.getElementById("delete-message");

    let itemIdToDelete = null;
    let itemTypeToDelete = null;

    // Abrir modal ao clicar no botão deletar
    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", () => {
            itemIdToDelete = btn.getAttribute("data-id");
            itemTypeToDelete = btn.getAttribute("data-type");
            deleteMessage.textContent = `Deseja deletar este ${itemTypeToDelete}?`;
            modalDelete.style.display = "flex";
        });
    });

    // Confirmar exclusão
    confirmBtn.addEventListener("click", () => {
        console.log(`Deletando ${itemTypeToDelete} com ID: ${itemIdToDelete}`);
        // Aqui você pode chamar sua função para remover do banco ou da tabela
        modalDelete.style.display = "none";
    });

    // Cancelar exclusão
    cancelBtn.addEventListener("click", () => {
        modalDelete.style.display = "none";
        itemIdToDelete = null;
        itemTypeToDelete = null;
    });
});
   

 } );  

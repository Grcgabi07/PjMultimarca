
/*
    Função para mostrar e ocultar elementos
    Parametros:
    esconder: boolean - true para esconder, false para mostrar
    elemento: string - classe ou id do elemento a ser manipulado
    Exemplo de uso:
    setMostrarOcutarElemento(true, ".minha-classe");
*/
const setMostrarOcutarElemento = function(esconder, elemento) {
    document.querySelectorAll(elemento).forEach(function(section) {
        section.style.display = esconder ? "none" : "block";
    });
}

const setRemoverElementos = function(elemento) {
    document.querySelectorAll(elemento).forEach(function(item) {
        item.remove();
    });
}

// COLUNA DE AÇÃOES COM BOTÕES EDITAR E EXCLUIR
 const tdAcoes = document.createElement("td");
 tdAcoes.style.display = "flex";
 tdAcoes.style.gap = "5px";

 // botão editar
 const btnEditar = document.createElement("button");
 btnEditar.textContent = "Editar";
 btnEditar.classList.add("btn", "edit");
 btnEditar.style.cursor = "pointer";
 btnEditar.addEventListener("click", async function(event) {
    alert("Função de editar para o item ID." + item.id);
 });
 
 //botão excluir
 const btnExcluir = document.createElement("button");
    btnExcluir.textContent = "Excluir";
    btnExcluir.classList.add("btn", "delete");
    btnExcluir.style.cursor = "pointer";
    btnExcluir.addEventListener("click", async function(event) {
        const confirmar = confirm("Tem certeza que deseja excluir o item ID." + item.id + "?");
        if (confirmar) {
            try {
                const resposta = await fetch(`/api/itens/${item.id}`, {
                    method: "DELETE"
                });
                if (resposta.ok) {
                    alert("Item excluído com sucesso!");
                    // Recarregar ou atualizar a tabela aqui
                } else {
                    alert("Erro ao excluir o item.");
                }
            } catch (erro) {
                console.error("Erro na requisição:", erro);
                alert("Erro ao excluir o item.");
            }
        }
    });

const criarTabelaFabricante = function (dados) {
  const tabela = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Cabeçalho principal
  const trTitle = document.createElement("tr");
  const thTitle = document.createElement("th");
  thTitle.textContent = "Fabricantes";
  thTitle.colSpan = 4;
  trTitle.appendChild(thTitle);
  thead.appendChild(trTitle);

  // Cabeçalho das colunas
  const cabecalho = ["ID", "Fabricante", "País de Origem", "Ação"];
  const trCabecalho = document.createElement("tr");
  cabecalho.forEach(function (campo) {
      const th = document.createElement("th");
      th.textContent = campo;
      trCabecalho.appendChild(th);
  });
  thead.appendChild(trCabecalho);

  // Estilização da tabela
  tabela.classList.add("tabela-dados");
  tabela.appendChild(thead);

  // Corpo da tabela
  dados.forEach(function (item) {
      const tr = document.createElement("tr");

      // ID
      const tdId = document.createElement("td");
      tdId.textContent = item.id;
      tr.appendChild(tdId);

      // Fabricante
      const tdFabricante = document.createElement("td");
      tdFabricante.textContent = item.nome;
      tr.appendChild(tdFabricante);

      // País de origem
      const tdPaisOrigem = document.createElement("td");
      tdPaisOrigem.textContent = item.paisOrigem;
      tr.appendChild(tdPaisOrigem);

      // Coluna de ações
      const tdAcoes = document.createElement("td");
      tdAcoes.style.display = "flex";
      tdAcoes.style.gap = "5px";

      // Botão Editar
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.classList.add("btn", "edit");
      btnEditar.style.cursor = "pointer";
      btnEditar.addEventListener("click", function () {
          // Preencher modal com dados do fabricante
          document.getElementById("nome-fabricante").value = item.nome;
          document.getElementById("pais-fabricante").value = item.paisOrigem;

          // Exibir modal
          document.getElementById("modal").style.display = "block";

          // Salvar ID para edição
          document.getElementById("form-fabricante").setAttribute("data-edit-id", item.id);
      });

      // Botão Excluir
      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.classList.add("btn", "delete");
      btnExcluir.style.cursor = "pointer";
      btnExcluir.addEventListener("click", async function () {
          const confirmar = confirm(`Tem certeza que deseja excluir o fabricante com ID ${item.id}?`);
          if (!confirmar) return;

          try {
              const resposta = await fetch(`http://localhost:8080/api/fabricantes/${item.id}`, {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
              });

              if (resposta.ok) {
                  tr.remove();
                  alert(`Fabricante com ID ${item.id} deletado com sucesso.`);
              } else {
                  const erro = await resposta.json();
                  alert(`Erro ao deletar: ${erro.message || resposta.statusText}`);
              }
          } catch (erro) {
              alert(`Erro de conexão: ${erro.message}`);
          }
      });

      // Adiciona botões à célula
      tdAcoes.appendChild(btnEditar);
      tdAcoes.appendChild(btnExcluir);
      tr.appendChild(tdAcoes);

      tbody.appendChild(tr);
  });

  tabela.appendChild(tbody);
  return tabela;
};

document.getElementById("form-fabricante").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = this.getAttribute("data-edit-id");
  const nome = document.getElementById("nome-fabricante").value.trim();
  const paisOrigem = document.getElementById("pais-fabricante").value;

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

  try {
      const resposta = await fetch(url, {
          method: method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome, paisOrigem }),
      });

      if (resposta.ok) {
          alert(id ? "Fabricante atualizado com sucesso!" : "Fabricante adicionado com sucesso!");
          this.removeAttribute("data-edit-id");
          document.getElementById("modal").style.display = "none";
          this.reset();
          // Atualize a tabela chamando sua função que recarrega os dados
      } else {
          const erro = await resposta.json();
          alert(`Erro: ${erro.message || resposta.statusText}`);
      }
  } catch (erro) {
      alert(`Erro de conexão: ${erro.message}`);
  }
});

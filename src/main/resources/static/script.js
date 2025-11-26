
// Função fetch para obter dados da API
async function getData(url) {
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return response; 
        }

        const resultado = await response.json();
        return resultado;

    } catch (error) {
        return error;
    }
}

// Funcao para requisição DELETE
async function deleteData(url) {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });
        return response;
    } catch (error) {
        return error;
    }
}

 // função para requisição PUT
async function putData(url, data) {
    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
   
        if(response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                return await resultado.jason();
            } else {
                return response.text();
            }
        } else {
            try {
                const error = await response.json();
                return { error: true, status: response.status, ...error };
            } catch {
                return { error: true, status: response.status, message: response.statusText };
            }
        }
    } catch (error) {
        return { error: true, message: "Error de console:" + error.message };

    }
  }

  // mostrar erro especifico do backend 
      //  function mostrarErro(response) {
       // if (response.error) {
       //     let mensage = response.mensagem;


        // tratamento especifico para erro comum 
     //   if (response.status === 400) {
     //       messagem = " Conflito de Dados!/n/n" 
        
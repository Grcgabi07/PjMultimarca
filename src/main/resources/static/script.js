
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
   
        if(response.ok {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("application/json")) {
                return await resultado;
            } else {
                return response;
            }
        })

    }
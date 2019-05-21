function logar(e){
    e.preventDefault();
    var valueSenha = document.getElementById("inputSenha").value;
    var valueEmail = document.getElementById("inputEmail").value;

    xmlhttp = new XMLHttpRequest();
    var urlRegistro = "http://138.204.68.18:3323/auth/authenticate";
    xmlhttp.open("POST", urlRegistro, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function () { 
      var response = JSON.parse(xmlhttp.responseText);
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
         //guarda o token de acesso do usuário 
        window.localStorage.setItem("token",response.token);
        window.localStorage.setItem("nome",response.user.nome);
        window.localStorage.setItem("fornecedor",response.user.fornecedorRelacionado);
        window.localStorage.setItem("acesso",response.user.acesso);

        switch (response.user.acesso){
            case "Produtor":
                //ações para administrador
                window.location.replace("page-produtor.html");
                break;
            case "Analista":
                //ações para supervisor
                window.location.replace("page-analista.html");
                break;
            case "Supervisor":
                //ações para importador
                window.location.replace("page-supervisor.html");
                break;
            case "Administrador":
                //ações para produtor
                window.location.replace("page-admin.html");
                break;
            default:
                //apresentar erro de usuário sem acesso definido.
        }
      }
      if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        //Apresentar erro para o usuário
        document.getElementById('erroImportData').innerHTML=response.error;
        document.getElementById('erroImportData').style.display = "block";
        setTimeout(function(){ document.getElementById('erroImportData').style.display = "none"; }, 4000);
      }
      
      
    };

    let parametros = JSON.stringify({
              "email":valueEmail,
              "senha":valueSenha});

    
    xmlhttp.send(parametros);

  
    return false;
  }



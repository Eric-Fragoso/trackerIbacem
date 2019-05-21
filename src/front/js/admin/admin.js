document.getElementById("userName").innerHTML = localStorage.getItem("nome");

var fornecedorAtual;

function cadastrar(e){

    e.preventDefault();
    var valueNome = document.getElementById("inputNome").value;
    var valueEmail = document.getElementById("inputEmail").value;
    var valueSenha = document.getElementById("inputSenha").value;
    var valueSenha2 = document.getElementById("inputSenha2").value;
    var valueTelefone= document.getElementById("inputTelefone").value;
    var valueFidelidade = document.getElementById("select-fidelidade").value;
    var valueAcesso = document.getElementById("select-nivelAcesso").value;
    var valueEmpresa = document.getElementById("select-empresa").value;

    xmlhttp = new XMLHttpRequest();
    var urlRegistro = "http://138.204.68.18:3323/auth/register";
    xmlhttp.open("POST", urlRegistro, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.onreadystatechange = function () { 
      var response = JSON.parse(xmlhttp.responseText);
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        closeModalNovoUser();
        fnPopulaUsuarios();
      }
      if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        //Apresentar erro para o usuário
        document.getElementById('mensagemErro').innerHTML=response.error;
        document.getElementById('mensagemErro').style.display = "block";
        setTimeout(function(){ document.getElementById('mensagemErro').style.display = "none"; }, 4000);
      }
      
      
    };

    let parametros = JSON.stringify({
              "nome":valueNome,
              "email":valueEmail,
              "senha":valueSenha,
              "telefone":valueTelefone,
              "fidelidade":valueFidelidade,
              "acesso":valueAcesso,
              "fornecedorRelacionado":valueEmpresa});
    xmlhttp.send(parametros);

  
    return false;
}

const fnPopulaEmpresas = async()=> {
  await axios.get('http://138.204.68.18:3324/api/fornecedores')
  .then(function(response){
      
      document.getElementById('select-empresa').innerHTML = response.data.map(function (empresa) {
      return (
        "<option value=\""+empresa.COD_FORNECEDOR+"\">"+empresa.FORNECEDOR+"</option><br/>"
        );
        
      }).join('');
  })
  .catch(function(error){
      console.warn(error);
  });
  easydropdown.all();
  
}

const fnPopulaUsuarios = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get('http://138.204.68.18:3323/usuarios',{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var usuarios = (response.data).users;
      document.getElementById('tbody-user').innerHTML = usuarios.map(function (usuario) {
        return (
          "<tr align=\"center\"><td>"+usuario.nome+"</td><td>"+usuario.acesso+"</td><td>"+usuario.email+"</td><td><a href=\"javascript:;\" title=\"Deletar usuário\" class=\"deletarUsuario\" onclick=\"openModalDeleteUser('"+usuario._id+"');\"><i class=\"fas fa-times-circle\"></i></a></td></tr>"
          );
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });

}

const deletarUsuario = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  await axios.delete(`http://138.204.68.18:3323/usuarios/${id}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    fnPopulaUsuarios();  
    closeModalDeleteUser();   
  })
  .catch(function(error){
      console.warn(error);
  });

}


const importarControle = async()=> {
  var valueControle = document.getElementById("input-controle").value;
  var valueAno = document.getElementById("select-ano-safra").value;
  var valueCultura = document.getElementById("select-cultura").value;



  await axios.get(`http://138.204.68.18:3324/api/controles/${valueControle}/${valueAno}/${valueCultura}`)
  .then(function(response){
    var controles = (response.data);
      document.getElementById('containerControles').innerHTML = controles.map(function (controle) {
        openModalExibeImportacao();
        fornecedorAtual = controle.COD_FORNECEDOR;
        return (
          `<ul>
            <li>COD_FORNECEDOR: <span id="controleCOD" class="destacaImport" value="${controle.COD_FORNECEDOR}">${controle.COD_FORNECEDOR}</span></li>
            <li>ANO: <span id="controleANO" class="destacaImport">${controle.ANO}</span></li>
            <li>MÊS: <span id="controleMES" class="destacaImport">${controle.MES}</span></li>
            <li>SEMANA: <span id="controleSEMANA" class="destacaImport">${controle.SEMANA}</span></li>
            <li>DATA: <span id="controleDATA" class="destacaImport">${controle.DATA}</span></li>
            <li>CULTURA: <span id="controleCULTURA" class="destacaImport">${controle.CULTURA}</span></li>
            <li>VARIEDADE: <span id="controleVAR" class="destacaImport">${controle.VARIEDADE}</span></li>
            <li>CONTROLE: <span id="controleCON" class="destacaImport">${controle.CONTROLE}</span></li>
            <li>SAFRA: <span id="controleSAFRA" class="destacaImport">${controle.SAFRA}</span></li>
            <li>VOLUME EM KG: <span id="controleCOD" class="destacaImport">${controle.VOLUME_KG}</span></li>
          </ul>`
          );
        
        }).join(''); 
      
  })
  .catch(function(error){
      console.warn(error);
      document.getElementById('erroImportData').innerHTML="Controle não encontrado";
      document.getElementById('erroImportData').style.display = "block";
      setTimeout(function(){ document.getElementById('erroImportData').style.display = "none"; }, 4000);
  });

}      


const salvaControle = async()=> {
  let tokenStr = localStorage.getItem("token");

  var valueControle = document.getElementById("input-controle").value;
  var valueAno = document.getElementById("select-ano-safra").value;
  var valueCultura = document.getElementById("select-cultura").value;
  let codigo = valueControle +"-"+valueCultura+"-"+valueAno;
  let importadoPor = localStorage.getItem("nome");
  let statusAtual = document.getElementById("select-status").value;

  await axios.post('http://138.204.68.18:3323/controles', 
              {codigo: codigo, 
               fornecedorCod:fornecedorAtual,
               importadoPor: importadoPor,
               passoAtual: statusAtual
              },
          {headers: {"Authorization" : `Bearer ${tokenStr}`} }
  )
  .then(function(response){
    fnPopulaControles(); 
    closeModalExibeImportacao();   
    
  })
  .catch(function(error){
      console.warn(error);
  });

}

const fnPopulaControles = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get('http://138.204.68.18:3323/controles',{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
    
      document.getElementById('tbody-controles').innerHTML = controles.map(function (controle) {
        
        if (controle.visivel == false){
          var visivelAtual = "<a href=\"javascript:;\"><i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"hidden\" class=\"checkboxVisivel\"></i></a>";
        }else{
          var visivelAtual = "<a href=\"javascript:;\"><i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
        }
        return (
          "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+visivelAtual+"</td></tr>"
          );
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);
  });

}

const atualizaControle = async(id,visivel)=> {
  let tokenStr = localStorage.getItem("token");
  let publicadoPor = localStorage.getItem("nome");

 
  await axios.put(`http://138.204.68.18:3323/controles/${id}`, 
              {id:id,
                publicadoPor: publicadoPor,
                visivel: visivel
              },
          {headers: {"Authorization" : `Bearer ${tokenStr}`} }
  )
  .then(function(response){
    fnPopulaControles(); 
  })
  .catch(function(error){
      console.warn(error);
  });

}











function changeCheckboxState(id){
  var checkbox = document.getElementById(id);
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked == true){
    atualizaControle(id,checkbox.checked);
    document.getElementById(id).parentElement.classList.remove("fa-times-circle");
    document.getElementById(id).parentElement.classList.add("fa-check-circle");
  }else{
    document.getElementById(id).parentElement.classList.add("fa-times-circle");
    document.getElementById(id).parentElement.classList.remove("fa-check-circle");
  } 
  
}





function fnConvertData(data){
  let dia = data.substring(8,10);
  let mes = data.substring(5,7);
  let ano = data.substring(0,4);

  return dia+"/"+mes+"/"+ano;
}


if(localStorage.getItem("acesso")!=="Administrador"){
  window.location.replace("index.html");
}
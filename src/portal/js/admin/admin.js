document.getElementById("userName").innerHTML = localStorage.getItem("nome");

var fornecedorAtual;

const cadastrar = async(e)=> {

    e.preventDefault();

    if(localStorage.getItem("produtorRel")!="IBACEM"){
      var valueEmpresa = document.getElementById("select-empresa").value;
    }else{
      var valueEmpresa = 9999;
    }
    let valueNome = document.getElementById("inputNome").value;
    let valueEmail = document.getElementById("inputEmail").value;
    let valueSenha = document.getElementById("inputSenha").value;
    let valueSenha2 = document.getElementById("inputSenha2").value;
    let valueTelefone= document.getElementById("inputTelefone").value;
    let valueFidelidade = document.getElementById("select-fidelidade").value;
    let valueAcesso = document.getElementById("select-nivelAcesso").value;
    let vAa = document.getElementById("select-nivelAnalista").value;

    console.log(vAa);
   
      await axios.post(`http://138.204.68.18:3323/auth/register`, 
                  {
                    nome:valueNome,
                    email:valueEmail,
                    senha:valueSenha,
                    telefone:valueTelefone,
                    fidelidade:valueFidelidade,
                    acesso:valueAcesso,
                    fornecedorRelacionado:valueEmpresa,
                    acessoAnalista: vAa                    
                  }
      )
      .then(function(response){
        console.log(response);
        closeModalNovoUser();
        fnPopulaUsuarios();
      })
      .catch(function(error){
          console.warn(error);
          document.getElementById('mensagemErro').innerHTML=response.error;
          document.getElementById('mensagemErro').style.display = "block";
          setTimeout(function(){ document.getElementById('mensagemErro').style.display = "none"; }, 4000);
      });
   
}




const fnPopulaEmpresas = async()=> {
  await axios.get('http://138.204.68.18:3324/api/fornecedores')
  .then(function(response){
      
      document.getElementById('select-empresa').innerHTML = response.data.map(function (empresa) {
      
        return (
        "<option value=\""+empresa.COD_FORNECEDOR+"\">"+empresa.FORNECEDOR+"</option><br/>"
        );
        
        }).join('');

      document.getElementById('select-empresa-editar').innerHTML = response.data.map(function (empresa) {
    
        return (
        "<option value=\""+empresa.COD_FORNECEDOR+"\">"+empresa.FORNECEDOR+"</option><br/>"
        );
        
        }).join('');

      document.getElementById('select-empresa-financeiro').innerHTML = response.data.map(function (empresa) {
        
        return (
        "<option value=\""+empresa.COD_FORNECEDOR+"\">"+empresa.FORNECEDOR+"</option><br/>"
              );
        }).join('');

      document.getElementById('select-empresa-controle').innerHTML = response.data.map(function (empresa) {
      
        return (
        "<option value=\""+empresa.COD_FORNECEDOR+"\">"+empresa.FORNECEDOR+"</option><br/>"
        );
        }).join('');

  })
  .catch(function(error){
      console.warn(error);
  });
  easydropdown.all({
    behavior:{
      liveUpdates:true
    }
  });
  
}

const fnPopulaUsuarios = async()=> {
  let tokenStr = localStorage.getItem("token");
  let nomeProdutor = "";
  let linha ="";
  await axios.get('http://138.204.68.18:3323/usuarios',{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var usuarios = (response.data).users;
      usuarios.map(async function (usuario) {
         await axios.get(`http://138.204.68.18:3324/api/fornecedores`)
        .then(function(response){
          response.data.map(function (empresa) {
              if (empresa.COD_FORNECEDOR == usuario.fornecedorRelacionado){
                nomeProdutor = empresa.FORNECEDOR;
              }
              if(usuario.fornecedorRelacionado == 9999){
                nomeProdutor ="IBACEM";
              }
            }).join('');  
            linha += "<tr align=\"center\"><td>"+nomeProdutor+"</td><td>"+usuario.nome+"</td><td>"+usuario.acesso+"</td><td>"+usuario.email+"</td><td><a href=\"javascript:;\" title=\"Deletar usuário\" class=\"deletarUsuario\" onclick=\"openModalDeleteUser('"+usuario._id+"');\"><i class=\"fas fa-times-circle\"></i></a></td><td><a href=\"javascript:;\" title=\"Editar usuário\" class=\"deletarUsuario\" onclick=\"openModalEditarUser('"+usuario._id+"','"+usuario.nome+"','"+usuario.email+"', '"+usuario.telefone+"', "+usuario.fidelidade+",'"+usuario.acesso+"', '"+usuario.fornecedorRelacionado+"');\"><i class=\"fas fa-user-edit\"></i></a></td></tr>"           
        })
        return (
          document.getElementById('tbody-user').innerHTML = linha
          );  
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });

}

const deletarUsuario = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  console.log(id);
  await axios.delete(`http://138.204.68.18:3323/usuarios/${id}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    fnPopulaUsuarios();  
    closeModalDeleteUser();   
  })
  .catch(function(error){
      console.warn(error);
  });

}



const atualizaUsuario = async(id)=> {

  let tokenStr = localStorage.getItem("token");
  let nome = document.getElementById("inputNomeEditar").value;
  let email = document.getElementById("inputEmailEditar").value;
  let telefone = document.getElementById("inputTelefoneEditar").value;
  let acesso = document.getElementById("select-nivelAcessoEditar").value;
  let fidelidade = document.getElementById("select-fidelidade-editar").value;
  let fornecedor = document.getElementById("select-empresa-editar").value;
  let acessoAnalista = document.getElementById("select-nivelAcessoAnalista-editar").value
 
  await axios.put(`http://138.204.68.18:3323/usuarios/${id}`, 
              {id:id, nome, email, telefone, acesso, fidelidade, fornecedorRelacionado:fornecedor, acessoAnalista
              },
          {headers: {"Authorization" : `Bearer ${tokenStr}`} }
  )
  .then(function(response){
    fnPopulaUsuarios();
    closeModalEditarUser();
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
        var apagar = "<a href=\"javascript:;\"><i class=\"fas fa-trash-alt\"></i></a>"
        var view = "<a href=\"javascript:;\"><i class=\"fas fa-eye\"></i></a>"
        if (controle.visivel == false){
          var visivelAtual = "<a href=\"javascript:;\"><i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"hidden\" class=\"checkboxVisivel\"></i></a>";
        }else{
          var visivelAtual = "<a href=\"javascript:;\"><i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
        }
        if (controle.analisado == false){
          var analisadoAtual = "<i class=\"fas fa-times-circle\"><input type=\"checkbox\" value=\"hidden\" class=\"checkboxVisivel\"></i>";
        }else{
          var analisadoAtual = "<i class=\"fas fa-check-circle\"><input type=\"checkbox\" value=\"show\" class=\"checkboxVisivel\" checked></i>";
        }
        if (controle.comentario != " "){
          var comentarioAtual = "<a href=\"javascript:;\"><i class=\"fas fa-comment-dots\"></i></a>";
        }else{
          var comentarioAtual = "<a href=\"javascript:;\"><i class=\"fas fa-edit\"></i></a>";
        }
        //var resumoIcon = "<a href=\"javascript:;\"><i class=\"fas fa-eye\"></i></a>";
        return (
          "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td>"+analisadoAtual+"</td><td><div class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+visivelAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"openModalComentario('"+controle._id+"','"+controle.comentario+"','"+controle.fornecedorCod+"','"+controle.codigo+"');\">"+comentarioAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"viewControle('"+controle.codigo+"','"+controle.fornecedorCod+"');\">"+view+"</div></td><td><div class=\"tdClicavel\" onclick=\"apagaControle('"+controle._id+"');\">"+apagar+"</div></td></tr>"
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
const salvaComentario = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  let valueComentario = document.getElementById("comentario-Controle").value;

  await axios.put(`http://138.204.68.18:3323/controles/${id}`, 
              {id:id,
               comentario:valueComentario
              },
          {headers: {"Authorization" : `Bearer ${tokenStr}`} }
  )
  .then(function(response){
    fnPopulaControles();
    closeModalComentario();
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
    atualizaControle(id,checkbox.checked);
    document.getElementById(id).parentElement.classList.add("fa-times-circle");
    document.getElementById(id).parentElement.classList.remove("fa-check-circle");
  } 
  
}


function changeCheckboxStateFornecedor(id){
  console.log(id);
  var checkbox = document.getElementById(id+"forn");
  console.log(checkbox);
  checkbox.checked = !checkbox.checked;
  if (checkbox.checked == true){
    atualizaControle(id,checkbox.checked);
    document.getElementById(id+"forn").parentElement.classList.remove("fa-times-circle");
    document.getElementById(id+"forn").parentElement.classList.add("fa-check-circle");
  }else{
    atualizaControle(id,checkbox.checked);
    document.getElementById(id+"forn").parentElement.classList.add("fa-times-circle");
    document.getElementById(id+"forn").parentElement.classList.remove("fa-check-circle");
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



/* FROM ANALISTA */
/* FROM ANALISTA */
/* FROM ANALISTA */



const cadastrarFinanceiro = async(e)=> {
let tokenStr = localStorage.getItem("token");

e.preventDefault();
var valueFornecedorCod = document.getElementById("select-empresa-financeiro").value;
var valueData = fnPreparaData(document.getElementById("input-data").value);
var valueHistorico = document.getElementById("input-descricao").value;
var valueNf = document.getElementById("input-nf").value;
var valueValor = document.getElementById("select-tipo-entrada").value + document.getElementById("input-valor").value;
valueValor = valueValor.replace(".","");
valueValor = valueValor.replace(",",".");

await axios.post('http://138.204.68.18:3323/financeiros', 
            {fornecedorCod:valueFornecedorCod,
              data: valueData,
              historico: valueHistorico,
              valor: valueValor,
              nf:valueNf
            },
        {headers: {"Authorization" : `Bearer ${tokenStr}`} }
)
.then(function(response){
  //console.log(response);
  fnPopulaFinanceirosFornecedor();
  //fnPopulaControles(); 
  //closeModalExibeImportacao();   
  
})
.catch(function(error){
    console.warn(error);
});

}




const fnPopulaFinanceiros = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get('http://138.204.68.18:3323/financeiros',{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var financeiros = (response.data).financeiros;
    
    
      document.getElementById('containerFinanceiro1').innerHTML = financeiros.map(function (financeiro) {
        
        if (financeiro.aprovado == false){
          var aprovadoAtual = `<a href="javascript:;"><i class="fas fa-times-circle"><input type="checkbox" id=${financeiro._id} value="hidden" class="checkboxVisivel"></i></a>`;
          if(financeiro.valor >= 0){
            return (
              `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.fornecedorCod}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td style="background-color: #F2F3E3; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td><td><div class="tdClicavel" onclick="changeCheckboxStateFinan('${financeiro._id}');">${aprovadoAtual}</div></td></tr>`
              );
          }else{
            return (
              `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.fornecedorCod}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td style="background-color: #F2F3E3; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td><div class="tdClicavel" onclick="changeCheckboxStateFinan('${financeiro._id}');">${aprovadoAtual}</div></td></tr>`
              );
          }
        }
        
        
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });
   setTimeout(rodaTabelas, 1000);    
}

const updateFinanceiro = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  var valueData = fnPreparaData(document.getElementById("input-data").value);
  var valueHistorico = document.getElementById("input-descricao").value;
  var valueNf = document.getElementById("input-nf").value;
  var valueValor = document.getElementById("select-tipo-entrada").value + document.getElementById("input-valor").value;
  valueValor = valueValor.replace(".","");
  valueValor = valueValor.replace(",",".");
  await axios.put(`http://138.204.68.18:3323/financeiros/${id}`, 
              {id:id,
               data: valueData,
               historico: valueHistorico,
               valor: valueValor,
               nf:valueNf
              },
          {headers: {"Authorization" : `Bearer ${tokenStr}`} }
  )
  .then(function(response){
    limpaEditaFinanceiro(); 
    fnPopulaFinanceirosFornecedor();
  })
  .catch(function(error){
      console.warn(error);
  });

}

const atualizaFinan = async(id, aprovado)=> {
  let tokenStr = localStorage.getItem("token");
  await axios.put(`http://138.204.68.18:3323/financeiros/${id}`, 
              {id:id,
               aprovado: aprovado
              },
          {headers: {"Authorization" : `Bearer ${tokenStr}`} }
  )
  .then(function(response){
    //fnPopulaFinanceiros(); 
  })
  .catch(function(error){
      console.warn(error);
  });

}


function changeCheckboxStateFinan(id){
  var checkbox2 = document.getElementById(id);
  checkbox2.checked = !checkbox2.checked;
  if (checkbox2.checked == true){
    atualizaFinan(id,true);
    document.getElementById(id).parentElement.classList.remove("fa-times-circle");
    document.getElementById(id).parentElement.classList.add("fa-check-circle");
  }else{
    atualizaFinan(id,false);
    document.getElementById(id).parentElement.classList.add("fa-times-circle");
    document.getElementById(id).parentElement.classList.remove("fa-check-circle");
  } 
  
}





const fnPopulaFinanceirosFornecedor = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get(`http://138.204.68.18:3323/financeiros/${document.getElementById("select-empresa-financeiro").value}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var financeiros = (response.data).financeiros;
      document.getElementById('containerFinanceiro2').innerHTML = financeiros.map(function (financeiro) {
        if(financeiro.valor >= 0){
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" class="invis" style="background-color: #F2F3E3!important; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td><td><div><a href="javascript:;" title="Deletar registro" class="deletarUsuario" onclick="openModalDeleteRegistro('${financeiro._id}');"><i class="fas fa-times-circle"></i></a></div></td><td><div><a href="javascript:;" title="Editar registro" class="deletarUsuario" onclick="editRegistroFinanceiro('${financeiro._id}','${fnConvertData(financeiro.data)}','${financeiro.historico}','${financeiro.nf}','${financeiro.valor}');"><i class="fas fa-edit"></i></a></div></tr>`
            );
        }else{
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" class="invis" style="background-color: #F2F3E3!important; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td><div><a href="javascript:;" title="Deletar registro" class="deletarUsuario" onclick="openModalDeleteRegistro('${financeiro._id}');"><i class="fas fa-times-circle"></i></a></div></td><td><div><a href="javascript:;" title="Editar registro" class="deletarUsuario" onclick="editRegistroFinanceiro('${financeiro._id}','${fnConvertData(financeiro.data)}','${financeiro.historico}','${financeiro.nf}','${financeiro.valor}');"><i class="fas fa-edit"></i></a></div></tr>`
            );
        }
        
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });

}


const deletarRegistro = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  await axios.delete(`http://138.204.68.18:3323/financeiros/${id}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    fnPopulaFinanceirosFornecedor();  
    closeModalDeleteRegistro();   
  })
  .catch(function(error){
      console.warn(error);
  });

}




const fnPopulaControlesFornecedor = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get(`http://138.204.68.18:3323/controles/fornecedor/${document.getElementById("select-empresa-controle").value}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
      document.getElementById('select-controle').innerHTML = controles.map(function (controle) {
        console.log(controle)
        return (
            "<option value=\""+controle._id+"\">"+controle.codigo+"</option><br/>"
            );
                
        }).join('');     
        
  })
  .catch(function(error){
      console.warn(error);
    });
  
}

function guardaDados(){
 // window.localStorage.setItem("controleId",document.getElementById("select-controle").value);
  //window.localStorage.setItem("etapa",document.getElementById("select-estagio-qualidade").value);
  uploadGeral(document.getElementById("select-controle").value, document.getElementById("select-estagio-qualidade").value);
}



function fnConvertData(data){
  let dia = data.substring(8,10);
  let mes = data.substring(5,7);
  let ano = data.substring(0,4);

  return dia+"/"+mes+"/"+ano;
}

function fnPreparaData(data){
  let dia = data.substring(0,2);
  let mes = data.substring(3,5);
  let ano = data.substring(6,10);

  return mes+"/"+dia+"/"+ano;
}

function fnConvertValor(valorInt){
  let valor;
  let sinal="";
  if(valorInt>0){
    valor = valorInt + "";
  }else{
    var temp = valorInt + "";
    valor = temp.substring((temp.length-(temp.length-1)),temp.length);
    sinal = "-";
  }  
   
  let centavos = valor.substring((valor.length-2),valor.length);
  let centena = valor.substring((valor.length-5),valor.length-2);
  let milhar = valor.substring((valor.length-8),valor.length-5);
  let milhao = valor.substring((valor.length-12),valor.length-9);

  if(milhao){
    return sinal+milhao+"."+milhar+"."+centena+","+centavos;
  }else if(milhar){
    return sinal+milhar+"."+centena+","+centavos;
  }else if(centena){
    return sinal+centena+","+centavos;
  }
  
}

function rodaTabelas(){  
  $('#my-table-user').dynatable({
    features: {
      paginate: false,
      sort: true,
      pushState: false,
      search: true,
      recordCount: false,
      perPageSelect: false
    }
  })
  $('#my-table-financeiro').dynatable({
    features: {
      paginate: false,
      sort: true,
      pushState: false,
      search: false,
      recordCount: false,
      perPageSelect: false
    }
  });
  $('#my-table').dynatable({
    features: {
      paginate: false,
      sort:true,
      pushState: false,
      search: true,
      recordCount: false,
      perPageSelect: false,
    }    
  });
  $('#input-data').datepicker({
    language: 'pt-BR',
    maxDate: new Date()
  })
}

const fnPopulaControlesFornecedorLista = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get(`http://138.204.68.18:3323/controles/fornecedor/${document.getElementById("select-empresa-controle").value}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
    document.getElementById('tbody-controles').innerHTML = controles.map(function (controle) {
       
      if (controle.visivel == false){
        var visivelAtual = "<a href=\"javascript:;\"><i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+'forn'+" value=\"hidden\" class=\"checkboxVisivel\"></i></a>";
      }else{
        var visivelAtual = "<a href=\"javascript:;\"><i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+'forn'+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
      }

      if (controle.analisado == false){
        var analisadoAtual = "<i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"hidden\" class=\"checkboxVisivel\"></i>";
      }else{
        var analisadoAtual = "<i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i>";
      }
      
      var apagar = "<a href=\"javascript:;\"><i class=\"fas fa-trash-alt\"></i></a>"
      var view = "<a href=\"javascript:;\"><i class=\"fas fa-eye\"></i></a>"

      if (controle.comentario != " "){
        var comentarioAtual = "<a href=\"javascript:;\"><i class=\"fas fa-comment-dots\"></i></a>";
      }else{
        var comentarioAtual = "<a href=\"javascript:;\"><i class=\"fas fa-edit\"></i></a>";
      }
      //var resumoIcon = "<a href=\"javascript:;\"><i class=\"fas fa-eye\"></i></a>";
      return (
        "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td>"+analisadoAtual+"</td><td><div class=\"tdClicavel\" onclick=\"changeCheckboxStateFornecedor('"+controle._id+"');\">"+visivelAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"openModalComentario('"+controle._id+"','"+controle.comentario+"','"+controle.fornecedorCod+"','"+controle.codigo+"');\">"+comentarioAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"viewControle('"+controle.codigo+"','"+controle.fornecedorCod+"');\">"+view+"</div></td><td><div class=\"tdClicavel\" onclick=\"apagaControle('"+controle._id+"');\">"+apagar+"</div></td></tr>"
        );
      
      
      }).join('');    
        
  })
  .catch(function(error){
      console.warn(error);
    });
  
}

function filtraEmpresaControle(){
  var empresaFiltra = document.getElementById("select-empresa-controle").options[document.getElementById('select-empresa-controle').selectedIndex].innerText;


  //document.getElementById("entradaFinanceira").style.display = "block";
  //document.getElementById("resultadoFiltraPesquisaControle").style.display = "block";
  //document.getElementById("resultadoPesquisaFinanceiro").style.display = "none";
  //document.getElementById("nomeFiltraEmpresaControle").innerHTML = empresaFiltra;

  fnPopulaControlesFornecedorLista();
}



const apagaControle = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  await axios.delete(`http://138.204.68.18:3323/controles/${id}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    fnPopulaControles(); 
  })
  .catch(function(error){
      console.warn(error);
  });

}

function viewControle(controleCod, fornecedorCod ) {
  var cod;
        switch (controleCod.length){
          case 9 :
            cod = controleCod.substring(0,4);
          break;
          case 8 :
            cod = controleCod.substring(0,3);
          break;
          case 7 :
            cod = controleCod.substring(0,2);
          break;
          case 6 :
            cod = controleCod.substring(0,1);
          break;
          default:
        }
  axios.get(`http://138.204.68.18:3324/api/comercial/${fornecedorCod}/${cod}`)
        .then(function(resposta){
          let controls = (resposta.data);
          let cultura;
          let variedade;
          let arrayMaster=[];
          let arrayKG=[];
          let arrayMercado=[];
          let arrayNavios=[];
          let arrayCaixas=[];
          let arrayNET=[];


          controls.map(function (control) {
              let arraySingle=[];
              cultura = control.CULTURA;
              variedade = control.VARIEDADE;
              //let kgtotal = control.TIPO_CX * control.QTD_CAIXA;
              let kgtotal = Math.round10(control.PESO_CX,-2);
              let nettotal = control.NET_CX * control.QTD_CAIXA;
              console.log(nettotal);
              arrayKG.push(kgtotal);
              arrayMercado.push(control.MERCADO);
              arrayNavios.push(control.NAVIO);
              arrayCaixas.push(control.QTD_CAIXA);
              arrayNET.push(nettotal);
              arraySingle.push(control.CONTAINER, control.DATA_CHEGADA, control.CAIXA, control.QTD_CAIXA, control.CALIBRE, control.MOEDA, control.VALOR_BRUTO_CX, control.VALOR_COMISSAOIMP_CX, control.VALOR_CUSTOIMP_CX, control.RESU_FOB, control.VALOR_CX_MI, control.RESU_MI, control.DESP_FRETE, control.COMISSAO_IBACEM, control.CUSTO_PH, control.COMISSAO_MI, control.NET_CX, control.NET_KG, kgtotal, nettotal )
              arrayMaster.push(arraySingle);
              
          }).join(' '); 
          var total = arrayKG.reduce(function(anterior, atual) {
            return anterior + atual;
          });
          
          var mercadoFinal = arrayMercado.filter(function (a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
          }, Object.create(null));

          var navioFinal = arrayNavios.filter(function (a) {
            return !this[JSON.stringify(a)] && (this[JSON.stringify(a)] = true);
          }, Object.create(null));

          var totalCaixas = arrayCaixas.reduce(function(anterior, atual) {
            return anterior + atual;
          });

          var totalNet = arrayNET.reduce(function(anterior, atual) {
            return anterior + atual;
          });

          console.log(mercadoFinal);
          document.getElementById("controleViewCOD").innerHTML = fornecedorCod;
          document.getElementById("controleViewCULTURA").innerHTML = cultura;
          document.getElementById("controleViewVARIEDADE").innerHTML = variedade;
          document.getElementById("controleViewKG").innerHTML =  Math.round10(total) + " Kg";
          document.getElementById("controleViewMercado").innerHTML = mercadoFinal;
          document.getElementById("controleViewNavios").innerHTML = navioFinal;
          document.getElementById("controleViewEntradas").innerHTML = arrayKG.length;
          document.getElementById("controleViewCaixas").innerHTML = totalCaixas;
          document.getElementById("controleViewNet").innerHTML = totalNet;
          //document.getElementById("controleCOD").innerHTML = empresaFiltra;
          
        });
        
        openModalViewControle();
}

fnPopulaControles(); 
fnPopulaUsuarios();
fnPopulaEmpresas();
fnPopulaFinanceiros();


(function(){

	/**
	 * Ajuste decimal de um número.
	 *
	 * @param	{String}	type	O tipo de arredondamento.
	 * @param	{Number}	value	O número a arredondar.
	 * @param	{Integer}	exp		O expoente (o logaritmo decimal da base pretendida).
	 * @returns	{Number}			O valor depois de ajustado.
	 */
	function decimalAdjust(type, value, exp) {
		// Se exp é indefinido ou zero...
		if (typeof exp === 'undefined' || +exp === 0) {
			return Math[type](value);
		}
		value = +value;
		exp = +exp;
		// Se o valor não é um número ou o exp não é inteiro...
		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
			return NaN;
		}
		// Transformando para string
		value = value.toString().split('e');
		value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
		// Transformando de volta
		value = value.toString().split('e');
		return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
	}

	// Arredondamento decimal
	if (!Math.round10) {
		Math.round10 = function(value, exp) {
			return decimalAdjust('round', value, exp);
		};
	}
	// Decimal arredondado para baixo
	if (!Math.floor10) {
		Math.floor10 = function(value, exp) {
			return decimalAdjust('floor', value, exp);
		};
	}
	// Decimal arredondado para cima
	if (!Math.ceil10) {
		Math.ceil10 = function(value, exp) {
			return decimalAdjust('ceil', value, exp);
		};
	}

})();
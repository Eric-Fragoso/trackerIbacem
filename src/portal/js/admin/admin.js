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
      
      document.getElementById('select-empresa-controle-qualidade').innerHTML = response.data.map(function (empresa) {
    
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
  let valueFornecedor = 0;
  let cod = "julio";
  await axios.get('http://138.204.68.18:3323/controles',{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
      document.getElementById('tbody-controles').innerHTML = controles.map(function (controle) {

        switch (controle.codigo.length){
          case 9 :
            cod = controle.codigo.substring(0,4);
          break;
          case 8 :
            cod = controle.codigo.substring(0,3);
          break;
          case 7 :
            cod = controle.codigo.substring(0,2);
          break;
          case 6 :
            cod = controle.codigo.substring(0,1);
          break;
          default:
        }



        
        valueFornecedor = controle.fornecedorCod;
        
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
        return (`
          <tr align="center">
            <td>${controle.codigo}</td>
            <td>${fnConvertData(controle.importadoEm)}</td>
            <td>${controle.passoAtual}</td>
            <td>${controle.importadoPor}</td>
            <td>${controle.publicadoPor}</td>
            <td>${analisadoAtual}</td>
            <td><div class="tdClicavel" onclick="changeCheckboxStateFornecedor(${controle._id});">${visivelAtual}</div></td>
            <td><div class="tdClicavel" onclick="openModalComentario(${controle._id},${controle.comentario},${controle.fornecedorCod},${controle.codigo});">${comentarioAtual}</div></td>
            <td><div class="tdClicavel" onclick="carregaResumoComercial(${valueFornecedor},${cod});">${view}</div></td>
            <td><div class="tdClicavel" onclick="apagaControle(${controle._id});">${apagar}</div></td>
          </tr>
          `);
        
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

const atualizaQual = async(id, aprovado)=> {
  let tokenStr = localStorage.getItem("token");
  await axios.put(`http://138.204.68.18:3323/images/${id}`, 
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


function changeCheckboxStateQual(id){
  var checkbox3 = document.getElementById(id);
  checkbox3.checked = !checkbox3.checked;
  if (checkbox3.checked == true){
    atualizaQual(id,true);
    document.getElementById(id).parentElement.classList.remove("fa-times-circle");
    document.getElementById(id).parentElement.classList.add("fa-check-circle");
  }else{
    atualizaQual(id,false);
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

const deletarQualidade = async(id)=> {
  let tokenStr = localStorage.getItem("token");
  await axios.delete(`http://138.204.68.18:3323/images/${id}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    fnPopulaQualidades();  
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
  uploadGeral(document.getElementById("select-controle-qualidade").value, document.getElementById("select-estagio-qualidade").value);
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
      return (`
      <tr align="center">
        <td>${controle.codigo}</td>
        <td>${fnConvertData(controle.importadoEm)}</td>
        <td>${controle.passoAtual}</td>
        <td>${controle.importadoPor}</td>
        <td>${controle.publicadoPor}</td>
        <td>${analisadoAtual}</td>
        <td><div class="tdClicavel" onclick="changeCheckboxStateFornecedor(${controle._id});">${visivelAtual}</div></td>
        <td><div class="tdClicavel" onclick="openModalComentario(${controle._id},${controle.comentario},${controle.fornecedorCod},${controle.codigo});">${comentarioAtual}</div></td>
        <td><div class="tdClicavel" onclick="carregaResumoComercial(${valueFornecedor},${cod});">${view}</div></td>
        <td><div class="tdClicavel" onclick="apagaControle(${controle._id});">${apagar}</div></td>
      </tr>
        `);
      
      
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

function viewControle(controleCod, fornecedorCod, faseAtual ) {
  let cod;
  let ano = controleCod.substring(controleCod.length-2,controleCod.length);
  let cultura = controleCod.substring(controleCod.length-4,controleCod.length-3);
  let fase;
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
        switch (faseAtual){
          case "Recepção" :
            fase = "viewRecepcao";
            exibeResumoREC(ano,cod,cultura);
          break;
          case "Selecao"  :
            fase = "viewSelecao";
            exibeResumoSEL(ano,cod,cultura);
          break;
          case "Embalagem"  :
            fase = "viewEmbalamento";
            exibeResumoEMB(ano,cod,cultura);
          break;
          case "Expedicao"  :
            fase = "viewExpedicao";
            exibeResumoEXP(ano,cod,cultura);
          break;
          case "Comercial"  :
            fase = "viewComercial";
            exibeResumoCOM(ano,cod,cultura);
          break;
          default:
        }

        escondeDivs(fase);
        
        
        openModalViewControle();
}

async function exibeResumoCOM(ano,cod,cultura){
  await axios.get(`http://138.204.68.18:3324/api/controles/${cod}/${ano}/${cultura}`)
  .then(function(response){
    let controles = (response.data);
      document.getElementById('viewComercial').innerHTML = controles.map(function (controle) {
            return (
              `<ul>
                <li>CONTROLE: <span id="controleCOD" class="destacaImport2">${cod}</span></li>
                <li>RELATÓRIO: <span id="controleREL" class="destacaImport2"><a href="javascript:;" onclick="geraPDF(${controle.COD_FORNECEDOR},${cod})" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Ver PDF</a></span></li>
              </ul>`
              );
        }).join(''); 
      
  })
  .catch(function(error){
      console.warn(error);
  });
}

function geraPDF(fornecedorCod, controleCod){
  
  axios.get(`http://138.204.68.18:3324/api/comercial/${fornecedorCod}/${controleCod}`)
        .then(function(resposta){
          var controls = (resposta.data);
          var cultura;
          var variedade;
          var arrayMaster=[];
          
          controls.map(function (control) {
              var arraySingle=[];
              cultura = control.CULTURA;
              variedade = control.VARIEDADE;
              //var kgtotal = control.TIPO_CX * control.QTD_CAIXA;
              var kgtotal = Math.round10(control.PESO_CX,-2);
              var nettotal = control.NET_CX * control.QTD_CAIXA;
              arraySingle.push(control.MERCADO, control.NAVIO, control.CONTAINER, control.DATA_CHEGADA, control.COD_CLIENTE, control.CAIXA, control.QTD_CAIXA, control.CALIBRE, control.MOEDA, control.VALOR_BRUTO_CX, control.VALOR_COMISSAOIMP_CX, control.VALOR_CUSTOIMP_CX, control.RESU_FOB, control.VALOR_CX_MI, control.RESU_MI, control.DESP_FRETE, control.COMISSAO_IBACEM, control.CUSTO_PH, control.COMISSAO_MI, control.NET_CX, control.NET_KG, kgtotal, nettotal )
              arrayMaster.push(arraySingle);
          }).join('');  
          var doc = new jsPDF('landscape','mm','a4');
            doc.addImage('data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABGAAD/4QMvaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzEzOCA3OS4xNTk4MjQsIDIwMTYvMDkvMTQtMDE6MDk6MDEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE3IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCMUMwQTgwNDZFMEIxMUU5OThFRDk2NTZDOEU4ODI2QSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCMUMwQTgwNTZFMEIxMUU5OThFRDk2NTZDOEU4ODI2QSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkIxQzBBODAyNkUwQjExRTk5OEVEOTY1NkM4RTg4MjZBIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkIxQzBBODAzNkUwQjExRTk5OEVEOTY1NkM4RTg4MjZBIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+/+4ADkFkb2JlAGTAAAAAAf/bAIQABAMDAwMDBAMDBAYEAwQG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', 'JPG', 15, 5, 18, 6.4);
            doc.setFontSize(11);
            doc.setFontType('bolditalic');
            doc.setTextColor(0, 144, 131);
            doc.text(`Relatório Comercial do Controle ${controleCod} - ${cultura} ${variedade}` , 40 , 10.5);
            doc.setFontSize(9);
            doc.autoTable({
              startX: 5,
              head: [['Mercado', 'Navio', 'Container', 'Chegada', 'Cliente', 'Caixa', 'Qtd Cx', 'Cal.', 'Moeda', '$ Cx', 'Com. Imp.','Custo Imp.', 'FOB BR', '$ Cx MI', 'FOB MI', 'Frete', 'IBACEM','CPH', 'Com. MI', 'NET. Cx', 'NET. KG', 'KG Total', 'NET Total']],
              body: arrayMaster,
              theme:'striped',
              headStyles: {
                 fontSize: 7
              },
              bodyStyles: {
                 fontSize: 6,
              },
              columnStyles: {
                0: {cellWidth: 13},
                1: {cellWidth: 22},
                2: {cellWidth: 17},
                3: {cellWidth: 14},
                4: {cellWidth: 12},
                5: {cellWidth: 20},
                6: {cellWidth: 8},
                7: {cellWidth: 8},
                8: {cellWidth: 11},
                9: {cellWidth: 8},
                10: {cellWidth: 10},
                11: {cellWidth: 11},
                12: {cellWidth: 10},
                13: {cellWidth: 10},
                14: {cellWidth: 10},
                15: {cellWidth: 9},
                16: {cellWidth: 13},
                17: {cellWidth: 9},
                18: {cellWidth: 10},
                19: {cellWidth: 10},
                20: {cellWidth: 10},
                21: {cellWidth: 10},
                22: {cellWidth: 10}
                             // etc
              }
            });
    
          doc.save(`${controleCod}.pdf`);

        })
}

async function exibeResumoREC(ano,cod,cultura){
  await axios.get(`http://138.204.68.18:3324/api/controles/${cod}/${ano}/${cultura}`)
  .then(function(response){
    let controles = (response.data);
      document.getElementById('viewRecepcao').innerHTML = controles.map(function (controle) {
            return (
              `<ul>
                <li>CONTROLE: <span id="controleCOD" class="destacaImport2">${cod}</span></li>
                <li>FORNECEDOR: <span id="controleFORNECEDOR" class="destacaImport2">${controle.COD_FORNECEDOR}</span></li>
                <li>CULTURA: <span id="controleCULTURA" class="destacaImport2">${controle.CULTURA}</span></li>
                <li>VARIEDADE: <span id="controleVARIEDADE" class="destacaImport2">${controle.VARIEDADE}</span></li>
                <li>VOLUME: <span id="controleVOLUME" class="destacaImport2">${controle.VOLUME_KG+"Kg"}</span></li>
              </ul>`
              );
        }).join(''); 
      
  })
  .catch(function(error){
      console.warn(error);
  });
}

async function exibeResumoSEL(ano,cod,cultura){
  await axios.get(`http://138.204.68.18:3324/api/controlessel/${cod}/${ano}/${cultura}`)
  .then(function(response){
    let controles = (response.data);
    fornecedorCod = '';

    let mercados = [];
    for(i = 0; i< controles.length; i++){    
        if(mercados.indexOf(controles[i].MERCADO) === -1){

          if((controles[i].MERCADO != "02-REFUGO LINHA 02") 
          && (controles[i].MERCADO != "03-REFUGO LINHA 03")
          && (controles[i].MERCADO != "04-REFUGO LINHA 04")
          && (controles[i].MERCADO != "REFUGO PÓS EMBALAMENTO")){
            mercados.push(controles[i].MERCADO);   
            fornecedorCod = controles[i].COD_FORNECEDOR;   
          }          
        }        
    }

    acumulaMI = 0;
    acumulaME = 0;
    acumulaMR = 0;
    acumulaCL = [];

    let mi =[];
    let me =[];
    let mr =[];
    let cl =[];
    for(i = 0; i< mercados.length; i++){    
      calibres = [];
      for(x = 0; x< controles.length; x++){    
        if(mercados[i] === controles[x].MERCADO){
          acumulaMI = acumulaMI + controles[x].VOLUME_KG_MI;
          acumulaME = acumulaME + controles[x].VOLUME_KG_ME;
          acumulaMR = acumulaMR + controles[x].VOLUME_KG_REFUGO;
          acumulaCL.push(controles[x].CALIBRE) ;
        }        
      }
    
      for(z = 0; z< acumulaCL.length; z++){    
        if(calibres.indexOf(acumulaCL[z]) === -1){
          calibres.push(acumulaCL[z]);        
        }        
      }

      mi.push(acumulaMI);
      me.push(acumulaME);
      mr.push(acumulaMR);
      cl.push(calibres);

    acumulaMI = 0;
    acumulaME = 0;
    acumulaMR = 0;
    acumulaCL = [];
    }
    let content = `<ul>
                    <li>CONTROLE: <span id="controleCOD" class="destacaImport2">${cod}</span></li>
                    <li>FORNECEDOR: <span id="controleFORNECEDOR" class="destacaImport2">${fornecedorCod}</span></li>
                  </ul>
          <table id="my-table" class="table tControles">
        <thead>
          <tr>
            <th width="25%">Mercado</th>
            <th width="25%">Calibres</th>
            <th width="18%">Volume MI</th>
            <th width="18%">Volume ME</th>
            <th width="14%">Volume Refugo</th>
          </tr>
        </thead>
        <tbody id="tbody-controles">`;

      for(i = 0; i< mercados.length; i++){ 
        content+=`<tr>
        <td>${mercados[i]}</td>
        <td>${cl[i]}</td>
        <td>${Math.round10(mi[i])+" KG"}</td>
        <td>${Math.round10(me[i])+" KG"}</td>
        <td>${Math.round10(mr[i])+" KG"}</td> 
      </tr>`;
      
      };
      content += `</tbody>
                  </table>`;
      document.getElementById('viewSelecao').innerHTML = content;
  })
  .catch(function(error){
      console.warn(error);
  });
}


async function exibeResumoEMB(ano,cod,cultura){
  await axios.get(`http://138.204.68.18:3324/api/controlesemb/${cod}/${ano}/${cultura}`)
  .then(function(response){
    let controles = (response.data);
    fornecedorCod = '';

    let calibres = [];
    for(i = 0; i< controles.length; i++){    
        if(calibres.indexOf(controles[i].CALIBRE) === -1){
          calibres.push(controles[i].CALIBRE);   
          fornecedorCod = controles[i].COD_FORNECEDOR;   
        }        
    }

    acumulaMI = 0;
    acumulaME = 0;
    acumulaMR = 0;
    pesototal = 0;
    refugoTotal = 0
    let mi =[];
    let me =[];
    let mr =[];
    for(i = 0; i< calibres.length; i++){    
      for(x = 0; x< controles.length; x++){    
        if(calibres[i] === controles[x].CALIBRE){
          acumulaMI = acumulaMI + controles[x].VOLUME_KG_MI;
          acumulaME = acumulaME + controles[x].VOLUME_KG_ME;
          acumulaMR = acumulaMR + controles[x].VOLUME_KG_REFUGO;
          pesototal = pesototal + controles[x].VOLUME_KG_MI + controles[x].VOLUME_KG_ME + controles[x].VOLUME_KG_REFUGO;
          refugoTotal = refugoTotal + controles[x].VOLUME_KG_REFUGO;
        }        
      }

      mi.push(acumulaMI);
      me.push(acumulaME);
      mr.push(acumulaMR);

    acumulaMI = 0;
    acumulaME = 0;
    acumulaMR = 0;
    }
    let content = `<ul>
                    <li>CONTROLE: <span id="controleCOD" class="destacaImport2">${cod}</span></li>
                    <li>FORNECEDOR: <span id="controleFORNECEDOR" class="destacaImport2">${fornecedorCod}</span></li>
                    <li>REFUGO TOTAL: <span id="controleCOD" class="destacaImport2">${Math.round10(refugoTotal)+" KG"}</span></li>
                    <li>PESO TOTAL: <span id="controleFORNECEDOR" class="destacaImport2">${Math.round10(pesototal)+" KG"}</span></li>
                  </ul>
          <table id="my-table" class="table tControles">
        <thead>
          <tr>
            <th width="25%">Calibre</th>
            <th width="18%">Peso Liquido</th>
          </tr>
        </thead>
        <tbody id="tbody-controles">
        `;

      for(i = 0; i< calibres.length; i++){ 
        content+=`<tr>
        <td>${(calibres[i]=="N/D")?"REFUGO":calibres[i]}</td>
        <td>${Math.round10(mi[i])+Math.round10(me[i])+Math.round10(mr[i])+" KG"}</td>
      </tr>`;
      
      };
      content += `</tbody>
                  </table>`;
      document.getElementById('viewEmbalamento').innerHTML = content;
  })
  .catch(function(error){
      console.warn(error);
  });
}


async function exibeResumoEXP(ano,cod,cultura){
  await axios.get(`http://138.204.68.18:3324/api/controlesexp/${cod}/${ano}/${cultura}`)
  .then(function(response){
    let controles = (response.data);

    console.log(controles);

    pesototal=0;

    for(i = 0; i< controles.length; i++){    
      pesototal = pesototal + controles[i].KG;
    }

    let content = `<ul>
                    <li>CONTROLE: <span id="controleCOD" class="destacaImport2">${cod}</span></li>
                    <li>PESO TOTAL: <span id="controleFORNECEDOR" class="destacaImport2">${Math.round10(pesototal)+" KG"}</span></li>
                  </ul>
          <table id="my-table" class="table tControles">
        <thead>
          <tr>
            <th width="20%">Mercado</th>
            <th width="20%">Container</th>
            <th width="25%">Carregamento</th>
            <th width="15%">Caixas</th>
            <th width="18%">Peso</th>
          </tr>
        </thead>
        <tbody id="tbody-controles">
        `;

      for(i = 0; i< controles.length; i++){ 
        content+=`<tr>
        <td>${controles[i].MERCADO}</td>
        <td>${controles[i].CONTAINER}</td>
        <td>${fnConvertData(controles[i].DATA_EMBARQUE)}</td>
        <td>${controles[i].QTD_CAIXA}</td>
        <td>${Math.round10(controles[i].KG)+" KG"}</td>
      </tr>`;
      
      };
      content += `</tbody>
                  </table>`;
      document.getElementById('viewExpedicao').innerHTML = content;
  })
  .catch(function(error){
      console.warn(error);
  });
}

function escondeDivs(visivel){
  document.getElementById('viewRecepcao').style.display = "none";
  document.getElementById('viewSelecao').style.display = "none";
  document.getElementById('viewEmbalamento').style.display = "none";
  document.getElementById('viewExpedicao').style.display = "none";
  document.getElementById('viewComercial').style.display = "none";
  document.getElementById(visivel).style.display = "block";
}

const fnPopulaControlesFornecedorQualidade = async()=> {
  console.log("tá por aqui");
  let tokenStr = localStorage.getItem("token");
  await axios.get(`http://138.204.68.18:3323/controles/fornecedor/${document.getElementById("select-empresa-controle-qualidade").value}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
      document.getElementById('select-controle-qualidade').innerHTML = controles.map(function (controle) {
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


const fnPopulaQualidades = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get('http://138.204.68.18:3323/images',{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var images = (response.data).images;
    
      document.getElementById('containerQualiadade').innerHTML = images.map(function (qualidade) {
        if (qualidade.aprovado == false){
          
          var aprovadoAtual = `<a href="javascript:;"><i class="fas fa-times-circle"><input type="checkbox" id=${qualidade._id} value="hidden" class="checkboxVisivel"></i></a>`;
            return (
              `<tr align="center"><td>${qualidade.etapaRelacionada}</td><td><a href="javascript:;" onclick="linkPdf('${qualidade.controleRelacionado}','${qualidade.etapaRelacionada}');" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Relatório</a></td><td></td><td><div><a href="javascript:;" title="Deletar registro" class="deletarUsuario" onclick="deletarQualidade('${qualidade._id}');"><i class="fas fa-trash-alt"></i></a></div></td><td><div class="tdClicavel" onclick="changeCheckboxStateQual('${qualidade._id}');">${aprovadoAtual}</div></td></tr>`
              );
          }
     
        
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });
   setTimeout(rodaTabelas, 1000);    
}

function fnPegaExtensao(caminho){
  return caminho.substring(caminho.length-3,caminho.length);
}


function linkPdf(controleId, etapa) {
  let tokenStr = localStorage.getItem("token");
  axios.get(`http://138.204.68.18:3323/images/${controleId}/${etapa}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    
    var images = (response.data).images;
        images.map(function (image) {
          console.log(image.path);
          if(fnPegaExtensao(image.path)==="pdf"){

            return window.open(image.path);
          }
        }).join('');               
  })
  .catch(function(error){
      console.warn(error);
    });
}


fnPopulaControles(); 
fnPopulaUsuarios();
fnPopulaEmpresas();
fnPopulaFinanceiros();
fnPopulaQualidades();


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




async function carregaResumoComercial(fornecedorCod, controleCod){
  let objetoInsert= '';
  await axios.get(`http://138.204.68.18:3324/api/relatorio/${fornecedorCod}/${controleCod}`)
        .then(function(resposta){
          var controls = (resposta.data);
          var soma1=0;
          var soma2=0;
          var total=0;

          controls.map(function(controle){
            soma1 = controle.RESU_FOB_BR - controle.COMISSAO_IBACEM - controle.DESP_FRETE_CX - controle.COMISSAO_REP - controle.CUSTO_PH - controle.FRETE_COLHEITA - controle.FUNRURAL;
            soma2 = controle.RESU_FOB_BR - controle.COMISSAO_IBACEM - controle.DESP_FRETE_CX - controle.COMISSAO_REP - controle.CUSTO_PH - controle.FRETE_COLHEITA - controle.FUNRURAL - controle.ADT_CX_ETOTAL - controle.ADT_CX_STOTAL;
            total = total + soma2;
            objetoInsert = objetoInsert +
            `<tr align="center">
            <td>${controle.MERCADO}</td>
            <td>${controle.NAVIO}</td>
            <td>${controle.CONTAINER}</td>
            <td>${controle.DATA_CHEGADA}</td>
            <td>${controle.COD_CLIENTE}</td>
            <td>${controle.TIPO_CX}</td>
            <td>${controle.QTD_CAIXA}</td>
            <td>${controle.CALIBRE}</td>
            <td>${(controle.VALOR_BRUTO_CX).toFixed(2)}</td>
            <td>${controle.VALOR_COMISSAOIMP_CX}</td>
            <td>${controle.DESC_COMERCIAL}</td>
            <td>${(controle.OUTRAS_DESP_CX).toFixed(2)}</td>
            <td>${(controle.RESU_FOB).toFixed(2)}</td>
            <td>${(controle.CAMBIO).toFixed(4)}</td>
            <td>${(controle.RESU_FOB_BR).toFixed(2)}</td>
            <td>${controle.COMISSAO_IBACEM}</td>
            <td>${(controle.DESP_FRETE_CX).toFixed(2)}</td>
            <td>${controle.COMISSAO_REP}</td>
            <td>${controle.CUSTO_PH}</td>
            <td>${controle.FRETE_COLHEITA}</td>
            <td>${controle.FUNRURAL}</td>
            <td>${controle.NET_KG}</td>
            <td>${(controle.VOLUME).toFixed(2)}</td>
            <td>${(soma1).toFixed(2)}</td>
            <td>${controle.ADT_CX_ENTRES}</td>
            <td>${controle.ADT_CX_ETOTAL}</td>
            <td>${controle.ADT_CX_SAIDA}</td>
            <td>${controle.ADT_CX_STOTAL}</td>
            <td>${(soma2).toFixed(2)}</td>
                  
            </tr>`            
          }).join('');
          document.getElementById('saldoComercialValor').innerHTML = `R$  ${total}`;
          document.getElementById('tituloFornecedorComerciais').innerHTML = controls[0].FORNECEDOR;
          document.getElementById('tituloControlesComerciais').innerHTML = `Relatório do Controle ${controls[0].CONTROLE}, ${controls[0].CULTURA} - ${controls[0].VARIEDADE}`;
          return (document.getElementById('containerResumeComercial').innerHTML = objetoInsert);
        })
  openModalComercial();
}
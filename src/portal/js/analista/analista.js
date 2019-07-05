document.getElementById("userName").innerHTML = localStorage.getItem("nome");

const fnPopulaEmpresas = async()=> {
    await axios.get('http://138.204.68.18:3324/api/fornecedores')
    .then(function(response){
        
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
        if(financeiro.valor >= 0){
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.fornecedorCod}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td></tr>`
            );
        }else{
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.fornecedorCod}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td style="background-color: #F2F3E3; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td></tr>`
            );
        }
        
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });
    
}

const fnPopulaFinanceirosFornecedor = async()=> {
  let tokenStr = localStorage.getItem("token");
  await axios.get(`http://138.204.68.18:3323/financeiros/${document.getElementById("select-empresa-financeiro").value}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var financeiros = (response.data).financeiros;
      document.getElementById('containerFinanceiro2').innerHTML = financeiros.map(function (financeiro) {
        if(calcula60(fnConvertData(financeiro.data))){
          if(financeiro.valor >= 0){
            return (
              `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td><td></td><td></td></tr>`
              );
          }else{
            return (
              `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td><td></td></tr>`
              );
          }
        }else{
          if(financeiro.valor >= 0){
            return (
              `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td><td><div><a href="javascript:;" title="Deletar registro" class="deletarUsuario" onclick="openModalDeleteRegistro('${financeiro._id}');"><i class="fas fa-times-circle"></i></a></div></td><td><div><a href="javascript:;" title="Editar registro" class="deletarUsuario" onclick="editRegistroFinanceiro('${financeiro._id}','${fnConvertData(financeiro.data)}','${financeiro.historico}','${financeiro.nf}','${financeiro.valor}');"><i class="fas fa-edit"></i></a></div></tr>`
              );
          }else{
            return (
              `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td>${financeiro.nf}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td><div><a href="javascript:;" title="Deletar registro" class="deletarUsuario" onclick="openModalDeleteRegistro('${financeiro._id}');"><i class="fas fa-times-circle"></i></a></div></td><td><div><a href="javascript:;" title="Editar registro" class="deletarUsuario" onclick="editRegistroFinanceiro('${financeiro._id}','${fnConvertData(financeiro.data)}','${financeiro.historico}','${financeiro.nf}','${financeiro.valor}');"><i class="fas fa-edit"></i></a></div></td></tr>`
              );
          }
        }
        
        
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);

    });

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
    document.getElementById('tbody-controles').innerHTML = controles.map(function (controle) {
        
      if (controle.analisado == false){
        var analisadoAtual = "<a href=\"javascript:;\"><i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"hidden\" class=\"checkboxVisivel\"></i></a>";
      }else{
        var analisadoAtual = "<a href=\"javascript:;\"><i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
      }
      
      var apagar = "<a href=\"javascript:;\"><i class=\"fas fa-trash-alt\"></i></a>"
      var view = "<a href=\"javascript:;\"><i class=\"fas fa-eye\"></i></a>"

      if(controle.comentario!=" "){
        var comentarioAtual = "<a href=\"javascript:;\"><i class=\"fas fa-comment-dots\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
        return (
          "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td><div class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+analisadoAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"openModalComentario('"+controle._id+"','"+controle.comentario+"','"+controle.fornecedorCod+"','"+controle.codigo+"');\">"+comentarioAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"viewControle('"+controle.codigo+"','"+controle.fornecedorCod+"');\">"+view+"</div></td><td><div class=\"tdClicavel\" onclick=\"apagaControle('"+controle._id+"');\">"+apagar+"</div></td></tr>"
          );
      }else{
        var comentarioAtual = "";
        return (
          "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td><div class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+analisadoAtual+"</div></td><td><div>"+comentarioAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"viewControle('"+controle.codigo+"','"+controle.fornecedorCod+"');\">"+view+"</div></td><td><div class=\"tdClicavel\" onclick=\"apagaControle('"+controle._id+"');\">"+apagar+"</div></td></tr>"
          );
      }
      
      
      }).join('');    
        
  })
  .catch(function(error){
      console.warn(error);
    });
  
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

function guardaDados(){
 // window.localStorage.setItem("controleId",document.getElementById("select-controle").value);
  //window.localStorage.setItem("etapa",document.getElementById("select-estagio-qualidade").value);
  uploadGeral(document.getElementById("select-controle-qualidade").value, document.getElementById("select-estagio-qualidade").value);
}


function calcula60(data){
  
  let dia = data.substring(0,2);
  let mes = data.substring(3,5);
  let ano = data.substring(6,10);
  
  if(parseInt(mes) <= 09 ){
    mes = mes.substring(1,2);
  }
  
  dataBusca = new Date(mes+"/"+dia+"/"+ano); 
  now = new Date;
  

  var timeDiff = Math.abs(now.getTime() - dataBusca.getTime());
  var diferenca = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
  
  if (diferenca<=60){
    return false
  }else{
    return true
  }

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

if(localStorage.getItem("acesso")!=="Analista"){
  window.location.replace("index.html");
}


/* FROM ADMIN */
/* FROM ADMIN */
/* FROM ADMIN */
/* FROM ADMIN */
/* FROM ADMIN */

const importarControle = async()=> {
  let valueControle = document.getElementById("input-controle").value;
  let valueAno = document.getElementById("select-ano-safra").value;
  let valueCultura = document.getElementById("select-cultura").value;


  await axios.get(`http://138.204.68.18:3324/api/controles/${valueControle}/${valueAno}/${valueCultura}`)
  .then(function(response){
    let controles = (response.data);
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
        
        if (controle.analisado == false){
          var analisadoAtual = "<a href=\"javascript:;\"><i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"hidden\" class=\"checkboxVisivel\"></i></a>";
        }else{
          var analisadoAtual = "<a href=\"javascript:;\"><i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
        }
        
        var apagar = "<a href=\"javascript:;\"><i class=\"fas fa-trash-alt\"></i></a>"
        var view = "<a href=\"javascript:;\"><i class=\"fas fa-eye\"></i></a>"

        if(controle.comentario!=" "){
          var comentarioAtual = "<a href=\"javascript:;\"><i class=\"fas fa-comment-dots\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
          return (
            "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td><div class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+analisadoAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"openModalComentario('"+controle._id+"','"+controle.comentario+"','"+controle.fornecedorCod+"','"+controle.codigo+"');\">"+comentarioAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"viewControle('"+controle.codigo+"','"+controle.fornecedorCod+"','"+controle.passoAtual+"');\">"+view+"</div></td><td><div class=\"tdClicavel\" onclick=\"apagaControle('"+controle._id+"');\">"+apagar+"</div></td></tr>"
            );
        }else{
          var comentarioAtual = "";
          return (
            "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td><div class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+analisadoAtual+"</div></td><td><div>"+comentarioAtual+"</div></td><td><div class=\"tdClicavel\" onclick=\"viewControle('"+controle.codigo+"','"+controle.fornecedorCod+"','"+controle.passoAtual+"');\">"+view+"</div></td><td><div class=\"tdClicavel\" onclick=\"apagaControle('"+controle._id+"');\">"+apagar+"</div></td></tr>"
            );
        }
        
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);
  });
  rodaTabelas();
  
}



const atualizaControle = async(id,analisado)=> {
  let tokenStr = localStorage.getItem("token");
  let analisadoPor = localStorage.getItem("nome");

 
  await axios.put(`http://138.204.68.18:3323/controles/${id}`, 
              {id:id,
                analisadoPor: analisadoPor,
                analisado: analisado
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
    
    document.getElementById(id).parentElement.classList.remove("fa-times-circle");
    document.getElementById(id).parentElement.classList.add("fa-check-circle");
  }else{
    document.getElementById(id).parentElement.classList.add("fa-times-circle");
    document.getElementById(id).parentElement.classList.remove("fa-check-circle");
  } 
  atualizaControle(id,checkbox.checked);
}





function fnConvertData(data){
  let dia = data.substring(8,10);
  let mes = data.substring(5,7);
  let ano = data.substring(0,4);

  return dia+"/"+mes+"/"+ano;
}

function rodaTabelas(){  
  $('#my-table-analista').dynatable({
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

function filtraEmpresa(){
  var empresaFiltra = document.getElementById("select-empresa-financeiro").options[document.getElementById('select-empresa-financeiro').selectedIndex].innerText;


  document.getElementById("entradaFinanceira").style.display = "block";
  document.getElementById("resultadoFiltraPesquisaFinanceiro").style.display = "block";
  document.getElementById("resultadoPesquisaFinanceiro").style.display = "none";
  document.getElementById("nomeFiltraEmpresa").innerHTML = empresaFiltra;

  fnPopulaFinanceirosFornecedor();
}

function filtraEmpresaControle(){
  var empresaFiltra = document.getElementById("select-empresa-controle").options[document.getElementById('select-empresa-controle').selectedIndex].innerText;


  //document.getElementById("entradaFinanceira").style.display = "block";
  //document.getElementById("resultadoFiltraPesquisaControle").style.display = "block";
  //document.getElementById("resultadoPesquisaFinanceiro").style.display = "none";
  //document.getElementById("nomeFiltraEmpresaControle").innerHTML = empresaFiltra;

  fnPopulaControlesFornecedor();
}

function openModalExibeImportacao() {
  document.getElementById('ModalConfirmarImport').style.display = "block";
}
// Fecha modal exibe importação
function closeModalExibeImportacao() {
  document.getElementById('ModalConfirmarImport').style.display = "none";
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
          break;
          default:
        }

        escondeDivs(fase);
        /*axios.get(`http://138.204.68.18:3324/api/comercial/${fornecedorCod}/${cod}`)
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
              console.log(nettotal)
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
          
        });*/
        
        openModalViewControle();
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
          mercados.push(controles[i].MERCADO);   
          fornecedorCod = controles[i].COD_FORNECEDOR;   
          console.log(controles[i]) ; 
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
        <td>${calibres[i]}</td>
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
            <th width="25%">Mercado</th>
            <th width="25%">Carregamento</th>
            <th width="18%">Qtd. Caixas</th>
            <th width="18%">Peso</th>
          </tr>
        </thead>
        <tbody id="tbody-controles">
        `;

      for(i = 0; i< controles.length; i++){ 
        content+=`<tr>
        <td>${controles[i].MERCADO}</td>
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


fnPopulaControles();
fnPopulaEmpresas();
fnPopulaFinanceiros();

switch (localStorage.getItem("subacesso")){
  case " ":
      //ações para administrador

      break;
  case "controle":
      document.getElementById('default').style.display = "block";
      document.getElementById('abaFinan').style.display = "none";
      document.getElementById('abaQuali').style.display = "none";

      document.getElementById('pageControlesAnalista').style.display = "block";
      document.getElementById('pageFinanceiroAnalista').style.display = "none";
      document.getElementById('pageQualidadeAnalista').style.display = "none";
      break;
  case "financeiro":
      document.getElementById('default').style.display = "none";
      document.getElementById('abaFinan').style.display = "block";
      document.getElementById('abaQuali').style.display = "none";

      document.getElementById('pageControlesAnalista').style.display = "none";
      document.getElementById('pageFinanceiroAnalista').style.display = "block";
      document.getElementById('pageQualidadeAnalista').style.display = "none";
      
      break;
  case "qualidade":
      document.getElementById('default').style.display = "none";
      document.getElementById('abaFinan').style.display = "none";
      document.getElementById('abaQuali').style.display = "block";
      
      document.getElementById('pageControlesAnalista').style.display = "none";
      document.getElementById('pageFinanceiroAnalista').style.display = "none";
      document.getElementById('pageQualidadeAnalista').style.display = "block";
      

      break;
  case "senior":
      document.getElementById('default').style.display = "block";
      document.getElementById('abaFinan').style.display = "block";
      document.getElementById('abaQuali').style.display = "block";
      document.getElementById('pageControlesAnalista').style.display = "block";
      document.getElementById('pageFinanceiroAnalista').style.display = "block";
      document.getElementById('pageQualidadeAnalista').style.display = "block";

      break;
  default:
      //apresentar erro de usuário sem acesso definido.
}


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
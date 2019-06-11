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
  var valueValor = document.getElementById("select-tipo-entrada").value + document.getElementById("input-valor").value;


  await axios.post('http://138.204.68.18:3323/financeiros', 
              {fornecedorCod:valueFornecedorCod,
                data: valueData,
                historico: valueHistorico,
                valor: valueValor.replace(".","")
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
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.fornecedorCod}</td><td>${financeiro.historico}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td></tr>`
            );
        }else{
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.fornecedorCod}</td><td>${financeiro.historico}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td></tr>`
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
        if(financeiro.valor >= 0){
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td></td><td><a href=\"javascript:;\" title=\"Deletar registro\" class=\"deletarUsuario\" onclick=\"openModalDeleteRegistro('"+usuario._id+"');\"><i class=\"fas fa-times-circle\"></i></a></td></tr>`
            );
        }else{
          return (
            `<tr align="center"><td>${fnConvertData(financeiro.data)}</td><td>${financeiro.historico}</td><td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td><td></td><td>R$ ${fnConvertValor(financeiro.valor)}</td><td><a href=\"javascript:;\" title=\"Deletar registro\" class=\"deletarUsuario\" onclick=\"openModalDeleteRegistro('"+usuario._id+"');\"><i class=\"fas fa-times-circle\"></i></a></td></tr>`
            );
        }
        
        
        }).join('');      
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

if(localStorage.getItem("acesso")!=="Analista"){
  window.location.replace("index.html");
}

fnPopulaFinanceiros();



/* FROM ADMIN */
/* FROM ADMIN */
/* FROM ADMIN */
/* FROM ADMIN */
/* FROM ADMIN */

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
        
        if (controle.analisado == false){
          var analisadoAtual = "<a href=\"javascript:;\"><i class=\"fas fa-times-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"hidden\" class=\"checkboxVisivel\"></i></a>";
        }else{
          var analisadoAtual = "<a href=\"javascript:;\"><i class=\"fas fa-check-circle\"><input type=\"checkbox\" id="+controle._id+" value=\"show\" class=\"checkboxVisivel\" checked></i></a>";
        }
        return (
          "<tr align=\"center\"><td>"+controle.codigo+"</td><td>"+fnConvertData(controle.importadoEm)+"</td><td>"+controle.passoAtual+"</td><td>"+controle.importadoPor+"</td><td>"+controle.publicadoPor+"</td><td class=\"tdClicavel\" onclick=\"changeCheckboxState('"+controle._id+"');\">"+analisadoAtual+"</td></tr>"
          );
        
        }).join('');      
  })
  .catch(function(error){
      console.warn(error);
  });

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

fnPopulaControles();
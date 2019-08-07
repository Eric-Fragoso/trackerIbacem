document.getElementById("userName").innerHTML = localStorage.getItem("nome");

function fnConvertData(data){
  let dia = data.substring(8,10);
  let mes = data.substring(5,7);
  let ano = data.substring(0,4);

  return dia+"/"+mes+"/"+ano;
}

const fnPopulaControles = async()=> {
  let tokenStr = localStorage.getItem("token");
  let valueFornecedor = localStorage.getItem("fornecedor");
  let objetoInsert= '';
  let cod;
  let cultura;
  let ano;

  await axios.get(`http://138.204.68.18:3323/controles/fornecedor/${valueFornecedor}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
    
      
      controles.map(async function (controle) {
        
        switch (controle.codigo.length){
          case 9 :
            cod = controle.codigo.substring(0,4);
            cultura = controle.codigo.substring(5,6);
            ano = controle.codigo.substring(7,9);
          break;
          case 8 :
            cod = controle.codigo.substring(0,3);
            cultura = controle.codigo.substring(4,5);
            ano = controle.codigo.substring(6,8);
          break;
          case 7 :
            cod = controle.codigo.substring(0,2);
            cultura = controle.codigo.substring(3,4);
            ano = controle.codigo.substring(5,7);
          break;
          case 6 :
            cod = controle.codigo.substring(0,1);
            cultura = controle.codigo.substring(2,3);
            ano = controle.codigo.substring(4,6);
          break;
          default:
        }

        if(controle.visivel){
              await axios.get(`http://138.204.68.18:3324/api/controles/acompanhamento/${cod}/${ano}/${cultura}`)
              .then(function(resposta){
                var controls = (resposta.data);
                controls.map(function (control) {
                  if (localStorage.getItem("dataInicial")){
                    if(taNoRange(fnConvertData(control.DATA_CONTROLE), localStorage.getItem("dataInicial"), localStorage.getItem("dataFinal"))){
                        objetoInsert = objetoInsert +
                        `<tr align="center">
                              <td>${fnConvertData(control.DATA_CONTROLE)}</td>
                              <td>${control.CONTROLE}</td>
                              <td>${Math.round(control.RECEPCAO)} Kg</td>
                              <td>${Math.round(control.SELECAO)} Kg</td>
                              <td>${Math.round(control.EMBALAMENTO)} Kg</td>
                              <td>${Math.round(control.EXPEDICAO)} Kg</td>
                              <td>${calculaPerda(control.RECEPCAO, control.SELECAO, control.EMBALAMENTO, control.EXPEDICAO)} Kg</td>
                        </tr>`
                        
                    }
                  }else{
                    objetoInsert = objetoInsert +
                    `<tr align="center">
                          <td>${fnConvertData(control.DATA_CONTROLE)}</td>
                          <td>${control.CONTROLE}</td>
                          <td>${Math.round(control.RECEPCAO)} Kg</td>
                          <td>${Math.round(control.SELECAO)} Kg</td>
                          <td>${Math.round(control.EMBALAMENTO)} Kg</td>
                          <td>${Math.round(control.EXPEDICAO)} Kg</td>
                          <td>${calculaPerda(control.RECEPCAO, control.SELECAO, control.EMBALAMENTO, control.EXPEDICAO)} Kg</td>
                    </tr>`
                  }
                      
                  }).join('');  
                
                  return (document.getElementById('containerControles').innerHTML = objetoInsert);
                  
              })
              .catch(function(error){
                console.warn(error);
            });
          }
      }).join('');   
    
      fnPopulaControlesComercial();
     
  })
  .catch(function(error){
      console.warn(error);
  });
  
}  

const fnPopulaControlesComercial = async()=> {
  let tokenStr = localStorage.getItem("token");
  let valueFornecedor = localStorage.getItem("fornecedor");
  let objetoInsert= '';
  await axios.get(`http://138.204.68.18:3323/controles/fornecedor/${valueFornecedor}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
       
      controles.map(function (controle) {
        var cod;
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
        if (controle.passoAtual === "Comercial"){
          axios.get(`http://138.204.68.18:3324/api/comercial/${valueFornecedor}/${cod}`)
          .then(function(resposta){
            var controls = (resposta.data);
            var entradas = 0;
            var cultura = '';
            var variedade = '';
            var pesoTotal = 0;
            controls.map(function (control) {
              entradas++;
              cultura = control.CULTURA;
              data = fnConvertData(control.DATA_EMBARQUE);
              variedade = control.VARIEDADE;
              pesoTotal = pesoTotal + (control.QTD_CAIXA * control.TIPO_CX);
            }).join(''); 
            if (localStorage.getItem("dataInicialComercial")){ 
              if(taNoRange(data, localStorage.getItem("dataInicialComercial"), localStorage.getItem("dataFinalComercial"))){
                objetoInsert = objetoInsert +
                  `<tr align="center">
                        <td>${data}</td>
                        <td>${controle.codigo}</td>
                        <td>${entradas}</td>
                        <td>${cultura} </td>
                        <td>${variedade}</td>
                        <td>${pesoTotal} Kg</td>
                        <td><a href="javascript:;" onclick="carregaResumoComercial(${valueFornecedor},${cod})" class="editarControleProdutor"><i class="far fa-eye"></i> Ver relatório</a></td>
                  </tr>`
              }
            }else{
              objetoInsert = objetoInsert +
              `<tr align="center">
                    <td>${data}</td>
                    <td>${controle.codigo}</td>
                    <td>${entradas}</td>
                    <td>${cultura} </td>
                    <td>${variedade}</td>
                    <td>${pesoTotal} Kg</td>
                    <td><a href="javascript:;" onclick="carregaResumoComercial(${valueFornecedor},${cod})" class="editarControleProdutor"><i class="far fa-eye"></i> Ver relatório</a></td>
              </tr>`
            }
            return (document.getElementById('containerControlesComercial').innerHTML = objetoInsert);
          })
          .catch(function(error){
            console.warn(error);
        });
      }
      }).join('');   
      fnPopulaFinanceiros();  

  })
  .catch(function(error){
      console.warn(error);
  });
  

} 
async function carregaResumoComercial(fornecedorCod, controleCod){
  let objetoInsert= '';
  await axios.get(`http://138.204.68.18:3324/api/relatorio/${fornecedorCod}/${controleCod}`)
        .then(function(resposta){
          var controls = (resposta.data);

          controls.map(function(controle){
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
                  <td>${controle.VALOR_BRUTO_CX}</td>
                  <td>${controle.VALOR_COMISSAOIMP_CX}</td>
                  <td>${controle.DESC_COMERCIAL}</td>
                  <td>${controle.OUTRAS_DESP_CX}</td>
                  <td>${controle.RESU_FOB}</td>
                  <td>${controle.COMISSAO_IBACEM}</td>
                  <td>${controle.DESP_FRETE_CX}</td>
                  <td>${controle.COMISSAO_REP}</td>
                  <td>${controle.CUSTO_PH}</td>
                  <td>${controle.FRETE_COLHEITA}</td>
                  <td>${controle.FUNRURAL}</td>
                  <td>${controle.NET_KG}</td>
                  <td>${controle.VOLUME}</td>
                  <td>${controle.RESU_FOB_BR - controle.COMISSAO_IBACEM - controle.DESP_FRETE_CX - controle.COMISSAO_REP - controle.CUSTO_PH - controle.FRETE_COLHEITA - controle.FUNRURAL}</td>
                  <td>${controle.ADT_CX_ENTRES}</td>
                  <td>${controle.ADT_CX_ETOTAL}</td>
                  <td>${controle.ADT_CX_SAIDA}</td>
                  <td>${controle.ADT_CX_STOTAL}</td>
                  <td>${controle.RESU_FOB_BR - controle.COMISSAO_IBACEM - controle.DESP_FRETE_CX - controle.COMISSAO_REP - controle.CUSTO_PH - controle.FRETE_COLHEITA - controle.FUNRURAL - controle.ADT_CX_ETOTAL - controle.ADT_CX_STOTAL}</td>
                  <td><a href="javascript:;" onclick="imprimeResumoComercial(${controle})" class="editarControleProdutor"><i class="fas fa-print"></i>  Imprimir</a></td>
            </tr>`            
          }).join('');
          return (document.getElementById('containerResumeComercial').innerHTML = objetoInsert);
        })
  openModalComercial();
}


/*
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
*/

const fnPopulaFinanceiros = async()=> {
  let tokenStr = localStorage.getItem("token");
  let valueFornecedor = localStorage.getItem("fornecedor");
  let objetoInsert="";
  const qtdEntradas = 8; //Valor do número das útimas entradas que serão exibidas do produtor
  await axios.get(`http://138.204.68.18:3323/financeiros/${valueFornecedor}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var financeiros = (response.data).financeiros;
    var saldo = 0;
    var contador = 0;
      financeiros.map(function (financeiro) {
        if (localStorage.getItem("dataInicialFinanceiro")){ 
          if(taNoRange(fnConvertData(financeiro.data), localStorage.getItem("dataInicialFinanceiro"), localStorage.getItem("dataFinalFinanceiro"))){
            saldo = saldo + financeiro.valor ;  
            if(contador >=(financeiros.length-(qtdEntradas))){
                if(financeiro.valor > 0){
                  objetoInsert = objetoInsert +
                      `<tr align="center">
                            <td>${fnConvertData(financeiro.data)}</td>
                            <td>${financeiro.historico}</td>
                            <td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td>
                            <td>R$ ${fnConvertValor(financeiro.valor)}</td>
                            <td></td>
                            <td>R$ ${fnConvertValor(saldo)}</td>
                      </tr>`
                }else{
                  objetoInsert = objetoInsert +
                      `<tr align="center">
                            <td>${fnConvertData(financeiro.data)}</td>
                            <td>${financeiro.historico}</td>
                            <td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td>
                            <td></td>
                            <td>R$ ${fnConvertValor(financeiro.valor)}</td>
                            <td>R$ ${fnConvertValor(saldo)}</td>
                      </tr>`
                }
            }
          }
        }else{
          saldo = saldo + financeiro.valor ;  
            if(contador >=(financeiros.length-(qtdEntradas))){
                if(financeiro.valor > 0){
                  objetoInsert = objetoInsert +
                      `<tr align="center">
                            <td>${fnConvertData(financeiro.data)}</td>
                            <td>${financeiro.historico}</td>
                            <td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td>
                            <td>R$ ${fnConvertValor(financeiro.valor)}</td>
                            <td></td>
                            <td>R$ ${fnConvertValor(saldo)}</td>
                      </tr>`
                }else{
                  objetoInsert = objetoInsert +
                      `<tr align="center">
                            <td>${fnConvertData(financeiro.data)}</td>
                            <td>${financeiro.historico}</td>
                            <td width="1%" style="background-color: #F2F3E3; color:#F2F3E3"></td>
                            <td></td>
                            <td>R$ ${fnConvertValor(financeiro.valor)}</td>
                            <td>R$ ${fnConvertValor(saldo)}</td>
                      </tr>`
                }
            }
        }
        contador++;
        
        document.getElementById('valorSaldoProdutor').innerHTML ='R$ ' + fnConvertValor(saldo);
        
        }).join('');   
        return (document.getElementById('containerFinanceiro').innerHTML = objetoInsert);   
  })
  .catch(function(error){
      console.warn(error);

    });
    fnPopulaControlesQualidade();
}


const fnPopulaControlesQualidade = async()=> {
  let tokenStr = localStorage.getItem("token");
  let valueFornecedor = localStorage.getItem("fornecedor");
  let objetoInsert="";
  
  await axios.get(`http://138.204.68.18:3323/controles/fornecedor/${valueFornecedor}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var controles = (response.data).controles;
      controles.map(function (controle) {
        if(controle.visivel){
          objetoInsert = objetoInsert +`<tr align="center"><td>${controle.codigo}</td>`;
          if(controle.qRecepcao){
            objetoInsert = objetoInsert + `<td><a href="javascript:;" onclick="linkPdf('${controle._id}', 'Recepcao');" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Relatório</a></td>`;
          }else{
            objetoInsert = objetoInsert + `<td></td>`;
          }

          if(controle.qSelecao){
            objetoInsert = objetoInsert + `<td><a href="javascript:;" onclick="linkPdf('${controle._id}', 'Selecao');" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Relatório</a></td>`;
          }else{
            objetoInsert = objetoInsert + `<td></td>`;
          }

          if(controle.qEmbalamento){
            objetoInsert = objetoInsert + `<td><a href="javascript:;" onclick="linkPdf('${controle._id}', 'Embalamento');" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Relatório</a></td>`;
          }else{
            objetoInsert = objetoInsert + `<td></td>`;
          }

          if(controle.qExpedicao){
            objetoInsert = objetoInsert + `<td><a href="javascript:;" onclick="linkPdf('${controle._id}', 'Expedicao');" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Relatório</a></td>`;
          }else{
            objetoInsert = objetoInsert + `<td></td>`;
          }
            objetoInsert = objetoInsert + `</tr>`;
        } 
        }).join('');   
        return (document.getElementById('containerQualidade').innerHTML = objetoInsert);  
        
  })
  .catch(function(error){
      console.warn(error);

    });
    
    setTimeout(rodaTabelas, 500);  
  
    
}  

function rodaTabelas(){
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
  $('#my-table-comercial').dynatable({
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
  $('#my-table-qualidade').dynatable({
    features: {
      paginate: false,
      sort: true,
      pushState: false,
      search: true,
      recordCount: false,
      perPageSelect: false,            
    }
  });
}

function galeria(controleId, etapa) {
  let tokenStr = localStorage.getItem("token");
  let items= [];
  axios.get(`http://138.204.68.18:3323/images/${controleId}/${etapa}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var images = (response.data).images;
        images.map(function (image) {
          if(fnPegaExtensao(image.path)!=="pdf"){
            items.push(image.path);
          }
        }).join('');   
        SimpleLightbox.open({items});
        return ""     
  })
  .catch(function(error){
      console.warn(error);
    });
}


function linkPdf(controleId, etapa) {
  let tokenStr = localStorage.getItem("token");
  axios.get(`http://138.204.68.18:3323/images/${controleId}/${etapa}`,{ headers: {"Authorization" : `Bearer ${tokenStr}`} })
  .then(function(response){
    var images = (response.data).images;
        images.map(function (image) {
          if(fnPegaExtensao(image.path)==="pdf"){
            return window.open(image.path);
          }
        }).join('');               
  })
  .catch(function(error){
      console.warn(error);
    });
}

function fnConvertData(data){
  let dia = data.substring(8,10);
  let mes = data.substring(5,7);
  let ano = data.substring(0,4);

  return dia+"/"+mes+"/"+ano;
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

function fnPegaExtensao(caminho){
  return caminho.substring(caminho.length-3,caminho.length);
}

if(localStorage.getItem("acesso")!=="Produtor"){
  window.location.replace("index.html");
}


function imprimirExtrato(){
  
  var conteudo = document.getElementById('my-table-financeiro').innerHTML;
  var saldoG = document.getElementById('valorSaldoProdutor').innerHTML;
    localStorage.removeItem("print");
    localStorage.setItem("print", conteudo);
    localStorage.removeItem("saldoG");
    localStorage.setItem("saldoG", saldoG);
    var myWindow=window.open('page-produtor-print.html');

}
function imprimirResumo(){
  
  var conteudoResumo = document.getElementById('my-table').innerHTML;
    localStorage.removeItem("conteudoResumo");
    localStorage.setItem("conteudoResumo", conteudoResumo);
    var myWindow2=window.open('page-produtor-resumo-print.html');

}

function calculaPerda(f1=0,f2=0,f3=0,f4=0,f5=0){
  if(f5){
    return Math.round(f1-f5);
  }else{ 
    if (f4){
      return Math.round(f1-f4);
    }else{
      if(f3){
        return Math.round(f1-f3);
      }else{
        if(f2){
          return Math.round(f1-f2);
        }else{
          return 0;
        }
      }
    }
  }
}

function filtrarData(){
  localStorage.removeItem("dataInicial");
  localStorage.removeItem("dataFinal");

  if(document.getElementById('input-filtroData').value !=""){
    var dataIncial = (document.getElementById('input-filtroData').value).substring(6,10) + 
                    (document.getElementById('input-filtroData').value).substring(3,5) +
                    (document.getElementById('input-filtroData').value).substring(0,2);

    var dataFinal = (document.getElementById('input-filtroData').value).substring(19,23) + 
                    (document.getElementById('input-filtroData').value).substring(16,18) +
                    (document.getElementById('input-filtroData').value).substring(13,15);    

    localStorage.removeItem("dataInicial");
    localStorage.setItem("dataInicial", dataIncial);

    localStorage.removeItem("dataFinal");
    localStorage.setItem("dataFinal", dataFinal);
    document.getElementById('filtrarRange').style.display = "none";
    document.getElementById('apagarRange').style.display = "block";
    document.getElementById('input-filtroData').disabled = true;
    
  }
fnPopulaControles();

}


function filtrarDataComercial(){
  localStorage.removeItem("dataInicialComercial");
  localStorage.removeItem("dataFinalComercial");

  if(document.getElementById('input-filtroData2').value !=""){
    var dataInicialComercial = (document.getElementById('input-filtroData2').value).substring(6,10) + 
                    (document.getElementById('input-filtroData2').value).substring(3,5) +
                    (document.getElementById('input-filtroData2').value).substring(0,2);

    var dataFinalComercial = (document.getElementById('input-filtroData2').value).substring(19,23) + 
                    (document.getElementById('input-filtroData2').value).substring(16,18) +
                    (document.getElementById('input-filtroData2').value).substring(13,15);    

    localStorage.removeItem("dataInicialComercial");
    localStorage.setItem("dataInicialComercial", dataInicialComercial);

    localStorage.removeItem("dataFinalComercial");
    localStorage.setItem("dataFinalComercial", dataFinalComercial);
    document.getElementById('filtrarRange2').style.display = "none";
    document.getElementById('apagarRange2').style.display = "block";
    document.getElementById('input-filtroData2').disabled = true;
    
  }
  fnPopulaControlesComercial();

}


function filtrarDataFinanceiro(){
  localStorage.removeItem("dataInicialFinanceiro");
  localStorage.removeItem("dataFinalFinanceiro");

  if(document.getElementById('input-filtroData3').value !=""){
    var dataInicialFinanceiro = (document.getElementById('input-filtroData3').value).substring(6,10) + 
                    (document.getElementById('input-filtroData3').value).substring(3,5) +
                    (document.getElementById('input-filtroData3').value).substring(0,2);

    var dataFinalFinanceiro = (document.getElementById('input-filtroData3').value).substring(19,23) + 
                    (document.getElementById('input-filtroData3').value).substring(16,18) +
                    (document.getElementById('input-filtroData3').value).substring(13,15);    

    localStorage.removeItem("dataInicialFinanceiro");
    localStorage.setItem("dataInicialFinanceiro", dataInicialFinanceiro);

    localStorage.removeItem("dataFinalFinanceiro");
    localStorage.setItem("dataFinalFinanceiro", dataFinalFinanceiro);
    document.getElementById('filtrarRange3').style.display = "none";
    document.getElementById('apagarRange3').style.display = "block";
    document.getElementById('input-filtroData3').disabled = true;
    
  }
  fnPopulaFinanceiros();  

}

function limpaFiltro(){
  localStorage.removeItem("dataInicial");
  localStorage.removeItem("dataFinal");
  document.getElementById('input-filtroData').value = "";
  document.getElementById('filtrarRange').style.display = "block";
  document.getElementById('apagarRange').style.display = "none";
  document.getElementById('input-filtroData').disabled = false;
  fnPopulaControles();
}

function limpaFiltroComercial(){
  localStorage.removeItem("dataInicialComercial");
  localStorage.removeItem("dataFinalComercial");
  document.getElementById('input-filtroData2').value = "";
  document.getElementById('filtrarRange2').style.display = "block";
  document.getElementById('apagarRange2').style.display = "none";
  document.getElementById('input-filtroData2').disabled = false;
  fnPopulaControlesComercial();
}

function limpaFiltroFinanceiro(){
  localStorage.removeItem("dataInicialFinanceiro");
  localStorage.removeItem("dataFinalFinanceiro");
  document.getElementById('input-filtroData3').value = "";
  document.getElementById('filtrarRange3').style.display = "block";
  document.getElementById('apagarRange3').style.display = "none";
  document.getElementById('input-filtroData3').disabled = false;
  fnPopulaFinanceiros();  
}


function taNoRange(dataAlvo, inicial, final){
  dataCalculo = dataAlvo.substring(6,10)+dataAlvo.substring(3,5)+dataAlvo.substring(0,2);
  
  if (dataCalculo >= inicial && dataCalculo <= final){
    return true;
  }
  return false;  
  
}

localStorage.removeItem("dataInicial");
localStorage.removeItem("dataFinal");
localStorage.removeItem("dataInicialComercial");
localStorage.removeItem("dataFinalComercial");
fnPopulaControles();

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
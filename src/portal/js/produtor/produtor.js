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
                        <td><a href="javascript:;" onclick="geraPDF(${valueFornecedor},${cod})" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Gerar PDF</a></td>
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
                    <td><a href="javascript:;" onclick="geraPDF(${valueFornecedor},${cod})" class="editarControleProdutor"><i class="fas fa-file-pdf"></i> Gerar PDF</a></td>
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
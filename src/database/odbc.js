let connection;
var oracledb = require("oracledb");

(async function(){
    try{
        connection = await oracledb.getConnection({
            user:'leitura',
            password:'leitura',
            connectString:'10.0.1.3:1521/MEGA'
        });
        connection.execute(
            `select vp.ANO, 
                    vp.MES,
                    to_number(to_char(to_date(vp.DATA,'DD/MM/YYYY'),'WW')) as SEMANA, 
                    vp.DATA,       
                    decode(upper(substr(vp.SAFRA,1,1)),
                        'M','Manga'
                        ,'U','Uva'
                        ,'C','Cacau','Outra') as CULTURA,
            vp.VARIEDADE,
            vp.CONTROLE,
            sum(vp.PESO) as VOLUME_KG
                                                                                                                         
            from mgagr.agr_bi_visaoprodutivaph_dq vp
            where vp.PROCESSO = 1
            group by
                vp.ANO,
                vp.MES,
                to_number(to_char(to_date(vp.DATA,'DD/MM/YYYY'),'WW')),
                vp.DATA,
                decode(upper(substr(vp.SAFRA,1,1)),'M','Manga'
                                        ,'U','Uva'
                                        ,'C','Cacau','Outra'),
                vp.VARIEDADE,
                vp.CONTROLE`,
                [],  
           function(err, result) {
              if (err) {
                console.error(err.message);
                return;
              }
              console.log(result.rows);
           });
       });
    } catch(err){
        console.log("Error: ", err)
    }finally{
        if (connection){
            try{
                await connection.close();
            } catch(err){
                console.log("erro fechando a conexão:", err);
            }
        }
    }

})()
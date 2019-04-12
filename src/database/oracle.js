process.env.ORA_SDTZ = 'UTC';

const oracledb = require('oracledb');
const {user, password, connectString} = require('../config/oracle.json')

let connection;
var sql, binds, options, result;

async function conectar() {
    try {  
        connection = await oracledb.getConnection(  {
            user,        
            password,    
            connectString,
        });

        busca();
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
        }
    }
};

async function busca(){
    sql = `select vp.COD_FORNECEDOR,
            vp.ANO,
            vp.MES,
            to_number(to_char(to_date(vp.DATA,'DD/MM/YYYY'),'WW')) as SEMANA,
            vp.DATA,
            decode(upper(substr(vp.SAFRA,1,1)),'M','Manga'
                                            ,'U','Uva'
                                            ,'C','Cacau','Outra') as CULTURA,
            vp.VARIEDADE,
            vp.CONTROLE,
            vp.SAFRA,
            sum(vp.PESO) as VOLUME_KG
                                                                                                                            
        from mgagr.agr_bi_visaoprodutivaph_dq vp
        where vp.PROCESSO = 1 AND vp.COD_FORNECEDOR = 83
        group by
            vp.COD_FORNECEDOR,
            vp.ANO,
            vp.MES,
            to_number(to_char(to_date(vp.DATA,'DD/MM/YYYY'),'WW')),
            vp.DATA,
            decode(upper(substr(vp.SAFRA,1,1)),'M','Manga'
                                            ,'U','Uva'
                                            ,'C','Cacau','Outra'),
            vp.VARIEDADE,
            vp.CONTROLE,
            vp.SAFRA
        order by vp.DATA
        `;

    binds = {};

    // For a complete list of options see the documentation.
    options = {
      outFormat: oracledb.OBJECT   // query result format
      // extendedMetaData: true,   // get extra metadata
      // fetchArraySize: 100       // internal buffer allocation size for tuning
    };

    result = await connection.execute(sql, binds, options);

    console.log("Column metadata: ", result.metaData);
    console.log("Query results: ");
    console.log(result.rows);

}


conectar();
module.exports = oracledb;
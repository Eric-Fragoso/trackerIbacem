// Using a fixed Oracle time zone helps avoid machine and deployment differences
process.env.ORA_SDTZ = 'UTC';

var oracledb = require('oracledb');

async function run() {
  let connection;

  try {

    let sql, binds, options, result;

    connection = await oracledb.getConnection(  {
      user          : 'leitura',
      password      : 'leitura',
      connectString : '10.0.1.3:1521/MEGA'
    });

   

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
        where vp.PROCESSO = 1 
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
}

run();


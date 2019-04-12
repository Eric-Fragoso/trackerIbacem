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
        console.log("conectou com o banco sem problemas");
        
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

async function busca(sql){
    try {  
        connection = await oracledb.getConnection(  {
            user,        
            password,    
            connectString,
        });
        //  colocar aqui ações da função
            
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

            return (result.rows);
        // final das ações de sucesso
        
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


busca(`select  f.FAGR_IN_CODIGO AS COD_FORNECEDOR,
f.FAGR_ST_NOME AS FORNECEDOR
from mgagr.AGR_FAGRICOLA f`);
module.exports = oracledb;
let connection;
var oracledb = require("oracledb");

(async function(){
    try{
        connection = await oracledb.getConnection({
            user:'leitura',
            password:'leitura',
            connectString:'10.0.1.3:1521/MEGA'
        });
        console.log("conexão realizada com sucesso");
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
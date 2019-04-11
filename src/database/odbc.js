let connection;
var oracledb = require("oracledb");

(async function(){
    try{
        connection = await oracledb.getConnection({
            user:'ibacem',
            password:'ibc1763!',
            connectString:'138.204.68.18:3322/MEGA'
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
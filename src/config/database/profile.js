const { createPool } = require('mysql');

const pool = createPool({
    host: 'localhost',
    user: 'royal',
    password: 'royal',
    database: 'profiles',
    connectionLimit: 10
});

pool.query(``,(err, result, fields)=>{
    if(err)
    {
        return ()=>{}
    }
    return ()=>{}
});

module.exports = pool;
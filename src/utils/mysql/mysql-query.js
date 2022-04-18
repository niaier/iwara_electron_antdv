const mysql = require('mysql')

export const mysqlQuery = function (config, sql, values = []) {
  console.log(config, sql, values);
  const pool = mysql.createPool(config)
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err)
      connection.query(sql, values, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
        connection.release()
      })
    })

  }).catch(() => { })
}

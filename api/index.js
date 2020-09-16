const { query } = require('../lib/stardog')

module.exports = ({ router }) => {

  return router.post('/user', async function (req, res) {
    const { 姓名, 用户名 } = req.body

    const resp = await query(`
      INSERT {
        :user:${用户名} a :用户 ;
          :用户名 "${用户名}" ;
          :姓名 "${姓名}" ;
      }
      WHERE {
        MINUS {
          :user:${用户名} a :用户 ;
          :用户名 "${用户名}" .
        }
      }
    `)

    res.json({ status: 200 })
  })
}

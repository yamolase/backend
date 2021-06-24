const express =  require('express')
const app = express()
const auth = require('../middlewares/auth.js')
const cors = require('cors')
app.use(cors())

app.use(express.urlencoded({extended:true}))
app.use(express.json())

const mysql = require('mysql')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todolist"
});
app.post('/', (req, res, next) => {
    con.query('select count(*) as jumlah_user from tabel_user', function(err, result){
        if (result[0].jumlah_user > 0){
            auth(req, res, next)
        } else {
            next()
        }
    })
},(req,res)=> {
    con.query('insert into tabel_user (username, password) values (?,?)', [req.body.username,req.body.password], function(err, result){
        if(err){
            res.end(500)
            return
        }
        res.json({id: result.insertId, username: req.body.username})
    })   
}) 

app.get('/', auth, (req ,res) => {
    con.query("SELECT * FROM tabel_user", function (err, result) {
        res.json(result)
        res.end()
    });
})

app.delete('/:id',auth, (req, res)=> {
    con.query('select count(*) as jumlah_user from tabel_user', function(err, result){
        if (result[0].jumlah_user == 1){
            res.send()
        } 
        else {
            con.query('DELETE FROM tabel_user WHERE id = ?', [req.params.id])
        }
    })             
    res.end()
})
 
module.exports = app;
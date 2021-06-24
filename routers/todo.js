const express =  require('express')
const app = express()

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


app.post('/',(req,res)=> {  
    con.connect(function(err,result){
        const kata = req.body.deskripsi
        con.query("insert into tabel_todo(deskripsi) values (?)",[kata], function(err,result){
            res.json({id: result.insertId})
        })
        
    })
    
})

app.get('/', (req ,res) => {
    con.connect(function(err) {     
        var data ="" 
        con.query("SELECT * FROM tabel_todo", function (err, result) {
            res.json(result)
            res.end()
        });
      });
})

app.delete('/:id', (req, res)=> {
    con.query('DELETE FROM tabel_todo WHERE id = ?', [req.params.id]); 
    res.end()
})


module.exports = app;
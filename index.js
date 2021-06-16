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


app.get('/', (req,res) => {
    res.send(`
    <html>
        <body>
            <form action="/todo" method="post">
                <input name="deskripsi" />
                <button>Add</button>
            </form>
        </body>
    </html>`)
})

//insert to database
app.post('/todo',(req,res)=> {  
    con.connect(function(err){
        const kata = req.body.deskripsi
        con.query("insert into tabel_todo(deskripsi) values (?)",[kata])
    })
    res.end() 
})

app.get('/todo', (req ,res) => {
    con.connect(function(err) {     
        var data ="" 
        con.query("SELECT * FROM tabel_todo", function (err, result) {
            console.log({id: result.id})
            res.json(result)
            res.end()
        });
      });
})

app.delete('/todo/:id', (req, res)=> {
    con.query('DELETE FROM tabel_todo WHERE id = ?', [req.params.id]); 
    res.end()
})

app.listen(3000,function() {
    console.log("server udah jalan bos")
})
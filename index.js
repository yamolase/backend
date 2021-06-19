const express =  require('express')
const cors = require('cors')
const routerTodo = require('./routers/todo.js')
const routerUser = require('./routers/user.js')
const auth = require('./middlewares/auth.js')

const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use('/todo', auth, routerTodo)
app.use('/user', routerUser)

app.listen(3080,function() {
    console.log("server is listening on port", this.address().port)
})
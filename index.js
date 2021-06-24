const express = require('express');
const cors = require('cors');
const Websocket = require('ws');
const http = require('http');

const routerTodo = require('./routers/todo.js');
const routerUser = require('./routers/user.js');
const auth = require('./middlewares/auth.js');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/todo', auth, routerTodo);
app.use('/user', routerUser);

app.get('/', (req, res) => {
    res.send(`
      <html>
        <body>
          <form action="/todo" method="post">
            <input name="description" />
              <button>Add</button>
          </form>
        </body>
      </html>`);
});

const server = http.createServer(app);
const wsServer = new Websocket.Server({ noServer: true });

wsServer.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        wsServer.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === Websocket.OPEN) {
                client.send(data);
            }
        });
    });
});

server.on('upgrade', function (request, socket, head) {
    wsServer.handleUpgrade(request, socket, head, function (ws) {
        wsServer.emit('connection', ws, request);
    });
});

server.listen(3080, function () {
    console.log('server is listening on port', this.address().port);
});

var http = require('http');
const mysql = require('mysql2');
const url = require('url');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'order_form'
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected!');
});

const server = http.createServer((req,res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.method === 'GET' && parsedUrl.pathname === '/users') {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) {
                res.writeHead(500);
                return res.end('Database error');
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(results));
        });
        
    }else if (req.method === 'POST' && parsedUrl.pathname === '/users') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        })

        req.on('end', () => {
            try {
                const { name, email, item } = JSON.parse(body);
                db.query('INSERT INTO users (name, email, item) VALUES (?, ?)', [name, email, item], (err) => {
                    if (err) {
                        res.writeHead(500);
                        return res.end('Insert failed');
                    }
                    res.writeHead(200);
                    res.end('User added!');
                });
             }  catch (e) {
                res.writeHead(400);
                res.end('Invalid JSON');
             }  
        });
    
    }else {
        res.writeHead(404);
        res.end('Not Found');
    }
}).listen(8000);

console.log('Server running on http://localhost:8000');
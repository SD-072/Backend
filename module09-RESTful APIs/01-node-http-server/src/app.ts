import http, { type RequestListener } from 'node:http';

const users = [
  { id: '1', name: 'john doe', age: 20 },
  {
    id: '2',
    name: 'Jane Doe',
    age: 20,
  },
];

const requestHandler: RequestListener = (req, res) => {
  const { method, url } = req;
  const singleUserRegex = /^\/users\/[0-9a-zA-Z]+$/;

  if (url === '/users') {
    if (method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(users));
    }

    if (method == 'POST') {
      let body = '';

      req.on('data', (chuck) => {
        body += chuck;
      });

      req.on('end', () => {
        const parsedBody = JSON.parse(body);

        // bulk creation [ {"name": "Mark Smith", age: 31} ]
        if (Array.isArray(parsedBody)) {
          parsedBody.forEach((user) => {
            const newUser = { id: crypto.randomUUID(), ...user };
            users.push(newUser);
          });
        } else {
          // single user creation
          const newUser = { id: crypto.randomUUID(), ...parsedBody };
          users.push(newUser);
        }

        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(users));
      });
      return;
    }
  }

  if (singleUserRegex.test(url!)) {
    const id = url?.split('/')[2];

    if (method === 'GET') {
      const user = users.find((u) => {
        return u.id === id;
      });

      if (!user) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        return res.end('User not found');
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(user));
    }

    if (method == 'PUT') {
    }

    if (method == 'DELETE') {
    }
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'text/plain');
  res.end(`${method} is not allowed`);
};

const server = http.createServer(requestHandler);

const port = 3000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}/`));

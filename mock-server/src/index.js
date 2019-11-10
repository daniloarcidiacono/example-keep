import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const publicUrls = [ '/login' ];

let users = {
    "root": "root",
    "john": "john"
};

let tokens = {
    "test": "root"
};

let notes = {
    "root": [
        {
            "id": 1,
            "title": "Grocery list",
            "content": "1) Apples\n2) Steak",
            "color": "#FFFFFF",
            "archived": false,
            "rank": 0
        }
    ],
    "john": []
};

Array.prototype.executeOn = function(condition, callback) {
  for (let i = 0; i < this.length; i++) {
      if (condition(this[i], i)) {
          callback(this[i], i);
      }
  }
};

Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

// https://www.robinwieruch.de/node-js-express-tutorial
const app = express();

app.use(cors());

// Parses the text as JSON and exposes the resulting object on req.body.
app.use(express.json());

// Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
// and exposes the resulting object (containing the keys and values) on req.body.
app.use(express.urlencoded({ extended: true }));

// Security filter
app.use((req, res, next) => {
    // Skip public URLs
    if (req.path.startsWith('/api-docs') || publicUrls.indexOf(req.path) !== -1) {
        next();
        return;
    }

    // Authenticate
    const token = req.get('x-token');
    if (!token) {
        res.status(401);
        return res.send({
            "message": "Missing X-TOKEN header"
        });
    } else if (!tokens.hasOwnProperty(token)) {
        res.status(401);
        return res.send({
            "message": "Invalid X-TOKEN"
        });
    }

    // Inject
    req.user = tokens[token];

    // Passing the request to the next handler in the stack.
    next();
});

/**
 * @swagger
 * /notes:
 *    get:
 *      summary: Gets all notes of a user
 *      tags: [keep]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: query
 *            name: archived
 *            schema:
 *              type: boolean
 *            description: Whether to retrieve archived posts only
 *          - in: header
 *            name: X-TOKEN
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *       200:
 *         description: posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   color:
 *                     type: string
 *                   archived:
 *                     type: boolean
 *                   rank:
 *                     type: number
 */
app.get('/notes', (req, res) => {
    // req.query.archived is a string!
    let archived = req.query.archived === 'true';
    res.send(notes[req.user].filter(x => x.archived === archived).sort((a, b) => a.rank - b.rank));
});

/**
 * @swagger
 * /notes:
 *    post:
 *      summary: Creates a new note for a user
 *      tags: [keep]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: header
 *            name: X-TOKEN
 *            schema:
 *              type: string
 *            required: true
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   content:
 *                     type: string
 *                   color:
 *                     type: string
 *                   rank:
 *                     type: number
 *                 required:
 *                   - title
 *                   - content
 *      responses:
 *       200:
 *         description: note created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
app.post('/notes', (req, res) => {
    const note = {
        id: notes[req.user].length + 1,
        title: req.body.title,
        content: req.body.content,
        color: req.body.color,
        archived: false,
        rank: req.body.rank
    };
    notes[req.user].push(note);

    res.send({ id: note.id });
});

/**
 * @swagger
 * /notes/{id}/archive:
 *    post:
 *      summary: Archives a note
 *      tags: [keep]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the id of the note to archive
 *          - in: header
 *            name: X-TOKEN
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *       204:
 *         description: note archived
 */
app.post('/notes/:id/archive', (req, res) => {
    notes[req.user].executeOn(x => x.id === parseInt(req.params.id), (item) => {
        item.archived = true;
    });

    res.status(204).send();
});

/**
 * @swagger
 * /notes/{id}:
 *    put:
 *      summary: Updates a note
 *      tags: [keep]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the id of the note to delete
 *          - in: header
 *            name: X-TOKEN
 *            schema:
 *              type: string
 *            required: true
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               color:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *      responses:
 *       204:
 *         description: note updated
 */
app.put('/notes/:id', (req, res) => {
    notes[req.user].executeOn(x => x.id === parseInt(req.params.id), (item) => {
        item.title = req.body.title;
        item.content = req.body.content;
        item.color = req.body.color;
    });

    res.status(204).send();
});

/**
 * @swagger
 * /notes/{id}/rank/{rank}:
 *    put:
 *      summary: Updates a note's rank
 *      tags: [keep]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the id of the note to delete
 *          - in: path
 *            name: rank
 *            schema:
 *              type: number
 *            required: true
 *            description: the rank of the note
 *          - in: header
 *            name: X-TOKEN
 *            schema:
 *              type: string
 *            required: true
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               color:
 *                 type: string
 *             required:
 *               - title
 *               - content
 *      responses:
 *       204:
 *         description: note rank updated
 */
app.put('/notes/:id/rank/:rank', (req, res) => {
    notes[req.user].executeOn(x => x.id === parseInt(req.params.id), (item) => {
        item.rank = parseInt(req.params.rank);
    });

    res.status(204).send();
});

/**
 * @swagger
 * /notes/{id}:
 *    delete:
 *      summary: Deletes a note
 *      tags: [keep]
 *      produces:
 *          - application/json
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: the id of the note to delete
 *          - in: header
 *            name: X-TOKEN
 *            schema:
 *              type: string
 *            required: true
 *      responses:
 *       204:
 *         description: note deleted
 */
app.delete('/notes/:id', (req, res) => {
    notes[req.user].removeIf(x => x.id === parseInt(req.params.id));
    res.status(204).send();;
});

/**
 * @swagger
 * /login:
 *    post:
 *      summary: Performs a login
 *      tags: [idp]
 *      produces:
 *          - application/json
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *      responses:
 *       200:
 *         description: login success
 *       401:
 *         description: login failure
 */
app.post('/login', (req, res) => {
    if (users.hasOwnProperty(req.body.username) && req.body.password === users[req.body.username]) {
        // 200 Ok
        const token = uuidv4();
        tokens[token] = req.body.username;
        res.send({ token });
        return;
    }

    // 401 Unauthorized
    res.status(401);
    res.send({ "message": "Incorrect credentials" });
});

// Error handling
app.use((err, req, res, next) => {
    res.status(err.status).json({
        errors: err.errors
    });
});

// Swagger
const options = {
    swaggerDefinition: {
        // Like the one described here: https://swagger.io/specification/#infoObject
        info: {
            title: 'Google Keep API',
            version: '1.0.0',
            description: 'Google Keep API with autogenerated swagger doc',
        },
        openapi: '3.0.0' // https://github.com/Surnet/swagger-jsdoc/issues/90
    },
    // List of files to be processes. You can also set globs './routes/*.js'
    apis: ['src/index.js'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Start the server
app.listen(process.env.PORT, () =>
    console.log(`Mock server listening on port ${process.env.PORT}!`)
);

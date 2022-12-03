const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456",
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345",
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    console.log(person)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  app.get('/info', (request, response) => {
    const lenght = persons.length
    response.json(`Phonebook has info for ${lenght} people ${new Date()}`)
  })

  const generateId = () => {
    const max = 9999
    return Math.floor(Math.random() * (max - persons.length) + persons.length);
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body.name)
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }

    if(persons.filter(person => person.name === body.name).length > 0){
        return response.status(400).json({ 
            error: 'name must be unique' 
          })
    }
  
    const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { v7 as uuidv7 } from "uuid";
import _ from "lodash";

const prisma = new PrismaClient();

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' }
    }
  },
}

const registerSchema = {
  body: {
    type: 'object',
    required: ['name', 'surname', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      surname: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' }
    }
  },
}

const getTodosSchema = {
  body: {
    type: 'object',
    required: ['title', 'description', 'category'],
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      priority: { type: 'number' },
      category: { type: 'string' },
      deadline: { 
        type: ['string', 'null'] 
      }
    }
  },
}

const updateTodoSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    }
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      description: { type: 'string' },
      priority: { type: 'number' },
      category: { type: 'string' },
      completed: { type: 'boolean' },
      deadline: {
        type: ['string', 'null']
      }
    }
  },
}

const getTodoSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    }
  }
}

const getCategorySchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    }
  }
}

async function getAllTodos(userId: string) {
  return await prisma.todos.findMany({
    where: {
      user_id: userId
    }
  });
}

async function routes(fastify: FastifyInstance, opts: any){
    fastify.post('/login', { schema: loginSchema }, async (request: any, reply: any) => {
      const { email, password } : any = request.body;

      try{
        const user = await prisma.users.findUnique({ where: { email }})
        if(!user){
          return reply.status(401).send({ error: 'Credenziali non valide' })
        }

        const isValid = await argon2.verify(user.password, password)
        if(!isValid){
          return reply.status(401).send({ error: 'Credenziali non valide' })
        }

        const token = jwt.sign(
          { id: user.id, email: user.email, name: user.name, surname: user.surname },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        );

        return reply.status(200).send({ success: true, userId: user.id, data: token });
      }
      catch(err){
        console.log(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.post('/register', { schema: registerSchema }, async (request: any, reply: any) => {
      const { name, surname, email, password } : any = request.body;
      
      try{
        const encryptedPass = await argon2.hash(password);
        console.log("Password: ", encryptedPass + " " + password)

        const user = await prisma.users.create({
          data: { id: uuidv7(), name, surname, email, password: encryptedPass }
        })

        return reply.status(200).send({ success: true, data: user });
      }
      catch(err){
        console.log(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.get('/todos', async (request: any, reply) => {
      try{
        const todos = await getAllTodos(request.userId);
        return reply.status(200).send({ success: true, data: todos });
      }
      catch(err){
        console.log(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.put('/todos/toggle-completion', async(request: any, reply: any) => {
      try {
        const { completedIds, toCompleteIds, date } = request.body;

        console.log(request.body);
        const userId = request.userId;

        const result = await prisma.$transaction([
          prisma.todos.updateMany({
            where: {
              id: {
                in: toCompleteIds
              },
              AND: {
                user_id: userId
              }
            },
            data: { 
              completed: true,
              completed_at: date
            }
          }),
          prisma.todos.updateMany({
            where: {
              id: {
                in: completedIds
              },
              AND: {
                user_id: userId
              }
            },
            data: { 
              completed: false,
              completed_at: null
            }
          }),
          prisma.todos.findMany({
            where: {
              id: {
                in: [...toCompleteIds, ...completedIds]
              },
              user_id: userId
            }
          })
        ])

        return reply.status(200).send({ success: true, data: result[2] });
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.delete('/todos', async(request: any, reply: any) => {
      try {
        const ids = request.body;
        const userId = request.userId;

        const deleteTodos = await prisma.todos.deleteMany({
          where: {
            id: {
              in: ids
            },
            AND: {
              user_id: userId
            }
          }
        }) 

        return reply.status(200).send({ success: true, data: deleteTodos })
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' });
      }
    })

    fastify.get('/categories', async (request: any, reply: any) => {
      try{
        const categories = await prisma.category.findMany();
        return reply.status(200).send({ success: true, data: categories });
      }
      catch(err){
        console.log(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.post('/todo', { schema: getTodosSchema }, async (request: any, reply: any) => {
      try{
        const { category, deadline, ...rest } = request.body;

        const data = {
          ...rest,
          deadline,
          users: { connect: { id: request.userId } },
          category: { connect: { id: category } }
        };
        
        if(deadline){
          const deadlineISO = new Date(deadline).toISOString();
          data.deadline = deadlineISO;
        }
        
        const todo = await prisma.todos.create({ data });
        return reply.status(200).send({ success: true, id: data.id, data: todo})
      }
      catch(err){
        console.log(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.put('/todo/:id', { schema: updateTodoSchema }, async(request: any, reply: any) => {
      try{
        const id = Number(request.params.id);
        const { id: reqId, category_id, user_id, deadline, ...rest } = request.body;

        let data = {
          ...rest,
          deadline,
          users: { connect: { id: user_id } },
          category: { connect: { id: category_id } }
        };

        if(deadline){
          const deadlineISO = new Date(deadline).toISOString();
          data.deadline = deadlineISO;
        }

        const updatedTodo = await prisma.todos.update({
          where: {
            id
          },
          data
        })

        reply.send({ success: true, id, data: updatedTodo });
      }
      catch(err){
        console.log(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.get('/todo/:id', { schema: getTodoSchema }, async(request: any, reply: any) => {
      try {
        const id= Number(request.params.id);
        const todo = await prisma.todos.findUnique({
          where: { id }
        })

        return reply.status(200).send({ success: true, data: todo })
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.get('/category/:id', { schema: getCategorySchema }, async(request: any, reply: any) => {
      try {
        const id= request.params.id;
        const category = await prisma.category.findUnique({
          where: { id }
        })

        return reply.status(200).send({ success: true, data: category })
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.delete('/todo/:id', { schema: getTodoSchema }, async(request: any, reply: any) => {
      try {
        const id= Number(request.params.id);
        const todo = await prisma.todos.delete({
          where: { id }
        })

        return reply.status(200).send({ success: true, data: todo })
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })

    fastify.get('/analytics', async(request:any, reply: any) => {
      try {
        const todos = await getAllTodos(request.userId);

        // analytics completed
        const completedTodos = todos.filter((t:any) => t.completed);
        const completed = {
          done: completedTodos.length,
          todo: todos.length - completedTodos.length
        }

        const deadlineTodos = todos.filter((t:any) => t.deadline != null)
        // analytics calendary
        const uniqueCalendaryTodos = _.uniq(completedTodos.concat(deadlineTodos));
        const calendaryTodos = uniqueCalendaryTodos.map((t:any) => { 
          let todoColor = "#1a723aff";
          if(!t.completed && t.deadline != null){
            const today = new Date().setHours(0,0,0,0);
            const date = new Date(t.deadline).setHours(0,0,0,0);
            todoColor = date < today ? "#912828ff" : "#b9a22fff";
          }
          return { title: t.title, date: new Date(t.completed ? t.completed_at! : t.deadline!).toLocaleDateString("sv-SE"), color: todoColor, extendedProps: { id: t.id, completed: t.completed } }
        })

        // analytics next
        const next = deadlineTodos.filter((dt:any) => {
          const today = new Date().setHours(0,0,0,0);
          const date = new Date(dt.deadline!).setHours(0,0,0,0);
          return date >= today && !dt.completed;
        }).sort((a: any, b: any) => { return new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()}).slice(0, 3)

        return reply.status(200).send({ success: true, data: { completed, calendary: calendaryTodos, next } })
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: 'Server error' })
      }
    })
}

export default routes;
import { PrismaClient } from "@prisma/client";
import express, {Request, Response} from "express";
import createError from "http-errors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json())

// app.use((req: Request, res:Response, next: Function) => {
//     next(createError(404))
// })

app.listen(3000, () => 
    console.log('[server]: Server is running at http://localhost:3000')
)

// feed
app.get('/feed', async (req: Request, res:Response) => {
    const posts = await prisma.post.findMany({
        include: {author: true}
    })
    res.json(posts)
})

// post

app.post('/post', async (req:Request, res:Response)=>{
    const {content, authorEmail} = req.body
    const result = await prisma.post.create({
        data: {
            content,
            author:{connect:{
                email: authorEmail
            }}
        }
    })
    res.json(result)
})

// get by id
app.get('/post/:id', async(req:Request, res:Response)=>{
    const { id } = req.params
    const post = await prisma.post.findUnique({
        where: {id: Number(id)}
    })
    res.json(post)
})

// put by id
app.put('/post/:id', async (req:Request, res:Response) => {
    const {id} = req.params
    const post = await prisma.post.update({
        where: {id: Number(id)},
        data: {
            ...req.body
        }
    })
    res.json(post)
})

// delete by id
app.delete('/post/:id', async (req: Request, res:Response) => {
    const { id } = req.params
    const post = await prisma.post.delete({
        where: {id : Number(id)},
    })
    res.json(post)
})

// USER
// create user
app.post('/user', async (req:Request, res: Response) => {
    const result = await prisma.user.create({
        data: {...req.body}
    })
    res.json(result)
})

// get user by id
app.get('/:username', async (req:Request, res:Response) => {
    const { username } = req.params
    const user = await prisma.user.findUnique({
        where: { username: String(username) }
    })
    res.json(user)
})


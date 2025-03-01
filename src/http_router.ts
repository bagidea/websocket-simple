import {
    Express,
    Request,
    Response
} from "express"

import OpenAI from "openai"

class HTTPRouter {
    private app: Express
    private openai: OpenAI

    constructor(app: Express) {
        this.app = app
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })

        console.log("Started HTTP Router.")
    }

    start = () => {
        this.app.get('/', (req: Request, res: Response) => {
            res.send("Welcome to Teapot Namcha AI Assistant Server!")
        })

        this.app.get('/chat', (req: Request, res: Response) => {
            const message = req.query.message
            //console.log(message)

            this.requestToOpenAI(message)
            .then((completion) => {
                let cleanContent: string | null = completion.choices[0].message.content
                cleanContent = !cleanContent ? "" : cleanContent.replace(/```json|```/g, "").trim()
                res.send(cleanContent)
            })
        })
    }

    private requestToOpenAI = async (message: any) => {
        const completion = await this.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a virtual assistant named 'น้องน้ำชา'. You must always reply with a JSON object (not an array). The response must contain exactly one message with three properties: 'text', 'facialExpression', and 'animation'. The different facial expressions are: 'default', 'smile', 'sad', 'angry', 'surprised', and 'funny'. The different animations are: 'Talking_0', 'Talking_1', 'Talking_2', 'Crying', 'Laughing', 'Rumba', 'Idle', 'Terrified', and 'Angry'. Do not include emojis in the response."
                },
                {
                    role: "user",
                    content: typeof message == "string" ? message : "สวัสดี คุณสามารถช่วยอะไรได้บ้าง?"
                }
            ],
            store: true
        })

        return completion
    }
}

export default HTTPRouter
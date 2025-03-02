import express, { Express } from "express"

import {
    IncomingMessage,
    Server,
    ServerResponse
} from "http"

import { WebSocket, WebSocketServer } from "ws"

import HTTPRouter from "./http_router"

import dotenv from "dotenv"
dotenv.config()

// Express

const app: Express = express()
const port: number = 6336

const server: Server<typeof IncomingMessage, typeof ServerResponse> = app.listen(port, () => {
    console.log("Server is running on port "+port)
})

const httpRouter: HTTPRouter = new HTTPRouter(app)
httpRouter.start()

// WebSocket

const wss: WebSocketServer = new WebSocketServer({ server })
const clients: Array<WebSocket> = new Array<WebSocket>()

wss.on("connection", (ws: WebSocket) => {
    console.log("Client connected")

    clients.push(ws)

    ws.on("message", (msg) => {
        console.log("Received: "+msg)
        //ws.send("Echo: "+msg)

        clients.forEach((c: WebSocket) => {
            c.send("Echo: "+msg)
        })
    })

    ws.on("close", () => {
        console.log("Client disconnected")

        for (let i: number = 0; i < clients.length; i++) {
            if (clients[i] === ws) {
                clients.splice(i, 1)
                break
            }
        }
    })
})
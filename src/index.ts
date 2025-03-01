import express, { Express } from "express"

import {
    IncomingMessage,
    Server,
    ServerResponse
} from "http"

import { WebSocketServer } from "ws"

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

wss.on("connection", (ws) => {
    console.log("Client connected")

    ws.on("message", (msg) => {
        //console.log("Received: "+msg)
        //ws.send("Echo: "+msg)
    })

    ws.on("close", () => {
        console.log("Client disconnected")
    })
})
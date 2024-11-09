import express from 'express'
import * as http from 'node:http'
import { Socket } from 'node:net'
import { buildApp } from './app'

const app = express()

const endpoint = buildApp(app)

const server = {
  start: (port: number, callback?: () => void) =>
    new Promise<http.Server>((resolve, reject) => {
      const listen = app.listen(port, callback)

      // for termination
      const sockets = new Set<Socket>()
      listen.on('connection', (socket) => {
        // console.log('New client connected')
        sockets.add(socket)
        listen.on('close', () => {
          // console.log('Client disconnected')
          return sockets.delete(socket)
        })
      })

      // 'once' is precedence over 'on' event
      listen.once('close', () => {
        for (const socket of sockets) {
          socket.destroy()
          sockets.delete(socket)
        }
      })

      listen.on('error', (err) => reject(err))
      listen.on('listening', () => resolve(listen))
    }),
  endpoint,
}

export default server

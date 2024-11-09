import server from './server'

process.on('warning', (e) => console.warn(e.stack))

const HTTP_PORT = +(process.env.HTTP_PORT || 4001)

async function main() {
  // Start the server and you're done!
  await server.start(HTTP_PORT, () => {
    console.info(
      `🚀 Server ready at http://localhost:${HTTP_PORT}${server.endpoint}`
    )
  })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

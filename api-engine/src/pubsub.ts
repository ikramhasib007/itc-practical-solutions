import { createPubSub } from 'graphql-yoga'

export type PubSubChannels = {}

export const pubSub = createPubSub<PubSubChannels>()

// jshint esversion: 8

// dependencies exports
require('dotenv').config();
const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');


//  relative exports
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');


/**
 * from here the logic starts
 * it is the backend of our project
 * 
 * todo : it should connect and meet our needs for a proper
 * fluid backend experience so that it will load up and work
 * efficiently.
 * 
 * 
 */

const pubsub = new PubSub();


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubsub})
});

// connecting the database and starting the server
mongoose.connect(process.env.MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB connected');
        return server.listen({port: 5000});
    })
    .then(res => {
        console.log(`server running at ${res.url}`);
    });

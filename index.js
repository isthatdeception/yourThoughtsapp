// jshint esversion: 8

// dependencies exports
require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');
const mongoose = require('mongoose');


//  relative exports
const Post = require('./models/Post');


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

const typeDefs = gql`

    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }

    type Query{
        getPosts: [Post]
    }
`;

const resolvers = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find();
                return posts;
            } catch(err) {
                throw new Error(err);
            }
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
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

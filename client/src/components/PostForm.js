import React from 'react'
import { Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';


import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';


export default function PostForm() {


    const { values, onChange, onSubmit} = useForm(createPostCallback, {
        body: ''
    });

    const [ createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result){
        const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            data.getPosts = [result.data.createPost, ...data.getPosts];
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data});
            values.body = '';
        }
    });


    function createPostCallback() {
        createPost();
    }

    return (
        <div>
            <Form onSubmit={onSubmit}>
                <h2>Tell your story:</h2>
                <Form.Field>
                    <Form.Input 
                        placholder='charm the world!'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        />
                    <Button type ='submit' color='teal'>
                        share!
                    </Button>
                </Form.Field>
            </Form>
        </div>
    )
}

const CREATE_POST_MUTATION = gql`
mutation createPost($body: String!) {
    createPost(body: $body){
        id body createdAt username
        likes{
            id username createdAt
        }
        likeCount
        comments{
            id body username createdAt
        }
        commentCount
    }
}
`
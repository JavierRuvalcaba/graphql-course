const express = require('express');
const { buildSchema } = require('graphql');
const courses = require('./courses');
const { graphqlHTTP } = require('express-graphql');

const app = express();

const schema = buildSchema(`
  type Course{
    id: ID!
    title: String!
    views: Int
  }

  type Query{
    getCourses: [Course]
    getCourse(id: ID!): Course
  }
`);

const root = {
  getCourses(){
    return courses;
  },
  getCourse({id}){
    return courses.find(c => c.id === id);
  }
}

app.get('/', function(req,res){
  res.send('Wellcome');
})

//middleware
app.use('/graphql',graphqlHTTP({
  schema,
  rootValue: root,
  graphiql: true
}));

app.listen(8080, function(){
  console.log('Server started');
})
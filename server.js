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

  input CourseInput{
    title: String!
    views: Int
  }

  type Query{
    getCourses: [Course]
    getCourse(id: ID!): Course
  }

  type Mutation{
    addCourse(input: CourseInput): Course
    updateCourse(id: ID!, title: String!, views: Int): Course
  }
  
`);

const root = {
  getCourses(){
    return courses;
  },
  getCourse({id}){
    return courses.find(c => c.id === id);
  },
  addCourse({input}){
    const id = String(courses.length + 1);
    const course = { id, ...input };
    courses.push(course);
    return course;
  },
  updateCourse({id,title,views}){
    const courseIdx =  courses.findIndex(c => c.id === id);
    const course = courses[courseIdx];
    const newCourse =  Object.assign(course,{title,views});
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
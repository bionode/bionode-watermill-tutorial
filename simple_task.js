'use strict'

// === WATERMILL ===
//const task = require ('../../..').task
const watermill = require('bionode-watermill')
const task = watermill.task

// this is a kiss example of how tasks work with shell
const simpleTask = task({
  output: '*.txt', // checks if output file matches the specified pattern
  params: 'Test_file.txt',  //defines parameters to be passed to the
    // task function
  name: 'This is the task name' //defines the name of the task
}, ({ params }) => `touch ${params}`
)

// runs the task
simpleTask()

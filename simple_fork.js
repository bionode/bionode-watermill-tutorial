'use strict'

// === WATERMILL ===
const {
  task,
  join,
  fork
} = require('bionode-watermill')

const simpleTask1 = task({
    output: '*.txt', // checks if output file matches the specified pattern
    params: 'test_file.txt',  //defines parameters to be passed to the
    // task function
    name: 'task1: creating file 1' //defines the name of the task
  }, ({ params }) => `touch ${params} | echo "this is a string from first file" >> ${params}`
)

const simpleTask2 = task({
    output:'*.txt', // specifies the pattern of the expected input
    params: 'another_test_file.txt', /* checks if output file matches the
     specified pattern*/
    name: 'task 2: creating file 2'
  }, ({ params }) => `touch ${params} | echo "this is a string from second file" >> ${params}`
)

const appendFiles = task({
    input: '*.txt', // specifies the pattern of the expected input
    output: '*.txt', // checks if output file matches the specified patters
    name: 'Write to files' //defines the name of the task
  }, ({ input }) => `echo "after fork string" >> ${input}`
)

// this is a kiss example of how fork works
const pipeline = join(
  fork(simpleTask1, simpleTask2),
  appendFiles
)

//executes the pipeline itself
pipeline()
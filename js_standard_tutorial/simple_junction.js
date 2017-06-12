'use strict'

// === WATERMILL ===
const {
  task,
  join,
  junction
} = require('bionode-watermill')

// this is a kiss example of how tasks work with shell
const simpleTask = task({
    output: '*.txt', // checks if output file matches the specified pattern
    params: 'test_file.txt',  //defines parameters to be passed to the
    // task function
    name: 'This is the task name' //defines the name of the task
  }, function(resolvedProps) {
    const params = resolvedProps.params
    return 'touch ' + params
  }
)

const writeToFile = task({
    input: '*.txt', // specifies the pattern of the expected input
    output: '*.txt', // checks if output file matches the specified pattern
    name: 'Write to file' //defines the name of the task
  }, function(resolvedProps) {
    const input = resolvedProps.input
    return 'echo "some string" >> ' + input
  }
)

const writeAnotherFile = task({
  output:'*.file', // specifies the pattern of the expected input
  params: 'another_test_file.file', /* checks if output file matches the
  specified pattern*/
  name: 'Yet another task'
}, function(resolvedProps) {
    const params = resolvedProps.params
    return 'touch ' + params + ' | echo "some new string" >> ' + params
  } /* one can also use util (require='util') to format these strings but
   here I limited the number of imports to keep the simplicity of the tutorial*/
)

// this is a kiss example of how junction works
const pipeline = junction(
  join(simpleTask, writeToFile),  /* this "joint" tasks will be executed at the
  same time as the task bellow*/
  writeAnotherFile
)

//executes the pipeline itself
pipeline()
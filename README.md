# bionode-watermill for dummies!

## Objective

This tutorial is intended for those that attempt to assemble a bioinformatics 
pipeline using bionode-watermill for the first time.

## Defining a task

Watermill is a tool that lets you orchestrate tasks. So, lets first 
understand how to define a task. 
 
To define a task we first need to require bionode-watermill:

```javascript
const watermill = require('../../..') /* don't forget to edit this require if
 you run it outside bionode-watermill examples/pipelines/simple_tutorial 
 folder */ 
const task = watermill.task  /* have to specify task since bionode-watermill 
has more operators*/
```

After, we can use task variable to define a task:

```javascript
// this is a kiss example of how tasks work with shell
const simpleTask = task({
  output: '*.txt', // checks if output file matches the specified pattern
  params: 'test_file.txt',  /*defines parameters to be passed to the
     task function*/
  name: 'This is the task name' //defines the name of the task
}, ({ params }) => `touch ${params}`
)
```

Then after defining the task, it may be executed like this:
```javascript
// runs the task
simpleTask()
```
This task will create a new file (empty) inside a directory named 
"data/\<uid>/".

The above example is available [here](https://github.com/tiagofilipe12/bionode-watermill/tree/master/examples/pipelines/simple_tutorial/simple_task.js).

## Using orchestrators

* ### Join

Join is an operator that lets you run a sequence of tasks in a given order. 
For instance if we are interested in creating a file and writing to it 
in two different instances. But let's first define a new task so we can 
perform it after the task that we called `simpleTask`:

```javascript
const writeToFile = task({
  input: '*.txt', // specifies the pattern of the expected input
  output: '*.txt', // checks if output file matches the specified pattern
  name: 'Write to file' //defines the name of the task
}, ({ input }) => `echo "some string" >> ${input}`
)
```

So, task `writeToFile` writes "some string" to the file that we have just 
created in task `simpleTask`. However, to do so, we need the file to be 
created first and only then write something to it.
In order to achieve this we use `join`:

```javascript
// this is a kiss example of how join works
const pipeline = join(simpleTask, writeToFile)

//executes the join itself
pipeline()
```

This operation will generate two directories inside `data` folder, one which 
is responsible for the first task (`simpleTask`) that will create a new
 file called `test_file.txt`, and a second task (`writeToFile`) that will do 
 a symlink to `test_file.txt` and write to it, since we have indicated that 
 we would like to write for the same file as the input. Note that once again 
 files will be inside a directory named "data/\<uid>/" (but in this case you 
 will have two directories with distinct uids).

The above example is available [here](https://github.com/tiagofilipe12/bionode-watermill/tree/master/examples/pipelines/simple_tutorial/simple_join.js).


* ### Junction
* ### Fork

## Useful links:

* [How to require bionode-watermill inside my project?](https://github.com/bionode/GSoC17/blob/master/notes/running_watermill.md)


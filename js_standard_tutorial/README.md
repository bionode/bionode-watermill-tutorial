# bionode-watermill for dummies!

* [Objective](#objective)
* [First things first](#first-things-first)
* [Dening a task](#defining-a-task)
* [Using orchestrators](#using-orchestrators)
    * [join](#join)
    * [junction](#junction)
    * [fork](#fork)
* [Useful links](#useful-links)

## Objective

This tutorial is intended for those that attempt to assemble a bioinformatics 
pipeline using bionode-watermill for the first time.

## First things first

This tutorial assumes that you have installed `npm`, `git` and `node`.

To setup and test the scripts within this tutorial follow these simple steps:

* `git clone https://github.com/bionode/bionode-watermill-tutorial.git`
* `cd bionode-watermill-tutorial`
* `npm install bionode-watermill`

## Defining a task

Watermill is a tool that lets you orchestrate tasks. So, lets first 
understand how to define a **task**. 
 
To define a **task** we first need to require bionode-watermill:

```javascript
const watermill = require('bionode-watermill') /* don't forget to edit this 
require if
 you run it outside bionode-watermill examples/pipelines/simple_tutorial 
 folder */ 
const task = watermill.task  /* have to specify task*/
```

After, we can use task variable to define a task:

Using standard javascript style:

```javascript
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
```

Then after defining the task, it may be executed like this:
```javascript
// runs the task and returns a promise, and can also return a callback
simpleTask()
```
This task will create a new file (empty) inside a directory named 
"data/\<uid>/".
You may also notice that a bunch of text was outputted to terminal and it 
can be useful for debugging your pipelines.

The above example is available [here](https://github.com/bionode/bionode-watermill-tutorial/blob/master/simple_task.js).
You can test the above example by running: `node simple_task.js`

## Using orchestrators

[What are orchestrators?](https://github.com/bionode/bionode-watermill#what-are-orchestrators)

* ### Join

**Join** is an operator that lets you run a sequence of tasks in a given order. 
For instance if we are interested in creating a file and writing to it 
in two different instances. But let's first define a new task so we can 
perform it after the task that we called `simpleTask`:

```javascript
const writeToFile = task({
    input: '*.txt', // specifies the pattern of the expected input
    output: '*.txt', // checks if output file matches the specified pattern
    name: 'Write to file' //defines the name of the task
  }, function(resolvedProps) {
    const input = resolvedProps.input
    return 'echo "some string" >> ' + input
  }
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

The above example is available [here](https://github.com/bionode/bionode-watermill-tutorial/blob/master/simple_join.js).
You can test the above example by running: `node simple_join.js`

* ### Junction

Unlike **join**, **junction** allows to run multiple tasks in parallel. 

However we will have to create a new task since if we simply replace in the 
previous pipeline **join** with **junction**, we will end up with a file 
named `test_file.txt` with nothing written inside, because if you create the 
file and write to it at the same time, write won't work, but the file will be
 created. 
 
 ```javascript
 // this will not produce the file with text in it!
const pipeline = junction(simpleTask, writeToFile)
```

So, in we will define a new simple task:

```javascript
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
```

And then execute the new pipeline:

```javascript
// this is a kiss example of how junction works
const pipeline = junction(
  join(simpleTask, writeToFile),  /* this "joint" tasks will be executed at the
  same time as the task bellow */
  writeAnotherFile
)

//executes the pipeline itself
pipeline()
```

This new pipeline consists on creating two files and writing text to them. Note 
that in `writeAnotherFile` task in this task pipe is used 
 in shell ("|") to along with the shell commands `touch` and `echo`. That is a 
 feature that bionode-watermill also supports. Of course, these are simple 
 tasks that can be performed only with shell commands (but they are merely 
 illustrative). Instead, as mentioned above you can use javascript **callback** 
 functions or **promises** as the final return of a **task**.
 
Nevertheless, if you browse to `data` folder, you should have three folders 
(because you have three tasks). One with the text file generated in the first
 task, another one with a symlink for the first task (that was used to write 
 to this file) and finally a third one in which you should have the file 
 generated and written in the third task (named `another_test_file.file`). 

The above example is available [here](https://github.com/bionode/bionode-watermill-tutorial/blob/master/simple_junction.js).
You can test the above example by running: `node simple_junction.js`

* ### Fork

While **junction** handles two or more tasks at the same time, **fork** 
allows to pass the output of two or more different tasks to the next task. 
Imagine you have two different files being generated in two different tasks 
 and want to  process them using the same task in the next step. In this case 
 bionode-watermill uses **fork**, to split the pipeline in two distinct 
 branches that after will be processed independently. 
 
 If you have something like:
 ```javascript 
 join(
   taskA,
   fork(taskB, taskC),
   taskD
 )
 ```
 This will result in something like this:  ```taskA -> taskB -> taskD'``` and 
 ```taskA -> taskC -> taskD''```, with two distinct final outputs for the 
 pipeline. This is a quite useful feature to benchmark programs or if you are
  interested in running multiple programs that do the same type of analyses 
  and compare the results of both analyses.
  
  Importantly, the same type of pipeline with **junction** instead of **fork**,
   ```javascript 
   join(
     taskA,
     junction(taskB, taskC),
     taskD
   )
   ```
   would result in the following workflow: ```taskA -> taskB, taskC -> taskD```,
    where taskD has only one final result.
    
 But enough talk, lets get to work!
 
 For the fork tutorial, two functions will be defined. These functions 
 create a file and write to it:
 
 ```javascript
const simpleTask1 = task({
    output: '*.txt', // checks if output file matches the specified pattern
    params: 'test_file.txt',  //defines parameters to be passed to the
    // task function
    name: 'task1: creating file 1' //defines the name of the task
  }, function(resolvedProps) {
    const params = resolvedProps.params
    return 'touch ' + params + ' | echo "this is a string from first file"' +
      ' >> ' + params
  }
)

const simpleTask2 = task({
    output:'*.txt', // specifies the pattern of the expected input
    params: 'another_test_file.txt', /* checks if output file matches the
     specified pattern*/
    name: 'task 2: creating file 2'
  },  function(resolvedProps) {
    const params = resolvedProps.params
    return 'touch ' + params + ' | echo "this is a string from second file"' +
      ' >> ' + params
  }
)
```

Then, a task to be performed after the fork, which will add the same text to 
these files:

```javascript
const appendFiles = task({
    input: '*.txt', // specifies the pattern of the expected input
    output: '*.txt', // checks if output file matches the specified patters
    name: 'Write to files' //defines the name of the task
  }, function(resolvedProps) {
    const input = resolvedProps.input
    return 'echo "after fork string" >> ' + input
  }
)
```

And finally our pipeline execution:

```javascript
// this is a kiss example of how fork works
const pipeline = join(
  fork(simpleTask1, simpleTask2),
  appendFiles
)

//executes the pipeline itself
pipeline()
```

This should result in four output directories in our `data` folder. Notice 
that contrarily to **junction**, where three tasks would render three output 
directories, with **fork** the result of our pipeline are four output 
directories, where the outputs from `simpleTask1` and `simpleTask2` where 
both processed by task `appendFiles`.

The above example is available [here](https://github.com/bionode/bionode-watermill-tutorial/blob/master/simple_fork.js).
You can test the above example by running: `node simple_junction.js`
 

## Useful links

* [How to require bionode-watermill inside my project?](https://github.com/bionode/GSoC17/blob/master/notes/running_watermill.md)

* [Tutorial using ES6 syntax](https://github.com/bionode/bionode-watermill-tutorial/blob/master/README.md)
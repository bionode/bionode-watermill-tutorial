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

Or you can also do something like the following in ES6 syntax, using arrow 
functions:

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
}, ({ params }) => `touch ${params} | echo "some new string" >> ${params}`
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

## Useful links

* [How to require bionode-watermill inside my project?](https://github.com/bionode/GSoC17/blob/master/notes/running_watermill.md)


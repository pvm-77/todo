import { useState, useEffect, useRef } from "react";
import FilterButton from "./components/FilterButton";
import Form from "./components/Form";
import Todo from "./components/Todo";
import { nanoid } from 'nanoid'
import todoService from './API/todo'
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed
};
const FILTER_NAMES = Object.keys(FILTER_MAP)

const App = (props) => {

  // setting the filters
  const [filter, setFilter] = useState('All')
  // console.log(FILTER_NAMES)



  const [tasks, setTasks] = useState([])
  const addTask = (name) => {
    const newTask = { id: 'todo-' + nanoid(), name: name, completed: false }
    // here handle situation of creating a task 
    // console.log(newTask)


    todoService.createTodo(newTask).then((response) => {
      console.log(response.data)
      // setTasks([...tasks,response.data])
      setTasks([...tasks, response.data])
    }).catch(err => {
      console.log('unable to create task')
    })
    // setTasks([...tasks, newTask])

  }
  const toggleTaskCompleted = (id) => {
    // check if 
    const updateTask = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed }
      }
      return task
    })
    console.log(updateTask)
    setTasks(updateTask)


  }
  // delete a task 
  const deleteTask = (id) => {
    console.log(id)
    // get all tasks except one which is deleted
    todoService.deleteTodo(id)
    .then(response => {
      console.log(response)
  
      // const remainTasks = tasks.filter((task) => task.id !== response.data.id)
      // setTasks(remainTasks)

    })
    .catch(err => console.log('sorry! unable to delete the task '))
    // const remainTasks = tasks.filter((task) => id !== task.id)
    // setTasks(remainTasks)

  }

  // edit task
  const editTask = (id, newName) => {
    const editTaskList = tasks.map((task) => {
      // if this task has same id as edited task id
      if (id === task.id) {
        return { ...task, name: newName }

      }
      return task
    })

    setTasks(editTaskList)
  }



  // console.log(FILTER_MAP[filter])
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        key={task.id} id={task.id}
        isCompleted={task.completed}
        name={task.name}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  // filter list 
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton key={name} name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ))




  // console.log(taskList)
  const taskNoun = taskList.length !== 1 ? 'tasks' : 'task'
  const headingText = `${taskList.length} ${taskNoun} remaining`
  const listHeadingRef = useRef(null)
  const prevTaskLength = usePrevious(tasks.length);
  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);



  useEffect(() => {
    todoService.getAllTodos().then(res => {
      console.log(res.data)
      setTasks(res.data)
    }).catch(err => console.log(err))
  }, [])
  return (
    <div className="todoapp stack-large">
      <h1>Work todo</h1>
      {/* form start here */}
      <Form addTask={addTask} />
      {/* form end here */}

      {/* filter button start here */}
      <div className="filters btn-group stack-exception">
        {/* <FilterButton />
        <FilterButton />
        <FilterButton /> */}
        {filterList}
      </div>
      {/* filter button ends here */}
      <h2 id="list-heading" tabIndex='-1' ref={listHeadingRef}>
        {headingText}
      </h2>
      {/* task list start here */}
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {/* <Todo name='eat' isCompleted={true} id='todo-0' />
        <Todo name='sleep' isCompleted={false} id='todo-1' />
        <Todo name='repeat' isCompleted={false} id='todo-2' /> */}
        {taskList}
      </ul>
      {/* task list end here */}
    </div>
  );

}

export default App;

import axios from 'axios'
const baseUrl = 'http://localhost:3001/todo'
const todoService = {
    createTodo: async (todoObject) => {
        const request = axios.post(baseUrl, todoObject)
        // console.log(request)
        return request;
    },
    updateTodo: async (id, updateTodoObject) => {
        const request = await axios.update(`${baseUrl}/${id}`, updateTodoObject)
        console.log(request)
        return request 

    },
    deleteTodo: async (id) => {
        console.log(id)
        const request = axios.delete(`${baseUrl}/${id}`)
        // console.log(request)
        return request

    },

    getAllTodos: async () => {
        return axios.get(baseUrl)

        // const request =  axios.get(baseUrl)
        // console.log(request);
        // return request.data
    }

}

export default todoService
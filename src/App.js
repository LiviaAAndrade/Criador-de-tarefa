

import './App.css';
import { useState, useEffect } from 'react';
import {BsTrash, BsBookmark,BsBookmarkCheck} from 'react-icons/bs';
const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime]= useState("");
  const [todos, setTodos]= useState([]);
  const [loading, setLoading]= useState(false);

  useEffect(() => {
      const loadData = async() =>{
        setLoading(true)
        //resposta
        const res= await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data)=> data)
        .catch((err)=> console.log(err));

        setLoading(false);
        setTodos(res);

      };
      loadData();
    },
  [])

  const handleSubmit =async (e) =>{
    e.preventDefault()
    console.log("enviou");

    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };
    
    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers:{
        "Content-Type": "application/json",
      },
    });
    //atualiza a pagina
    setTodos((prevState) => [...prevState, todo]);

    console.log(todo);
    setTitle("");
    setTime("");

  };

  const handleDelete = async (id) => {

    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });
    setTodos((prevState) => prevState.filter((todo)=> todo.id !== id ));
   };

   const handleEdit = async (todo) => {

    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, {
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => prevState.map((t) =>(t.id === data.id ? (t= data): t)));
   };

  if(loading){
    return <p>carregando.. :3</p>
  }
  
  return (
    <div className="App">
      <div className='todo-header'>
        <h2> Tarefas </h2>
      </div>

      <div className='form-todo'>
        <h2> Insira sua próxima tarefa:</h2>
        <div className='form-control'>
          <label htmlFor='title'> O que voce vai fazer?</label>
          <input 
            type="text" 
            name="title" 
            placeholder= "Titulo da tarefa" 
            onChange={(e) => setTitle(e.target.value)} 
            value={title || ""}
          />
        </div>

        <div className='form-control'>
          <label htmlFor='time'> Duração</label>
          <input 
            type="text" 
            name="time" 
            placeholder= "Tempo estimado (em horas)" 
            onChange={(e) => setTime(e.target.value)} 
            value={time || ""}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <input type= "submit" value="Criar tarefa"/>
        </form>
      </div>

      <div className='list-todo'>
        <h2> Lista de tarefas:</h2>
        {todos.length ===0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}> {todo.title}</h3>
            <p>Duração: {todo.time}</p>
          <div className='actions'>  
            <span onClick={() => handleEdit(todo)}>
              {!todo.done ? <BsBookmark/> : <BsBookmarkCheck />}
            </span>
            <BsTrash onClick={() => handleDelete(todo.id)}/>
          </div>

          </div>
        ))}
      </div>



    </div>
  );
}

export default App;

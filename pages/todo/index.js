"use client"
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../navbar/navbar';
import Link from 'next/link';

const Todo = () => {
    const email = useSelector((state) => state.user.verifyEmail);

    const [todo, setTodo] = useState({ title: "", desc: "", email: email });
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [completed, setCompleted] = useState(false)
    console.log("todo", email)

    // useEffect(() => {
    //     if (email) {
    //         const usersData = localStorage.getItem('users');
    //         if (usersData) {
    //             const users = JSON.parse(usersData);
    //             const user = users.find(user => user.email === email);
    //             if (user) {
    //                 setTodos(user.todos || []);
    //                 setCompletedTodos(user.CompletedTodos || []);
    //             }
    //         }
    //     }
    // }, [email]);
    useEffect(() => {
        const fetchTodos = async () => {
            if (email) {
                try {
                    const response = await fetch('http://localhost:3001/gettodo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();
                  
                    if (data.todos ) {
                        setTodos(data.todos);
                        setCompletedTodos([])
                    }
                  else  if (data.completedTodos) {
                        setTodos([]);
                        setCompletedTodos([data.completedTodos]);
                    }
                    else {
                        alert(data.error);
                        setTodos([]);
                        setCompletedTodos([]);
                    }
                } catch (error) {
                    alert('Internal server error. Please try later.');
                    console.error('Error fetching todos:', error);
                }
            }
        };

        fetchTodos();
    }, [email]);

    const addTodo = () => {
        // const usersData = localStorage.getItem('users');
        // if (todo.title === "" || todo.desc === "") {
        //     alert("Please enter fields *");
        // } else {
        //     if (usersData) {
        //         let users = JSON.parse(usersData);
        //         const userIndex = users.findIndex(user => user.email === email);
        //         if (userIndex !== -1) {
        //             if (users[userIndex].todos && users[userIndex].todos.some(t => t.title === todo.title)) {
        //                 alert("Todo with this title already exists");
        //             } else {
        //                 if (!users[userIndex].todos) users[userIndex].todos = [];
        //                 users[userIndex].todos.push({ title: todo.title, desc: todo.desc });
        //                 localStorage.setItem("users", JSON.stringify(users));
        //                 alert("TODO Successfully Added")
        //                 setTodos(users[userIndex].todos);
        //                 setTodo({ title: "", desc: "", email: "" });
        //             }
        //         } else {
        //             alert("You are not a registered user");
        //         }
        //     } else {
        //         alert("No users found in localStorage");
        //     }
        // }

        fetch('http://localhost:3001/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todo)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                    
                                       
                } else {
                    alert(data.message);
                    setTodos(data.todos)
                    console.log(data.todos)
                    // setTodo({ title: "", desc: ""})
                }
            })
            .catch(error => {
                alert('\nPlease try later' + '\n' + error);
                console.log(error)
            });
    };

    const onChange = (e) => {
        setTodo({
            ...todo,
            [e.target.name]: e.target.value
        });
    };

    // const deleteTodo = (title) => {
    //     const usersData = localStorage.getItem('users');
    //     if (usersData) {
    //         let users = JSON.parse(usersData);
    //         const userIndex = users.findIndex(user => user.email === email);
    //         if (userIndex !== -1) {
    //             let newTodos = users[userIndex].todos.filter((item) => item.title !== title);
    //             users[userIndex].todos = newTodos;
    //             localStorage.setItem("users", JSON.stringify(users));
    //             setTodos(newTodos);
    //         }
    //     }
    // };
    const deleteTodo = async (title) => {
        try {
            const response = await fetch('http://localhost:3001/deleteTodo', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, title })
            });

            const data = await response.json();

            if (data.todos) {
                setTodos(data.todos);
                alert("Pending Task deleted successfully");
            }
            else if (data.completedTodos) {
                setCompletedTodos(data.completedTodos)
                alert("Completed Task deleted successfully");
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            alert('Internal server error. Please try later.');
            console.error('Error deleting todo:', error);
        }
    };

    // const completedDeleteTodo = (title) => {
    //     const usersData = localStorage.getItem('users');
    //     if (usersData) {
    //         let users = JSON.parse(usersData);
    //         const userIndex = users.findIndex(user => user.email === email);
    //         if (userIndex !== -1) {
    //             let newTodos = users[userIndex].CompletedTodos.filter((item) => item.title !== title);
    //             users[userIndex].CompletedTodos = newTodos;
    //             localStorage.setItem("users", JSON.stringify(users));
    //             setCompletedTodos(newTodos);
    //         }
    //     }
    // };
    // const completeTodo = (title) => {
    //     const usersData = localStorage.getItem('users');
    //     if (usersData) {
    //         let users = JSON.parse(usersData);
    //         const userIndex = users.findIndex(user => user.email === email);
    //         if (userIndex !== -1) {
    //             const completedTask = users[userIndex].todos.find((item) => item.title === title);
    //             if (!users[userIndex].CompletedTodos) users[userIndex].CompletedTodos = [];
    //             users[userIndex].CompletedTodos.push(completedTask);

    //             users[userIndex].todos.map((item) => {
    //                 if (item.title === title) {
    //                     let newTodos = users[userIndex].todos.filter((item) => item.title !== title);
    //                     users[userIndex].todos = newTodos;
    //                     localStorage.setItem("users", JSON.stringify(users));
    //                     setTodos(newTodos);
    //                     return { ...item, completed: true };
    //                 }
    //                 return item;
    //             });

    //             setCompletedTodos(users[userIndex].CompletedTodos);
    //             alert("Task Completed Hurray!");
    //         }
    //     }
    // };
    const completeTodo = async (title) => {
        try {
            const response = await fetch('http://localhost:3001/completeTodo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email, title: title })
            });

            const data = await response.json();
            console.log('Response text:', data);


            if (data.todos) {
                setTodos(data.todos);
                setCompletedTodos(data.completedTodos);
                alert("Task Completed Hurray!");
            }
            else {
                alert(data.error);
            }
        } catch (error) {
            alert('Internal server error. Please try later.');
            console.error('Error completing todo:', error);
        }
    };


    return (
        <div className="text-3xl">
            <Navbar></Navbar>
            <section className="text-gray-600">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 bg-slate-100">
                        <h2 className="text-blue-700 text-2lg font-medium title-font mb-5">Add a Todo</h2>
                        <div className="relative mb-4">
                            <label htmlFor="title" className="leading-7 text-sm text-gray-600">Todo Title</label>
                            <input onChange={onChange} value={todo.title}
                                type="text" id="title" name="title"
                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-500 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                autoComplete='off' />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="desc" className="leading-7 text-sm text-gray-600">Todo Description</label>
                            <input onChange={onChange} value={todo.desc}
                                type="text" id="desc" name="desc"
                                className="w-full bg-white rounded border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-400 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" autoComplete='off' />
                        </div>
                        <button onClick={addTodo} className="text-white bg-blue-700 border-0 py-2 px-8 focus:outline-none w-fit hover:bg-blue-500 rounded text-lg">Add Todo</button>
                    </div>
                </div>
            </section>

            <section className="text-gray-600 body-font">
                <div className="container px-5 py-4 mx-auto">
                    <div className="flex flex-col text-center w-full mb-20">
                        <h1 className="text-4xl font-medium title-font mb-2 text-blue-700">Your Todos</h1>
                        {todos.length === 0 && completedTodos.length === 0 && (
                            <p className="mx-auto leading-relaxed text-base mb-2">No TODOS to show</p>
                        )}
                        <div className="text-center">
                            <button className={`text-xl font-medium title-font mb-4 px-2 py-2 hover:bg-blue-300 text-blue-500 w-40 ${!completed ? 'bg-blue-200' : ''}`} onClick={() => { setCompleted(false) }}>Pending</button>
                            <button className={`text-xl font-medium title-font mb-4 px-2 py-2 hover:bg-blue-300 text-blue-500 w-40 ${completed ? 'bg-blue-200' : ''}`} onClick={() => { setCompleted(true) }}>Completed</button>
                        </div>
                    </div>
                    {(todos.length > 0 || completedTodos.length > 0) && (
                        <div className="w-full">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                {!completed &&
                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Title</th>
                                                <th scope="col" className="px-6 py-3">Description</th>
                                                <th scope="col" className="px-6 py-3 text-red-700">Status</th>
                                                <th scope="col" className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {todos.map((item, index) => (
                                                <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</th>
                                                    <td className="px-6 py-4">{item.desc}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex">

                                                            <button onClick={() => completeTodo(item.title)} className="px-2 text-red-700 hover:bg-red-400 p-1">❌ Not Completed</button>
                                                            <label style={{ fontSize: 10 }} className="px-1 text-red-700 p-1 ">(Click to complete)</label>
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex">
                                                            <a className="cursor-pointer font-medium border-2 border-red-500 rounded-md p-1 hover:bg-red-500 hover:text-white" onClick={() => deleteTodo(item.title)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20px" height="20px">
                                                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" />
                                                                </svg>
                                                            </a>
                                                            <Link href={`/todo/${index}`} className="ml-2 cursor-pointer border-2 border-blue-700 rounded-md p-1 hover:bg-blue-500 hover:text-white">
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px">
                                                                    <path d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z" />
                                                                </svg>
                                                            </Link>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                }
                                {completed &&

                                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Title</th>
                                                <th scope="col" className="px-6 py-3">Description</th>
                                                <th scope="col" className="px-6 py-3 text-green-700">Status</th>
                                                <th scope="col" className="px-6 py-3">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {completedTodos.map((item, index) => (
                                                <tr className="odd:bg-white even:bg-gray-50 border-b" key={index}>
                                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{item.title}</th>
                                                    <td className="px-6 py-4">{item.desc}</td>
                                                    <td className="px-6 py-4 text-green-700">✔️ Completed</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex">
                                                            <a className="cursor-pointer font-medium border-2 border-red-500 rounded-md p-1 hover:bg-red-500 hover:text-white" onClick={() => deleteTodo(item.title)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20px" height="20px">
                                                                    <path d="M 14.984375 2.4863281 A 1.0001 1.0001 0 0 0 14 3.5 L 14 4 L 8.5 4 A 1.0001 1.0001 0 0 0 7.4863281 5 L 6 5 A 1.0001 1.0001 0 1 0 6 7 L 24 7 A 1.0001 1.0001 0 1 0 24 5 L 22.513672 5 A 1.0001 1.0001 0 0 0 21.5 4 L 16 4 L 16 3.5 A 1.0001 1.0001 0 0 0 14.984375 2.4863281 z M 6 9 L 7.7929688 24.234375 C 7.9109687 25.241375 8.7633438 26 9.7773438 26 L 20.222656 26 C 21.236656 26 22.088031 25.241375 22.207031 24.234375 L 24 9 L 6 9 z" />
                                                                </svg>
                                                            </a>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>


                                }
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>

    );
};

// Todo.authRequired = true;
// export default withAuth(Todo, true);
export default Todo
// // pages/todo.js
// import React from 'react';
// import PrivateRoute from '../components/PrivateRoute';

// const TodoPage = () => {
//   return (
//     <PrivateRoute>
//       <div>
//         <h1>Todo Page</h1>
//         {/* Your Todo page content */}
//       </div>
//     </PrivateRoute>
//   );
// };

// export default TodoPage;

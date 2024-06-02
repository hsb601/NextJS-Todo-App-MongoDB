import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Navbar from '../navbar/navbar';

const Edit = () => {
    const email = useSelector((state) => state.user.verifyEmail);
    const router = useRouter();
    const params = useParams();
    const [todo, setTodo] = useState({ title: "", desc: "" });
    const [originalTitle, setOriginalTitle] = useState("");

    useEffect(() => {
        const fetchTodos = async () => {
            if (params?.id && email) {
                try {
                    const response = await fetch('http://localhost:3001/gettodo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email })
                    });

                    const data = await response.json();

                    if (response.ok) {
                        const todoItem = data.todos[params.id];
                        setTodo(todoItem);
                        setOriginalTitle(todoItem.title); 
                    }
                } catch (error) {
                    alert('Internal server error. Please try later.');
                    console.error('Error fetching todos:', error);
                }
            }
        };
        fetchTodos();
    }, [params, email]);

    const onChange = (e) => {
        setTodo({
            ...todo,
            [e.target.name]: e.target.value
        });
    };

    const updateTodo = async () => {
        try {
            const response = await fetch('http://localhost:3001/updateTodo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    title: todo.title, 
                    desc: todo.desc, 
                    email, 
                    originalTitle 
                })
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert("Task Updated successfully");
                router.push('/todo');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Internal server error. Please try later.');
            console.error('Error updating todo:', error);
        }
    };
    
    return (
        <div className="text-3xl h-screen">
            <Navbar></Navbar>
            <section className="text-gray-600  ">
                <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
                    <div className="bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
                        <h2 className="text-blue-700 text-2lg font-medium title-font mb-5">Update a Todo</h2>
                        <div className="relative mb-4">
                            <label htmlFor="title" className="leading-7 text-sm text-gray-600">Todo Title</label>
                            <input onChange={onChange} value={todo.title} type="text" id="title" name="title" className="w-full bg-white rounded border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <div className="relative mb-4">
                            <label htmlFor="desc" className="leading-7 text-sm text-gray-600">Todo Text</label>
                            <input onChange={onChange} value={todo.desc} type="text" id="desc" name="desc" className="w-full bg-white rounded border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
                        </div>
                        <button onClick={updateTodo} className="text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none w-fit hover:bg-blue-600 rounded text-lg">Update Todo</button>
                        <p className="text-xs text-gray-500 mt-3">The best todo list app out there!</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Edit;

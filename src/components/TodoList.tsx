import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Smile } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
  emoji: string
}

interface TodoListProps {
  darkMode: boolean;
}

const TodoList: React.FC<TodoListProps> = ({ darkMode }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })
  const [newTodo, setNewTodo] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState('')

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, emoji: selectedEmoji }])
      setNewTodo('')
      setSelectedEmoji('')
      setShowEmojiPicker(false)
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const onDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const onDragOver = (e: React.DragEvent<HTMLLIElement>) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent<HTMLLIElement>, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text'))
    const newTodos = [...todos]
    const [removed] = newTodos.splice(dragIndex, 1)
    newTodos.splice(dropIndex, 0, removed)
    setTodos(newTodos)
  }

  const emojis = ['😀', '😎', '🚀', '💡', '🎉', '📚', '💪', '🏆']

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300'
          }`}
          placeholder="Agregar nueva tarea..."
        />
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
        >
          <Smile size={24} />
        </button>
        <button
          onClick={addTodo}
          className="bg-purple-500 text-white p-2 rounded-r-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <Plus size={24} />
        </button>
      </div>
      {showEmojiPicker && (
        <div className={`mb-4 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {emojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => {
                setSelectedEmoji(emoji)
                setShowEmojiPicker(false)
              }}
              className="mr-2 text-2xl"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      <ul>
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            className={`flex items-center mb-2 p-2 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} cursor-move`}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className="mr-2">{todo.emoji}</span>
            <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
            <button
              onClick={() => removeTodo(todo.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              <Trash2 size={20} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoList
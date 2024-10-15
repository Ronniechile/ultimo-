import React, { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

interface PostIt {
  id: number
  content: string
  color: string
  textColor: string
}

interface PostItNotesProps {
  darkMode: boolean
}

const PostItNotes: React.FC<PostItNotesProps> = ({ darkMode }) => {
  const [notes, setNotes] = useState<PostIt[]>(() => {
    const savedNotes = localStorage.getItem('postItNotes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  useEffect(() => {
    localStorage.setItem('postItNotes', JSON.stringify(notes))
  }, [notes])

  const generateColor = () => {
    const hue = Math.floor(Math.random() * 360)
    const saturation = Math.floor(Math.random() * 30) + 70 // 70-100%
    const lightness = Math.floor(Math.random() * 20) + 70 // 70-90%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  const getContrastColor = (bgColor: string) => {
    const color = bgColor.match(/\d+/g)
    if (!color) return '#000000'
    const [h, s, l] = color.map(Number)
    return l > 60 ? '#000000' : '#FFFFFF'
  }

  const addNote = () => {
    const bgColor = generateColor()
    const newNote: PostIt = {
      id: Date.now(),
      content: '',
      color: bgColor,
      textColor: getContrastColor(bgColor)
    }
    setNotes([...notes, newNote])
  }

  const updateNote = (id: number, content: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ))
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <div className="w-full">
      <button
        onClick={addNote}
        className={`mb-4 p-2 rounded-full ${darkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'} text-white transition-colors duration-300`}
      >
        <Plus size={24} />
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {notes.map(note => (
          <div
            key={note.id}
            style={{ backgroundColor: note.color, color: note.textColor }}
            className="p-4 rounded-lg shadow-md relative aspect-square"
          >
            <button
              onClick={() => deleteNote(note.id)}
              className="absolute top-2 right-2 hover:text-gray-800"
              style={{ color: note.textColor }}
            >
              <X size={20} />
            </button>
            <textarea
              value={note.content}
              onChange={(e) => updateNote(note.id, e.target.value)}
              className="w-full h-full bg-transparent border-none resize-none focus:outline-none"
              style={{ color: note.textColor }}
              placeholder="Escribe tu nota aquí..."
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostItNotes
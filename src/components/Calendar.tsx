import React, { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react'

interface CalendarProps {
  darkMode: boolean;
}

interface Event {
  id: number;
  date: Date;
  title: string;
}

const Calendar: React.FC<CalendarProps> = ({ darkMode }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents')
    return savedEvents ? JSON.parse(savedEvents, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : []
  })
  const [newEventTitle, setNewEventTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events))
  }, [events])

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const addEvent = () => {
    if (selectedDate && newEventTitle.trim() !== '') {
      const newEvent = { id: Date.now(), date: selectedDate, title: newEventTitle }
      setEvents(prevEvents => [...prevEvents, newEvent])
      setNewEventTitle('')
      setSelectedDate(null)
    }
  }

  const editEvent = (event: Event) => {
    setEditingEvent(event)
    setNewEventTitle(event.title)
    setSelectedDate(event.date)
  }

  const updateEvent = () => {
    if (editingEvent && selectedDate && newEventTitle.trim() !== '') {
      setEvents(prevEvents => prevEvents.map(event => 
        event.id === editingEvent.id ? { ...event, date: selectedDate, title: newEventTitle } : event
      ))
      setEditingEvent(null)
      setNewEventTitle('')
      setSelectedDate(null)
    }
  }

  const deleteEvent = (id: number) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== id))
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      editingEvent ? updateEvent() : addEvent()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">
          {format(currentDate, 'MMMM yyyy', { locale: es })}
        </h2>
        <button onClick={nextMonth} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {daysInMonth.map(day => {
          const dayEvents = events.filter(event => isSameDay(event.date, day))
          return (
            <div
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 text-center cursor-pointer ${
                isSameMonth(day, currentDate)
                  ? darkMode ? 'text-white' : 'text-gray-900'
                  : darkMode ? 'text-gray-500' : 'text-gray-400'
              } ${
                isSameDay(day, new Date())
                  ? 'bg-purple-500 text-white rounded-full'
                  : ''
              } ${
                dayEvents.length > 0
                  ? 'border-b-2 border-purple-500'
                  : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
      {selectedDate && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">
            {format(selectedDate, 'dd MMMM yyyy', { locale: es })}
          </h3>
          <input
            type="text"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full p-2 mb-2 rounded ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'
            }`}
            placeholder="Nuevo evento..."
          />
          <button
            onClick={editingEvent ? updateEvent : addEvent}
            className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
          >
            {editingEvent ? 'Actualizar Evento' : 'Agregar Evento'}
          </button>
        </div>
      )}
      <div className="mt-4">
        <h3 className="font-bold mb-2">Eventos del mes:</h3>
        <ul>
          {events
            .filter(event => isSameMonth(event.date, currentDate))
            .map((event) => (
              <li key={event.id} className="mb-2 flex items-center justify-between">
                <span>{format(event.date, 'dd/MM')} - {event.title}</span>
                <div>
                  <button onClick={() => editEvent(event)} className="mr-2 text-blue-500 hover:text-blue-700">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default Calendar
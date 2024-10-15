import React, { useState, useEffect, useRef } from 'react'
import Calendar from './components/Calendar'
import TodoList from './components/TodoList'
import Calculator from './components/Calculator'
import PostItNotes from './components/PostItNotes'
import Pomodoro from './components/Pomodoro'
import AudioPlayer from './components/AudioPlayer'
import { Calendar as CalendarIcon, CheckSquare, Calculator as CalculatorIcon, Sun, Moon, StickyNote, Palette, Timer, HelpCircle, Music } from 'lucide-react'

type Tab = 'calendar' | 'todo' | 'calculator' | 'postit' | 'pomodoro' | 'audio'

const themes = [
  { primary: 'bg-purple-600', secondary: 'bg-purple-500', text: 'text-white' },
  { primary: 'bg-blue-600', secondary: 'bg-blue-500', text: 'text-white' },
  { primary: 'bg-green-600', secondary: 'bg-green-500', text: 'text-white' },
  { primary: 'bg-red-600', secondary: 'bg-red-500', text: 'text-white' },
]

interface Song {
  id: string;
  name: string;
  artist: string;
  url: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const saved = localStorage.getItem('activeTab')
    return (saved as Tab) || 'calendar'
  })
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [currentTheme, setCurrentTheme] = useState(0)
  const [showHelp, setShowHelp] = useState(false)

  // Pomodoro state
  const [minutes, setMinutes] = useState(() => {
    const savedMinutes = localStorage.getItem('pomodoroMinutes')
    return savedMinutes ? parseInt(savedMinutes) : 25
  })
  const [seconds, setSeconds] = useState(() => {
    const savedSeconds = localStorage.getItem('pomodoroSeconds')
    return savedSeconds ? parseInt(savedSeconds) : 0
  })
  const [isActive, setIsActive] = useState(() => {
    const savedIsActive = localStorage.getItem('pomodoroIsActive')
    return savedIsActive ? JSON.parse(savedIsActive) : false
  })

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    const savedPlaylist = localStorage.getItem('audioPlayerPlaylist')
    return savedPlaylist ? JSON.parse(savedPlaylist) : []
  })
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab)
  }, [activeTab])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        } else if (minutes > 0) {
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          clearInterval(interval)
          setIsActive(false)
        }
      }, 1000)
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, minutes, seconds])

  useEffect(() => {
    localStorage.setItem('pomodoroMinutes', minutes.toString())
    localStorage.setItem('pomodoroSeconds', seconds.toString())
    localStorage.setItem('pomodoroIsActive', JSON.stringify(isActive))
  }, [minutes, seconds, isActive])

  useEffect(() => {
    localStorage.setItem('audioPlayerPlaylist', JSON.stringify(playlist))
  }, [playlist])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate)
      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.addEventListener('ended', handleSongEnd)
    }
    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate)
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audio.removeEventListener('ended', handleSongEnd)
      }
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying, currentSongIndex])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const changeTheme = () => {
    setCurrentTheme((prevTheme) => (prevTheme + 1) % themes.length)
  }

  const theme = themes[currentTheme]

  const helpContent = {
    calendar: "El Calendario te permite agregar y gestionar eventos. Haz clic en una fecha para añadir un evento.",
    todo: "La Lista de Tareas te ayuda a organizar tus actividades. Agrega nuevas tareas, asigna emojis y ordénalas arrastrando.",
    calculator: "La Calculadora realiza operaciones matemáticas básicas. Usa el teclado o los botones en pantalla.",
    postit: "Las Notas Post-It son perfectas para apuntes rápidos. Agrega nuevas notas y personaliza sus colores.",
    pomodoro: "El Temporizador Pomodoro te ayuda a gestionar tu tiempo de trabajo y descanso. Inicia, pausa y reinicia según necesites.",
    audio: "El Reproductor de Audio te permite cargar y reproducir archivos de audio. Controla la reproducción y el volumen."
  }

  // Audio player functions
  const togglePlay = () => setIsPlaying(!isPlaying)

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
      setDuration(audioRef.current.duration)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSongEnd = () => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
    } else {
      setIsPlaying(false)
    }
  }

  const handleSeek = (time: number) => {
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
      setVolume(isMuted ? 1 : 0)
    }
  }

  const playNext = () => {
    if (currentSongIndex < playlist.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1)
      setIsPlaying(true)
    }
  }

  const playPrevious = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1)
      setIsPlaying(true)
    }
  }

  const addSongsToPlaylist = (newSongs: Song[]) => {
    setPlaylist([...playlist, ...newSongs])
  }

  const updatePlaylistOrder = (newPlaylist: Song[]) => {
    setPlaylist(newPlaylist)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'} flex flex-col transition-colors duration-300`}>
      <header className={`${darkMode ? theme.primary : theme.secondary} ${theme.text} p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50 bg-opacity-80 backdrop-filter backdrop-blur-lg`}>
        <h1 className="text-2xl font-bold">Mi Aplicación Web</h1>
        <div className="flex space-x-2">
          <button onClick={changeTheme} className={`p-2 rounded-full hover:${darkMode ? theme.secondary : theme.primary} transition-colors duration-300`}>
            <Palette size={24} />
          </button>
          <button onClick={toggleDarkMode} className={`p-2 rounded-full hover:${darkMode ? theme.secondary : theme.primary} transition-colors duration-300`}>
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button onClick={() => setShowHelp(!showHelp)} className={`p-2 rounded-full hover:${darkMode ? theme.secondary : theme.primary} transition-colors duration-300`}>
            <HelpCircle size={24} />
          </button>
        </div>
      </header>
      <main className="flex-grow p-4 flex mt-16">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6 flex-grow mr-4 transition-colors duration-300`}>
          {activeTab === 'calendar' && <Calendar darkMode={darkMode} />}
          {activeTab === 'todo' && <TodoList darkMode={darkMode} />}
          {activeTab === 'calculator' && <Calculator darkMode={darkMode} />}
          {activeTab === 'postit' && <PostItNotes darkMode={darkMode} />}
          {activeTab === 'pomodoro' && (
            <Pomodoro
              darkMode={darkMode}
              minutes={minutes}
              seconds={seconds}
              isActive={isActive}
              setMinutes={setMinutes}
              setSeconds={setSeconds}
              setIsActive={setIsActive}
            />
          )}
          {activeTab === 'audio' && (
            <AudioPlayer
              darkMode={darkMode}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              volume={volume}
              isMuted={isMuted}
              playlist={playlist}
              currentSongIndex={currentSongIndex}
              togglePlay={togglePlay}
              handleSeek={handleSeek}
              handleVolumeChange={handleVolumeChange}
              toggleMute={toggleMute}
              playNext={playNext}
              playPrevious={playPrevious}
              addSongsToPlaylist={addSongsToPlaylist}
              updatePlaylistOrder={updatePlaylistOrder}
              setCurrentSongIndex={setCurrentSongIndex}
            />
          )}
        </div>
        <nav className="flex flex-col space-y-4">
          {[
            { id: 'calendar', Icon: CalendarIcon },
            { id: 'todo', Icon: CheckSquare },
            { id: 'calculator', Icon: CalculatorIcon },
            { id: 'postit', Icon: StickyNote },
            { id: 'pomodoro', Icon: Timer },
            { id: 'audio', Icon: Music },
          ].map(({ id, Icon }) => (
            <button
              key={id}
              className={`p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
                activeTab === id 
                  ? (darkMode ? theme.primary : theme.secondary) 
                  : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-600')
              }`}
              onClick={() => setActiveTab(id as Tab)}
            >
              <Icon size={24} />
            </button>
          ))}
        </nav>
      </main>
      {showHelp && (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}>
          <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-xl max-w-md`}>
            <h2 className="text-2xl font-bold mb-4">Ayuda</h2>
            <p className="mb-4">{helpContent[activeTab]}</p>
            <button
              onClick={() => setShowHelp(false)}
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} px-4 py-2 rounded transition-colors duration-300`}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
      {activeTab !== 'audio' && playlist.length > 0 && (
        <div className={`fixed bottom-0 left-0 right-0 p-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={togglePlay} className="mr-4 focus:outline-none">
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <div>
                <p className="font-semibold">{playlist[currentSongIndex]?.name || 'No song selected'}</p>
                <p className="text-sm text-gray-500">{playlist[currentSongIndex]?.artist}</p>
              </div>
            </div>
            <div className="flex items-center">
              <button onClick={toggleMute} className="focus:outline-none mr-2">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-24"
              />
              <button onClick={() => setActiveTab('audio')} className="ml-4 focus:outline-none">
                <Maximize2 size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
      <audio
        ref={audioRef}
        src={playlist[currentSongIndex]?.url}
        onEnded={handleSongEnd}
      />
    </div>
  )
}

export default App
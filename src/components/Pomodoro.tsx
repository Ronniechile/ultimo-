import React from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface PomodoroProps {
  darkMode: boolean;
  minutes: number;
  seconds: number;
  isActive: boolean;
  setMinutes: React.Dispatch<React.SetStateAction<number>>;
  setSeconds: React.Dispatch<React.SetStateAction<number>>;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Pomodoro: React.FC<PomodoroProps> = ({
  darkMode,
  minutes,
  seconds,
  isActive,
  setMinutes,
  setSeconds,
  setIsActive
}) => {
  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setMinutes(25)
    setSeconds(0)
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className={`p-3 rounded-full ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors duration-300`}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className={`p-3 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  )
}

export default Pomodoro
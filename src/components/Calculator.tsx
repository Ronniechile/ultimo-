import React, { useState, useEffect } from 'react'

interface CalculatorProps {
  darkMode: boolean;
}

const Calculator: React.FC<CalculatorProps> = ({ darkMode }) => {
  const [display, setDisplay] = useState('')

  const handleClick = (value: string) => {
    setDisplay(display + value)
  }

  const handleClear = () => {
    setDisplay('')
  }

  const handleCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(display)
      setDisplay(result.toString())
    } catch (error) {
      setDisplay('Error')
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCalculate()
    } else if (e.key >= '0' && e.key <= '9' || ['+', '-', '*', '/', '.'].includes(e.key)) {
      handleClick(e.key)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [display])

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ]

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className={`p-4 rounded-t-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <input
          type="text"
          value={display}
          readOnly
          className={`w-full p-2 text-right text-xl rounded ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          }`}
        />
      </div>
      <div className={`grid grid-cols-4 gap-2 p-4 rounded-b-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        {buttons.map((btn) => (
          <button
            key={btn}
            onClick={() => btn === '=' ? handleCalculate() : handleClick(btn)}
            className={`${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-white hover:bg-gray-200 text-gray-800'
            } font-semibold py-2 px-4 rounded shadow transition-colors duration-300`}
          >
            {btn}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="col-span-4 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-300"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default Calculator
import React from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react'

interface Song {
  id: string;
  name: string;
  artist: string;
  url: string;
}

interface AudioPlayerProps {
  darkMode: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playlist: Song[];
  currentSongIndex: number;
  togglePlay: () => void;
  handleSeek: (time: number) => void;
  handleVolumeChange: (volume: number) => void;
  toggleMute: () => void;
  playNext: () => void;
  playPrevious: () => void;
  addSongsToPlaylist: (songs: Song[]) => void;
  updatePlaylistOrder: (newPlaylist: Song[]) => void;
  setCurrentSongIndex: (index: number) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  darkMode,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playlist,
  currentSongIndex,
  togglePlay,
  handleSeek,
  handleVolumeChange,
  toggleMute,
  playNext,
  playPrevious,
  addSongsToPlaylist,
  updatePlaylistOrder,
  setCurrentSongIndex
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newSongs: Song[] = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name.split('.').slice(0, -1).join('.'),
        artist: 'Unknown Artist',
        url: URL.createObjectURL(file)
      }))
      addSongsToPlaylist(newSongs)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const onDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString())
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text'))
    const newPlaylist = [...playlist]
    const [removed] = newPlaylist.splice(dragIndex, 1)
    newPlaylist.splice(dropIndex, 0, removed)
    updatePlaylistOrder(newPlaylist)
    if (currentSongIndex === dragIndex) {
      setCurrentSongIndex(dropIndex)
    } else if (currentSongIndex < dragIndex && currentSongIndex >= dropIndex) {
      setCurrentSongIndex(currentSongIndex + 1)
    } else if (currentSongIndex > dragIndex && currentSongIndex <= dropIndex) {
      setCurrentSongIndex(currentSongIndex - 1)
    }
  }

  const currentSong = playlist[currentSongIndex]

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-xl`}>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Now Playing</h2>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xl font-semibold">{currentSong?.name || 'No song selected'}</p>
            <p className="text-gray-500">{currentSong?.artist}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full mx-4"
          />
          <span>{formatTime(duration)}</span>
        </div>
        <div className="flex justify-center items-center space-x-6">
          <button onClick={playPrevious} className="focus:outline-none">
            <SkipBack size={32} />
          </button>
          <button onClick={togglePlay} className="focus:outline-none">
            {isPlaying ? <Pause size={48} /> : <Play size={48} />}
          </button>
          <button onClick={playNext} className="focus:outline-none">
            <SkipForward size={32} />
          </button>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">Playlist</h3>
        <div className="overflow-y-auto max-h-64">
          {playlist.map((song, index) => (
            <div
              key={song.id}
              draggable
              onDragStart={(e) => onDragStart(e, index)}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, index)}
              className={`flex items-center justify-between p-2 ${
                index === currentSongIndex ? 'bg-purple-500 text-white' : ''
              } hover:bg-gray-100 cursor-move`}
              onClick={() => {
                setCurrentSongIndex(index)
                togglePlay()
              }}
            >
              <div className="flex items-center">
                <Music size={20} className="mr-2" />
                <div>
                  <p className="font-semibold">{song.name}</p>
                  <p className="text-sm text-gray-500">{song.artist}</p>
                </div>
              </div>
              <span>{index === currentSongIndex && isPlaying ? 'Playing' : ''}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-4">Add Songs</h3>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          multiple
          className="mb-4"
        />
      </div>
    </div>
  )
}

export default AudioPlayer
import { useState, useRef, useEffect } from 'react'
import { AudioRecorderUtil, formatDuration } from '../utils/audioUtils'

export default function AudioRecorder({ onRecordingComplete, onTranscriptReady }) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState(null)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      recorderRef.current?.stop()
    }
  }, [])

  const startRecording = async () => {
    try {
      const recorder = new AudioRecorderUtil()
      recorder.onStop = (blob) => {
        setAudioBlob(blob)
        onRecordingComplete?.(blob)
      }
      await recorder.start()
      recorderRef.current = recorder
      setIsRecording(true)
      setDuration(0)
      setAudioBlob(null)

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1)
      }, 1000)
    } catch (err) {
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    recorderRef.current?.stop()
    setIsRecording(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Audio Recorder</h3>
        {isRecording && (
          <span className="flex items-center gap-2 badge badge-red font-semibold">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Recording
          </span>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        {/* Duration */}
        <div className={`text-5xl font-mono tracking-wider px-6 py-3 rounded-2xl ${
          isRecording ? 'text-red-600 bg-red-50' : 'text-gray-700 bg-gray-50'
        }`}>
          {formatDuration(duration)}
        </div>

        {/* Record Button */}
        <div className="relative">
          {isRecording && (
            <div className="absolute inset-0 rounded-full animate-pulse-ring" />
          )}
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="relative w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="6" />
              </svg>
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="relative w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-full hover:from-gray-800 hover:to-gray-900 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="5" width="10" height="10" rx="2" />
              </svg>
            </button>
          )}
        </div>

        <p className="text-sm text-gray-400">
          {isRecording ? 'Click to stop recording' : 'Click to start recording'}
        </p>

        {/* Audio Preview */}
        {audioBlob && (
          <div className="w-full mt-2 p-4 bg-gradient-to-r from-gray-50 to-primary-50/30 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-600 mb-2 font-medium">Recording captured ({formatDuration(duration)})</p>
            <audio controls className="w-full" src={URL.createObjectURL(audioBlob)} />
          </div>
        )}
      </div>
    </div>
  )
}

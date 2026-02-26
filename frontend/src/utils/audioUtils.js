/**
 * Audio recording utilities using the MediaRecorder API.
 */

export class AudioRecorderUtil {
  constructor() {
    this.mediaRecorder = null
    this.audioChunks = []
    this.stream = null
    this.onDataAvailable = null
    this.onStop = null
  }

  async start() {
    this.audioChunks = []
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : 'audio/webm'

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType })

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data)
        this.onDataAvailable?.(event.data)
      }
    }

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.audioChunks, { type: mimeType })
      this.onStop?.(blob)
    }

    this.mediaRecorder.start(1000) // Collect data every second
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
  }

  get isRecording() {
    return this.mediaRecorder?.state === 'recording'
  }

  get duration() {
    // Approximate duration from chunks
    return this.audioChunks.length // seconds (roughly, since we collect every 1s)
  }
}

/**
 * Format seconds to MM:SS display.
 */
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

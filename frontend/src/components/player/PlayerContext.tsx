'use client'

import { Song } from '@/types/song'
import { createContext, useContext, useRef, useState } from 'react'

type PlayerContextType = {
	current: Song | null
	queue: Song[]
	isPlaying: boolean
	play: (song: Song, list: Song[]) => void
	pause: () => void
	next: () => void
	prev: () => void
	audioRef: React.RefObject<HTMLAudioElement | null>
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const [current, setCurrent] = useState<Song | null>(null)
	const [queue, setQueue] = useState<Song[]>([])
	const [isPlaying, setIsPlaying] = useState(false)

	const audioRef = useRef<HTMLAudioElement>(null)

	const play = async (song: Song, list: Song[]) => {
		const audio = audioRef.current
		if (!audio) return

		setQueue(list)
		setCurrent(song)

		// 👉 если тот же трек — не перезагружаем
		if (audio.src !== song.audio_url) {
			audio.src = song.audio_url
			audio.currentTime = 0
		}

		try {
			await audio.play()
			setIsPlaying(true)
		} catch (e) {
			console.error('Play error', e)
		}
	}

	const pause = () => {
		const audio = audioRef.current
		if (!audio) return

		audio.pause()
		setIsPlaying(false)
	}

	const next = () => {
		if (!current) return

		const index = queue.findIndex(s => s.id === current.id)
		const nextSong = queue[index + 1]

		if (nextSong) play(nextSong, queue)
	}

	const prev = () => {
		if (!current) return

		const index = queue.findIndex(s => s.id === current.id)
		const prevSong = queue[index - 1]

		if (prevSong) play(prevSong, queue)
	}

	return (
		<PlayerContext.Provider
			value={{
				current,
				queue,
				play,
				pause,
				next,
				prev,
				isPlaying,
				audioRef,
			}}
		>
			{children}
		</PlayerContext.Provider>
	)
}

export function usePlayer() {
	const ctx = useContext(PlayerContext)
	if (!ctx) throw new Error('PlayerProvider missing')
	return ctx
}

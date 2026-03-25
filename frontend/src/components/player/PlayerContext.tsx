'use client'

import { streamUrl } from '@/services/api'
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
	preload: (song: Song) => void
	audioRef: React.RefObject<HTMLAudioElement | null>
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerProvider({ children }: { children: React.ReactNode }) {
	const [current, setCurrent] = useState<Song | null>(null)
	const [queue, setQueue] = useState<Song[]>([])
	const [isPlaying, setIsPlaying] = useState(false)

	const audioRef = useRef<HTMLAudioElement>(null)

	// 🔥 preload при наведении
	const preload = (song: Song) => {
		const audio = new Audio()
		audio.src = streamUrl(`/stream/${song.filename}`)
		audio.preload = 'auto'
	}

	const fadeIn = (audio: HTMLAudioElement) => {
		audio.volume = 0
		let vol = 0

		const interval = setInterval(() => {
			vol += 0.1
			audio.volume = Math.min(vol, 1)

			if (vol >= 1) clearInterval(interval)
		}, 30)
	}

	const play = (song: Song, list: Song[]) => {
		const audio = audioRef.current
		if (!audio) return

		setQueue(list)
		setCurrent(song)

		const url = streamUrl(`/stream/${song.filename}`)

		// 🔥 если тот же трек — не трогаем
		if (audio.src !== url) {
			audio.src = url
		}

		audio.currentTime = 0
		audio.play()

		fadeIn(audio) // 🔥 вау эффект

		setIsPlaying(true)
	}

	const pause = () => {
		audioRef.current?.pause()
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
				preload,
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

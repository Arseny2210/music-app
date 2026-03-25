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

	// 🔥 preload (упрощённый и безопасный)
	const preload = (song: Song) => {
		const link = document.createElement('link')
		link.rel = 'preload'
		link.as = 'audio'
		link.href = streamUrl(`/stream/${song.filename}`)
		document.head.appendChild(link)
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

	const play = async (song: Song, list: Song[]) => {
		const audio = audioRef.current
		if (!audio) return

		const url = streamUrl(`/stream/${song.filename}`)

		// 🔥 ВСЕГДА ставим src (без сравнения!)
		audio.src = url

		setQueue(list)
		setCurrent(song)

		audio.currentTime = 0

		try {
			await audio.play()
			fadeIn(audio)
			setIsPlaying(true)
		} catch (e) {
			console.error('Play error:', e)
			setIsPlaying(false)
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

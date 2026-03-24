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

	const play = (song: Song, list: Song[]) => {
		setQueue(list)
		setCurrent(song)

		setTimeout(() => {
			audioRef.current?.play()
			setIsPlaying(true)
		}, 50)
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
			value={{ current, queue, play, pause, next, prev, isPlaying, audioRef }}
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

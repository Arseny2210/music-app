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

		console.log('🎧 PLAY CLICKED')
		console.log('➡️ Song:', song)

		if (!audio) {
			console.log('❌ audioRef is NULL')
			return
		}

		const url = streamUrl(`/stream/${song.filename}`)

		console.log('➡️ URL:', url)
		console.log('➡️ Current audio.src:', audio.src)

		setQueue(list)
		setCurrent(song)

		audio.src = url
		audio.currentTime = 0

		try {
			await audio.play()
			console.log('✅ AUDIO STARTED')
			setIsPlaying(true)
		} catch (e) {
			console.error('❌ PLAY ERROR:', e)
		}
	}

	const pause = () => {
		const audio = audioRef.current
		if (!audio) return

		audio.pause()
		console.log('⏸ PAUSE')
		setIsPlaying(false)
	}

	const next = () => {
		console.log('⏭ NEXT')
		if (!current) return

		const index = queue.findIndex(s => s.id === current.id)
		const nextSong = queue[index + 1]

		if (nextSong) play(nextSong, queue)
		else console.log('⚠️ no next song')
	}

	const prev = () => {
		console.log('⏮ PREV')
		if (!current) return

		const index = queue.findIndex(s => s.id === current.id)
		const prevSong = queue[index - 1]

		if (prevSong) play(prevSong, queue)
		else console.log('⚠️ no prev song')
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

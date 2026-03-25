'use client'

import { streamUrl } from '@/services/api'
import { useEffect, useState } from 'react'
import styles from './PlayerBar.module.css'
import { usePlayer } from './PlayerContext'

export default function PlayerBar() {
	const { current, isPlaying, pause, play, next, prev, audioRef } = usePlayer()

	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const update = () => {
			const value = (audio.currentTime / audio.duration) * 100
			setProgress(value || 0)
		}

		audio.addEventListener('timeupdate', update)
		audio.onended = next

		return () => audio.removeEventListener('timeupdate', update)
	}, [current, next])

	if (!current) return null

	return (
		<div className={styles.wrapper}>
			<div className={styles.inner}>
				<div className={styles.title}>{current.name}</div>

				<div className={styles.controls}>
					<button onClick={prev} className={styles.iconBtn}>
						⏮
					</button>

					<button
						onClick={() => (isPlaying ? pause() : play(current, []))}
						className={styles.playBtn}
					>
						{isPlaying ? '⏸' : '▶'}
					</button>

					<button onClick={next} className={styles.iconBtn}>
						⏭
					</button>
				</div>

				<div className={styles.progress}>
					<div className={styles.bar} style={{ width: `${progress}%` }} />
				</div>

				<audio
					ref={audioRef}
					src={streamUrl(`/stream/${current.filename}`)}
					preload='metadata'
				/>
			</div>
		</div>
	)
}

'use client'

import { useEffect, useState } from 'react'
import styles from './PlayerBar.module.css'
import { usePlayer } from './PlayerContext'

export default function PlayerBar() {
	const { current, next, prev, audioRef } = usePlayer()

	const [progress, setProgress] = useState(0)
	const [isPlaying, setIsPlaying] = useState(false)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const update = () => {
			if (!audio.duration) return
			setProgress((audio.currentTime / audio.duration) * 100)
		}

		const onPlay = () => setIsPlaying(true)
		const onPause = () => setIsPlaying(false)
		const onEnded = () => next()

		audio.addEventListener('timeupdate', update)
		audio.addEventListener('play', onPlay)
		audio.addEventListener('pause', onPause)
		audio.addEventListener('ended', onEnded)

		return () => {
			audio.removeEventListener('timeupdate', update)
			audio.removeEventListener('play', onPlay)
			audio.removeEventListener('pause', onPause)
			audio.removeEventListener('ended', onEnded)
		}
	}, [audioRef, current, next]) // 👈 важно!

	return (
		<div className={styles.wrapper}>
			<div className={styles.inner}>
				<div className={styles.title}>
					{current ? current.name : 'Выберите трек'}
				</div>

				<div className={styles.controls}>
					<button onClick={prev} className={styles.iconBtn} disabled={!current}>
						⏮
					</button>

					<button
						onClick={() => {
							const audio = audioRef.current
							if (!audio || !current) return

							if (audio.paused) {
								audio.play()
							} else {
								audio.pause()
							}
						}}
						className={styles.playBtn}
						disabled={!current}
					>
						{isPlaying ? '⏸' : '▶'}
					</button>

					<button onClick={next} className={styles.iconBtn} disabled={!current}>
						⏭
					</button>
				</div>

				<div className={styles.progress}>
					<div className={styles.bar} style={{ width: `${progress}%` }} />
				</div>

				<audio ref={audioRef} preload='auto' />
			</div>
		</div>
	)
}

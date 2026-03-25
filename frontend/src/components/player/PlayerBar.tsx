'use client'

import { useEffect, useState } from 'react'
import styles from './PlayerBar.module.css'
import { usePlayer } from './PlayerContext'

export default function PlayerBar() {
	const { current, isPlaying, next, prev, audioRef } = usePlayer()

	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const update = () => {
			if (!audio.duration) return
			setProgress((audio.currentTime / audio.duration) * 100)
		}

		audio.addEventListener('timeupdate', update)
		audio.onended = next

		return () => {
			audio.removeEventListener('timeupdate', update)
		}
	}, [next])

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

							if (isPlaying) {
								audio.pause()
							} else {
								audio.play()
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

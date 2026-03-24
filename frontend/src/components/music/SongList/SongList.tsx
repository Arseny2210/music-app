'use client'

import { usePlayer } from '@/components/player/PlayerContext'
import { Song } from '@/types/song'
import Image from 'next/image'
import styles from './SongList.module.css'
type Props = {
	songs: Song[]
}

export default function SongList({ songs }: Props) {
	const { play } = usePlayer()

	console.log(songs)
	return (
		<div className={styles.grid}>
			{songs.map(song => (
				<div
					key={song.id}
					onClick={() => play(song, songs)}
					className={styles.card}
				>
					<div className={styles.imageWrapper}>
						<Image
							src={`${process.env.NEXT_PUBLIC_API_URL}/covers/${song.cover}`}
							alt={song.name}
							width={300}
							height={300}
							className={styles.cover}
						/>

						<div className={styles.play}>▶</div>
					</div>

					<div className={styles.name}>{song.name}</div>

					<div className={styles.genre}>
						{song.genre === 'pop'
							? 'Поп'
							: song.genre === 'chanson'
								? 'Шансон'
								: song.genre}
					</div>
				</div>
			))}
		</div>
	)
}

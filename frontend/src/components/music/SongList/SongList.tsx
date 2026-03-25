'use client'

import { usePlayer } from '@/components/player/PlayerContext'
import { Song } from '@/types/song'
import Image from 'next/image'
import styles from './SongList.module.css'

type Props = {
	songs: Song[]
	loading?: boolean
}

export default function SongList({ songs, loading }: Props) {
	const { play } = usePlayer()

	if (loading) {
		return (
			<div className={styles.grid}>
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={i} className={styles.card}>
						<div className={styles.skeletonImage} />
						<div className={styles.skeletonText} />
						<div className={styles.skeletonSubText} />
					</div>
				))}
			</div>
		)
	}

	return (
		<div className={styles.grid}>
			{songs.map(song => (
				<div
					key={song.id}
					onClick={() => {
						console.log('🖱 CLICK CARD:', song.name)
						play(song, songs)
					}}
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

						<div className={styles.overlay}>
							<div className={styles.play}>▶</div>
						</div>
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

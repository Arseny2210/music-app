'use client'

import SongList from '@/components/music/SongList/SongList'
import { getSongs } from '@/services/api'
import { Song } from '@/types/song'
import { useEffect, useState } from 'react'
import styles from './Music.module.css'

export default function MusicPage() {
	const [songs, setSongs] = useState<Song[]>([])
	const [genre, setGenre] = useState<string>('all')

	useEffect(() => {
		getSongs().then(setSongs)
	}, [])

	const filteredSongs =
		genre === 'all' ? songs : songs.filter(song => song.genre === genre)

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Music</h1>

			<div className={styles.filters}>
				<button onClick={() => setGenre('all')}>Все</button>
				<button onClick={() => setGenre('pop')}>Поп</button>
				<button onClick={() => setGenre('chanson')}>Шансон</button>
			</div>

			<SongList songs={filteredSongs} />
		</div>
	)
}

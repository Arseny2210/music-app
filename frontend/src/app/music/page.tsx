'use client'

import SongList from '@/components/music/SongList/SongList'
import { getSongs } from '@/services/api'
import { Song } from '@/types/song'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import styles from './Music.module.css'

export default function MusicPage() {
	const [genre, setGenre] = useState<'all' | 'pop' | 'chanson'>('all')

	const {
		data: songs = [],
		isLoading,
		isFetching,
	} = useQuery<Song[]>({
		queryKey: ['songs'],
		queryFn: getSongs,
	})

	// 🔥 мемоизация (чтобы не пересчитывалось лишний раз)
	const filteredSongs = useMemo(() => {
		return genre === 'all' ? songs : songs.filter(song => song.genre === genre)
	}, [songs, genre])

	return (
		<div className={styles.container}>
			<div className={styles.filters}>
				<button onClick={() => setGenre('all')}>Все</button>
				<button onClick={() => setGenre('pop')}>Поп</button>
				<button onClick={() => setGenre('chanson')}>Шансон</button>
			</div>

			{/* 👉 если хочешь можно показывать "обновляется..." */}
			{isFetching && !isLoading && (
				<div style={{ marginBottom: 10, fontSize: 14, color: '#888' }}>
					Обновляем список...
				</div>
			)}

			<SongList songs={filteredSongs} loading={isLoading} />
		</div>
	)
}

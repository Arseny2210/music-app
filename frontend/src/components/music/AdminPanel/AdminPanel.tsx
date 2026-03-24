'use client'

import { uploadSong } from '@/services/api'
import { useState } from 'react'
import styles from './AdminPanel.module.css'

type Props = {
	reload: () => void
}

export default function AdminPanel({ reload }: Props) {
	const [name, setName] = useState('')
	const [file, setFile] = useState<File | null>(null)
	const [cover, setCover] = useState<File | null>(null)
	const [genre, setGenre] = useState('pop')

	const upload = async () => {
		if (!name || !file || !cover) return

		await uploadSong(name, file, cover, genre)

		setName('')
		setFile(null)
		setCover(null)
		setGenre('pop')

		reload()
	}

	return (
		<div className={styles.card}>
			<h2 className={styles.title}>Добавить музыку</h2>

			<div className={styles.grid}>
				<div className={styles.field}>
					<label>Название трека</label>

					<input
						type='text'
						value={name}
						onChange={e => setName(e.target.value)}
						placeholder='Введите название'
						className={styles.input}
					/>
				</div>

				<div className={styles.field}>
					<label>Жанр</label>

					<select
						value={genre}
						onChange={e => setGenre(e.target.value)}
						className={styles.input}
					>
						<option value='pop'>Pop</option>
						<option value='chanson'>Chanson</option>
					</select>
				</div>

				<div className={styles.field}>
					<label>Файл музыки</label>

					<input
						type='file'
						accept='audio/*'
						onChange={e => setFile(e.target.files?.[0] || null)}
						className={styles.file}
					/>
				</div>

				<div className={styles.field}>
					<label>Обложка</label>

					<input
						type='file'
						accept='image/*'
						onChange={e => setCover(e.target.files?.[0] || null)}
						className={styles.file}
					/>
				</div>
			</div>

			<button onClick={upload} className={styles.button}>
				Загрузить трек
			</button>
		</div>
	)
}

'use client'

import AdminPanel from '@/components/music/AdminPanel/AdminPanel'
import { checkAuth, deleteSong, getSongs, login, logout } from '@/services/api'

import { Song } from '@/types/song'
import { useEffect, useState } from 'react'
import styles from './Admin.module.css'

export default function AdminPage() {
	const [auth, setAuth] = useState(false)
	const [loading, setLoading] = useState(true)

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const [songs, setSongs] = useState<Song[]>([])

	const loadSongs = async () => {
		const data = await getSongs()
		setSongs(data)
	}

	useEffect(() => {
		const init = async () => {
			const ok = await checkAuth()

			if (ok) {
				setAuth(true)
				await loadSongs()
			}

			setLoading(false)
		}

		init()
	}, [])

	const loginUser = async () => {
		try {
			await login(username, password)

			const ok = await checkAuth()

			if (ok) {
				setAuth(true)
				await loadSongs()
			} else {
				alert('Неверный логин или пароль')
			}
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Ошибка входа')
		}
	}

	const logoutUser = () => {
		logout()
		setAuth(false)
		setSongs([])
	}

	const removeSong = async (id: number) => {
		try {
			await deleteSong(id)
			await loadSongs()
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Ошибка удаления')
		}
	}

	if (loading) {
		return <div className={styles.login}>Loading...</div>
	}

	if (!auth) {
		return (
			<div className={styles.login}>
				<h1 className={styles.title}>Админ панель</h1>

				<input
					type='text'
					value={username}
					onChange={e => setUsername(e.target.value)}
					className={styles.input}
					placeholder='Username'
				/>

				<input
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					className={styles.input}
					placeholder='Password'
				/>

				<button onClick={loginUser} className={styles.button}>
					Войти
				</button>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>Admin Panel</h1>

			{/* ---------------- MUSIC ---------------- */}

			<div className={styles.section}>
				<h2 className={styles.sectionTitle}>Музыка</h2>

				<div className={styles.card}>
					<AdminPanel reload={loadSongs} />
				</div>

				<div className={styles.songList}>
					{songs.map(song => (
						<div key={song.id} className={styles.songItem}>
							<span className={styles.songName}>{song.name}</span>

							<button
								onClick={() => removeSong(song.id)}
								className={styles.delete}
							>
								Удалить
							</button>
						</div>
					))}
				</div>
			</div>

			<div className={styles.btnWrapper}>
				<button onClick={logoutUser} className={styles.button}>
					Выйти
				</button>
			</div>
		</div>
	)
}

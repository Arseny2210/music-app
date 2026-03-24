const API = process.env.NEXT_PUBLIC_API_URL!

export async function login(username: string, password: string) {
	const formData = new FormData()

	formData.append('username', username)
	formData.append('password', password)

	await fetch(`${API}/auth/login`, {
		method: 'POST',
		body: formData,
		credentials: 'include',
	})
}

export async function logout() {
	await fetch(`${API}/auth/logout`, {
		method: 'POST',
		credentials: 'include',
	})
}

export async function checkAuth() {
	const res = await fetch(`${API}/auth/me`, {
		credentials: 'include',
	})

	return res.ok
}

export async function getSongs() {
	const res = await fetch(`${API}/songs`)
	return res.json()
}

export async function deleteSong(id: number) {
	await fetch(`${API}/songs/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	})
}

export async function uploadSong(
	name: string,
	file: File,
	cover: File,
	genre: string,
) {
	const formData = new FormData()

	formData.append('name', name)
	formData.append('file', file)
	formData.append('cover', cover)
	formData.append('genre', genre)

	await fetch(`${API}/upload`, {
		method: 'POST',
		body: formData,
		credentials: 'include',
	})
}

export function streamUrl(url: string) {
	return `${API}${url}`
}

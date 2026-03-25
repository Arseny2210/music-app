const API = process.env.NEXT_PUBLIC_API_URL!

export async function login(username: string, password: string) {
	const formData = new FormData()

	formData.append('username', username)
	formData.append('password', password)

	const res = await fetch(`${API}/auth/login`, {
		method: 'POST',
		body: formData,
	})

	if (!res.ok) {
		throw new Error('Login failed')
	}

	const data = await res.json()

	localStorage.setItem('token', data.access_token)
}

export async function logout() {
	localStorage.removeItem('token')
}

export async function checkAuth() {
	const token = localStorage.getItem('token')

	if (!token) return false

	const res = await fetch(`${API}/auth/me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return res.ok
}

export async function getSongs() {
	const res = await fetch(`${API}/songs`)
	return res.json()
}

export async function deleteSong(id: number) {
	const token = localStorage.getItem('token')

	await fetch(`${API}/songs/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

export async function uploadSong(
	name: string,
	file: File,
	cover: File,
	genre: string,
) {
	const token = localStorage.getItem('token')

	const formData = new FormData()

	formData.append('name', name)
	formData.append('file', file)
	formData.append('cover', cover)
	formData.append('genre', genre)

	await fetch(`${API}/upload`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
}

export function streamUrl(url: string) {
	return `${API}${url}`
}

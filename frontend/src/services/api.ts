const API = process.env.NEXT_PUBLIC_API_URL!

async function parseError(res: Response, fallback: string) {
	try {
		const data = await res.json()
		if (data?.detail && typeof data.detail === 'string') {
			return data.detail
		}
	} catch {
		// no-op: backend may return plain text/empty body
	}
	return fallback
}

export async function login(username: string, password: string) {
	const formData = new FormData()

	formData.append('username', username)
	formData.append('password', password)

	const res = await fetch(`${API}/auth/login`, {
		method: 'POST',
		body: formData,
	})

	if (!res.ok) {
		throw new Error(await parseError(res, 'Login failed'))
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

	try {
		const res = await fetch(`${API}/auth/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
		return res.ok
	} catch {
		return false
	}
}

export async function getSongs() {
	const res = await fetch(`${API}/songs`)
	if (!res.ok) {
		throw new Error(await parseError(res, 'Failed to load songs'))
	}
	return res.json()
}

export async function deleteSong(id: number) {
	const token = localStorage.getItem('token')

	const res = await fetch(`${API}/songs/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res.ok) {
		throw new Error(await parseError(res, 'Failed to delete song'))
	}
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

	const res = await fetch(`${API}/upload`, {
		method: 'POST',
		body: formData,
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res.ok) {
		throw new Error(await parseError(res, 'Failed to upload song'))
	}
}

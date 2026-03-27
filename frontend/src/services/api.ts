import { supabase } from './supabaseClient'

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

	const audioName = `${crypto.randomUUID()}.${file.name.split('.').pop()}`
	const coverName = `${crypto.randomUUID()}.${cover.name.split('.').pop()}`

	// upload audio
	const { error: audioError } = await supabase.storage
		.from('music')
		.upload(audioName, file)

	if (audioError) throw audioError

	// upload cover
	const { error: coverError } = await supabase.storage
		.from('music')
		.upload(coverName, cover)

	if (coverError) throw coverError

	const audioUrl = supabase.storage.from('music').getPublicUrl(audioName)
		.data.publicUrl
	const coverUrl = supabase.storage.from('music').getPublicUrl(coverName)
		.data.publicUrl

	const res = await fetch(`${API}/songs`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			name,
			genre,
			audio_url: audioUrl,
			cover_url: coverUrl,
		}),
	})

	if (!res.ok) {
		throw new Error(await parseError(res, 'Failed to upload song'))
	}
}

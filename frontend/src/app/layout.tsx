import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header/Header'
import PlayerBar from '@/components/player/PlayerBar'
import { PlayerProvider } from '@/components/player/PlayerContext'
import './globals.css'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ru'>
			<body className='min-h-screen flex flex-col'>
				<PlayerProvider>
					<Header />
					<main className='flex-1 py-10 pb-32'>{children}</main>
					<Footer />
					<PlayerBar />
				</PlayerProvider>
			</body>
		</html>
	)
}

import Footer from '@/components/layout/Footer/Footer'
import Header from '@/components/layout/Header/Header'
import { PlayerProvider } from '@/components/player/PlayerContext'
import { Providers } from '@/components/Providers'
import './globals.css'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='ru'>
			<body className='min-h-screen flex flex-col'>
				<Providers>
					<PlayerProvider>
						<Header />
						<main className='flex-1'>{children}</main>
						<Footer />
					</PlayerProvider>
				</Providers>
			</body>
		</html>
	)
}

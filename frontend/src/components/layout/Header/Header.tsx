'use client'

import { navigation } from '@/config/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'

export default function Header() {
	const pathname = usePathname()

	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<h1 className={styles.title}>
					<Link href={'/'}>Музыкальное приложение</Link>
				</h1>

				<div className={styles.menu}>
					{navigation.map(item => {
						const isActive = pathname === item.href

						return (
							<Link
								key={item.href}
								href={item.href}
								className={`${styles.menuItem} ${
									isActive ? styles.menuItemActive : ''
								}`}
							>
								{item.name}
							</Link>
						)
					})}
				</div>
			</div>
		</header>
	)
}

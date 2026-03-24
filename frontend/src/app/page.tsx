import styles from './Home.module.css'

export default function HomePage() {
	return (
		<div className={styles.container}>
			<h1 className={styles.title}>My Music</h1>

			<p className={styles.text}>
				Welcome to the official website of my music. Here you can listen to all
				my tracks online.
			</p>

			<p className={styles.text}>
				All songs are available in the Music section.
			</p>
		</div>
	)
}

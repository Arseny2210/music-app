'use client'

import { motion } from 'framer-motion'
import { Mail, Send, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import styles from './Home.module.css'

const fadeUp = {
	initial: { opacity: 0, y: 50 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: false, margin: '-50px' },
	transition: { duration: 0.5 },
}

export default function HomePage() {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				{/* HERO */}
				<motion.section {...fadeUp} className={styles.hero}>
					<h1>🎤 Песня про вас — уникальный подарок</h1>
					<p>
						Имя, история и эмоции превращаются в трек, который невозможно
						забыть.
					</p>

					<div className={styles.heroButtons}>
						{/* 👉 TELEGRAM */}
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link
								href='https://t.me/MusicFor_Site'
								target='_blank'
								className={styles.primaryBtn}
							>
								Заказать песню
							</Link>
						</motion.div>

						{/* 👉 MUSIC PAGE */}
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Link href='/music' className={styles.secondaryBtn}>
								Послушать примеры
							</Link>
						</motion.div>
					</div>
				</motion.section>

				{/* BENEFITS */}
				<motion.section {...fadeUp} className={styles.grid}>
					{[
						{ title: 'Индивидуально', text: 'Полностью под вашу историю' },
						{ title: 'Эмоции', text: 'Реакция “вау” гарантирована' },
						{ title: 'Уникально', text: 'Такого подарка ни у кого нет' },
					].map((item, i) => (
						<motion.div
							key={i}
							whileHover={{ scale: 1.05 }}
							className={styles.card}
						>
							<h3>{item.title}</h3>
							<p>{item.text}</p>
						</motion.div>
					))}
				</motion.section>

				{/* USE CASES */}
				<motion.section {...fadeUp} className={styles.useCases}>
					<h2 className={styles.titleSmall}>🎯 Идеально подойдёт</h2>

					<div className={styles.useGrid}>
						{[
							'💍 Свадьба',
							'🎂 День рождения',
							'❤️ Признание в любви',
							'🎉 Юбилей',
							'🎁 Сюрприз',
							'📱 TikTok / Reels',
						].map((item, i) => (
							<motion.div
								key={i}
								whileHover={{ scale: 1.08 }}
								whileTap={{ scale: 0.95 }}
								className={styles.useCard}
							>
								{item}
							</motion.div>
						))}
					</div>
				</motion.section>

				{/* PRICING */}
				<motion.section {...fadeUp} className={styles.pricing}>
					<h2 className={styles.titleSmall}>💸 Стоимость</h2>

					<div className={styles.priceGrid}>
						{[
							{ name: 'Песня', price: '500 ₽' },
							{ name: 'Стихи', price: '250 ₽' },
							{ name: 'Готовая музыка', price: '100 ₽' },
						].map((item, i) => (
							<motion.div
								key={i}
								whileHover={{ scale: 1.05 }}
								className={styles.priceCard}
							>
								<h3>{item.name}</h3>
								<p className={styles.price}>{item.price}</p>
							</motion.div>
						))}
					</div>
				</motion.section>

				{/* CTA */}
				<motion.section {...fadeUp} className={styles.cta}>
					<h2 className={styles.titleSmall}>🚀 Закажите прямо сейчас</h2>
					<p>Создайте подарок, который запомнится навсегда</p>

					<motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.95 }}>
						<Link
							href='https://t.me/MusicFor_Site'
							target='_blank'
							className={styles.primaryBtn}
						>
							Оформить заказ
						</Link>
					</motion.div>
				</motion.section>

				{/* CONTACTS */}
				<motion.section {...fadeUp} className={styles.contacts}>
					{[
						{
							icon: <Send size={18} />,
							name: 'Telegram',
							link: 'https://t.me/MusicFor_Site',
						},
						{
							icon: <Mail size={18} />,
							name: 'Email',
							link: 'Music2202@yandex.ru',
						},
						{
							icon: <ShoppingBag size={18} />,
							name: 'Avito',
							link: '#',
						},
					].map((item, i) => (
						<motion.a
							key={i}
							whileHover={{ scale: 1.08 }}
							whileTap={{ scale: 0.95 }}
							href={item.link}
							target='_blank'
						>
							{item.icon} {item.name}
						</motion.a>
					))}
				</motion.section>
			</div>
		</div>
	)
}

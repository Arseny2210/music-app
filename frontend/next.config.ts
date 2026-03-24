const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '8000',
				pathname: '/covers/**',
			},
		],
		dangerouslyAllowLocalIP: true,
	},
}

export default nextConfig

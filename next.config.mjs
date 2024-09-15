/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your configurations here
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      use: 'js-yaml-loader',
    })
    return config
  },
}

export default nextConfig;
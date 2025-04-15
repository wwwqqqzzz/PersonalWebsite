let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  // output: 'export', // 注释掉静态导出配置，启用API路由支持
  
  // 配置基础路径
  basePath: process.env.NODE_ENV === 'development' ? '' : '/portfolio',
  
  // 配置重写规则
  async rewrites() {
    return {
      beforeFiles: [
        // 将根路径请求重定向到门户网站的静态文件
        {
          source: '/',
          destination: '/portal/index.html',
        },
        // 处理门户网站的静态资源
        {
          source: '/assets/:path*',
          destination: '/portal/assets/:path*',
        },
        // 捕获门户网站的其他路径，不需要额外的头部要求
        {
          source: '/:path*',
          destination: '/portal/:path*',
          // 移除has条件限制
        },
      ],
    };
  },
  
  trailingSlash: true,
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig

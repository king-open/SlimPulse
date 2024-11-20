interface EnvConfig {
  API_URL: string
  APP_NAME: string
  VERSION: string
}

const devConfig: EnvConfig = {
  API_URL: 'http://localhost:3000/api',
  APP_NAME: 'Fitness Check (Dev)',
  VERSION: '0.0.1',
}

const prodConfig: EnvConfig = {
  API_URL: 'https://api.fitness-check.com', // 生产环境 API 地址
  APP_NAME: 'Fitness Check',
  VERSION: '0.0.1',
}

const testConfig: EnvConfig = {
  API_URL: 'https://test-api.fitness-check.com', // 测试环境 API 地址
  APP_NAME: 'Fitness Check (Test)',
  VERSION: '0.0.1',
}

export const getConfig = (): EnvConfig => {
  switch (import.meta.env.MODE) {
    case 'development':
      return devConfig
    case 'test':
      return testConfig
    case 'production':
      return prodConfig
    default:
      return devConfig
  }
}

export const config = getConfig() 

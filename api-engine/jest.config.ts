import type { Config } from 'jest'
import { defaults } from 'jest-config'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'mts', 'cts'],
  collectCoverageFrom: [
    '**/*.{ts,tsx,js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
  ],
  transform: {
    '\\.[jt]sx?$': 'babel-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
  globalSetup: '<rootDir>/__tests__/jest/globalSetup.ts',
  globalTeardown: '<rootDir>/__tests__/jest/globalTeardown.ts',
  moduleDirectories: ['node_modules', 'src'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/jest/jest.setup.ts'],
}

export default config

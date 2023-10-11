const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
	dir: '.',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
	setupFilesAfterEnv: ['<rootDir>/lib/configs/jest.setup.js'],
	moduleNameMapper: {
		// Handle module aliases (this will be automatically configured for you soon)
		'^@lib(.*)$': '<rootDir>/lib/$1',
		'^@backend(.*)$': '<rootDir>/lib/backend/$1',
		'^@shared(.*)$': '<rootDir>/lib/shared/$1',
		'^@public(.*)$': '<rootDir>/public/$1',
		'^@app/(.*)$': '<rootDir>/app/$1',
		'^@prismaClient/(.*)$': '<rootDir>/prisma/$1',
	},
	modulePathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/.history/'],
	testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);

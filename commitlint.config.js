module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'header-max-length': [2, 'always', 72],
		'body-case': [2, 'always', ['lower-case']],
		'header-case': [2, 'always', ['lower-case']],
		'scope-case': [2, 'always', ['lower-case']],
		'type-enum': [
			2,
			'always',
			[
				'feat',
				'fix',
				'docs',
				'style',
				'refactor',
				'test',
				'revert',
				'chore',
				'build',
				'release',
			],
		],
	},
};

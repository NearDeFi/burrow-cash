module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: ["plugin:react/recommended", "plugin:react/recommended", "prettier"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["react", "@typescript-eslint"],
	rules: {
		"object-curly-spacing": "off",
		"react/react-in-jsx-scope": 0,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};

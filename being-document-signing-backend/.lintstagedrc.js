module.exports = {
  "lint-staged": {
    "*.js": ["prettier-eslint --write", "git add"]
  },
  husky: {
    hooks: {
      "pre-commit": "lint-staged"
    }
  }
};

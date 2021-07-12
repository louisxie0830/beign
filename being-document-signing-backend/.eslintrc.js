module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 8,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    sourceType: "module"
  },
  env: {
    es6: true,
    node: true
  },
  extends: ["standard", "prettier", "prettier/standard"],
  plugins: ["import", "prettier", "standard"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  }
};

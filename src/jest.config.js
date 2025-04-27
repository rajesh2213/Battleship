module.exports = {
    transform: {
      "^.+\\.js$": "babel-jest", // Use Babel to transform JavaScript files
    },
    moduleFileExtensions: ["js"], // Specify the file extensions Jest should handle
    testEnvironment: "node", // Set the test environment (node or jsdom)  
}; 
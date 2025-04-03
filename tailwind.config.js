module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Poppins', 'Arial', 'sans-serif'], // Add Poppins to the font stack
        },
      },
    },
    plugins: [require("daisyui")],
  }
  
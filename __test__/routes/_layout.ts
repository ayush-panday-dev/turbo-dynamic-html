import { generateTDHLayout } from "../../core/TDHLayout";

const layout = generateTDHLayout({
  render: (data: any, children) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Car Shop</title>
  <style>
    /* Basic styling - you can customize this */
    body {
      font-family: sans-serif;
      margin: 0;
      padding: 0;
    }
    header, footer {
      background-color: #333;
      color: white;
      padding: 1em;
      text-align: center;
    }
    nav {
      background-color: #f4f4f4;
      padding: 0.5em;
    }
    nav a {
      text-decoration: none;
      color: #333;
      padding: 0.5em;
    }
    main {
      padding: 1em;
    }
    .container {
        display: flex;
        flex-direction: column; /* Default to column on smaller screens */
        align-items: center; /* Center items horizontally */
    }
    .car-item {
      border: 1px solid #ccc;
      padding: 1em;
      margin-bottom: 1em;
      width: 80%; /* Adjust width as needed for responsiveness */
      box-sizing: border-box;
    }

    @media (min-width: 768px) {
        .container {
            flex-direction: row; /* Switch to row for larger screens */
            justify-content: space-around; /* Distribute items horizontally */
            align-items: flex-start; /* Align to the top of the container */
            flex-wrap: wrap; /* Allow items to wrap to the next line if needed */
        }
        .car-item {
            width: 30%; /* Adjust width for larger screens */
            margin: 1em;
        }

    }
  </style>
</head>
<body>

  <header>
    <h1>Car Shop</h1>
  </header>

  <nav>
    <a href="#">Home</a>
    <a href="#">Cars for Sale</a>
    <a href="#">About Us</a>
    <a href="#">Contact</a>
  </nav>

  ${children}

  <footer>
    <p>&copy; 2024 Car Shop. All rights reserved.</p>
  </footer>

</body>
</html>`;
  },
});

export default layout;

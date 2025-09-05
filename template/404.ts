import { generateTDHPage } from "turbo-dynamic-html";

const page = generateTDHPage({
  render(data: any) {
    return `
      <style>
        .not-found-body {
          background-color: #1B1212;
          font-family: 'Source Sans Pro', sans-serif;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .not-found-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          min-height: 100vh;
          padding: 4rem 2rem;
          box-sizing: border-box; 
        }

        .not-found-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(8rem, 25vw, 12rem);
          font-weight: 700;
          line-height: 1;
          margin: 0;
          color: #D72C2C; 
          text-shadow: 0 4px 25px rgba(215, 44, 44, 0.2);
        }
        
        .not-found-subheading {
          font-family: 'Playfair Display', serif;
          color: #F5E9E9; 
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          margin-top: 1rem;
          margin-bottom: 1rem;
        }

        .not-found-text {
          color: #8A7979; 
          font-size: 1.1rem;
          max-width: 500px;
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        .not-found-btn {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          border-radius: 6px;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: none;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          background-color: #D72C2C;
          color: #1B1212;
        }
        
        .not-found-btn:hover {
          filter: brightness(1.1);
          transform: translateY(-4px);
          box-shadow: 0 10px 20px rgba(215, 44, 44, 0.2);
        }
        
        .not-found-btn i {
          margin-right: 10px;
        }
      </style>

      <div class="not-found-body">
        <section class="not-found-section">
          <h1 class="not-found-heading">404</h1>
          <h2 class="not-found-subheading">Page Not Found</h2>
          <p class="not-found-text">
            The page you're looking for seems to have been misplaced. Let's get you back on track.
          </p>
          <a href="/" class="not-found-btn">
            <i class="fa-solid fa-house"></i> Go To Homepage
          </a>
        </section>
      </div>
    `;
  },
});

export default page;

import { generateTDHPage } from "turbo-dynamic-html";

const page = generateTDHPage({
  render(data: any) {
    return `
      <style>
        @keyframes glitch {
          2%,64% { transform: translate(2px,0) skew(0deg); }
          4%,60% { transform: translate(-2px,0) skew(0deg); }
          62%    { transform: translate(0,0) skew(5deg); }
        }
       .server-error-body {
          background-color: #13111C; 
          font-family: 'Source Sans Pro', sans-serif;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .server-error-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          min-height: 100vh;
          padding: 4rem 2rem;
          box-sizing: border-box;
        }

        .server-error-heading {
          font-family: 'Playfair Display', serif;
          font-size: clamp(8rem, 25vw, 12rem);
          font-weight: 700;
          line-height: 1;
          margin: 0;
          color: #B4A9E4; 
          position: relative;
          animation: glitch 1s linear infinite;
        }
        
        .server-error-heading::before,
        .server-error-heading::after {
          content: '500';
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: #13111C;
          overflow: hidden;
        }

        .server-error-heading::before {
          left: 2px;
          text-shadow: -2px 0 #FF4A4A;
          clip-path: rect(44px, 450px, 56px, 0);
          animation: glitch 3s infinite linear alternate-reverse;
        }

        .server-error-heading::after {
          left: -2px;
          text-shadow: -2px 0 #4AC7FF; 
          clip-path: rect(85px, 450px, 90px, 0);
          animation: glitch 2s infinite linear alternate-reverse;
        }

        .server-error-subheading {
          font-family: 'Playfair Display', serif;
          color: #E0DAFF; 
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .server-error-text {
          color: #79719A; 
          font-size: 1.1rem;
          max-width: 550px;
          margin-bottom: 2.5rem;
          line-height: 1.7;
        }

        .server-error-btn {
          display: inline-flex;
          align-items: center;
          padding: 16px 32px;
          border-radius: 6px;
          font-family: 'Source Sans Pro', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: 1px solid #79719A;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
          background-color: transparent;
          color: #E0DAFF;
        }
        
        .server-error-btn:hover {
          background-color: #B4A9E4;
          border-color: #B4A9E4;
          color: #13111C;
        }
        
        .server-error-btn i {
          margin-right: 10px;
        }
      </style>

      <div class="server-error-body">
        <section class="server-error-section">
          <h1 class="server-error-heading">500</h1>
          <h2 class="server-error-subheading">Internal Server Error</h2>
          <p class="server-error-text">
            It seems there's a technical issue on our end. Our team has been notified. Please try refreshing the page in a few moments.
          </p>
          <a href="/" class="server-error-btn">
            <i class="fa-solid fa-house"></i> Return to Homepage
          </a>
        </section>
      </div>
    `;
  },
});

export default page;

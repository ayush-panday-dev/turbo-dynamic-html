import { generateTDHPage } from "../../core";

const page = generateTDHPage({
  render(data: any) {
    return `  <main>
    <div class="container">
    
      <div class="car-item">
        <img src="placeholder-car.jpg" alt="Car Model" width="100%">
        <h2>Car Model 1</h2>
        <p>Description of the car...</p>
        <p>Price: $XX,XXX</p>
        <button>View Details</button>
      </div>

       <div class="car-item">
        <img src="placeholder-car.jpg" alt="Car Model" width="100%">
        <h2>Car Model 2</h2>
        <p>Description of the car...</p>
        <p>Price: $XX,XXX</p>
        <button>View Details</button>
      </div>

       <div class="car-item">
        <img src="placeholder-car.jpg" alt="Car Model" width="100%">
        <h2>Car Model 3</h2>
        <p>Description of the car...</p>
        <p>Price: $XX,XXX</p>
        <button>View Details</button>
      </div>

       <div class="car-item">
        <img src="placeholder-car.jpg" alt="Car Model" width="100%">
        <h2>Car Model 4</h2>
        <p>Description of the car...</p>
        <p>Price: $XX,XXX</p>
        <button>View Details</button>
      </div>

        <!-- More car items can be added here -->
    </div>
  </main>`;
  },
});

export default page;

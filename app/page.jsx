import "./home.css";
import Link from "next/link";
import bgImage from "../src/assets/events.jpg";
function HomePage() {
  return (
    <main className="home-page">
      <section
        className="hero"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="overlay"></div>

        <div className="hero-content">
          <span className="hero-badge">Copenhagen Developer Events</span>

          <h1>
            Discover
            <br />
            Amazing
            <br />
            Tech Events
          </h1>

          <p>
            Join conferences, workshops, hackathons, and meetups with developers
            from all around Denmark.
          </p>

          <div className="hero-buttons">
            <Link href="/events">
              <button className="primary-btn">Browse Events</button>
            </Link>

            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;

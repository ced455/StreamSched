import { useAuth } from '../store/hooks';
import './Home.css';

export function Home() {
  const { auth, login } = useAuth();

  if (auth.isAuthenticated) {
    return (
      <div className="home authenticated-home">
        <h1>Welcome to StreamPlan</h1>
        <p>You're already logged in!</p>
        <a href="/schedule" className="button">
          View Schedule
        </a>
      </div>
    );
  }

  return (
    <div className="home">
      <header className="hero">
        <h1>StreamPlan</h1>
        <p>Your centralized Twitch streaming schedule</p>
      </header>

      <main>
        <section className="features">
          <h2>Features</h2>
          <ul>
            <li>📅 View all your followed streamers' schedules in one place</li>
            <li>📱 Access anywhere with our mobile-first design</li>
            <li>💾 Works offline with cached schedules</li>
          </ul>
        </section>

        <section className="cta">
          <h2>Get Started</h2>
          <p>Connect with your Twitch account to see your personalized schedule</p>
          <button onClick={login} className="login-button">
            Login with Twitch
          </button>
        </section>
      </main>

      <footer>
        <p>
          StreamPlan uses the Twitch API to provide schedule information.
          Not affiliated with Twitch.
        </p>
      </footer>
    </div>
  );
}

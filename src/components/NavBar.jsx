import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Workout Manager</h1>
      </div>
      <div className="navbar-links">
        <NavLink href="/">Home</NavLink>
        <NavLink href="/exercises">Exercises</NavLink>
        <NavLink href="/workouts">Workouts</NavLink>
      </div>
    </nav>
  );
}

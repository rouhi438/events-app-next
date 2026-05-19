"use client";
import EventCard from "../card/page.jsx";
import { useState, useEffect } from "react";
import "./eventList.css";
import { useAuth } from "../../src/context/AuthContext.jsx";
import { useSearch } from "../../src/context/SearchContext.jsx";

export default function EventList() {
  const { searchQuery } = useSearch();

  const welcomeMessage =
    typeof window !== "undefined"
      ? localStorage.getItem("welcomeMessage")
      : null;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const { user } = useAuth();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${baseUrl}/events?q=${searchQuery}&_page=${page}&_limit=${limit}`)
      // fetch(
      //   `https://localhost:3001/events?q=${searchQuery}&_page=${page}&_limit=${limit}`,
      // )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setEvents(data);
      })
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [searchQuery, page]);
  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="event-list-container">
      <div className="page-change">
        <div className="change-page-btns-holder">
          <button
            className="change-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>Page {page}</span>

          <button className="change-btn" onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
        {user && <div className="welcome-banner">{welcomeMessage}</div>}
      </div>
      <ul className="event-list">
        {events.length > 0 ? (
          events.map((event) => <EventCard key={event.id} event={event} />)
        ) : (
          <p>No events found</p>
        )}
      </ul>
    </div>
  );
}

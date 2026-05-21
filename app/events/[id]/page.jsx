// TODO: display at least date, time, venue, city, and description for one event
// TODO: use useParams() to get the event id from the URL
// TODO: fetch the event from GET /events/:id instead of using mock data
"use client";
import Link from "next/link";
import "./detailList.css";
import { useState, useEffect } from "react";
import { useCart } from "../../../src/context/CartContext";
import { useParams } from "next/navigation";

export default function EventDetail() {
  const { addToCart } = useCart();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { id } = useParams();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  useEffect(() => {
    setLoading(true);
    //fetch(`http://localhost:3001/events/${id}`)
    fetch(`${baseUrl}/events/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch event");
        }
        return res.json();
      })
      .then((data) => setEvent(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>Error:{error}</p>;
  if (!event) return null;
  return (
    <div className="event-detail-container">
      <div className="detail-header">
        <div className="back-btn-holder">
        <Link href="/events" className="back-btn">
          ← Back to events
        </Link>
      </div>
        <div className="quantity-holder">
          <div className="quantity-controls">
            <button
              className="minus"
              type="button"
              onClick={() => {
                if (quantity > 1) {
                  setQuantity(quantity - 1);
                }
              }}
            >
              -
            </button>
            <span className="ticket-quantity">{quantity}</span>
            <button
              className="plus"
              type="button"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            className="add-btn"
            onClick={() => {
              for (let i = 0; i < quantity; i++) {
                addToCart(event);
              }
            }}
            disabled={event.ticketsAvailable === 0}
            style={{ fontSize: "13px" }}
          >
            Add to Cart
          </button>
        </div>
      </div>
      <h1 className="event-name">{event.name}</h1>

      <div className="event-detail-top">
        <div className="event-detail-left">
          <p>
            <strong>Date:</strong> {event.date}
          </p>
          <p>
            <strong>Time:</strong> {event.time}
          </p>
          <p>
            <strong>Venue:</strong> {event.venue}
          </p>
          <p>
            <strong>City:</strong> {event.city}
          </p>
        </div>

        <div className="event-detail-right">
          <p>
            <strong>Category:</strong> {event.category}
          </p>
          <p>
            <strong>Price:</strong> €{event.price}
          </p>
          <p>
            <strong>Tickets:</strong>{" "}
            {event.ticketsAvailable === 0
              ? "Sold out"
              : `${event.ticketsAvailable} tickets left`}
          </p>
          <p>
            <strong>Total seats:</strong> {event.totalTickets}
          </p>
        </div>
      </div>

      {/* description bottom */}
      <div className="event-detail-description">
        <h3>Description:</h3>
        <p>{event.description}</p>
      </div>
    </div>
  );
}

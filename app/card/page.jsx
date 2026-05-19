"use client";
import "./eventCard.css";
import Link from "next/link";
import { useCart } from "../../src/context/CartContext";
export default function EventCard({ event }) {
  const { addToCart } = useCart();
  let ticketMessage;
  if (event.ticketsAvailable === 0) {
    ticketMessage = "Sold out";
  } else if (event.ticketsAvailable < 15) {
    ticketMessage = `Only ${event.ticketsAvailable} tickets left`;
  } else {
    ticketMessage = "Tickets Available";
  }
  return (
    <li className="list-item">
      <h2 className="event-title">{event.name}</h2>

      <p>
        <strong>Date & Time :</strong>
        {event.date} at {event.time}
      </p>

      <p>
        <strong>Location :</strong>
        {event.venue}, {event.city}
      </p>

      <p>
        <strong>Category :</strong>
        {event.category}
      </p>

      <p>
        <strong>Price :</strong>{" "}
        {event.price === 0 ? "Free" : `€${event.price}`}
      </p>

      <p>
        <strong>Tickets : </strong>
        <span style={{ color: event.ticketsAvailable === 0 ? "red" : "black" }}>
          {ticketMessage}
        </span>
      </p>
      <div className="btns">
        <button
          className="bye-btn"
          type="button"
          onClick={() => addToCart(event)}
          disabled={event.ticketsAvailable === 0}
        >
          Buy Ticket
        </button>
        <Link href={`/events/${event.id}`} className="details-btn">
          Event Details
        </Link>
      </div>
    </li>
  );
}

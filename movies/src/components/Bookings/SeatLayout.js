import React, { useState, useEffect } from "react";
import "./SeatLayout.css";

const SeatLayout = ({ bookedSeats = [], selectedSeat, onSeatSelect }) => {
  // Define the seat map structure
  const rows = [
    ["A11", "A10", "A9", "A8", "A7", "A6", "A5", "A4", "A3", "A2", "A1"],
    ["B11", "B10", "B9", "B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1"],
    ["C11", "C10", "C9", "C8", "C7", "C6", "C5", "C4", "C3", "C2", "C1"],
    ["D11", "D10", "D9", "D8", "D7", "D6", "D5", "D4", "D3", "D2", "D1"],
    ["E11", "E10", "E9", "E8", "E7", "E6", "E5", "E4", "E3", "E2", "E1"],
    ["F11", "F10", "F9", "F8", "F7", "F6", "F5", "F4", "F3", "F2", "F1"],
    ["G1"], // Special single seat row
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);

  // Update localStorage whenever selectedSeats changes
  useEffect(() => {
    localStorage.setItem("seats", JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  // Handle seat selection
  const handleSeatClick = (seat) => {
    if (bookedSeats.includes(seat)) {
      return; // Ignore clicks on booked seats
    }

    if (selectedSeats.includes(seat)) {
      const updatedSeats = selectedSeats.filter((s) => s !== seat);
      setSelectedSeats(updatedSeats); // Deselect seat
      if (onSeatSelect) onSeatSelect(null); // Notify parent of deselection
    } else {
      setSelectedSeats([seat]); // Allow only one seat selection
      if (onSeatSelect) onSeatSelect(seat); // Notify parent of new selection
    }
  };

  return (
    <div className="theater-container">
      <h2>Theater 1</h2>
      <div className="screen">Screen</div>
      <div className="seat-layout">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="seat-row">
            {row.map((seat, seatIndex) => (
              <div
                key={seatIndex}
                className={`seat 
                  ${bookedSeats.includes(seat) ? "booked" : ""}
                  ${selectedSeats.includes(seat) ? "selected" : ""}
                `}
                onClick={() => handleSeatClick(seat)}
                // Disable interaction on booked seats
                style={{
                  pointerEvents: bookedSeats.includes(seat) ? "none" : "auto",
                }}
              >
                {seat}
              </div>
            ))}
          </div>
        ))}
        <div className="aisle">Aisle</div>
      </div>
      <h3>Selected Seat: {selectedSeats.join(", ") || "None"}</h3>
    </div>
  );
};

export default SeatLayout;


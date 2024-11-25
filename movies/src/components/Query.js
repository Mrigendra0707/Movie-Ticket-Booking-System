import React, { useState } from 'react';
import axios from 'axios';
import './Query.css';

export default function Query() {
    const [suggestions, setSuggestions] = useState([]); // Stores query suggestions
    const [query, setQuery] = useState(''); // Stores the current user query
    const [response, setResponse] = useState(''); // Stores the response to the query

    // Fetch query suggestions based on user input
    const handleQueryChange = async (input) => {
        setResponse(''); // Clear previous response
        setSuggestions([]); // Clear previous suggestions
        setQuery(input); // Update query state
        try {
            const res = await axios.post(`http://localhost:5000/example/${input}`, {});
            if (res.data.examples) {
                setSuggestions(res.data.examples); // Update suggestions
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch the answer for the user's selected query
    const fetchQueryResponse = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/query', {
                Question: query,
            });
            if (res.data.answer) {
                setResponse(res.data.answer); // Update the response
            } else {
                setResponse("No answer available for the provided query.");
            }
        } catch (error) {
            console.error(error);
            setResponse("Error fetching the query response.");
        }
    };

    return (
        <div className="Query-outerBox">
            <form onSubmit={fetchQueryResponse}>
                <h2>Booking Queries</h2>
                <br />
                <label htmlFor="query-input">Your Question: </label>
                <input
                    id="query-input"
                    type="text"
                    value={query}
                    onChange={(event) => handleQueryChange(event.target.value)}
                    placeholder="E.g., Show timings for a movie"
                />
                <br /><br />
                <div>
                    {/* Display query suggestions */}
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="suggestion-item"
                            onClick={() => handleQueryChange(suggestion.Question)}
                        >
                            {suggestion.Question}
                        </div>
                    ))}
                </div>
                <br />
                <div style={{ color: 'green' }}>
                    {/* Display the response to the user's query */}
                    {response && <div className="query-response">{response}</div>}
                </div>
                <br />
                <div className="query-button">
                    <button type="submit">Get Answer</button>
                </div>
            </form>
        </div>
    );
}

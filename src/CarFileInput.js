import React, { useState } from 'react';

function CarFileInput() {
  const [carLink, setCarLink] = useState('');

  const handleChange = (event) => {
    setCarLink(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // do something with the carLink value, like send it to a backend API
    console.log(carLink);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Link to CAR file:
        <input type="text" value={carLink} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

export default CarFileInput;

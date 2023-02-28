import React, { useState } from 'react';

function CommPInput() {
  const [commP, setCommP] = useState('');

  const handleChange = (event) => {
    setCommP(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    // do something with the carLink value, like send it to a backend API
    console.log(commP);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        commP:
        <input type="text" value={commP} onChange={handleChange} />
      </label>
      <button type="submit">Submit</button>
    </form>
    
  );
}

export default CommPInput;

import React, { useState } from 'react';

const FitnessItem = (props) => {

    const [fName, setFName] = useState(props.fitness.name);

    return (
        <p>{fName}</p>
    );
};

export default FitnessItem;
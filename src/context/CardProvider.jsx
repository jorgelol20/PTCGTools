import React, {Fragment, createContext, useState, useEffect} from "react";

const cardsContext = createContext();

const CardProvider = (props) => {
    const [contextDeck, setDeck] = useState([]);
    const [contextNumberOfHands, setNumberOfHands] = useState(0);
    const setContextDeck = (newDeck) => {
        setDeck(newDeck);
    }
    const setContextNumberOfHands = (newNumber) => {
        setNumberOfHands(newNumber);
    }
    const exports = {
        contextDeck,
        contextNumberOfHands,
        setContextDeck,
        setContextNumberOfHands,
    }
    return (
        <Fragment>
            <cardsContext.Provider value={exports}>
                {props.children}
            </cardsContext.Provider>
        </Fragment>
    )
}
export default CardProvider;
export { cardsContext };
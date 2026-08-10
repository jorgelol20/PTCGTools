import React, {Fragment, createContext, useState, useEffect} from "react";

const cardsContext = createContext();

const CardProvider = (props) => {
    const [contextDeck, setDeck] = useState([]);
    const [userDecks, setUserDecks] = useState([])
    const [contextNumberOfHands, setNumberOfHands] = useState(0);

    const setContextDeck = (newDeck) => {
        setDeck(newDeck);
    }

    const setContextNumberOfHands = (newNumber) => {
        setNumberOfHands(newNumber);
    }

    const saveUserDecks = () => {
        localStorage.setItem("user_decks", userDecks)
    }

    const addNewDeck = async (newDeck) => {
        await setUserDecks(prevDecks => [...prevDecks, newDeck]);
        saveUserDecks();
    }

    useEffect(()=>{
        const tempUserDecks = localStorage.getItem("user_decks");
        if(tempUserDecks !== null && tempUserDecks !== undefined) setUserDecks(tempUserDecks)
    },[]);
    const exports = {
        contextDeck,
        userDecks,
        contextNumberOfHands,
        setContextDeck,
        setUserDecks,
        addNewDeck,
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
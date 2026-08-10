import React, { Fragment, createContext, useState, useEffect } from "react";

const cardsContext = createContext();

const CardProvider = (props) => {
    const [contextDeck, setDeck] = useState([]);
    const [userDecks, setUserDecks] = useState([])
    const [contextNumberOfHands, setNumberOfHands] = useState(0);

    const setContextDeck = (newDeck) => {
        setDeck(newDeck);
    }

    const addCardToDeck = (newCard) => {
        setDeck((prevDeck) => {
            const currentDeck = prevDeck || [];
            const cardExists = currentDeck.some((card) => card.cardId === newCard.cardId);
            if (cardExists) {
                return currentDeck.map((card) =>
                    card.id === newCard.id
                        ? { ...card, quantity: Number(card.quantity || 1) + 1 }
                        : card
                );
            }

            return [
                ...currentDeck,
                { ...newCard, quantity: Number(newCard.quantity || 1) }
            ];
        });
    };

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

    useEffect(() => {
        const tempUserDecks = localStorage.getItem("user_decks");
        if (tempUserDecks !== null && tempUserDecks !== undefined) setUserDecks(tempUserDecks)
    }, []);
    const exports = {
        contextDeck,
        userDecks,
        contextNumberOfHands,
        setContextDeck,
        addCardToDeck,
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
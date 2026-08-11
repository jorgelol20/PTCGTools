import React, { Fragment, createContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const cardsContext = createContext();


const CardProvider = (props) => {
    const [contextDeck, setDeck] = useState([]);
    const [userDecks, setUserDecks] = useState([])
    const [contextNumberOfHands, setNumberOfHands] = useState(0);
    const { t } = useTranslation();

    const setContextDeck = (newDeck) => {
        setDeck(newDeck);
    }

    const addCardToDeck = (newCard) => {
        setDeck((prevDeck) => {
            const currentCards = prevDeck?.cards || [];
            const targetId = newCard.cardId || newCard.id;
            const cardExists = currentCards.some(
                (card) => (card.cardId || card.id) === targetId
            );

            const updatedCards = cardExists
                ? currentCards.map((card) =>
                    (card.cardId || card.id) === targetId
                        ? { ...card, quantity: Number(card.quantity || 1) + 1 }
                        : card
                )
                : [
                    ...currentCards,
                    { ...newCard, quantity: Number(newCard.quantity || 1) }
                ];
            return {
                ...prevDeck,
                cards: updatedCards
            };
        });
    };

    const setContextNumberOfHands = (newNumber) => {
        setNumberOfHands(newNumber);
    }

    const saveUserDecks = (updatedDecks) => {
        localStorage.setItem("user_decks", JSON.stringify(updatedDecks))
    }

    const saveDeck = async (deckToSave) => {
        const currentDecks = userDecks.map((deck)=>{
            if(deck.id === deckToSave.id){
                deck = deckToSave;
            } 
            return deck
        })

        const updatedDecks = [...currentDecks];
        setUserDecks(updatedDecks);
        await saveUserDecks(updatedDecks);
    }

    const deleteDeck = async (deckToDelete) => {
        
    }

    const addNewDeck = async () => {
        const currentDecks = Array.isArray(userDecks) ? userDecks : [];

        const newId = currentDecks.length > 0
            ? Math.max(...currentDecks.map(d => d.id || 0)) + 1
            : 1;

        const newDeckFormatted = {
            id: newId,
            name: t('newDeck') + newId,
            cards: [],
        };
        const updatedDecks = [...currentDecks, newDeckFormatted];
        setUserDecks(updatedDecks);
        await saveUserDecks(updatedDecks);
    };

    useEffect(() => {
        const tempUserDecks = JSON.parse(localStorage.getItem("user_decks"));
        if (tempUserDecks !== null && tempUserDecks !== undefined) setUserDecks(tempUserDecks)
    }, []);

    const exports = {
        contextDeck,
        userDecks,
        contextNumberOfHands,
        setContextDeck,
        addCardToDeck,
        setUserDecks,
        saveDeck,
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
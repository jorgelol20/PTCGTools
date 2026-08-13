import React, { Fragment, createContext, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import usePokeAPI from "../hooks/usePokeAPI";
import { errorContext } from "./ErrorProvider.jsx";
import { parseDeckList } from "../utils/parseDeckList";

const cardsContext = createContext();


const CardProvider = (props) => {
    const [contextDeck, setDeck] = useState(null);
    const [userDecks, setUserDecks] = useState([])
    const [contextNumberOfHands, setNumberOfHands] = useState(0);
    const [actualCardInfo, setActualCard] = useState(null)

    const [clipboardCards, setClipboardCards] = useState(undefined);
    const { deckAPI } = usePokeAPI(clipboardCards);
    const { setNewError, badCards, resetBadCards } = useContext(errorContext);

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
        const currentDecks = userDecks.map((deck) => {
            if (deck.id === deckToSave.id) {
                deck = deckToSave;
            }
            return deck
        })

        const updatedDecks = [...currentDecks];
        setUserDecks(updatedDecks);
        await saveUserDecks(updatedDecks);
    }

    const deleteDeck = async (deckToDelete) => {
        const updatedDecks = userDecks.filter(deck => deck.id !== deckToDelete.id);

        if (contextDeck?.id === deckToDelete.id) {
            setContextDeck(null);
        }

        setUserDecks(updatedDecks);

        try {
            await saveUserDecks(updatedDecks);
        } catch (err) {
            console.error('Failed to save decks after delete:', err);
        }
    };

    const addNewDeck = async (cards = []) => {
        const currentDecks = Array.isArray(userDecks) ? userDecks : [];

        const newId = currentDecks.length > 0
            ? Math.max(...currentDecks.map(d => d.id || 0)) + 1
            : 1;

        const newDeckFormatted = {
            id: newId,
            name: t('newDeck') + newId,
            cards: cards,
        };
        const updatedDecks = [...currentDecks, newDeckFormatted];
        setUserDecks(updatedDecks);
        await saveUserDecks(updatedDecks);
    };

    const importDeckFromClipboard = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsedCards = parseDeckList(text);

            if (parsedCards.includes(null) || parsedCards.includes(undefined) || parsedCards.length === 0) {
                setNewError(t('errorFormat'));
                return;
            }
            setClipboardCards(parsedCards);
        } catch (error) {
            setNewError(t('clipboardError'));
        }
    }

    useEffect(() => {
        if (deckAPI !== undefined && deckAPI.cards !== undefined && deckAPI.cards.length > 0) {
            if (deckAPI.cards.includes(undefined)) {
                let badCardsString = badCards !== undefined ? `${badCards}` : "";
                setNewError(`${t('loadingError')}:  ${badCardsString}`);
                resetBadCards();
            }

            const currentDecks = Array.isArray(userDecks) ? userDecks : [];
            const newId = currentDecks.length > 0
                ? Math.max(...currentDecks.map(d => d.id || 0)) + 1
                : 1;

            const importedDeck = {
                id: newId,
                name: t('importedDeck') + newId,
                cards: deckAPI.cards.filter((card) => card !== undefined)
            };

            const updatedDecks = [...currentDecks, importedDeck];
            setUserDecks(updatedDecks);
            saveUserDecks(updatedDecks);
            setContextDeck(importedDeck);

            setClipboardCards(undefined);
        }
    }, [deckAPI])

    useEffect(() => {
        const tempUserDecks = JSON.parse(localStorage.getItem("user_decks"));
        if (tempUserDecks !== null && tempUserDecks !== undefined) setUserDecks(tempUserDecks)
    }, []);
    useEffect(()=>{
        console.log(actualCardInfo)
    },[actualCardInfo])

    const exports = {
        contextDeck,
        userDecks,
        contextNumberOfHands,
        actualCardInfo,
        setContextDeck,
        addCardToDeck,
        setUserDecks,
        deleteDeck,
        saveDeck,
        addNewDeck,
        setActualCard,
        importDeckFromClipboard,
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
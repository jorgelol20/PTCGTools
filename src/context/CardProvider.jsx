import React, { Fragment, createContext, useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import usePokeAPI from "../hooks/usePokeAPI";
import { errorContext } from "./ErrorProvider.jsx";
import { parseDeckList } from "../utils/parseDeckList";
import { checkDeckFormat } from "../utils/checkDeckFormat.js";

const cardsContext = createContext();


/*==========FUNCIONES AUXILIARES=========== */
const getTrainerSubOrder = (card) => {
    switch (card.trainerType) {
        case 'Partidario':
        case 'Supporter':
            return 0; // Entrenador
        case 'Objeto':
        case 'Item':
            return 1;      // Item
        case 'Herramienta':
        case 'Tool':
            return 1;      // Herramienta Pokémon, la agrupo con Item
        case 'Estadio':
        case 'Stadium':
            return 2;   // Estadio
        default: return 3;          // cualquier otro caso, al final
    }
};

const getEnergySubOrder = (card) => {
    const subtypes = card.subtypes || [];
    return subtypes.includes('Special') || subtypes.includes('Especial') ? 0 : 1; // especiales primero, luego básicas
};

const sortPokemonCards = (cards) => {
    const byName = new Map(cards.map(c => [c.name, c]));
    const childrenMap = new Map();
    const roots = [];

    cards.forEach(card => {
        const parentName = card.evolvesFrom ?? null;
        const hasParentInDeck = parentName !== null && byName.has(parentName);

        if (hasParentInDeck) {
            if (!childrenMap.has(parentName)) childrenMap.set(parentName, []);
            childrenMap.get(parentName).push(card);
        } else {
            roots.push(card);
        }
    });

    roots.sort((a, b) => a.name.localeCompare(b.name));
    childrenMap.forEach(list => list.sort((a, b) => a.name.localeCompare(b.name)));

    const result = [];
    const visit = (card) => {
        result.push(card);
        (childrenMap.get(card.name) || []).forEach(visit);
    };
    roots.forEach(visit);
    return result;
};

const sortTrainerCards = (cards) => {
    return [...cards].sort((a, b) => {
        const diff = getTrainerSubOrder(a) - getTrainerSubOrder(b);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
};

const sortEnergyCards = (cards) => {
    return [...cards].sort((a, b) => {
        const diff = getEnergySubOrder(a) - getEnergySubOrder(b);
        return diff !== 0 ? diff : a.name.localeCompare(b.name);
    });
};

const sortDeckCards = (cards = []) => {
    const isPokemon = (c) => c.category === 'Pokémon' || c.category === 'Pokemon';
    const isTrainer = (c) => c.category === 'Trainer' || c.category === 'Entrenador';
    const isEnergy = (c) => c.category === 'Energy' || c.category === 'Energía';

    const pokemonCards = cards.filter(isPokemon);
    const trainerCards = cards.filter(isTrainer);
    const energyCards = cards.filter(isEnergy);
    const others = cards.filter(c => !isPokemon(c) && !isTrainer(c) && !isEnergy(c));

    return [
        ...sortPokemonCards(pokemonCards),
        ...sortTrainerCards(trainerCards),
        ...sortEnergyCards(energyCards),
        ...others
    ];
};


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
        const format = checkDeckFormat(deckToSave.cards)
        const currentDecks = userDecks.map((deck) => {
            if (deck.id === deckToSave.id) {
                deck = {
                    ...deckToSave,
                    format: format
                };
            }
            return deck
        })

        const updatedDecks = [...currentDecks]
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
            format: [false, false, false]
        };
        const updatedDecks = [...currentDecks, newDeckFormatted];
        setUserDecks(updatedDecks);
        await saveUserDecks(updatedDecks);
    };

    const importDeckFromClipboard = async (deckText = null) => {
        if (deckText == null) {
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
        } else {
            const parsedCardsFromText = parseDeckList(deckText);
            if (parsedCardsFromText.includes(null) || parsedCardsFromText.includes(undefined) || parsedCardsFromText.length === 0) {
                setNewError(t('errorFormat'));
                return;
            }
            setClipboardCards(parsedCardsFromText);
        }

    }

    const sortDeck = () => {
        setDeck(prevDeck => {
            if (!prevDeck || !prevDeck.cards) return prevDeck;
            return {
                ...prevDeck,
                cards: sortDeckCards(prevDeck.cards)
            };
        });
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
            const cards = deckAPI.cards.filter((card) => card !== undefined);
            const format = checkDeckFormat(cards);
            const importedDeck = {
                id: newId,
                name: t('importedDeck') + newId,
                cards: cards,
                format: format
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
        sortDeck
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
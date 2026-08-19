import React, { useCallback, useContext, useEffect, useState } from 'react';
import TCGdex from '@tcgdex/sdk';
import expansionDictionary from '../assets/db/expansionSet.json';
import { errorContext } from '../context/ErrorProvider.jsx';
import { useTranslation } from 'react-i18next';
import { formatCard } from '../utils/formatCard.js';

const usePokeAPI = (deck) => {
    const { t, i18n } = useTranslation();
    //Utils
    const tcgdex = new TCGdex(i18n.language);

    // Idioma de fallback: es -> en, en -> es (y cualquier otro caso cae a "en" por defecto)
    const fallbackLanguage = i18n.language === 'es' ? 'en' : 'es';
    const tcgdexFallback = new TCGdex(fallbackLanguage);

    const expansions = expansionDictionary;

    //States
    const [deckAPI, setDeckAPI] = useState(undefined);
    const [loading, setLoading] = useState(false);

    //Context
    const { addNewBadCard, addFallbackCard, setNewError } = useContext(errorContext);

    //Functions
    /**
     * 
     * @param {String} card 
     * @returns 
     */
    const getCard = async (card) => {
        let responseCard;
        try {
            responseCard = await tcgdex.card.get(`${card}`);
            if (responseCard) {
                return { card: responseCard, isFallback: false };
            }
        } catch (error) {
            // sigue al fallback
        }

        try {
            responseCard = await tcgdexFallback.card.get(`${card}`);
            if (responseCard) {
                return { card: responseCard, isFallback: true };
            }
        } catch (error) {
            return undefined;
        }
        return undefined;
    }

    /**
     * Formatear la carta a seleccionar
     * @param {Object} card 
     * @returns Array
     */
    const formatCardId = (card) => {
        try {
            let expansion = undefined;
            if (card.expansion) {
                expansion = expansions[card.expansion];
            }
            if (expansion !== undefined) {
                let cardNumber = card.number;
                if (expansion.includes("me") || expansion.includes("sv") || (expansion.includes("swsh") && !(expansion.includes(".5") || (expansion.includes("swsh1") && !expansion.includes("swsh10") && !expansion.includes("swsh11")) || expansion.includes("swsh7")))) {
                    if (cardNumber < 10) {
                        cardNumber = "00" + cardNumber;
                    } else if (cardNumber < 100) {
                        cardNumber = "0" + cardNumber;
                    }
                }
                if (expansion.includes('tg')) {
                    if (cardNumber < 10) {
                        cardNumber = "TG0" + cardNumber;
                    } else if (cardNumber < 100) {
                        cardNumber = "TG" + cardNumber;
                    }
                }
                return [(expansion + "-" + cardNumber), card.quantity];
            } else if (card.name.includes("Energía") || card.name.includes("Energy")) {
                switch (card.name) {
                    case "Energía Lucha":
                    case "Fight Energy":
                    case "Basic {F} Energy":
                        return ["Fight Energy", card.quantity];

                    case "Energía Oscura":
                    case "Darkness Energy":
                    case "Dark Energy":
                    case "Basic {D} Energy":
                        return ["Darkness Energy", card.quantity];

                    case "Energía Fuego":
                    case "Fire Energy":
                    case "Basic {R} Energy":
                        return ["Fire Energy", card.quantity];

                    case "Energía Planta":
                    case "Grass Energy":
                    case "Basic {G} Energy":
                        return ["Grass Energy", card.quantity];

                    case "Energía Rayo":
                    case "Lightning Energy":
                    case "Basic {L} Energy":
                        return ["Lightning Energy", card.quantity];

                    case "Energía Psíquica":
                    case "Psychic Energy":
                    case "Basic {P} Energy":
                        return ["Psychic Energy", card.quantity];

                    case "Energía Agua":
                    case "Water Energy":
                    case "Basic {W} Energy":
                        return ["Water Energy", card.quantity];

                    case "Energía Metálica":
                    case "Metal Energy":
                    case "Basic {M} Energy":
                        return ["Metal Energy", card.quantity];

                    case "Energía Hada":
                    case "Fairy Energy":
                    case "Basic {Y} Energy":
                        return ["Fairy Energy", card.quantity];

                    default:
                        return ["Energy", card.quantity];
                }
            }
            return undefined;
        } catch (error) { }
    }

    /**
     * Iterar el array de cartas que nos ha dado el usuario
     * @param {Array} cardsList 
     */
    const iterateCards = async (cardsList) => {
        if (cardsList !== null) {
            const cardListAPI = cardsList.map(async (card, index) => {
                const formatedCard = formatCardId(card, i18n.language);
                if (formatedCard !== undefined) {
                    if (formatedCard[0].includes("Energy") || formatedCard[0].includes("Energía") ) {
                        return {
                            name: formatedCard[0],
                            quantity: formatedCard[1],
                            type: "Energy"
                        }
                    }
                    let result = await getCard(formatedCard[0]);
                    if (result !== undefined) {
                        if (result.isFallback) {
                            addFallbackCard(" " + (card.name) + " " + (card.expansion));
                        }
                        return [result.card, formatedCard[1], result.isFallback];
                    }
                    addNewBadCard(" " + (card.name) + " " + (card.expansion));
                    return null;
                }
                addNewBadCard(" " + (card.name));
                return null;
            });
            const finalDeckAPI = await Promise.all(cardListAPI);
            formatApiDeck(finalDeckAPI);
        } else {
            setNewError(t('loadingErrorAPI'));
        }
    }

    /**
     * Formatear el DECK obtenido de la API
     * @returns 
     */
    const formatApiDeck = (deckToFormat) => {
        let formatedDeckAPI = [];
        if (deckToFormat.length !== 0) {
            formatedDeckAPI = deckToFormat.map((card) => {
                return formatCard(card, card[2] ? fallbackLanguage : i18n.language)
            })
        }
        setLoading(false);
        const newDeckList = {
            name: 'TempDeck',
            cards: formatedDeckAPI,
            id: Date.now()
        }
        setDeckAPI(newDeckList);
    }

    //
    const getDeckAPI = (cards) => {
        if (cards != undefined) {
            iterateCards(cards);
        }
    };
    useEffect(() => {
        getDeckAPI(deck)
    }, [deck, i18n.language])

    return { deckAPI, loading };
}
export default usePokeAPI;
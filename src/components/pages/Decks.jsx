import React from "react";
import { useContext } from "react";
import { Fragment } from "react";
import { cardsContext } from "../../context/CardProvider";
import usePokeAPI from "../../Hooks/usePokeAPI";
import Loading from "../Loading";
import DecksList from "../DecksList";
import './Decks.css'
import { useState } from "react";
import Search from "../Search";
import Card from "../Card";
import { useEffect } from "react";
import CardInfo from "../CardInfo";
import { useTranslation } from "react-i18next";
import { NavLink, useLocation } from "react-router-dom";

const Decks = () => {
    const { contextDeck, setContextDeck, saveDeck } = useContext(cardsContext)
    const [deckName, setDeckName] = useState(contextDeck?.name??'')
    const { deckAPI, loading } = usePokeAPI();
    const [actualCardInfo, setActualCard] = useState(null);
    const [actualDeckName, setActualDeckName] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useTranslation();

    const [cardQuantity, setCardQuantity] = useState(0);
    const [deckAvgPrice, setDeckAvgPrice] = useState(0);
    const [dolarsDeckAvgPrice, setDolarsDeckAvgPrice] = useState(0);
    const [deckLowPrice, setDeckLowPrice] = useState(0);
    const [dolarsDeckLowPrice, setDolarsDeckLowPrice] = useState(0);

    const location = useLocation();

    useEffect(() => {
        if(contextDeck !== null){
            setDeckName(contextDeck.name)
        }
    }, [contextDeck])

    const setNewCardInfo = (newCardInfo) => {
        setActualCard(newCardInfo);
    }

    const handleUpdateQuantity = (cardToUpdate, cantidad) => {
        setContextDeck(prevDeck => {
            const currentCards = prevDeck?.cards || [];
            const updatedCards = currentCards
                .map(card => {
                    const isMatch = card.cardId
                        ? card.cardId === cardToUpdate.cardId
                        : card.name === cardToUpdate.name;

                    if (isMatch) {
                        const currentQty = Number(card.quantity) || 0;
                        return { ...card, quantity: currentQty + cantidad };
                    }
                    return card;
                })
                .filter(card => card.quantity > 0);
            return {
                ...prevDeck,
                cards: updatedCards
            };
        });
    };



    const load = contextDeck != undefined && contextDeck.cards !== undefined && !loading;

    useEffect(() => {
        if(contextDeck !== null){
            setActualDeckName(contextDeck.name)
        }
    }, [load])

    async function convert(from, to, amount) {
        if (from === undefined) {
            return 0
        }
        return await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`)
            .then((resp) => resp.json())
            .then((data) => {
                const convertedAmount = (amount * data.rates[to]).toFixed(2);
                return convertedAmount
            });
    }

    const changePriceDolar = async (totalMinPrice = 0, totalAvgPrice = 0) => {
        setDolarsDeckLowPrice(await convert('EUR', 'USD', Number(totalMinPrice.toFixed(2))))
        setDolarsDeckAvgPrice(await convert('EUR', 'USD', Number(totalAvgPrice.toFixed(2))))
    }

    useEffect(() => {
        // Si no hay cartas, reseteamos todos los estados
        if (!contextDeck || !contextDeck.cards || contextDeck.cards.length === 0) {
            setCardQuantity(0);
            setDeckAvgPrice(0);
            setDeckLowPrice(0);
            changePriceDolar(0, 0);
            return;
        }

        const USD_TO_EUR_RATE = 0.92;

        const getValidPriceInEur = (cmPrice, tpPrice) => {
            const cm = Number(cmPrice);
            const tp = Number(tpPrice);


            if (Number.isFinite(cm) && cm > 0) {
                return cm;
            }


            if (Number.isFinite(tp) && tp > 0) {
                return tp * USD_TO_EUR_RATE;
            }

            return 0;
        };
        const totalQuantity = contextDeck.cards.reduce(
            (cont, card) => cont + (Number(card?.quantity) || 0),
            0
        );

        const totalAvgPrice = contextDeck.cards.reduce((cont, card) => {
            const priceInEur = getValidPriceInEur(card?.avgCMPrice, card?.avgTPPrice);
            const qty = Number(card?.quantity) || 0;
            return cont + (priceInEur * qty);
        }, 0);

        const totalMinPrice = contextDeck.cards.reduce((cont, card) => {
            const priceInEur = getValidPriceInEur(card?.lowCMPrice, card?.lowTPPrice);
            const qty = Number(card?.quantity) || 0;
            return cont + (priceInEur * qty);
        }, 0);

        // Guardamos los valores finales redondeados
        setCardQuantity(totalQuantity);
        setDeckAvgPrice(Number(totalAvgPrice.toFixed(2)));
        setDeckLowPrice(Number(totalMinPrice.toFixed(2)));

        // Convertimos el total final a dólares para la otra vista
        changePriceDolar(totalMinPrice, totalAvgPrice);

    }, [contextDeck]);

    



    return (
        <Fragment>
            <div className="decks">
                {/* Solo visible a 1000px de resolución (width) mediante CSS */}
                <button
                    className="hamburger-btn"
                    aria-label="Abrir lista de decks"
                    aria-expanded={isMenuOpen}
                    onClick={() => setIsMenuOpen(prev => !prev)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {isMenuOpen && (
                    <div
                        className="decks-list-overlay"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                <div className={`decks-list ${isMenuOpen ? 'open' : ''}`}>
                    <DecksList />
                </div>
                <div className="deck-cards">
                    {
                        load && contextDeck!== undefined ?
                            <div>
                                <button
                                    onClick={() => {
                                        const newInfo = {
                                            name: deckName,
                                            id: contextDeck.id,
                                            cards: contextDeck.cards
                                        }
                                        saveDeck(newInfo)
                                    }}
                                >{t('saveDeck')}</button>
                                <NavLink to='/calc'><button
                                    onClick={()=>{
                                        location('/calc')
                                    }}
                                >{t('calcDeck')}</button></NavLink>
                                <input className="deck-name" type="text" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
                                <div className="deck-info">

                                    <h1 id='title'> {t('cardListTitle')} (Total: <label style={cardQuantity != 60 ? { color: 'red' } : { color: 'green' }}> {cardQuantity} </label>)</h1>
                                    <h1 id='title'>{t('avgPriceText')}: {deckAvgPrice}€ | {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(dolarsDeckAvgPrice)}</h1>
                                    <h1 id='title'>{t('lowPriceText')}: {deckLowPrice}€ | {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', }).format(dolarsDeckLowPrice)}</h1>
                                </div>
                                <div className='cardSearch'>
                                    <Search />
                                </div>
                                <div className='cards'>
                                    {
                                        contextDeck.cards.map((card) => {
                                            if (card !== undefined) {
                                                return <Card
                                                    className="card"
                                                    key={card.cardId}
                                                    cardInfo={card}
                                                    setNewCardInfo={setNewCardInfo}
                                                    onUpdateQuantity={handleUpdateQuantity}
                                                />
                                            }

                                        })
                                    }
                                </div>
                            </div>
                            : ''
                    }
                    <div className='cardInfo'>
                        {
                            load && actualCardInfo !== null && <CardInfo cardInfo={actualCardInfo} setNewCardInfo={setNewCardInfo} />
                        }
                    </div>

                </div>

            </div>
        </Fragment >
    )
}
export default Decks;
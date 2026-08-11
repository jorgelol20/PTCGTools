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

const Decks = () => {
    const { contextDeck, setContextDeck, saveDeck } = useContext(cardsContext)
    const [deckName, setDeckName] = useState(contextDeck.name)
    const { deckAPI, loading } = usePokeAPI();
    const [actualCardInfo, setActualCard] = useState(null);
    const [actualDeckName, setActualDeckName] = useState(null);

    useEffect(()=>{
        setDeckName(contextDeck.name)
    },[contextDeck])

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

    useEffect(()=>{
        setActualDeckName(contextDeck.name)
    },[load])

    
    return (
        <Fragment>
            <div className="decks">
                <div className="decks-list">
                    <DecksList />
                </div>
                <div className="deck-cards">
                    {
                        load ?
                            <div>
                                <button
                                onClick={()=>{
                                    const newInfo = {
                                        name: deckName,
                                        id: contextDeck.id,
                                        cards: contextDeck.cards
                                    }
                                    saveDeck(newInfo)
                                }}
                                >Guardar</button>
                                <div className="deck-info">
                                    <input className="deck-name" type="text" value={deckName} onChange={(e) => setDeckName(e.target.value)} />
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
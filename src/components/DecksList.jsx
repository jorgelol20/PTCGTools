import React from "react";
import { Fragment } from "react";
import { cardsContext } from "../context/CardProvider";
import { useContext } from "react";
import { useState } from "react";

import './DecksList.css';
import DeckPreview from "./DeckPreview";
import { useEffect } from "react";


const DecksList = () => {
    const [decksList, setDecksList] = useState([]);
    const { userDecks,addNewDeck } = useContext(cardsContext);

    useEffect(()=>{
        setDecksList(userDecks);
    },[userDecks])

    return (
        <Fragment>
            <div>
                <h1>Listado de mazos</h1>
                <div className="deck-list">
                    {
                        decksList !== undefined && decksList.length > 0 ? decksList?.map((deck)=>{
                                return <DeckPreview deckInfo={deck}/>
                            }
                        )
                        : ''
                    }
                    <button
                        onClick={()=>{
                            addNewDeck();
                        }}
                    >Nuevo mazo +</button>
                </div>
            </div>
        </Fragment>
    )
}
export default DecksList;
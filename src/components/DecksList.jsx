import React from "react";
import { Fragment } from "react";
import { cardsContext } from "../context/CardProvider";
import { useContext } from "react";
import { useState } from "react";

import './DecksList.css';
import DeckPreview from "./DeckPreview";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Advice from "./structure/Advice";
import { useLocation } from "react-router-dom";
import { errorContext } from "../context/ErrorProvider";
import ErrorAlert from "./structure/ErrorAlert";



const DecksList = () => {
    const [decksList, setDecksList] = useState([]);
    const { userDecks, addNewDeck, importDeckFromClipboard } = useContext(cardsContext);
    const { t, i18n } = useTranslation();
    const location = useLocation();
    

    useEffect(() => {
        setDecksList(userDecks);
    }, [userDecks])


    return (
        <Fragment>
            <div>
                <h1>Listado de mazos</h1>
                <div className="deck-list">
                    {
                        decksList !== undefined && decksList.length > 0 ? decksList?.map((deck) => {
                            return <DeckPreview deckInfo={deck} key={deck.id} />
                        }
                        )
                            : ''
                    }
                    <div className="decks-list-buttons">
                        {location.pathname !== '/calc' ? <button
                            onClick={() => {
                                addNewDeck();
                            }}
                        >{t('newDeck')} +</button> : <></>}
                        <button className="import-button" onClick={importDeckFromClipboard}>
                            {t('importDeck')} <br /><span style={{ fontSize: "10px" }}>(Limitless, Pokémon TCG Live)</span>
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default DecksList;
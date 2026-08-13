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
                <div className='adviceBox'>
                    {
                        i18n.language == "es" && <Advice text={"Algunas expansiones no están disponibles aún en español. Las cartas en el formato estándard funcionan sin ningún problema. Se recomienda el uso del idioma inglés si vas a hacer uso de cartas del formato 'Expandido'. Disculpar las molestias"} type={"importante"} />
                    }
                </div>
                <div className="error">
                    {
                        error && moveToError() && <ErrorAlert id="error" errorMessage={contextError} />
                    }
                </div>
                <div className="deck-list">
                    {
                        decksList !== undefined && decksList.length > 0 ? decksList?.map((deck) => {
                            return <DeckPreview deckInfo={deck} />
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
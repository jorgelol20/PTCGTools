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
import Form from './Form.jsx';



const DecksList = ({ setIsMenuOpen }) => {
    const [decksList, setDecksList] = useState([]);
    const [isMobile, setIsMobile] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const { userDecks, addNewDeck, importDeckFromClipboard } = useContext(cardsContext);
    const { t, i18n } = useTranslation();
    const location = useLocation();


    useEffect(() => {
        setDecksList(userDecks);
        setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    }, [userDecks])


    return (
        <Fragment>
            <div>
                <h1>Listado de mazos</h1>
                <div className="deck-list">
                    {
                        decksList !== undefined && decksList.length > 0 ? decksList?.map((deck) => {
                            return <DeckPreview setIsMenuOpen={setIsMenuOpen} deckInfo={deck} key={deck.id} />
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
                        {
                            !isMobile &&
                            <button className="import-button" onClick={importDeckFromClipboard}>
                                {t('importDeck')} <br /><span style={{ fontSize: "10px" }}>(Limitless, Pokémon TCG Live)</span>
                            </button>
                        }
                        <div className={`textArea ${isOpen ? "open" : "closed"}`}>
                            <button
                                className="textAreaToggle"
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                            >
                                {isOpen ? t('hideTextArea') : t('showTextArea')}
                            </button>
                            <div className="textAreaContent">
                                <Form />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default DecksList;
import React from "react";
import { Fragment } from "react";
import './DeckPreview.css';
import { useContext } from "react";
import { cardsContext } from "../context/CardProvider";
import { useTranslation } from "react-i18next";
import Delete_Icon from './../assets/img/delete.svg';
import { useEffect } from "react";
import { useState } from "react";

const DeckPreview = ({ deckInfo }) => {
    const { contextDeck, setContextDeck, deleteDeck } = useContext(cardsContext);
    const [active, setActive] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (contextDeck !== null) {
            if (contextDeck.id === deckInfo.id) {
                setActive(true)
            } else {
                setActive(false)
            }
        } else{
            setActive(false)
        }
    }, [contextDeck])
    return (
        <Fragment>
            <div className={active ? "preview active" : "preview"}
                style={{ backgroundImage: `url(${deckInfo.cards[0]?.image})` }}
            >
                <div className="deck-preview"
                    onClick={() => {
                        setContextDeck(deckInfo)
                    }}

                >
                    <div className="deck-preview-info">
                        <div >
                            <h1>{deckInfo.name}</h1>
                            <p>{t("cardsOnDeck")} {deckInfo.cards?.length ?? 0}</p>
                        </div>

                    </div>
                </div>
                <button onClick={() => { deleteDeck(deckInfo) }} className="delete-icon"><img src={Delete_Icon} alt="Botón borrar" title="Eliminar mazo" /></button>
            </div>
        </Fragment>
    )
}
export default DeckPreview;
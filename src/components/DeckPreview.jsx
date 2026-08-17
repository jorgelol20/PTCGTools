import React from "react";
import { Fragment } from "react";
import './DeckPreview.css';
import { useContext } from "react";
import { cardsContext } from "../context/CardProvider";
import { useTranslation } from "react-i18next";
import Delete_Icon from './../assets/img/delete.svg';
import NotValid_Icon from './../assets/img/notValid.svg';
import Valid_Icon from './../assets/img/valid.svg';
import { useEffect } from "react";
import { useState } from "react";

const DeckPreview = ({ deckInfo }) => {
    const { contextDeck, setContextDeck, deleteDeck } = useContext(cardsContext);
    const [cardsQuantity, setCardsQuantity] = useState();
    const [active, setActive] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        if (contextDeck !== null) {
            if (contextDeck.id === deckInfo.id) {
                setActive(true)
            } else {
                setActive(false)
            }
        } else {
            setActive(false)
        }
    }, [contextDeck])
    useEffect(() => {
        const tempCont = deckInfo.cards.reduce(
            (cont, card) => cont + (Number(card?.quantity) || 0),
            0
        );
        setCardsQuantity(tempCont)
    }, [])
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
                        <div className="deck-info">
                            <h1>{deckInfo.name}</h1>
                            <p>{t("cardsOnDeck")} {cardsQuantity}</p>
                            <div className="deck-format">
                                <p>S <img src={deckInfo.format[0] ? Valid_Icon : NotValid_Icon} alt="" /></p>
                                <p>E <img src={deckInfo.format[1] ? Valid_Icon : NotValid_Icon} alt="" /></p>
                                <p>GLC <img src={deckInfo.format[2] ? Valid_Icon : NotValid_Icon} alt="" /></p>
                            </div>
                        </div>

                    </div>
                </div>
                <button onClick={() => { deleteDeck(deckInfo) }} className="delete-icon"><img src={Delete_Icon} alt="Botón borrar" title="Eliminar mazo" /></button>
            </div>
        </Fragment>
    )
}
export default DeckPreview;
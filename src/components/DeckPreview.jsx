import React from "react";
import { Fragment } from "react";
import './DeckPreview.css';
import { useContext } from "react";
import { cardsContext } from "../context/CardProvider";
import { useTranslation } from "react-i18next";

const DeckPreview = ({ deckInfo }) => {
    const { setContextDeck } = useContext(cardsContext);
    const {t} = useTranslation();
    return (
        <Fragment>
            <div className="deck-preview"
                onClick={() => {
                    setContextDeck(deckInfo)
                }}
            >
                <div className="preview-images">
                    {
                        deckInfo.cards?.length >= 1 ?
                            <div>
                                <img src={deckInfo.cards[0]?.image} alt={`${deckInfo.cards[0]?.name} ${deckInfo.cards[0]?.expansion}`} />
                                {
                                    deckInfo.cards?.length >= 2 ?<img src={deckInfo.cards[1]?.image} alt={`${deckInfo.cards[1]?.name} ${deckInfo.cards[1]?.expansion}`} /> : ""
                                }
                                {
                                    deckInfo.cards?.length >= 3 ?<img src={deckInfo.cards[1]?.image} alt={`${deckInfo.cards[1]?.name} ${deckInfo.cards[1]?.expansion}`} /> : ""
                                }
                                
                            </div>
                            : ""
                    }
                </div>
                <h1>{deckInfo.name}</h1>

                <p>{t("cardsOnDeck")} {deckInfo.cards?.length ?? 0}</p>
            </div>
        </Fragment>
    )
}
export default DeckPreview;
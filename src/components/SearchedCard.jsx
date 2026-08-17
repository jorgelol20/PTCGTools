import React from "react";
import { Fragment } from "react";
import TCGdex from "@tcgdex/sdk";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cardsContext } from '../context/CardProvider.jsx';
import { useContext } from "react";

import Fight_Energy from './../assets/img/energies/Fight_Energy.png';
import Fire_Energy from './../assets/img/energies/Fire_Energy.png';
import Water_Energy from './../assets/img/energies/Water_Energy.png';
import Grass_Energy from './../assets/img/energies/Grass_Energy.png';
import Psychic_Energy from './../assets/img/energies/Psychic_Energy.png';
import Dark_Energy from './../assets/img/energies/Dark_Energy.png';
import Fairy_Energy from './../assets/img/energies/Fairy_Energy.png';
import Light_Energy from './../assets/img/energies/Light_Energy.png';
import Metal_Energy from './../assets/img/energies/Metal_Energy.png';

import Placeholder from './../assets/img/placeHolder.png';

import './SearchedCard.css'
import { formatCard } from "../utils/formatCard.js";
import { checkFormat } from "../utils/checkFormat.js";


const SearchedCard = ({ cardId, language }) => {
    const [cardInfo, setCardInfo] = useState([]);
    const { t, i18n } = useTranslation();
    const tcgdex = new TCGdex(language);
    const { addCardToDeck } = useContext(cardsContext);
    const [legality, setLegality] = useState("other")
    const selectImage = (card) => {
        switch (card) {
            case "Energía Lucha":
            case "Fight Energy":
            case "Fighting Energy":
                return Fight_Energy;
            case "Energía Oscura":
            case "Darkness Energy":
                return Dark_Energy;
            case "Energía Fuego":
            case "Fire Energy":
                return Fire_Energy;
            case "Energía Planta":
            case "Grass Energy":
                return Grass_Energy;
            case "Energía Rayo":
            case "Lightning Energy":
                return Light_Energy;
            case "Energía Psíquica":
            case "Psychic Energy":
                return Psychic_Energy;
            case "Energía Agua":
            case "Water Energy":
                return Water_Energy;
            case "Energía Metálica":
            case "Metal Energy":
                return Metal_Energy;
            case "Energía Hada":
            case "Fairy Energy":
                return Fairy_Energy;
            default:
                return null;
        }
    }

    const setCard = async () => {
        const card = await tcgdex.card.get(cardId)
        setCardInfo(card)
    }


    useEffect(() => {
        setCard()
    }, [])



    if (cardInfo !== undefined && (cardInfo?.category === 'Energy' || cardInfo?.category === 'Energía')) {
        return (
            <Fragment>
                <div className="result-card"
                    onClick={async () => {
                        const card = [cardInfo, 1];
                        const newCard = formatCard(card, language)
                        await addCardToDeck(newCard)
                    }}
                >
                    <img
                        src={`${cardInfo?.image}/low.webp`}
                        alt={`${cardInfo?.name} ${cardInfo?.set?.name}`}
                        title={`${cardInfo?.name} ${cardInfo?.set?.name}`}
                        className={`${checkFormat(cardInfo?.legal)}`}
                        id={cardInfo?.category}
                        onError={(e) => {
                            e.preventDefault();
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = selectImage(cardInfo.name);
                        }}
                        style={{ background: "none" }}
                    />
                    <h1>{`${cardInfo?.name} `}<br />{` ${cardInfo?.set?.name}`}</h1>
                </div>
            </Fragment>
        )
    } else {
        return (
            <Fragment>
                <div className="result-card"
                    onClick={async () => {
                        const card = [cardInfo, 1];
                        const newCard = formatCard(card, language)
                        await addCardToDeck(newCard)
                    }}
                >
                    <img
                        src={`${cardInfo?.image}/low.webp`}
                        alt={`${cardInfo?.name} ${cardInfo?.set?.name}`}
                        title={`${cardInfo?.name} ${cardInfo?.set?.name}`}
                        className={`${checkFormat(cardInfo?.legal)}`}
                        id={cardInfo?.category}
                        onError={(e) => {
                            e.preventDefault();
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = Placeholder;
                        }} />

                    <h1>{`${cardInfo?.name} `}<br />{` ${cardInfo?.set?.name}`}</h1>
                </div>
            </Fragment>
        )
    }
}
export default SearchedCard;
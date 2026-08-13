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


const SearchedCard = ({ cardId, handleClear }) => {
    const [cardInfo, setCardInfo] = useState([]);
    const { t, i18n } = useTranslation();
    const tcgdex = new TCGdex(i18n.language);
    const { addCardToDeck } = useContext(cardsContext);

    const selectImage = (card) => {
        switch (card) {
            case "Energía Lucha":
            case "Fight Energy":
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


    const formatCard = (card) => {
        switch (card[0].category) {
            case "Pokémon":
            case "Pokemon":
                if (card[0].abilities) {
                    if (card[0].id === "me01-028") {
                        card[0].stage = t('basic');
                    }
                    return {
                        name: card[0].name,
                        expansion: card[0].set.name,
                        cardNumber: card[0].localId,
                        cardId: card[0].id,
                        cardType: card[0].category,
                        pokemonType: card[0].stage,
                        rarity: card[0].rarity,
                        abilitieText: card[0].abilities.effect,
                        image: card[0].image + '/low.webp',
                        quantity: card[1],
                        productIdCM: card[0].pricing.cardmarket?.idProduct ?? NaN,
                        avgCMPrice: card[0].pricing.cardmarket?.avg ?? NaN,
                        lowCMPrice: card[0].pricing.cardmarket?.low ?? NaN,
                        productIdTPP: card[0].pricing.tcgplayer?.normal?.productId ?? card[0].pricing.tcgplayer?.holofoil?.productId ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.productId ?? NaN,
                        avgTPPrice: card[0].pricing.tcgplayer?.normal?.midPrice ?? card[0].pricing.tcgplayer?.holofoil?.midPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.midPrice ?? NaN,
                        lowTPPrice: card[0].pricing.tcgplayer?.normal?.lowPrice ?? card[0].pricing.tcgplayer?.holofoil?.lowPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.lowPrice ?? NaN,
                        language: card[2]?fallbackLanguage:i18n.language
                    }
                } else {
                    return {
                        name: card[0].name,
                        expansion: card[0].set.name,
                        cardNumber: card[0].localId,
                        cardId: card[0].id,
                        cardType: card[0].category,
                        pokemonType: card[0].stage,
                        rarity: card[0].rarity,
                        image: card[0].image + '/low.webp',
                        quantity: card[1],
                        productIdCM: card[0].pricing.cardmarket?.idProduct ?? NaN,
                        avgCMPrice: card[0].pricing.cardmarket?.avg ?? NaN,
                        lowCMPrice: card[0].pricing.cardmarket?.low ?? NaN,
                        productIdTPP: card[0].pricing.tcgplayer?.normal?.productId ?? card[0].pricing.tcgplayer?.holofoil?.productId ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.productId ?? NaN,
                        avgTPPrice: card[0].pricing.tcgplayer?.normal?.midPrice ?? card[0].pricing.tcgplayer?.holofoil?.midPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.midPrice ?? NaN,
                        lowTPPrice: card[0].pricing.tcgplayer?.normal?.lowPrice ?? card[0].pricing.tcgplayer?.holofoil?.lowPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.lowPrice ?? NaN,
                        language: card[2]?fallbackLanguage:i18n.language
                    }
                }
            default:
                return {
                    name: card[0].name,
                    expansion: card[0].set.name,
                    cardNumber: card[0].localId,
                    cardId: card[0].id,
                    cardType: card[0].category,
                    rarity: card[0].rarity,
                    image: card[0].image + '/low.webp',
                    quantity: card[1],
                    productIdCM: card[0].pricing.cardmarket?.idProduct ?? NaN,
                    avgCMPrice: card[0].pricing.cardmarket?.avg ?? NaN,
                    lowCMPrice: card[0].pricing.cardmarket?.low ?? NaN,
                    productIdTPP: card[0].pricing.tcgplayer?.normal?.productId ?? card[0].pricing.tcgplayer?.holofoil?.productId ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.productId ?? NaN,
                    avgTPPrice: card[0].pricing.tcgplayer?.normal?.midPrice ?? card[0].pricing.tcgplayer?.holofoil?.midPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.midPrice ?? NaN,
                    lowTPPrice: card[0].pricing.tcgplayer?.normal?.lowPrice ?? card[0].pricing.tcgplayer?.holofoil?.lowPrice ?? card[0].pricing.tcgplayer?.["reverse-holofoil"]?.lowPrice ?? NaN,
                    language: card[2]?fallbackLanguage:i18n.language
                }
        }
    }

    if (cardInfo !== undefined) {
        return (
            <Fragment>
                <div className="result-card"
                    onClick={async () => {
                        const card = [cardInfo, 1];
                        const newCard = formatCard(card)
                        await addCardToDeck(newCard)
                        handleClear();
                    }}
                >
                    {
                        cardInfo.category === "Energy" || cardInfo.category === "Energía" ?
                            <img style={{ background: "none" }} src={selectImage(cardInfo.name)} alt={`${cardInfo?.name} ${cardInfo?.set?.name}`} title={`${cardInfo?.name} ${cardInfo?.set?.name}`} />
                            : <img src={`${cardInfo?.image}/low.webp`} alt={`${cardInfo?.name} ${cardInfo?.set?.name}`} title={`${cardInfo?.name} ${cardInfo?.set?.name}`} onError={(e) => {
                                e.preventDefault();
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = Placeholder;
                            }} />
                    }
                    <h1>{`${cardInfo?.name} `}<br />{` ${cardInfo?.set?.name}`}</h1>
                </div>
            </Fragment>
        )
    }
}
export default SearchedCard;
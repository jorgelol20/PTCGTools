import React, { Fragment, useState } from "react";
import './Card.css';
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
import SpainFlag from './../assets/img/Flag-Spain.png';
import USAFlag from './../assets/img/Flag-USA.png';
import { useSSR, useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useRef } from "react";
import { cardsContext } from "../context/CardProvider";
import { useContext } from "react";
import { checkFormat } from "../utils/checkFormat";

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
const Card = ({ cardInfo, onUpdateQuantity, showButtons = true }) => {
    const [displayInfo, setDisplay] = useState(false);
    const { setActualCard } = useContext(cardsContext)

    const { t, i18n } = useTranslation();
    if (cardInfo.category == "Pokémon" || cardInfo.category == "Entrenador" || cardInfo.category == "Trainer" || cardInfo.category == "Pokemon") {
        return (
            <Fragment key={Date.now()+cardInfo.cardId}>
                <div className="card-main">
                    <div onClick={() => {
                        setActualCard(cardInfo);
                    }} className={`${checkFormat(cardInfo.legal, cardInfo?.cardId, cardInfo?.name)} card`} key={cardInfo.cardId}>
                        <img className="languaje-icon" src={cardInfo.language == 'es' ? SpainFlag : USAFlag} alt="" />
                        <div className="head">
                            <label htmlFor="card" className={cardInfo.quantity > 4 ? "quantity ilegal-quantity":"quantity"}>{cardInfo.quantity}</label>
                        </div>
                        <div className="body">
                            <picture id="image">
                                <img
                                    src={cardInfo.image}
                                    onError={(e) => {
                                        e.preventDefault();
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src = Placeholder;
                                    }}
                                    alt={cardInfo.name + " Pokémon TCG"}
                                    title={cardInfo.name + " Pokémon TCG"}
                                />
                            </picture>
                        </div>
                    </div>
                    {
                        showButtons ?

                            <div className="quantity-buttons">
                                <button className="quantity"
                                    onClick={() => {
                                        onUpdateQuantity(cardInfo, 1);
                                    }}
                                >+</button>
                                <button className="quantity"
                                    onClick={() => {
                                        onUpdateQuantity(cardInfo, -1);
                                    }}
                                >-</button>
                            </div>
                            : <></>
                    }
                </div>
            </Fragment>
        )
    } else {
        return (<Fragment key={Date.now()+cardInfo.name}>
            <div className="card-main">
                <div className={`${checkFormat(cardInfo.legal, cardInfo?.cardId)} card`} key={cardInfo.name} onClick={() => {
                    if (cardInfo.expansion) {
                        setActualCard(cardInfo);
                    }
                }}>
                    <img className="languaje-icon" src={cardInfo.language == 'es' ? SpainFlag : USAFlag} alt="" />
                    <div className="head">
                        {/* <label className="title">{cardInfo.name}</label> */}
                        <label htmlFor="card" className="quantity">{cardInfo.quantity}</label>
                    </div>

                    <div className="body">
                        <img
                            src={`${cardInfo?.image}`}
                            alt={`${cardInfo?.name} ${cardInfo?.set?.name}`}
                            title={`${cardInfo?.name} ${cardInfo?.set?.name}`}
                            id={cardInfo?.category}
                            onError={(e) => {
                                e.preventDefault();
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = selectImage(cardInfo.name);
                            }}
                            style={{ background: "none" }}
                        />
                    </div>
                </div>
                {
                    showButtons ?

                        <div className="quantity-buttons">
                            <button className="quantity"
                                onClick={() => {
                                    onUpdateQuantity(cardInfo, 1);
                                }}
                            >+</button>
                            <button className="quantity"
                                onClick={() => {
                                    onUpdateQuantity(cardInfo, -1);
                                }}
                            >-</button>
                        </div>
                        : <></>
                }
            </div>
        </Fragment>
        )
    }
}
export default Card;
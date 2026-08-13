import React, { Fragment } from "react";
import './Content.css';
import PageRoutes from "../structure/PageRoutes";
import { cardsContext } from "../../context/CardProvider";
import { useContext } from "react";
import usePokeAPI from "../../hooks/usePokeAPI";
import CardInfo from "../CardInfo";
import { useState } from "react";
import { useEffect } from "react";

const Content = () => {
    const { actualCardInfo, setActualCard, contextDeck } = useContext(cardsContext);
    const { deckAPI, loading } = usePokeAPI();
    const [actualCard, setActualCardInfo] = useState(null);
    useEffect(()=>{
        setActualCardInfo(actualCardInfo);
        console.log(actualCardInfo)
    },[actualCardInfo])

    return (
        <Fragment>
            <main>
                {
                    actualCard != null ?
                    <CardInfo
                        cardInfo={actualCard}
                        setNewCardInfo={setActualCard}
                    />
                    :""
                }

                <PageRoutes />
            </main>
        </Fragment>
    );
};

export default Content;
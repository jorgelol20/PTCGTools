import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from './../Form.jsx';
import ShowDeck from "../ShowDeck.jsx";
import './Main.css';
import { errorContext } from "../../context/ErrorProvider.jsx";
import { cardsContext } from "../../context/CardProvider.jsx";
import ErrorAlert from "../structure/ErrorAlert.jsx";
import DecksList from "../DecksList.jsx";
import { useTranslation } from "react-i18next";
import Advice from "../structure/Advice.jsx";



const Main = () => {
    const [deck, setDeck] = useState(undefined);
    const [error, setError] = useState(false);
    const { contextError } = useContext(errorContext);
    const { setContextDeck } = useContext(cardsContext);
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const location = useLocation();

    const moveToError = () => {
        window.scrollTo({
            top: "10vh",
            behavior: 'smooth'
        });
        return true;
    }
    const setNewDeck = (newDeck) => {
        setDeck(newDeck)
    }
    useEffect(() => {
        contextError !== "" && contextError !== undefined ? setError(true) : setError(false);
    }, [contextError])

    // useEffect(() => {
    //     if (location.pathname !== "/results") {
    //         setContextDeck(null);
    //     }
    // }, [location]);

    return (
        <Fragment>
            <div className="mainContainer">
                <div className="form">
                    <div className='adviceBox'>
                        {
                            <Advice text={t("cardsAdvice")} type={"importante"} />
                        }
                    </div>
                    <div className="error">
                        {
                            error && moveToError() && <ErrorAlert id="error" errorMessage={contextError} />
                        }
                    </div>
                    <div className={`textArea ${isOpen ? "open" : "closed"}`}>
                        <button
                            className="textAreaToggle"
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                        >
                            {isOpen ? t('hideTextArea') : t('showTextArea')}
                        </button>
                        <div className="textAreaContent">
                            <Form
                                setNewDeck={setNewDeck}
                            />
                        </div>
                    </div>
                    <div className="textArea">
                        <DecksList />
                    </div>
                </div>

                <div className="showDeck">
                    <ShowDeck
                        deck={deck}
                    />
                </div>
            </div>
        </Fragment>
    )
}
export default Main;
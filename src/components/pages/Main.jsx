import React, { Fragment, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from './../Form.jsx';
import ShowDeck from "../ShowDeck.jsx";
import './Main.css';
import { errorContext } from "../../context/ErrorProvider.jsx";
import { cardsContext } from "../../context/CardProvider.jsx";
import ErrorAlert from "../structure/ErrorAlert.jsx";



const Main = () => {
    const [deck, setDeck] = useState(undefined);
    const [error, setError] = useState(false);
    const { contextError } = useContext(errorContext);
    const { setContextDeck } = useContext(cardsContext);
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

    useEffect(() => {
        if (location !== "/results") {
            setContextDeck(undefined);
        }
    }, [location]);

    return (
        <Fragment>
            <div className="mainContainer">
                <div className="form">
                    <div className="error">
                        {
                            error && moveToError() && <ErrorAlert id="error" errorMessage={contextError} />
                        }
                    </div>
                    <div className="textArea">
                        <Form
                            setNewDeck={setNewDeck}
                        />
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
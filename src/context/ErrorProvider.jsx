import React, { Fragment, createContext, useState, useEffect } from "react";

const errorContext = createContext();

const ErrorProvider = (props) => {
    const [contextError, setError] = useState("");
    const [badCards, setBadCards] = useState("");
    const [fallbackCards, setFallbackCards] = useState("");

    const addNewBadCard = (badCard) => {
        setBadCards((prevCards) => [...prevCards, badCard]);
    }
    const resetBadCards = () => {
        setBadCards("");
    }

    const addFallbackCard = (fallbackCard) => {
        setFallbackCards((prevCards) => [...prevCards, fallbackCard]);
    }
    const resetFallbackCards = () => {
        setFallbackCards("");
    }

    const setNewError = (newError) => {
        setError(newError);
    }

    const exports = {
        setNewError,
        contextError,
        addNewBadCard,
        resetBadCards,
        badCards,
        addFallbackCard,
        resetFallbackCards,
        fallbackCards,
    }
    return (
        <Fragment>
            <errorContext.Provider value={exports}>
                {props.children}
            </errorContext.Provider>
        </Fragment>
    )
}
export default ErrorProvider;
export { errorContext };
import React, { Fragment, createContext, useState, useEffect } from "react";

const errorContext = createContext();

const ErrorProvider = (props) => {
    const [contextError, setError] = useState("");
    const [badCards, setBadCards] = useState("");
    const addNewBadCard = (badCard) => {

        setBadCards((prevCards) => [...prevCards, badCard]);
    }
    const resetBadCards = () => {
        setBadCards("");
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
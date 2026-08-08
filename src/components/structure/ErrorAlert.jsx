import React, { Fragment, useContext, useEffect, useState } from "react";
import './ErrorAlert.css';
import { errorContext } from "../../context/ErrorProvider";

const ErrorAlert = ({ errorMessage }) => {
    const { contextError, setNewError } = useContext(errorContext);
    const [display, setDisplay] = useState(true);
    useEffect(() => {
        setDisplay(true);
        const timer = setTimeout(() => {
            setDisplay(false);
            setNewError("")
        }, 5000)
        return () => clearTimeout(timer);
    }, [contextError, setNewError])
    if (!display || contextError === "") {
        return null;
    }
    return (
        <Fragment>
            <div className="errorContainer">
                <h1>ERROR: </h1>
                <p>{errorMessage}</p>
                <div id="loadingBar"></div>
            </div>
        </Fragment>
    )
}
export default ErrorAlert;
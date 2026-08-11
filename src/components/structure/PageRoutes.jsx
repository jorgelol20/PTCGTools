import React, {Fragment} from "react";
import {Routes, Route} from 'react-router-dom';
import Main from "../pages/Main.jsx";
import Results from "../pages/Results.jsx";
import Welcome from "../pages/Welcome.jsx";
import Decks from "../pages/Decks.jsx";

const PageRoutes = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/calc" element={<Main/>}/>
                <Route path="/results" element={<Results/>}/>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/*" element={<Welcome/>}/>
                <Route path="/deck" element={<Decks/>}/>
            </Routes>
        </Fragment>
    )
}
export default PageRoutes;
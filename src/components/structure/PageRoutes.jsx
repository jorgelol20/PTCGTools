import React, {Fragment} from "react";
import {Routes, Route} from 'react-router-dom';
import Main from "../pages/Main.jsx";
import Results from "../pages/Results.jsx";
import Welcome from "../pages/Welcome.jsx";

const PageRoutes = () => {
    return (
        <Fragment>
            <Routes>
                <Route path="/calc" element={<Main/>}/>
                <Route path="/results" element={<Results/>}/>
                <Route path="/" element={<Welcome/>}/>
                <Route path="/*" element={<Welcome/>}/>
            </Routes>
        </Fragment>
    )
}
export default PageRoutes;
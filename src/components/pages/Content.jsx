import React, { Fragment } from "react";
import './Content.css';
import PageRoutes from "../structure/PageRoutes";


const Content = () => {
    
    return (
        <Fragment>
            <main>
                {<PageRoutes />}
            </main>
        </Fragment>
    );
}
export default Content;
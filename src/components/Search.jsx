import React, { useState, useEffect } from "react";
import TCGdex, { Query } from "@tcgdex/sdk";
import Card from "./Card";
import SearchedCard from "./SearchedCard";
import { useTranslation } from "react-i18next";
import { result } from "lodash";

import './Search.css';
import { Fragment } from "react";
import Loading from "./Loading";

const Search = () => {
    const [searchText, setSearchText] = useState("");
    const [searchPage, setSearchPage] = useState(1);
    const [allCards, setAllCards] = useState([]); // State para almacenar la consulta completa
    const [loading, setLoading] = useState(false);
    const { t,i18n } = useTranslation();

    const clearTCGdexCache = () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("@tcgdex-cache/")) {
                localStorage.removeItem(key);
            }
        });
    };

    const fetchCards = async () => {
        setLoading(true);
        try {
            const tcgdex = new TCGdex(i18n.language);
            const results = await tcgdex.card.list(
                Query.create()
                    .contains('name', searchText)
                    .sort('localId', 'ASC')
                    .not.contains('image', 'tcgp')
            );
            const resultsIds = results.map((card) => card.id);
            setAllCards(resultsIds || []);
        } catch (error) {
            console.error("Error al buscar cartas:", error);
            clearTCGdexCache();
            setAllCards([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchText.trim()) {
            setAllCards([]);
            return;
        }
        setSearchPage(1);
        fetchCards();
    }, [searchText]);

    const handleClear = () => {
        setSearchText("");
    };

    // Obtenemos únicamente las 20 cartas de la página actual
    const displayedCards = allCards.slice((Math.max(0, searchPage - 1)) * 20, searchPage * 20);

    return (
        <Fragment >
            <div className="searchmenu">
                <div className="search">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="searchbar"
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Buscar carta..."
                        />
                    </form>
                    <button onClick={handleClear}>Limpiar</button>
                </div>

                <div className="filters">
                </div>
                <div className="search-results" style={{display:`${(allCards.length === 0) ? "none":""}`}}>
                    {loading && <Loading key={Math.random().toString(36).substring(2, 15)} />}

                    {!loading && allCards.length === 0 && searchText && (
                        <p>{t('notFound')}</p>
                    )}
                    <div className="results-cards">
                        {!loading &&
                            displayedCards.map((card) => (
                                <SearchedCard cardId={card} key={card} handleClear={handleClear} />
                            ))}
                    </div>
                    <div className="pageButtons">
                    <button onClick={() => setSearchPage(prev => Math.max(Math.min(Math.floor(allCards.length / 20 + 0.5), 1), prev - 1))}>
                        {t('previousPage')}
                    </button>
                    <button onClick={() => setSearchPage(prev => Math.min(Math.floor(allCards.length / 20 + 0.5), prev + 1))}>
                        {t('nextPage')}
                    </button>
                    <h1>{searchPage}/{Math.floor(allCards.length / 20 + 0.5)}</h1>
                </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Search;
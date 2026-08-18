import React, { useState, useEffect } from "react";
import TCGdex, { Query } from "@tcgdex/sdk";
import Card from "./Card";
import SearchedCard from "./SearchedCard";
import { useTranslation } from "react-i18next";
import { result } from "lodash";
import expansionDictionary from '../assets/db/expansionSet.json';
import './Search.css';
import { Fragment } from "react";
import Loading from "./Loading";
import { useRef } from "react";

const Search = () => {
    const { t, i18n } = useTranslation();
    const [searchText, setSearchText] = useState("");
    const searchLanguage = useRef(i18n.language);
    const searchSet = useRef("all");
    const searchCategory = useRef("all");
    const sets = Object.entries(expansionDictionary);
    const invalidExpandedSets = sets.slice(0, 75).map(key => key[1]);
    const searchLegality = useRef("all");
    const [searchPage, setSearchPage] = useState(1);
    const [allCards, setAllCards] = useState([]);
    const [loading, setLoading] = useState(false);


    const clearTCGdexCache = () => {
        Object.keys(localStorage).forEach((key) => {
            if (key.startsWith("@tcgdex-cache/")) {
                localStorage.removeItem(key);
            }
        });
    };

    const expandedBannedCards = (id) => {
        switch (id) {
            case 'swsh2-22':
            case 'swshp-SWSH022':
            case 'swsh2-165':
            case 'swsh2-207':
            case 'sm12-83':
            case 'sm12-194':
            case 'sm12-265':
            case 'sm115-58':
            case 'sm115-68':
            case 'sm11-206':
            case 'sm11-253':
            case 'sm10-78':
            case 'sm10-165':
            case 'sm8-90':
            case 'sm8-91':
            case 'sm10-178':
            case 'sm6-83':
            case 'sm5-114':
            case 'sm3.5-45':
            case 'xy1-124':
            case 'g1-71':
            case 'xy9-98':
            case 'xy9-98a':
            case 'xy9-98b':
            case 'xy9-109':
            case 'xy7-74':
            case 'xy7-75':
            case 'xy7-75a':
            case 'xy6-77':
            case 'xy6-77a':
            case 'xy6-106':
            case 'xy5-133':
            case 'xy5-158':
            case 'xy4-118':
            case 'xy4-99':
            case 'xy2-23':
            case 'bw9-101':
            case 'bw9-115':
            case 'bw5-62':
            case 'bw5-110':
            case 'bw3-67':
            case 'sm115-60':
                return false;
            default:
                return !invalidExpandedSets.includes(id.split('-')[0])
        }
        
    }

    const glcBannedCards = (id) => {
        switch (id) {
            case 'xy4-99':
            case 'xy4-118':
            case 'sm5-114':
            case 'xy7-74':
            case 'sm7-133':
            case 'sma-SV85':
            case 'swsh4.5-21':
            case 'hgss1-103':
            case 'xy1-130':
            case 'bw11-113':
            case 'xy4-111':
            case 'base4-124':
            case 'xy10-114':
            case 'sm1-136':
            case 'sm2-166':
            case 'g1-74':
            case 'xy12-90':
            case 'bw4-92':
            case 'base1-96':
                return false;
            default:
                return !invalidExpandedSets.includes(id.split('-')[0])
        }
    }

    const filterLegal = (cards) => {
        switch (searchLegality.current.value) {
            case 'glc':
                const filteredGlc = cards.filter(card => glcBannedCards(card.id));
                return filteredGlc
            default:
                return cards
        }
    }

    const getCategory = (category, language) => {
        if (category === 'Pokémon') {
            return language === 'es' ? 'Pokémon' : 'Pokemon';
        } else if (category === 'Trainer') {
            return language === 'es' ? 'Entrenador' : 'Trainer';
        } else if (category === 'Energy') {
            return language === 'es' ? 'Energía' : 'Energy';
        }
    }

    const getQuery = async (language = 'en', set = '', category = '') => {
        const tcgdex = new TCGdex(language);
        if (searchLegality.current.value.includes('standard')) {
            return await tcgdex.card.list(
                Query.create()
                    .contains('name', searchText)
                    .contains('legal.standard', 'true')
                    .contains('id', set)
                    .contains('category', category)
                    .sort('localId', 'ASC')
            );
        } else if (searchLegality.current.value.includes('expanded')) {
            return await tcgdex.card.list(
                Query.create()
                    .contains('name', searchText)
                    .contains('legal.expanded', 'true')
                    .contains('id', set)
                    .contains('category', category)
                    .sort('localId', 'ASC')
            );
        }else if(searchLegality.current.value.includes('glc')){
            return await tcgdex.card.list(
                Query.create()
                    .contains('name', searchText)
                    .contains('id', set)
                    .contains('category', category)
                    .not.contains('name', ' ex')
                    .not.contains('name', ' V')
                    .not.contains('name', ' EX')
                    .not.contains('name', '-EX')
                    .not.contains('name', ' VMax')
                    .not.contains('name', ' GX')
                    .not.contains('name', 'BREAK')
                    .sort('localId', 'ASC')
            );
        }else {
            return await tcgdex.card.list(
                Query.create()
                    .contains('name', searchText)
                    .contains('id', set)
                    .contains('category', category)
                    .sort('localId', 'ASC')
            );
        }

        return []
    }

    const fetchCards = async () => {
        setLoading(true);
        try {
            const language = searchLanguage.current.value === 'auto' ? i18n.language : searchLanguage.current.value;
            const set = searchSet?.current === "all" || searchSet?.current?.value === "all" ? '' : searchSet.current.value;
            const category = searchCategory?.current === "all" || searchCategory?.current?.value === "all" ? '' : getCategory(searchCategory.current.value, language)
            setSearchPage(1)
            const results = await getQuery(language, set, category);
            const filtered = results.filter(card => !/^(P-)?[AB](\-)?\d/.test(card.id));
            const resultsIds = filterLegal(filtered).map((card) => card.id);
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
        setAllCards([])
    };

    // Obtenemos únicamente las 20 cartas de la página actual
    const displayedCards = allCards.slice((Math.max(0, searchPage - 1)) * 20, searchPage * 20);

    return (
        <Fragment >
            <div className="searchmenu">
                <div className="search">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="search">
                            <input
                                className="searchbar"
                                type="text"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                placeholder={t("searchCard")}
                            /><button className="clean" onClick={handleClear}>{t('cleanButton')}</button>
                        </div>
                        <div className="filters">
                            <div className="filter">
                                <label htmlFor="">{t("languageSelection")}</label>
                                <select name="languageSelect" id="" defaultValue={i18n.language.includes('es') ? 'es' : 'en'} ref={searchLanguage} onChange={async (e) => {
                                    fetchCards();
                                }}>
                                    <option value="es">{t('spanish')}</option>
                                    <option value="en">{t('english')}</option>
                                </select>
                            </div>
                            <div className="filter">
                                <label htmlFor="">{t("setSelection")}</label>
                                <select name="setSelect" id="" ref={searchSet} onChange={async (e) => {
                                    fetchCards();
                                }}>
                                    <option value="all" defaultValue={true}>{t('allSets')}</option>
                                    {
                                        sets.slice(searchLegality.current.value === 'glc' ? 76 : 0, sets.length)
                                            .map((key) => {
                                                if (!key[0].includes('TK-')) return <option key={key[0] + key[1]} value={key[1]}>{key[0]}</option>
                                            })
                                    }
                                </select>
                            </div>
                            <div className="filter">
                                <label htmlFor="">{t("legalSelection")}</label>
                                <select name="setSelect" id="" ref={searchLegality}
                                    onChange={async (e) => {
                                        await fetchCards();
                                    }}>
                                    <option value="all" defaultValue={true}>{t('allSets')}</option>
                                    <option value="standard">{t('standard')}</option>
                                    <option value="expanded">{t('expanded')}</option>
                                    <option value="glc">GLC</option>
                                </select>
                            </div>
                            <div className="filter">
                                <label htmlFor="">{t("categorySelection")}</label>
                                <select name="setSelect" id="" ref={searchCategory}
                                    onChange={async (e) => {
                                        await fetchCards();
                                    }}>
                                    <option value="all" defaultValue={true}>{t('allSets')}</option>
                                    <option value="Pokémon" defaultValue={true}>{t('pokemon')}</option>
                                    <option value="Trainer">{t('trainer')}</option>
                                    <option value="Energy">{t('energy')}</option>
                                </select>
                            </div>
                            <div className="colors">
                                <div>
                                    <h3>{t('standard')}<span className="color-s"></span></h3>
                                </div>
                                <div>
                                    <h3>{t('expanded')}<span className="color-e"></span></h3>
                                </div>
                                <div>
                                    <h3>GLC<span className="color-g"></span></h3>
                                </div>
                                <div>
                                    <h3>Ilegal<span className="color-i"></span></h3>
                                </div>
                                <div>
                                    <h3>{t('other')}<span className="color-o"></span></h3>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>

                <div className="filters">
                </div>
                
                <div className="search-results" style={{ display: `${(allCards.length === 0) ? "none" : ""}` }}>
                    <h1 htmlFor="">Resultados</h1>
                    {loading && <Loading key={"loadgin-key"} />}

                    {!loading && allCards.length === 0 && searchText && (
                        <p>{t('notFound')}</p>
                    )}
                    <div className="results-cards">
                        {!loading &&
                            displayedCards.map((card) => (
                                <SearchedCard cardId={card} key={card} language={searchLanguage.current.value === 'auto' ? i18n.language : searchLanguage.current.value} />
                            ))}
                    </div>
                    <div className="pageButtons">
                        <button onClick={() => {
                            clearTCGdexCache();
                            setSearchPage(prev => Math.max(Math.min(Math.floor(allCards.length / 20 + 1), 1), prev - 1))
                        }}>
                            {t('previousPage')}
                        </button>
                        <button onClick={() => {
                            clearTCGdexCache()
                            setSearchPage(prev => Math.min(Math.floor(allCards.length / 20 + 1), prev + 1))
                        }}>
                            {t('nextPage')}
                        </button>
                        <h1>{searchPage}/{Math.floor(allCards.length / 20 + 1)}</h1>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Search;
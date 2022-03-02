import ReactDOM from 'react-dom';
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

const searchUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=';
const apiKey = '&api-key='
const key = ''; //Add key

const App = () => {
    const [articles, setArticles] = useState([]);
    const [searchInput, setSearchInput] = useState([]);

    useEffect(() => {
        getArticles('election');
    }, []);

    const setData = (searchValue) => { //Setting data entered by user
        setSearchInput(searchValue);
    };

    const searchItems = () => { //Item searched for data entered by user
        if (searchInput !== '') {
            getArticles(searchInput);
        }
    };

    const getArticles = async (keyword) => { //Articles are extracted for value searched
        const response = await fetch(searchUrl + keyword + apiKey + key);
        const jsonData = await response.json();
        setArticles(jsonData.response.docs);
    };

    const Post = (props) => {
        return (
            //Each Article
            <a className='link' href={props.data.web_url}>
                <div className="article">
                    {/* Article Header */}
                    <div className='header'>
                        <h3 className="heading">{props.data.headline.main}</h3>
                        <p className='pubDate'>{props.data.pub_date.slice(0, 10)}</p>
                    </div>
 
                    {/* Article Description */}
                    <p className="description">
                        {props.data.abstract}
                    </p>
 
                    {/* Article Footer */}
                    <div className='footer'>
                        <div className='hashtags'>
                            {props.data.keywords.map((item, ind) => (
                                <div key={ind} data={item}>#{item.value.split(' ').join('_')} </div>
                            ))}
                        </div>

                        <div className='author'>
                            {props.data.byline.original == null ? (<p>- Anonymous</p>) : (<p>- {props.data.byline.original}</p>)}
                        </div>
                    </div>
                </div>
            </a >
        );
    }

    return (
        // Main Body
        <div className="App">
            <header className="app-header">
                <h2>The New York Times</h2>
            </header>

            {/* Search Bar */}
            <div className="wrap">
                <div className="search">
                    <input type="text" className="searchTerm" placeholder="What are you looking for?" onChange={(e) => setData(e.target.value)} />
                    <button className='searchButton' onClick={() => searchItems()}>Search</button>
                </div>
            </div>

            {/* Article Pages */}
            <div>
                {articles.length > 0 ? (
                    <div className='list'>
                        <Pagination
                            data={articles}
                            RenderComponent={Post}
                            pageLimit={5}
                            dataLimit={5}
                        />
                    </div>
                ) : (
                    <h1 className='article singleItem'>No Posts to display</h1>
                )}
            </div>
        </div>
    );
};

//Pages of articles
const Pagination = ({ data, RenderComponent, pageLimit, dataLimit }) => {
    const [pages] = useState(Math.round(data.length / dataLimit));
    const [currentPage, setCurrentPage] = useState(1);

    const nextPage = () => { setCurrentPage((page) => page + 1); };

    const prevPage = () => { setCurrentPage((page) => page - 1); };

    const changePage = (event) => {
        const pageNumber = Number(event.target.textContent);
        setCurrentPage(pageNumber);
    };

    const getPaginatedData = () => {
        const startIndex = currentPage * dataLimit - dataLimit;
        const endIndex = startIndex + dataLimit;
        return data.slice(startIndex, endIndex);
    };

    const getPaginationGroup = () => {
        let start = Math.floor((currentPage - 1) / pageLimit) * pageLimit;
        console.log(data.length);
        return new Array(2).fill().map((_, idx) => start + idx + 1);
    };

    return (
        <div>
            <div className="dataContainer">
                {getPaginatedData().map((item, idx) => (
                    <RenderComponent key={idx} data={item} />
                ))}
            </div>

            <div className="pagination">
                <button onClick={prevPage} className={`prev ${currentPage === 1 ? 'disabled' : ''}`}> prev </button>
                {getPaginationGroup().map((item, index) => (
                    <button key={index} onClick={changePage} className={`paginationItem ${currentPage === item ? 'active' : null}`} >
                        <span>{item}</span>
                    </button>
                ))}
                <button onClick={nextPage} className={`next ${currentPage === pages ? 'disabled' : ''}`} > next </button>
            </div>
        </div>
    );
};

ReactDOM.render(<App/>, document.getElementById('app'));
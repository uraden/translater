import './App.css';
import axios from "axios";
import React, { useState } from 'react'
import uuid from 'uuid/v4'
import { FaRegBookmark } from 'react-icons/fa'
import { ImCancelCircle } from 'react-icons/im'
import { FaBookmark } from 'react-icons/fa'
import { RiBookMarkFill } from 'react-icons/ri'
import Slider from 'react-slide-out';
import 'react-slide-out/lib/index.css';
import _ from "lodash";



function App() {


  const [isOpen, setIsOpen] = useState(false)

  const openSlider = () => {
    setIsOpen(true)
  }

  const closeSlider = () => {
    setIsOpen(false)
  }


  const [text1, setText1] = useState('')
  const [textresult, setTextresult] = useState('')
  const [language, setLanguage] = useState('ru')
  const [fromlang, setFromLang] = useState('en')

  const [savedwords, setSavedWords] = useState([])
  const [originalsavedwords, setOriginalSavedWords] = useState([])
  const [bookmark, setBookmark] = useState(false)


  const Showme = () => {

    if (textresult !== '') {
      setSavedWords([...savedwords, textresult])
      setOriginalSavedWords([...originalsavedwords, text1])
      setBookmark(!bookmark)
    }


  }


  const [mapvalue, setMapValue] = useState([])
  const [ts, setTs] = useState()
  const [pos, setPos] = useState()
  const [txt, setTxt] = useState()


  const [syntranslang, setSynTransLang] = useState([])
  const [other, setOther] = useState([])



  const translateapi = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20210819T042015Z.8bb9e7590c421096.bbadd54c1dfdee59ec27d3b4c9986f85bfae3028&lang=${language}&text=${text1}&ui=${fromlang}`

  const dictionaryapi = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20210820T095831Z.40fea2b1d6b7ab60.5504c0547c1c1744a11423873136aa0bc442a066&lang=${fromlang}-${language}&text=${text1}`


  //geting axios
  const requestTranslate = axios.get(translateapi)
  const requestDictionary = axios.get(dictionaryapi)


  const reqTranslate = () => {
    if (language === 'zh' || language === 'uz' || language === 'ar' || language === 'id' || language === 'ko' || language === 'ms' || language === 'hi') {
      requestTranslate
        .then((responses) => {
          const responseOne = responses?.data?.text[0];
          // use/access the results
          console.log(responseOne)
          setTextresult(responseOne)
        })

    }
    else if (language === 'ru' || language === 'en' || language === 'de' || language === 'fr' || language === 'tr' || language === 'it' || language === 'es') {
      axios.all([requestTranslate, requestDictionary])
        .then(axios.spread((...responses) => {
          const responseOne = responses[0]?.data?.text[0];
          const responseTwo = responses[1]?.data?.def[0]?.tr;
          const responseThree = responses[1]?.data?.def[0]?.pos
          const responseFour = responses[1]?.data?.def[0]?.ts
          const responseFive = responses[1]?.data?.def[0]?.text
          const responseSix = responses[1]?.data?.def?.[0]?.tr

          const responseOther = responses[1].data

          // use/access the results
          console.log(responseOne);
          setTextresult(responseOne);
          console.log(responseOne)
          setOther(responseTwo);
          console.log(responseOther)
          setPos(responseThree);
          setTs(responseFour);
          setTxt(responseFive)
          setMapValue(responseSix)
          setSynTransLang(responseSix)

        })).catch(errors => {
          // react on errors.
          console.error(errors);
        })

    }
    setBookmark(false)
  }



  const swichLang = () => {
    setLanguage(fromlang)
    setFromLang(language)
  }

  const inputChangeHandler = (event) => {
    setText1(event.target.value)
  }




  const removeword = () => {
    setTxt('')
    setSynTransLang([])
    setPos()
    setTs()
    setMapValue([])
    setText1('')
    setTextresult('')
    setBookmark(false)
  }


 


  const zippedwords = _.zip(savedwords, originalsavedwords) 

  const savedbookword = zippedwords.map((results)=>(
    <div className="jeu">
       
       <p> {results[1]}</p>
       <p>  {results[0]} </p>
    </div>
  ))


  const head_slider_style = {
    position: 'relative',
    color: '#FFDC61',
    display: 'block',
    fontSize: 30,
    textAlign: 'center'

  }
  return (
    <div className="App">




      <Slider
        title={<div style={head_slider_style}> Saved Words </div>}
        isOpen={isOpen}
        onOutsideClick={closeSlider}
        foldWidth="100px"
      >



        <div style={{ padding: '10px' }} className="saved-words">
          <h3> {savedbookword}</h3>
        </div>


      </Slider>


      <br />

      <div className="heading-top">
        <div className="heading">
          <h1 className="p1 "> Powered by </h1>
          <h1 className="yan">Yandex </h1>
          <h1 className="p1">Translate </h1>
        </div>

        <a onClick={openSlider}> <RiBookMarkFill className="saved-bookmark" /> </a>

      </div>


      <div className="text-result-area">


        <div className="each-section section-form" tabindex="1">



          <select className="select from"
            value={fromlang}
            onChange={(e) => {
              const selectLang = e.target.value;
              setFromLang(selectLang)
            }}
          >
            <option value="zh"> Chinese </option>
            <option value="en"> English </option>
            <option value="de"> German </option>
            <option value="ru"> Russian </option>
            <option value="fr"> French </option>
            <option value="uz"> Uzbek </option>
            <option value="ar"> Arabic </option>
            <option value="tr"> Turkish </option>
            <option value="id"> Indonesian </option>
            <option value="it"> Italian </option>
            <option value="es"> Spanish </option>
            <option value="ko"> Korean </option>
            <option value="ms"> Malay </option>
            <option value="hi"> Hindi </option>
          </select>
          <ImCancelCircle className="earase" onClick={removeword} />
          <textarea
            className="input-text write"
            onChange={inputChangeHandler}
            value={text1}
            placeholder="Enter text here to translate"
          />

        </div>






        <div className="bts-all">
          <button onClick={reqTranslate} className="btn-tran"> Translate </button>
          <button onClick={swichLang} className="btn-tran switch"> ←Switch→ </button>
          {/*  <button onClick={reqLibrary}> click me </button> */}
        </div>

        <div className="each-section">
          <select
            className="select to"
            value={language}
            onChange={(e) => {
              const selectLang = e.target.value;
              setLanguage(selectLang)
            }}

          >
            <option value="zh"> Chinese </option>
            <option value="en"> English </option>
            <option value="de"> German </option>
            <option value="ru"> Russian </option>
            <option value="fr"> French </option>
            <option value="uz"> Uzbek </option>
            <option value="ar"> Arabic </option>
            <option value="tr"> Turkish </option>
            <option value="id"> Indonesian </option>
            <option value="it"> Italian </option>
            <option value="es"> Spanish </option>
            <option value="ko"> Korean </option>
            <option value="ms"> Malay </option>
            <option value="hi"> Hindi </option>
          </select>

          <div onClick={Showme}>     {bookmark ? <FaBookmark className="bookmarkfill" /> : <FaRegBookmark className="bookmark" />}</div>

          <textarea
            disabled
            className="input-text result"
            value={textresult}
          />
        </div>

      </div>



      <div className="synonyms">
        <div className="meanings 1">
          <h2 className={txt ? "word related" : 'noneshow'}> Related words</h2>
          <ul>
            {mapvalue && mapvalue.map((response) => (
              <span onClick={() => { setText1((response.mean[0].text)) }}>
                <li className="syno origin" key={uuid()} id={uuid}> {response?.mean?.[0]?.text} </li>
              </span>
            ))}
          </ul>
        </div>



        <div className="meanings 2">
          <h2 className={txt ? "word dictionary" : 'noneshow'}> Dictionary</h2>
          <p className="pdescr"> {txt} <span className={ts ? 'transcript' : 'noneshow'}> [{ts}]  </span> <span className="pos">{pos}</span> </p>

          <ol className="from-syn">
            {syntranslang && syntranslang.map((response) => (
              <li> {response?.text} </li>
            ))}
          </ol>
        </div>
      </div>






    </div>
  );
}

export default App;

import React, { Fragment, useEffect, useState, useRef  } from "react";
import { useSelector, useDispatch} from 'react-redux';
import { Link } from "react-router-dom";

import { getAggregatedWords } from '../../services/user';
import { setAllDifficultWords } from '../../store/wordsSlice';

import Header from "../../components/Header/Header";
import Card from "../../components/Card/Card";
import Footer from "../../components/Footer/Footer";
import empty from "../../assets/empty.jpg";
import Button from "../../components/Button/Button";
import TextbookNav from "./TextbookNav";
import './Difficult.css';

const initialValue: _IWord[] | [] = [];
interface _IWord {
  _id: string;
  image: string;
  textExample: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  textMeaning: string;
  transcription: string;
  word: string;
  wordTranslate: string;
  audio: string;
  audioExample: string;
  audioMeaning: string;
}
const Difficult = () => {

  const isAuth = useSelector((state: any) => state.user.isAuth);
  const user = useSelector((state: any) => state.user.data);

  const [difficultWords, setDifficultWords] = useState(initialValue);

  const spinner = useRef(true);
  
  useEffect(() => getAggregatedWords(user, res => {
    spinner.current = false;
    setDifficultWords(res[0].paginatedResults)
  }), []);

  const handleRedraw = () => {
    getAggregatedWords(user, res => {setDifficultWords(res[0].paginatedResults)})
  };

  
useEffect(() => {
  if (!spinner.current) {
    const elem = document.querySelector('.difficult-page-base');
    if(difficultWords.length) {
    elem?.classList.add('hidden');
  } else {
    elem?.classList.remove('hidden')
  }
  }
}, [difficultWords])

  //redux
  const dispatch = useDispatch();
  getAggregatedWords(user, res => dispatch(setAllDifficultWords(res[0].paginatedResults)));
  //
  const [isActive, setActive] = useState(false);
  const [isMenuGames, setMenuGames] = useState(false);
   const [menuGamesActive, setMenuGamesActive] = useState(true);
  const handleClickButton = () => {
    setActive(!isActive)
  };
  const showGames = () => {
    setMenuGames(!isMenuGames)
  }
  return (
    <Fragment>
      <Header/>
         <div className="button-container">
           <Button
             className="button textbook-button"
             title="Выберите раздел учебника"
             handleClick={handleClickButton} />
          {
            isActive && <TextbookNav/> 
          }
          <Button
            className="button games-button"
            title="Мини игры"
            handleClick={() => {if (menuGamesActive) showGames()}}
          />
          {isMenuGames && 
            <ul className="page__menu-games">
              <Link
                key={'link-sprint'}
                to={'../games/sprint'}
              >
                Спринт
              </Link>
              <Link
                key={'link-audio-challenge'}
                to={'../games/audio-challenge'} 
              >
                Аудио-вызов
              </Link>
            </ul>
          }
        </div>

        <div className='difficult-words-wrapper'>
          {spinner.current ? <div>Идет загрузка...</div> : null}
    {
      difficultWords.map((word: _IWord) => {
        return <Card
          key={word._id.toString()}
          wordId={word._id.toString()}
          image={`https://rslang-b.herokuapp.com/${word.image}`}
          word={word.word}
          wordTranslate={word.wordTranslate}
          textExample={word.textExample}
          textExampleTranslate={word.textExampleTranslate}
          textMeaningTranslate={word.textMeaningTranslate}
          transcription={word.transcription}
          textMeaning={word.textMeaning}
          audio={`https://rslang-b.herokuapp.com/${word.audio}`}
          audioExample={`https://rslang-b.herokuapp.com/${word.audioExample}`}
          audioMeaning={`https://rslang-b.herokuapp.com/${word.audioMeaning}`}
          redraw={handleRedraw}
          />;
      }
    )
    }
    <div className='difficult-page-base hidden'>
          <h3 className="difficult-h3">Сложные слова еще не отмечены...</h3>
        <img className="difficult-image" src={empty} alt="difficult-image"/>
      </div>
    </div>
     <Footer/>
  </Fragment>
   )

}
export default Difficult;


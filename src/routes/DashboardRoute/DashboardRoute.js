import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'
import {Link} from "react-router-dom";
import './Dashboard.css'
class DashboardRoute extends Component {
  static contextType = UserContext;

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${TokenService.getAuthToken()}`,
      },
    })
    .then(res => {
      if(!res.ok) {
        return res.json().then(e => Promise.reject(e));
      }
      return res.json();
    })
    .then(res => {
      this.context.setLanguage(res.language);
      this.context.setWords(res.words);
    })
  }

  render() {
    if (this.context.words.length === 0){
      return <p>Loading...</p>
    } else {
      return (
        <section className='dashboard'>
          <h2>{this.context.language.name}</h2>
          <section>Total correct answers: {this.context.language.total_score}</section>
          <h3>Words to practice</h3>
          <ol className='wordlist'>{this.context.words.map((word,i) => <li className='word' key={i}><h4>{word.original}</h4><div>correct answer count: {word.correct_count}</div><div>incorrect answer count: {word.incorrect_count}</div></li>)}</ol>
          <Link to={'/learn'}>Start practicing</Link>
        </section>
      );
    }
  }
}

export default DashboardRoute

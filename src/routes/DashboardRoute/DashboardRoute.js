import React, { Component } from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'
import Button from "../../components/Button/Button";
import {Link} from "react-router-dom";

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
      console.log(res);
      //update context
      this.context.setLanguage(res.language);
      this.context.setWords(res.words);

    })
  }

  render() {
    return (
      <section>
        <h2>{this.context.language.name}</h2>
        <section>Total correct answers: {this.context.language.total_score}</section>
        <h3>Words to practice</h3>
        <ol>{this.context.words.map((word,i) => <li  key={i}><h4>{word.original}</h4><div>correct answer count: {word.correct_count}</div><div>incorrect answer count: {word.incorrect_count}</div></li>)}</ol>
        <Link to={'/learn'}>Start practicing</Link>
      </section>
    );
  }
}

export default DashboardRoute

import React, {Component} from 'react'
import UserContext from '../../contexts/UserContext'
import config from '../../config'
import TokenService from '../../services/token-service'


class LearningRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentWord: '',
            nextWord: '',
            totalScore: 0,
            correctCount: 0,
            incorrectCount: 0,
            isCorrect: null,
            guess: '',
            answer: ''
        }
    }

    static contextType = UserContext;

    componentDidMount() {
        fetch(`${config.API_ENDPOINT}/language/head`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${TokenService.getAuthToken()}`,
            },
        })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(e => Promise.reject(e));
                }
                return res.json();
            })
            .then(res => {
                this.setState({
                    currentWord: res.nextWord, totalScore: res.totalScore, correctCount: res.wordCorrectCount,
                    incorrectCount: res.wordIncorrectCount, isCorrect: null
                });
            })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        //get user input
        if (this.state.isCorrect === null){
          const guess = event.target['learn-guess-input'].value;
          fetch(`${config.API_ENDPOINT}/language/guess`, {
              method: 'POST',
              headers: {
                  'content-type': 'application/json',
                  'authorization': `Bearer ${TokenService.getAuthToken()}`,
              },
              body: JSON.stringify({guess})
          }).then(res => {
              if (!res.ok) {
                  return res.json().then(e => Promise.reject(e));
              }
              return res.json();
          })
              .then(res => {
                  console.log(res);
                  this.setState({
                      answer: res.answer, guess, totalScore: res.totalScore, isCorrect: res.isCorrect,
                      correctCount: res.wordCorrectCount, incorrectCount: res.wordIncorrectCount, nextWord: res.nextWord
                  });
              })
        } else {
          //fetch GET call here?
          this.setState({isCorrect: null, currentWord: this.state.nextWord.original, correctCount: this.state.nextWord.correctCount, incorrectCount: this.state.nextWord.incorrectCount});
        } 

    };

    handleInput(e) {
        this.setState({guess: e.target.value})
    }

    render() {
        if (false) {
            return <p>Loading...</p>
        } else {
            return (
                <main>

                    <div className="DisplayFeedback">
                        <h2>{(this.state.isCorrect !== null) ? (this.state.isCorrect) ? 'You were correct! :D'
                            : 'Good try, but not quite right :('
                            : 'Translate the word:'}</h2>
                    </div>
                    <span>{this.state.currentWord}</span>
                    <div className='DisplayScore'><p>Your total score is: {this.state.totalScore}</p></div>
                    <p>You have answered this word correctly {this.state.correctCount} times.</p>
                    <p>You have answered this word incorrectly {this.state.incorrectCount} times.</p>
                    {(this.state.isCorrect !== null) ? <div className='DisplayFeedback'><p>The correct translation
                        for {this.state.currentWord} was {this.state.answer} and you chose {this.state.guess}!</p>
                    </div> : ''}
                    <form onSubmit={this.handleSubmit}>

                        {(this.state.isCorrect === null) ? <>
                            <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
                            <input type='text' name='learn-guess-input' id='learn-guess-input'
                                   onChange={(e) => this.handleInput(e)} value={this.state.guess} required/>
                            <button type='submit'>Submit your answer</button>
                        </> : <button type='submit'>Try another word!</button>
                        }
                    </form>

                </main>
            );
        }
    }
}

export default LearningRoute

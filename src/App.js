import React, {Component} from 'react';
import ProgressBox from './ProgressBox';
import QuestionBox from './QuestionBox';
import './App.css';

const config = require('./Questionrrr.json');

class App extends Component {
    state = {
        config: config,
        question: null,
        answers: [],
        message: {
            type: '',
            text: ''
        },
        isLastQuestion: false,
        currentQuestionIndex: 0,
    };

    api = {
        showMessage: (text, type = 'success') => {
            this.setState({
                message: {
                    type,
                    text
                }
            });
        },
        updateState: (newState) => {
            this.setState(newState)
        }
    };

    componentWillMount() {
        if (!this.state.config) {
            this.api.showMessage('No configuration provided!', 'error');
            return;
        }

        if (!this.state.question) {
            this.api.updateState({question: this.state.config.questions[0]});
        }
    }

    render() {
        const props = {
            state: this.state,
            api: this.api
        };

        return (
            <div className="App">
                <header>
                    <ProgressBox {...props} />
                </header>
                <p className={this.state.message.type}>{this.state.message.text}</p>
                <QuestionBox {...props} />
                <footer>Copyright &copy; {(new Date()).getFullYear()}</footer>
            </div>
        );
    }
}

export default App;

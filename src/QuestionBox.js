import React, {Component} from 'react';
import './QuestionBox.css';

class QuestionBox extends Component {
    state = {
        value: ''
    };

    onChange(event) {
        this.setState({
            value: event.target.value
        })

        this.props.api.updateState({
            question: Object.assign(this.props.state.question, {answer: event.target.value})
        });
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.props.state.question.answer) {
            return;
        }

        // Store current answer to the collection of answers.
        const answers = [...this.props.state.answers, this.props.state.question];

        this.props.api.updateState({
            answers
        });

        const currentQuestionIndex = this.props.state.currentQuestionIndex + 1;

        const question = this.props.state.config.questions[currentQuestionIndex];

        if (!question) {
            this.props.api.showMessage('Congratulations! You have completed all questions.');

            // Send the form information into the provided endpoint.
            if (this.props.state.config.submission.url) {
                this.submitAnswers(answers);
            }
        }

        this.props.api.updateState({
            currentQuestionIndex,
            question
        });

        this.setState({
            value: ''
        });
    }

    submitAnswers(answers) {
        fetch(this.props.state.config.submission.url, {
            method: 'POST',
            headers: Object.assign({'Content-Type': 'application/json'}, this.props.state.config.submission.headers),
            body: JSON.stringify(answers)
        })
            .then(response => {
                console.info('Submit form data has succeeded.', response);
            })
            .catch(error => {
                this.props.api.showMessage('Error! Could not submit answers.');
                console.error('Submit form data has failed.', error);
            });
    }

    render() {
        if (!this.props.state.question) {
            return null;
        }

        const inputStyle = {
            color: this.props.state.config.styles.primaryFontColor,
            borderColor: this.props.state.config.styles.primaryFontColor
        };

        const buttonStyle = {
            color: this.props.state.config.styles.primaryFontColor,
            borderColor: this.props.state.config.styles.primaryFontColor
        };

        const buttonLabel = this.props.state.currentQuestionIndex === (this.props.state.config.questions.length - 1) ? 'Submit' : 'Continue';

        return (
            <form className="QuestionBox" onSubmit={this.onSubmit.bind(this)}>
                <h1>{this.props.state.question.title}</h1>
                <input onChange={this.onChange.bind(this)} value={this.state.value} style={inputStyle}/>
                <button type="submit" style={buttonStyle}>{buttonLabel}</button>
            </form>
        )
    }
}

export default QuestionBox;
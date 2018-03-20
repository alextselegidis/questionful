import React, {Component} from 'react';
import './ProgressBox.css';

class ProgressBox extends Component {
    render() {
        const index = !this.props.state.question ? this.props.state.currentQuestionIndex : this.props.state.currentQuestionIndex + 1;

        const style = {
            color: this.props.state.config.styles.secondaryFontColor
        };

        return (
            <div className="ProgressBox" style={style}>
                <h1>
                    Question <strong>{index}</strong> of <strong>{this.props.state.config.questions.length}</strong>
                </h1>
            </div>
        )
    }
}

export default ProgressBox;
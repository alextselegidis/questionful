/* ----------------------------------------------------------------------------
 * Questionful - Questionnaires Made Simple
 *
 * @package     Questionful
 * @author      A.Tselegidis <alextselegidis@gmail.com>
 * @copyright   Copyright (c) Alex Tselegidis
 * @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
 * @link        https://questionful.org
 * @since       v1.0.x
 * ---------------------------------------------------------------------------- */
import React, {useState, useEffect} from 'react';
import ProgressBox from './ProgressBox';
import QuestionBox from './QuestionBox';
import './App.css';
import defaultConfigData from './Questionful.json';

// Allow runtime config override via Docker (window.__QUESTIONFUL_CONFIG__)
const configData = window.__QUESTIONFUL_CONFIG__ || defaultConfigData;

function App() {
    const [config, setConfig] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!configData?.pages?.length) {
            setMessage('Error! No valid form configuration found.');
            return;
        }

        const page = configData.pages[0];
        const elements = Array.isArray(page.elements) ? page.elements : [];

        const normalized = {
            ...configData,
            questions: elements.map((el, index) => ({
                id: el.name || `q${index}`,
                type: mapType(el.type),
                title: el.title || '',
                text: el.text || '',
                description: el.description || '',
                options: el.choices || [],
                multiple: el.multiple || false,
                required: el.required || false,
            })),
        };

        setConfig(normalized);

        if (elements.length > 0) {
            setQuestion(normalized.questions[0]);
        }
    }, []);

    const api = {
        showMessage: (msg) => setMessage(msg),
        updateState: (newState) => {
            if ('question' in newState) setQuestion(newState.question);
            if ('answers' in newState) setAnswers(newState.answers);
            if ('message' in newState) setMessage(newState.message);
            if ('currentQuestionIndex' in newState) setCurrentQuestionIndex(newState.currentQuestionIndex);
        },
    };

    if (!config) {
        return <div className="App">Loading...</div>;
    }

    const appStyle = {
        '--backgroundColor': config.styles.backgroundColor,
        '--primaryFontColor': config.styles.primaryFontColor,
        '--secondaryFontColor': config.styles.secondaryFontColor,
        fontFamily: config.styles.fontFamily,
        background: config.styles.backgroundColor,
        color: config.styles.primaryFontColor,
    };

    const footerStyle = {
        color: config.styles.secondaryFontColor,
    };

    const props = {
        state: {config, question, answers, message, currentQuestionIndex},
        api,
    };

    return (
        <div className="App" style={appStyle}>
            <header>
                <ProgressBox {...props} />
            </header>

            <em>{message}</em>

            <main className="ContentArea">
                <QuestionBox {...props} />
            </main>

            <footer style={footerStyle}>
                Copyright &copy; {new Date().getFullYear()} &nbsp;-&nbsp;
                <a href="https://alextselegidis.com" target="_blank" rel="noreferrer" style={footerStyle}>
                    Alex Tselegidis
                </a>
            </footer>
        </div>
    );
}

function mapType(rendererType) {
    switch (rendererType) {
        case 'qf-short-text':
            return 'short_text';
        case 'qf-paragraph':
            return 'paragraph';
        case 'qf-dropdown':
            return 'dropdown';
        case 'qf-multiple-choice':
            return 'multiple_choice';
        case 'qf-checkboxes':
            return 'multiple_choice';
        case 'qf-text-block':
            return 'text_block';
        case 'qf-image':
            return 'image';
        default:
            return null;
    }
}

export default App;

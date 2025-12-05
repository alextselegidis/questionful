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

import React, { useState, useEffect, useRef } from "react";
import FormField from "./FormField";
import "./QuestionBox.css";

export default function QuestionBox({ state, api }) {
    const { config, question, currentQuestionIndex, answers } = state || {};
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [fadeClass, setFadeClass] = useState("fade-in");
    const containerRef = useRef(null);

    useEffect(() => {
        if (!question) return;
        setValue(question.answer ?? (question.type === "multiple_choice" ? [] : ""));
        setError("");
    }, [question?.id]);

    useEffect(() => {
        if (!containerRef.current) return;
        const focusable = containerRef.current.querySelector(
            "input:not([type='hidden']), select, textarea"
        );
        if (focusable) {
            focusable.focus();
            if (focusable.type === "radio" || focusable.type === "checkbox") {
                focusable.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [question?.id]);

    if (!question) return null;

    const totalQuestions = config.questions.length;
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
    const buttonLabel = isLastQuestion ? "Submit" : "Continue";

    const handleFieldChange = (val) => {
        setValue(val);
        const updatedQuestion = { ...(question || {}), answer: val };
        api.updateState({ question: updatedQuestion });
    };

    const buildPayload = (answersArray) =>
        (answersArray || []).map((q) => ({
            id: q.id || q.name,
            answer: q.answer ?? null,
        }));

    const submitToEndpoint = async (payload) => {
        const submissionConfig = config.submission ?? null;
        if (!submissionConfig?.url) return true;

        try {
            const res = await fetch(submissionConfig.url, {
                method: submissionConfig.method ?? "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(submissionConfig.headers || {}),
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                setError("Error submitting your answers. Please try again.");
                return false;
            }

            setError("");
            return true;
        } catch (err) {
            console.error(err);
            setError("Submission failed. Please check your connection.");
            return false;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const empty =
            value === "" ||
            value === null ||
            (Array.isArray(value) && value.length === 0);

        if (question.required && empty) {
            setError("This question is required. Please provide an answer.");
            return;
        }

        const newAnswers = [...(answers || [])];
        newAnswers[currentQuestionIndex] = { ...(question || {}), answer: value };
        api.updateState({ answers: newAnswers });

        const nextIndex = currentQuestionIndex + 1;
        const nextQuestion = config.questions[nextIndex] ?? null;

        if (!nextQuestion) {
            setSubmitting(true);
            const payload = buildPayload(newAnswers);
            const success = await submitToEndpoint(payload);
            setSubmitting(false);

            if (!success) {
                setFadeClass("fade-in");
                return;
            }

            setSubmitted(true);
            setFadeClass("fade-in");
            return;
        }


        setFadeClass("fade-out");

        setTimeout(() => {
            api.updateState({
                currentQuestionIndex: nextIndex,
                question: nextQuestion,
            });
            setValue("");
            setTimeout(() => setFadeClass("fade-in"), 100);
        }, 300);
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === "Enter") {
            onSubmit(e);
        }
    };

    const formStyle = {
        fontSize: config?.styles?.fontSize || "14px",
        color: config?.styles?.primaryFontColor || "#333",
        fontFamily: config?.styles?.fontFamily || "inherit",
    };

    const buttonStyle = {
        color: config.styles.primaryFontColor,
        borderColor: config.styles.primaryFontColor,
    };

    return (
        <form
            className={`QuestionBox ${fadeClass}`}
            ref={containerRef}
            onSubmit={onSubmit}
            onKeyDown={handleKeyDown}
            style={formStyle}
        >
            {question.type !== "heading" && question.title && (
                <>
                    <h1 style={{ marginBottom: question.description ? "0.25rem" : "1rem" }}>
                        {question.title}
                        {question.required && <span style={{ color: "red" }}> *</span>}
                    </h1>

                    {question.description && question.description.trim() !== "" && (
                        <p className="qf-description">
                            {question.description}
                        </p>
                    )}
                </>
            )}

            {!submitted ? (
                <>
                    <FormField question={question} value={value} onChange={handleFieldChange} />

                    {error && <div className="qf-error">{error}</div>}

                    <button
                        type="submit"
                        style={buttonStyle}
                        disabled={submitting}
                    >
                        {submitting ? "Submitting..." : buttonLabel}
                    </button>
                </>
            ) : (
                <div className="final-message">
                    <h3>🎉 Thank you for completing the demo form!</h3>
                    <p><strong>Your answers have been submitted.</strong></p>
                </div>
            )}
        </form>
    );
}

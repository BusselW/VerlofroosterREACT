import { useState, useEffect, createElement as h } from 'react';
import { tutorialSteps, highlightElement, removeHighlight } from '../tutorial/roosterTutorial.js';

const InteractiveTutorial = ({ isActive, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [highlightedElement, setHighlightedElement] = useState(null);

    useEffect(() => {
        if (isActive && currentStep < tutorialSteps.length) {
            const step = tutorialSteps[currentStep];
            const element = highlightElement(step.targetId);
            setHighlightedElement(element);

            if (element) {
                updateTooltipPosition(element);
            }
        } else if (!isActive) {
            removeHighlight();
            setHighlightedElement(null);
        }
    }, [isActive, currentStep]);

    useEffect(() => {
        const handleResize = () => {
            if (highlightedElement) {
                updateTooltipPosition(highlightedElement);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [highlightedElement]);

    const updateTooltipPosition = (element) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const tooltipWidth = 320;
        const tooltipHeight = 180; // Increased estimate for content
        const margin = 20;

        // Default position: to the right of the element
        let x = rect.right + margin;
        let y = rect.top + (rect.height / 2) - (tooltipHeight / 2);

        // Check if tooltip would go off the right side of screen
        if (x + tooltipWidth > window.innerWidth - margin) {
            // Try positioning to the left
            x = rect.left - tooltipWidth - margin;

            // If still off screen, position within viewport
            if (x < margin) {
                x = margin;
                // Position above or below if we're using horizontal centering
                if (rect.bottom + tooltipHeight + margin < window.innerHeight) {
                    y = rect.bottom + margin;
                } else if (rect.top - tooltipHeight - margin > 0) {
                    y = rect.top - tooltipHeight - margin;
                } else {
                    // Last resort: center vertically in viewport
                    y = (window.innerHeight - tooltipHeight) / 2;
                }
            }
        }

        // Ensure tooltip doesn't go off the top or bottom
        if (y < margin) {
            y = margin;
        } else if (y + tooltipHeight > window.innerHeight - margin) {
            y = window.innerHeight - tooltipHeight - margin;
        }

        // Final boundary checks
        x = Math.max(margin, Math.min(x, window.innerWidth - tooltipWidth - margin));
        y = Math.max(margin, Math.min(y, window.innerHeight - tooltipHeight - margin));

        setTooltipPosition({ x, y });
    };

    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            closeTutorial();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const closeTutorial = () => {
        removeHighlight();
        setHighlightedElement(null);
        onClose();
    };

    const skipTutorial = () => {
        closeTutorial();
    };

    if (!isActive || currentStep >= tutorialSteps.length) {
        return null;
    }

    const step = tutorialSteps[currentStep];

    return h('div', {
        className: 'tutorial-tooltip',
        style: {
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 10000
        }
    },
        h('div', { className: 'tutorial-tooltip-content' },
            h('div', { className: 'tutorial-tooltip-header' },
                h('span', { className: 'tutorial-step-counter' },
                    `Stap ${currentStep + 1} van ${tutorialSteps.length}`
                ),
                h('button', {
                    className: 'tutorial-close-btn',
                    onClick: closeTutorial,
                    'aria-label': 'Sluit tutorial'
                }, '×')
            ),
            h('div', { className: 'tutorial-tooltip-body' },
                h('p', { className: 'tutorial-message' }, step.message)
            ),
            h('div', { className: 'tutorial-tooltip-footer' },
                h('button', {
                    className: 'btn btn-secondary btn-sm',
                    onClick: skipTutorial
                }, 'Tutorial overslaan'),
                h('div', { className: 'tutorial-nav-buttons' },
                    currentStep > 0 && h('button', {
                        className: 'btn btn-secondary btn-sm',
                        onClick: prevStep
                    }, 'Vorige'),
                    h('button', {
                        className: 'btn btn-primary btn-sm',
                        onClick: nextStep
                    }, currentStep < tutorialSteps.length - 1 ? 'Volgende' : 'Voltooien')
                )
            )
        )
    );
};

export default InteractiveTutorial;

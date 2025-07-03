import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error Boundary gevangen fout:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return React.createElement('div', { className: 'error-message' },
                React.createElement('h2', null, 'Er is een onverwachte fout opgetreden'),
                React.createElement('p', null, 'Probeer de pagina te vernieuwen.'),
                React.createElement('details', null,
                    React.createElement('summary', null, 'Technische details'),
                    React.createElement('pre', null, this.state.error?.message || 'Onbekende fout')
                )
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

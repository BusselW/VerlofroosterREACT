// Simple test to check basic syntax structure
const h = (tag, props, ...children) => ({ tag, props, children });
const Fragment = 'Fragment';

// Simulated function structure from verlofRooster.aspx
const testFunction = () => {
    return h('UserRegistrationCheck', { 
        onUserValidated: () => {} 
    }, 
        // App content - this will be shown dimmed when user is not registered
        (() => {
            return h(Fragment, null,
                h('div', null, 'test content')
            ); // Close Fragment with all app content
        })() // Close the anonymous function that wraps the app content  
    ); // Close the UserRegistrationCheck component
}; // Close the test function

console.log('Syntax test passed');
console.log(testFunction());

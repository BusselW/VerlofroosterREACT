# User Validation Implementation

## Overview
We have implemented user validation in the k.aspx file to ensure that only registered users can access the main rooster application. If a user is not found in the Medewerkers list, they are redirected to the registration page.

## How it Works

### 1. Current User Retrieval
- Uses `getCurrentUser()` from sharepointService.js to get the currently logged in SharePoint user
- Handles different login name formats (with or without claim prefixes)

### 2. Username Comparison
The system compares the current user's login name with usernames in the Medewerkers list using multiple approaches:

```javascript
// Direct comparison
medewerkersUsername === userLoginName

// Trimmed username comparison (removes domain prefix)
trimLoginNaamPrefix(medewerkersUsername) === trimLoginNaamPrefix(userLoginName)

// Case insensitive comparison
medewerkersUsername.toLowerCase() === userLoginName.toLowerCase()
```

### 3. Username Formats Handled
- `org\busselw` (domain\username)
- `i:0#.w|org\busselw` (claims-based format)
- Various case combinations

### 4. User States

#### Loading State
- Shows spinner and "Gebruiker valideren..." message
- Fetches current user and Medewerkers list

#### User Not Registered
- Shows registration required message
- Provides button to go to registration page (registratie.aspx)
- Provides "Opnieuw Controleren" button to retry validation
- Shows fallback link to old system

#### User Registered
- Allows access to main rooster application
- Continues normal app flow

## Files Modified

### k.aspx
- Added `UserRegistrationCheck` component
- Added user validation state to `RoosterApp`
- Added CSS styling for validation UI
- Imported `trimLoginNaamPrefix` function

### sharepointService.js
- Added `trimLoginNaamPrefix()` function to handle username formatting
- Exports the function for use in other components

## Technical Details

### Component Structure
```
RoosterApp
├── UserRegistrationCheck (if not validated)
│   ├── Loading State
│   ├── Not Registered State
│   └── Registered State (passes validation)
└── Main Rooster Components (if validated)
```

### Configuration Dependencies
- Requires `window.appConfiguratie` to be loaded
- Uses 'Medewerkers' list configuration from configLijst.js
- Filters out inactive users (Actief !== false)

### Error Handling
- Catches and logs errors during user validation
- Shows appropriate error messages to user
- Provides retry functionality

## Usage

The validation happens automatically when k.aspx loads:

1. User visits k.aspx
2. UserRegistrationCheck component runs
3. If user is found in Medewerkers list → access granted
4. If user is not found → redirected to registration

## Testing

To test the implementation:

1. Access k.aspx as a registered user (exists in Medewerkers list)
2. Access k.aspx as an unregistered user
3. Check browser console for detailed logging
4. Verify registration redirect functionality

## Future Enhancements

- Add user role-based access control
- Implement session caching for validation results
- Add admin override functionality
- Enhanced error reporting for debugging

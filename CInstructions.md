# basics
1. Follow the rules, use this file as additional context.
2. Write comments to follow the rules near the end of this file.

# references
Base-URL: https://som.org.om.local/sites/MulderT/CustomPW/Verlof/
API-URL: https://som.org.om.local/sites/MulderT/CustomPW/Verlof/_api/web/

# configLijst.js
- the file mentioned contains all the list data, GUIDs and field names.
- Do not change this file unless specifically asked to do so.
- the field named 'opmekring' is not a typo. Leave it.
  <!--
    Let op: De veldnaam 'opmekring' is bewust zo gespeld en is geen spelfout.
    Dit is de correcte naam zoals deze in de brondata voorkomt; NIET wijzigen naar 'opmerking'.
  -->

# rules
- Write function names, variable names, comments in Dutch.
- Explore the given code to you beforehand to employ DRY (Don't Repeat Yourself)
- Before writing your code, analyse which files are related to the action you are about to perform. Check to see if similar code already exists
- Afterwards: check to see if there are errrors. If there are, correct yourself and clean those errors up.

# Comments
Use sections like:
' ========================
' =     BASIS STIJLEN    =
' ========================

and 

' ========================
' =   getDagenInMaand    =
' ========================
    /**
     * Haalt alle dagen in het jaar op. Maak gebruik van de volgende parameters:
     * @param {number} maand - Het maandnummer (0-11).
     * @param {number} jaar - Het jaar.
     * @returns {Array<Date>} Een array van datumobjecten voor die maand.
     */
    const getDagenInMaand = (maand, jaar) => {
      const dagen = [];
      const laatstedag = new Date(jaar, maand + 1, 0); // Laatste dag van de maand
      for (let i = 1; i <= laatstedag.getDate(); i++) {
        dagen.push(new Date(jaar, maand, i));
      }
      return dagen;
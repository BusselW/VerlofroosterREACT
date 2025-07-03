
export const maandNamenVolledig = ['Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni', 'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'];

export const getPasen = (jaar) => {
    const a = jaar % 19; const b = Math.floor(jaar / 100); const c = jaar % 100; const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25); const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30; const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7; const m = Math.floor((a + 11 * h + 22 * l) / 451); const maand = Math.floor((h + l - 7 * m + 114) / 31); const dag = ((h + l - 7 * m + 114) % 31) + 1; return new Date(jaar, maand - 1, dag);
};

export const getFeestdagen = (jaar) => {
    const pasen = getPasen(jaar); const feestdagenMap = {}; const voegFeestdagToe = (datum, naam) => { const key = datum.toISOString().split('T')[0]; feestdagenMap[key] = naam; }; voegFeestdagToe(new Date(jaar, 0, 1), 'Nieuwjaarsdag'); voegFeestdagToe(new Date(pasen.getTime() - 2 * 24 * 3600 * 1000), 'Goede Vrijdag'); voegFeestdagToe(pasen, 'Eerste Paasdag'); voegFeestdagToe(new Date(pasen.getTime() + 1 * 24 * 3600 * 1000), 'Tweede Paasdag'); voegFeestdagToe(new Date(jaar, 3, 27), 'Koningsdag'); voegFeestdagToe(new Date(jaar, 4, 5), 'Bevrijdingsdag'); voegFeestdagToe(new Date(pasen.getTime() + 39 * 24 * 3600 * 1000), 'Hemelvaartsdag'); voegFeestdagToe(new Date(pasen.getTime() + 49 * 24 * 3600 * 1000), 'Eerste Pinksterdag'); voegFeestdagToe(new Date(pasen.getTime() + 50 * 24 * 3600 * 1000), 'Tweede Pinksterdag'); voegFeestdagToe(new Date(jaar, 11, 25), 'Eerste Kerstdag'); voegFeestdagToe(new Date(jaar, 11, 26), 'Tweede Kerstdag'); return feestdagenMap;
};

export const getWeekNummer = (datum) => {
    const doelDatum = new Date(datum.getTime()); const dagVanWeek = (doelDatum.getDay() + 6) % 7; doelDatum.setDate(doelDatum.getDate() - dagVanWeek + 3); const eersteJanuari = new Date(doelDatum.getFullYear(), 0, 1); return Math.ceil(((doelDatum.getTime() - eersteJanuari.getTime()) / 604800000) + 1);
};

export const getWekenInJaar = (jaar) => {
    const laatste31Dec = new Date(jaar, 11, 31); const weekNummer = getWeekNummer(laatste31Dec); return weekNummer === 1 ? 52 : weekNummer;
};

export const getDagenInMaand = (maand, jaar) => {
    const dagen = [];
    const laatstedag = new Date(jaar, maand + 1, 0);
    for (let i = 1; i <= laatstedag.getDate(); i++) {
        dagen.push(new Date(jaar, maand, i));
    }
    return dagen;
};

export const formatteerDatum = (datum) => {
    const dagNamen = ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za']; return { dagNaam: dagNamen[datum.getDay()], dagNummer: datum.getDate() };
};

export const getInitialen = (naam) => {
    if (!naam) return ''; return naam.split(' ').filter(d => d.length > 0).map(d => d[0]).join('').toUpperCase().slice(0, 2);
};

export const getDagenInWeek = (weekNummer, jaar) => {
    const dagen = [];
    const eersteJanuari = new Date(jaar, 0, 1);
    const dagVanWeek = (eersteJanuari.getDay() + 6) % 7; // Maandag = 0

    // Bereken de datum van de eerste maandag van het jaar
    const eersteMaandag = new Date(jaar, 0, 1 - dagVanWeek + (dagVanWeek === 0 ? 0 : 7));

    // Bereken de startdatum van de gewenste week
    const startVanWeek = new Date(eersteMaandag);
    startVanWeek.setDate(startVanWeek.getDate() + (weekNummer - 1) * 7);

    // Voeg 7 dagen toe voor de week (maandag t/m vrijdag voor werkdagen)
    for (let i = 0; i < 7; i++) {
        const dag = new Date(startVanWeek);
        dag.setDate(dag.getDate() + i);
        dagen.push(dag);
    }

    return dagen;
};

export const isVandaag = (datum) => {
    const vandaag = new Date();
    const datumCheck = new Date(datum);
    return datumCheck.getDate() === vandaag.getDate() &&
        datumCheck.getMonth() === vandaag.getMonth() &&
        datumCheck.getFullYear() === vandaag.getFullYear();
};

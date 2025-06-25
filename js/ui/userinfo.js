// js/ui/userinfo.js

/**
 * @file userinfo.js
 * @description React component voor het weergeven van een enkele medewerker-rij.
 */

// Haal de benodigde React-functies en de service op.
const { useState, useEffect, createElement: h } = React;
import { getUserInfo } from '../services/sharepointService.js';

const fallbackAvatar = 'https://placehold.co/96x96/4a90e2/ffffff?text=';

function MedewerkerRow({ medewerker }) {
    const [sharePointUser, setSharePointUser] = useState({ PictureURL: null, IsLoading: true });

    useEffect(() => {
        let isMounted = true;
        const fetchUserData = async () => {
            if (medewerker && medewerker.Username) {
                if(isMounted) setSharePointUser({ PictureURL: null, IsLoading: true });
                const userData = await getUserInfo(medewerker.Username);
                if (isMounted) {
                    setSharePointUser({ ...(userData || {}), IsLoading: false });
                }
            } else if(isMounted) {
                setSharePointUser({ PictureURL: null, IsLoading: false });
            }
        };

        fetchUserData();
        return () => { isMounted = false; };
    }, [medewerker.Username]);

    const getAvatarUrl = () => {
        if (sharePointUser.IsLoading) return '';
        if (sharePointUser.PictureURL) return sharePointUser.PictureURL;
        const initials = medewerker.Naam ? medewerker.Naam.match(/\b\w/g).join('') : '?';
        return `${fallbackAvatar}${initials}`;
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        const initials = medewerker.Naam ? medewerker.Naam.match(/\b\w/g).join('') : '?';
        e.target.src = `${fallbackAvatar}${initials}`;
    };

    // UI opgebouwd met h() calls in plaats van JSX
    return h('div', { className: 'medewerker-info' },
        h('img', {
            src: getAvatarUrl(),
            className: 'medewerker-avatar',
            alt: `Profielfoto van ${medewerker.Naam}`,
            onError: handleImageError
        }),
        h('div', null, // Wrapper voor tekst-elementen
            h('span', { className: 'medewerker-naam' }, medewerker.Naam),
            // Hier kun je extra velden toevoegen, zoals de functie
            medewerker.Functie ? h('span', { style: { display: 'block', fontSize: '0.8rem', color: '#666' } }, medewerker.Functie) : null
        )
    );
}

export default MedewerkerRow;
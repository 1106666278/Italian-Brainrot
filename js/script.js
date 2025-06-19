document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.getElementById('languageSwitcher');
    const relatedGamesContainer = document.getElementById('relatedGamesContainer');
    const faqContainer = document.getElementById('faqContainer');

    function setLanguage(lang) {
        document.documentElement.lang = lang;
        localStorage.setItem('preferredLanguage', lang);

        if (translations[lang] && translations[lang]['pageTitle']) {
            document.title = translations[lang]['pageTitle'];
        }

        const elementsToTranslate = document.querySelectorAll('[data-lang-key]');
        elementsToTranslate.forEach(el => {
            const key = el.getAttribute('data-lang-key');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'META' && el.name === 'description') {
                    el.content = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        loadFAQ(lang);
        loadRelatedGames(lang);
    }

    function loadRelatedGames(lang) {
        if (!relatedGamesContainer) return;
        fetch('./related-games.json')
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(games => {
                relatedGamesContainer.innerHTML = '';
                games.forEach(game => {
                    const card = `
                        <div class="game-card flex flex-col rounded-lg overflow-hidden shadow-lg transition-all duration-300 p-4 border border-green-200">
                            <img src="${game.image}" alt="${game.title[lang] || game.title['en']}" class="w-full h-40 object-cover rounded-md mb-4">
                            <h3 class="text-xl font-bold mb-2 text-green-700">${game.title[lang] || game.title['en']}</h3>
                            <p class="text-gray-600 text-sm mb-4 flex-grow">${game.description[lang] || game.description['en']}</p>
                            <a href="${game.url}" target="_blank"
                               class="mt-auto btn-primary font-semibold py-2 px-4 rounded-lg text-center"
                               data-lang-key="viewGameButton">
                               ${translations[lang]?.viewGameButton || translations['en'].viewGameButton}
                            </a>
                        </div>
                    `;
                    relatedGamesContainer.innerHTML += card;
                });
            })
            .catch(error => {
                console.error("Could not load related games:", error);
                relatedGamesContainer.innerHTML = `<p class="text-red-500 col-span-full">Error loading related games.</p>`;
            });
    }

    function loadFAQ(lang) {
        if (!faqContainer) return;
        fetch('./faq.json')
            .then(response => response.ok ? response.json() : Promise.reject(`HTTP error! status: ${response.status}`))
            .then(faqs => {
                faqContainer.innerHTML = '';
                faqs.forEach(faqItem => {
                    const item = `
                        <div class="faq-item rounded-lg shadow-md overflow-hidden">
                            <details class="group">
                                <summary class="flex justify-between items-center font-medium p-4 cursor-pointer">
                                    <span>${faqItem.question[lang] || faqItem.question['en']}</span>
                                    <span class="text-green-600 text-xl transition-transform duration-300 group-open:rotate-45">+</span>
                                </summary>
                                <div class="text-gray-600 p-4 pt-0">
                                    ${faqItem.answer[lang] || faqItem.answer['en']}
                                </div>
                            </details>
                        </div>
                    `;
                    faqContainer.innerHTML += item;
                });
            })
            .catch(error => {
                console.error("Could not load FAQ:", error);
                faqContainer.innerHTML = `<p class="text-red-500">Error loading FAQ.</p>`;
            });
    }

    languageSwitcher.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });

    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    languageSwitcher.value = savedLang;
    setLanguage(savedLang);
});

(function() {
            'use strict';

            // ===== KONFIGŪRACIJA =====
            const CONFIG = {
                SELECTION_TIMEOUT: 2000,
                TOAST_DURATION: 3000,
                BUTTON_RESET_TIMEOUT: 2500,
                ERROR_TIMEOUT: 3000,
                DEBOUNCE_DELAY: 100
            };

            // ===== PAGALBINĖS FUNKCIJOS =====
            let isCopying = false;

            /**
             * Debounce su atskiru timeriu kiekvienam įvyniojimui (select vs copy nesidalija).
             */
            function createDebounce(func, delay) {
                let timeoutId = null;
                return function(...args) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => func.apply(this, args), delay);
                };
            }

            /**
             * Pasirinkti tekstą code-block elemente
             */
            function selectText(element) {
                if (!element) return;

                try {
                    const pre = element.querySelector('pre');
                    if (!pre) return;

                    const range = document.createRange();
                    range.selectNodeContents(pre);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                    
                    element.classList.add('selected');
                    
                    setTimeout(() => {
                        element.classList.remove('selected');
                    }, CONFIG.SELECTION_TIMEOUT);
                } catch (_) { /* fallback: vartotojas gali pažymėti ranka */ }
            }

            /**
             * Klaviatūros navigacija code-block elementams
             */
            function handleCodeBlockKeydown(event, element) {
                // Enter arba Space aktyvuoja pasirinkimą
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    selectText(element);
                    
                    // Automatiškai kopijuoti po pasirinkimo
                    const promptId = element.querySelector('pre')?.id;
                    if (promptId) {
                        const button = element.closest('.prompt')?.querySelector('.btn');
                        if (button) {
                            setTimeout(() => {
                                copyPrompt(button, promptId);
                            }, 300);
                        }
                    }
                }
            }

            /**
             * Copy prompt to clipboard
             */
            function copyPrompt(button, promptId) {
                if (isCopying) {
                    return; // Apsauga nuo daugkartinio kopijavimo
                }

                if (!button || !promptId) {
                    showError(button, 'Midagi läks valesti. Proovige uuesti kopeerida.');
                    return;
                }

                const promptElement = document.getElementById(promptId);
                if (!promptElement) {
                    showError(button, 'Midagi läks valesti. Proovige uuesti kopeerida.');
                    return;
                }

                const promptText = promptElement.textContent?.trim();
                if (!promptText) {
                    showError(button, 'Midagi läks valesti. Proovige uuesti kopeerida.');
                    return;
                }

                isCopying = true;

                // Bandyti naudoti modernų Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(promptText)
                        .then(() => {
                            showSuccess(button);
                            isCopying = false;
                        })
                        .catch(() => {
                            fallbackCopy(promptText, button);
                        });
                } else {
                    // Fallback senesnėms naršyklėms
                    fallbackCopy(promptText, button);
                }
            }

            /**
             * Fallback kopijavimo metodas (senesnėms naršyklėms)
             */
            function fallbackCopy(text, button) {
                const textarea = document.getElementById('hiddenTextarea');
                if (!textarea) {
                    showError(button, 'Midagi läks valesti. Proovige uuesti. Valige tekst ja kasutage Ctrl+C (või Cmd+C).');
                    isCopying = false;
                    return;
                }

                const parent = textarea.parentNode;
                const next = textarea.nextSibling;

                try {
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '0';
                    textarea.style.top = '0';
                    textarea.style.opacity = '0';
                    textarea.style.pointerEvents = 'none';

                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    textarea.setSelectionRange(0, text.length);

                    const successful = document.execCommand('copy');

                    if (successful) {
                        showSuccess(button);
                    } else {
                        throw new Error('execCommand copy failed');
                    }
                } catch (_) {
                    showError(button, 'Kopeerimine ei õnnestunud. Valige tekst ja kasutage Ctrl+C (või Cmd+C).');
                } finally {
                    isCopying = false;
                    textarea.style.position = 'absolute';
                    textarea.style.left = '-9999px';
                    textarea.style.opacity = '';
                    textarea.style.pointerEvents = 'auto';
                    if (parent && textarea.parentNode !== parent) {
                        if (next && next.parentNode === parent) {
                            parent.insertBefore(textarea, next);
                        } else {
                            parent.appendChild(textarea);
                        }
                    }
                }
            }

            /**
             * Rodyti sėkmės pranešimą
             */
            function showSuccess(button) {
                if (!button) return;

                const original = button.innerHTML;
                button.innerHTML = '<i data-lucide="check" aria-hidden="true"></i><span>Kopeeritud</span>';
                if (typeof lucide !== 'undefined') lucide.createIcons({ root: button });
                button.classList.add('success');
                button.setAttribute('aria-label', 'Prompt edukalt kopeeritud');
                showToast();
                
                setTimeout(() => {
                    button.innerHTML = original;
                    if (typeof lucide !== 'undefined') lucide.createIcons({ root: button });
                    button.classList.remove('success');
                    const promptId = button.getAttribute('data-prompt-id');
                    if (promptId) {
                        button.setAttribute('aria-label', `Kopeerige prompt ${promptId.replace('prompt', '')} lõikelauale`);
                    }
                }, CONFIG.BUTTON_RESET_TIMEOUT);
            }

            /**
             * Rodyti klaidos pranešimą
             */
            function showError(button, message) {
                if (!button) return;

                const original = button.innerHTML;
                const errorMessage = message || 'Midagi läks valesti. Proovige uuesti kopeerida.';
                button.innerHTML = '<i data-lucide="alert-circle" aria-hidden="true"></i><span>' + errorMessage + '</span>';
                if (typeof lucide !== 'undefined') lucide.createIcons({ root: button });
                button.setAttribute('aria-label', errorMessage);
                
                setTimeout(() => {
                    button.innerHTML = original;
                    if (typeof lucide !== 'undefined') lucide.createIcons({ root: button });
                    const promptId = button.getAttribute('data-prompt-id');
                    if (promptId) {
                        button.setAttribute('aria-label', `Kopeerige prompt ${promptId.replace('prompt', '')} lõikelauale`);
                    }
                }, CONFIG.ERROR_TIMEOUT);
            }

            /**
             * Rodyti toast pranešimą
             */
            function showToast() {
                const toast = document.getElementById('toast');
                if (!toast) return;

                toast.classList.add('show');
                toast.setAttribute('aria-live', 'polite');
                
                setTimeout(() => {
                    toast.classList.remove('show');
                }, CONFIG.TOAST_DURATION);
            }

            // ===== GLOBAL FUNKCIJOS (prieinamos HTML) =====
            window.selectText = createDebounce(selectText, CONFIG.DEBOUNCE_DELAY);
            window.copyPrompt = createDebounce(copyPrompt, CONFIG.DEBOUNCE_DELAY);
            window.handleCodeBlockKeydown = handleCodeBlockKeydown;

            // ===== KLAVIATŪROS SHORTCUTS =====
            document.addEventListener('keydown', function(event) {
                // Ctrl/Cmd + C kopijuoja pasirinktą tekstą
                if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
                    const selection = window.getSelection();
                    if (selection.toString().trim().length > 0) {
                        // Tekstas jau pasirinktas, leisti naršyklei kopijuoti
                        return;
                    }
                }

                // Escape uždaro toast
                if (event.key === 'Escape') {
                    const toast = document.getElementById('toast');
                    if (toast) {
                        toast.classList.remove('show');
                    }
                }
            });

            // Kontaktų forma ir Google Sheets integracija šiame etape išjungta – minimali aplikacija, jokių duomenų nerinkime. Galima įjungti vėlesniuose etapuose (žr. INTEGRACIJA.md).

            // ===== "PAŽYMĖJAU KAIP ATLIKAU" – localStorage (M2) =====
            const PROMPT_DONE_KEY_PREFIX = 'di_prompt_done_';
            function loadPromptDoneState() {
                const checkboxes = document.querySelectorAll('.prompt-done');
                checkboxes.forEach(function(cb) {
                    const id = cb.getAttribute('data-prompt-id');
                    if (id) {
                        try {
                            cb.checked = localStorage.getItem(PROMPT_DONE_KEY_PREFIX + id) === 'true';
                        } catch { /* ignore */ }
                    }
                });
            }
            function savePromptDoneState(promptId, checked) {
                try {
                    localStorage.setItem(PROMPT_DONE_KEY_PREFIX + promptId, checked ? 'true' : 'false');
                } catch { /* ignore */ }
            }

            function getPromptDoneCount() {
                var count = 0;
                try {
                    for (var i = 1; i <= 8; i++) {
                        if (localStorage.getItem(PROMPT_DONE_KEY_PREFIX + i) === 'true') count++;
                    }
                } catch { /* ignore */ }
                return count;
            }

            function updateProgressIndicator() {
                var count = getPromptDoneCount();
                var textEl = document.getElementById('progressText');
                var fillEl = document.getElementById('progressBarFill');
                var barEl = document.querySelector('.progress-bar[role="progressbar"]');
                if (textEl) textEl.textContent = count === 8 ? 'Suurepärane – olete kasutanud kõiki kaheksat prompti.' : 'Olete kasutanud ' + count + '/8 prompti.';
                if (fillEl) fillEl.style.width = (count / 8 * 100) + '%';
                if (barEl) {
                    barEl.setAttribute('aria-valuenow', count);
                }
            }

            // ===== INICIALIZACIJA =====
            document.addEventListener('DOMContentLoaded', function() {
                if (typeof lucide !== 'undefined') lucide.createIcons();
                // Pridėti klaviatūros navigaciją visiems code-block elementams
                const codeBlocks = document.querySelectorAll('.code-block');
                codeBlocks.forEach(block => {
                    if (!block.hasAttribute('tabindex')) {
                        block.setAttribute('tabindex', '0');
                    }
                });

                // M2: atkurti ir susieti "Pažymėjau kaip atlikau" checkbox būseną
                loadPromptDoneState();
                document.querySelectorAll('.prompt-done').forEach(function(cb) {
                    cb.addEventListener('change', function() {
                        const id = cb.getAttribute('data-prompt-id');
                        if (id) savePromptDoneState(id, cb.checked);
                        updateProgressIndicator();
                    });
                });

                // S1: progreso indikatorius
                updateProgressIndicator();

            });})();

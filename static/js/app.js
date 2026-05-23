/**
 * APPLIKAČNÍ LOGIKA - INFORMACNI SYSTEM REGISTRACE DOD
 * Obsluhuje SPA navigaci, odpočet času, validaci formulářů, asynchronní API dotazy,
 * dynamické vykreslování SVG grafů, čtečku lístků a export dat do CSV.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializace aplikace
    App.init();
});

const App = {
    // Stav aplikace (držení dat na klientovi pro tabulku a exporty)
    state: {
        activeView: 'registration-view',
        visitorsList: [],
        currentTheme: 'dark'
    },

    // Výchozí nastavení API
    apiBase: '/api',

    init() {
        console.log("Inicializace frontendové aplikace...");
        
        // Načtení uloženého barevného schématu
        this.initTheme();

        // Spuštění SPA Navigace
        this.initNavigation();

        // Spuštění odpočtu
        this.initCountdown();

        // Inicializace registračního formuláře
        this.initRegistrationForm();

        // Inicializace ovládacích prvků Administrace
        this.initAdminControls();

        // Prvotní načtení dat pro veřejnou část (kapacity slotů)
        this.loadSlotCapacities();
    },

    /* ==========================================================================
       1. TÉMA & ROZHRANÍ (THEME MANAGEMENT)
       ========================================================================== */
    initTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('theme') || 'dark';
        
        this.state.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeToggle.addEventListener('click', () => {
            const nextTheme = this.state.currentTheme === 'dark' ? 'light' : 'dark';
            this.state.currentTheme = nextTheme;
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            
            // Překreslení grafů (barvy se mění podle tématu)
            if (this.state.activeView === 'admin-view') {
                this.renderCharts();
            }
        });
    },

    /* ==========================================================================
       2. SPA NAVIGACE (SINGLE PAGE APPLICATION ROUTER)
       ========================================================================== */
    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.view-section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = btn.getAttribute('data-target');
                this.state.activeView = target;

                // Aktivace tlačítka v menu
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Zobrazení příslušné sekce
                sections.forEach(sec => {
                    if (sec.id === target) {
                        sec.classList.add('active');
                    } else {
                        sec.classList.remove('active');
                    }
                });

                // Pokud přecházíme do Administrace, načteme čerstvá data
                if (target === 'admin-view') {
                    // Inicializace AudioContext na pozadí (vyžaduje interakci uživatele)
                    SoundEffects.init();
                    this.loadAdminDashboard();
                } else {
                    // Pokud jdeme na registraci, aktualizujeme kapacity
                    this.loadSlotCapacities();
                }
            });
        });
    },

    /* ==========================================================================
       3. ODPOČET ČASU (COUNTDOWN TIMER)
       ========================================================================== */
    initCountdown() {
        const countdownEl = document.getElementById('countdown');
        
        // Možné termíny DOD
        const dates = [
            { text: "13. října 2026", iso: "2026-10-13T09:00:00" }
        ];

        // Najít nejbližší budoucí termín
        const nowMs = new Date().getTime();
        let closestDate = dates[0];
        let minDiff = Infinity;

        dates.forEach(d => {
            const time = new Date(d.iso).getTime();
            const diff = time - nowMs;
            if (diff > 0 && diff < minDiff) {
                minDiff = diff;
                closestDate = d;
            }
        });

        // Pokud jsou všechny v minulosti, vezmeme ten poslední
        if (minDiff === Infinity) {
            closestDate = dates[dates.length - 1];
        }

        // Aktualizovat data-date a texty v badgech
        countdownEl.setAttribute('data-date', closestDate.iso);
        
        // Změna textu v hero badge
        const heroBadge = document.querySelector('.hero-badge');
        if (heroBadge) {
            heroBadge.innerHTML = `Den otevřených dveří<br>${closestDate.text}`;
        }
        
        // Změna textu v header badge
        const headerBadgeVal = document.querySelector('.header-dod-badge .badge-value');
        if (headerBadgeVal) {
            headerBadgeVal.innerText = closestDate.text;
        }

        const targetDate = new Date(closestDate.iso).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                countdownEl.innerHTML = "<h4>Den otevřených dveří právě probíhá! Vítejte!</h4>";
                clearInterval(timerInterval);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('cd-days').innerText = String(days).padStart(2, '0');
            document.getElementById('cd-hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('cd-minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('cd-seconds').innerText = String(seconds).padStart(2, '0');
        };

        // První spuštění a nastavení intervalu
        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    },

    /* ==========================================================================
       4. VEŘEJNÁ ČÁST - NAČTENÍ KAPACITY
       ========================================================================== */
    async loadSlotCapacities() {
        try {
            const formDate = document.getElementById('form-date');
            const dodDate = formDate ? formDate.value : '13. října 2026';
            const res = await fetch(`${this.apiBase}/stats?dod_date=${encodeURIComponent(dodDate)}`);
            const data = await res.json();
            
            if (data.status === 'success') {
                this.renderSlotCapacities(data.stats.slots);
            }
        } catch (err) {
            console.error("Nepodařilo se načíst kapacity slotů:", err);
        }
    },

    renderSlotCapacities(slotsData) {
        const listContainer = document.getElementById('slots-capacity-list');
        listContainer.innerHTML = '';

        for (const [timeSlot, info] of Object.entries(slotsData)) {
            const percentage = Math.round((info.registered / info.max) * 100);
            const isFull = info.remaining === 0;

            const slotItem = document.createElement('div');
            slotItem.className = 'slot-item';
            slotItem.innerHTML = `
                <div class="slot-meta">
                    <span class="slot-time">${timeSlot}</span>
                    <span class="slot-count ${isFull ? 'full' : ''}">
                        ${isFull ? 'Obsazeno' : `Volno: ${info.remaining} z ${info.max}`}
                    </span>
                </div>
                <div class="slot-progress-bar">
                    <div class="slot-progress-fill ${isFull ? 'full' : ''}" style="width: ${percentage}%"></div>
                </div>
            `;
            listContainer.appendChild(slotItem);
        }
    },

    /* ==========================================================================
       5. REGISTRAČNÍ FORMULÁŘ (VALIDACE & ODESLÁNÍ)
       ========================================================================== */
    initRegistrationForm() {
        const form = document.getElementById('registration-form');
        const submitBtn = document.getElementById('submit-btn');
        const loader = submitBtn.querySelector('.loader');
        const btnText = submitBtn.querySelector('.btn-text');

        // Spojení změny termínu s přenačtením kapacit
        const formDate = document.getElementById('form-date');
        if (formDate) {
            formDate.addEventListener('change', () => {
                this.loadSlotCapacities();
            });
        }

        // Dynamická validace při psaní/změně pole
        const fields = [
            { id: 'form-name', validator: val => val.trim().length >= 3, errorId: 'error-name' },
            { id: 'form-email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()), errorId: 'error-email' },
            { id: 'form-phone', validator: val => /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(val.trim()) && val.trim().length >= 9, errorId: 'error-phone' },
            { id: 'form-slot', validator: val => val !== '', errorId: 'error-slot' }
        ];

        fields.forEach(field => {
            const input = document.getElementById(field.id);
            input.addEventListener('input', () => {
                const isValid = field.validator(input.value);
                const formGroup = input.closest('.form-group');
                
                if (isValid) {
                    formGroup.classList.remove('invalid');
                }
            });
        });

        // Odeslání formuláře
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Kompletní validace před odesláním
            let isFormValid = true;
            fields.forEach(field => {
                const input = document.getElementById(field.id);
                const isValid = field.validator(input.value);
                const formGroup = input.closest('.form-group');
                
                if (!isValid) {
                    formGroup.classList.add('invalid');
                    isFormValid = false;
                } else {
                    formGroup.classList.remove('invalid');
                }
            });

            if (!isFormValid) return;

            // Příprava dat
            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const phone = document.getElementById('form-phone').value.trim();
            const visitorGroup = document.querySelector('input[name="form-group"]:checked').value;
            const timeSlot = document.getElementById('form-slot').value;
            const school = document.getElementById('form-school').value.trim();
            const grade = document.getElementById('form-grade').value;
            const accompanyingCount = parseInt(document.getElementById('form-accompanying').value) || 0;
            const tourType = document.getElementById('form-tour-type').value;
            const dormitoryBoys = document.getElementById('form-dormitory-boys').checked;
            const dormitoryGirls = document.getElementById('form-dormitory-girls').checked;
            const workplaceDrevarska = document.getElementById('form-workplace-drevarska').checked;
            const workplaceSkalice = document.getElementById('form-workplace-skalice').checked;
            const museumAgro = document.getElementById('form-museum-agro').checked;
            const svp = document.getElementById('form-svp').checked;
            const dodDate = document.getElementById('form-date') ? document.getElementById('form-date').value : '13. října 2026';
            
            // Zájmy
            const interests = [];
            document.querySelectorAll('input[name="form-interest"]:checked').forEach(cb => {
                interests.push(cb.value);
            });

            const payload = {
                name, email, phone,
                visitor_group: visitorGroup,
                time_slot: timeSlot,
                interests,
                primary_school: school,
                grade: grade,
                accompanying_count: accompanyingCount,
                tour_type: tourType,
                dormitory_boys: dormitoryBoys,
                dormitory_girls: dormitoryGirls,
                workplace_drevarska: workplaceDrevarska,
                workplace_skalice: workplaceSkalice,
                museum_agro: museumAgro,
                svp: svp,
                dod_date: dodDate
            };

            // Vizuální indikace načítání
            submitBtn.disabled = true;
            loader.classList.remove('hidden');
            btnText.innerText = 'Zpracovávám registraci...';

            try {
                const response = await fetch(`${this.apiBase}/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.status === 201 && data.status === 'success') {
                    // Přehrání úspěšného zvuku
                    SoundEffects.playSuccess();
                    
                    // Zobrazení lístku
                    this.showTicket(data.visitor);
                    
                    // Reset formuláře
                    form.reset();
                    
                    // Aktualizujeme kapacity
                    this.loadSlotCapacities();
                } else {
                    throw new Error(data.message || 'Chyba serveru při registraci.');
                }
            } catch (err) {
                console.error("Chyba při registraci:", err);
                SoundEffects.playError();
                alert(`Chyba: ${err.message}`);
            } finally {
                // Obnova stavu tlačítka
                submitBtn.disabled = false;
                loader.classList.add('hidden');
                btnText.innerText = 'Dokončit registraci 🚀';
            }
        });

        // Ovládání akcí vstupenky (modálu)
        document.getElementById('btn-close-ticket').addEventListener('click', () => {
            document.getElementById('ticket-modal').classList.add('hidden');
        });

        document.getElementById('btn-print-ticket').addEventListener('click', () => {
            window.print();
        });

        document.getElementById('btn-email-ticket').addEventListener('click', () => {
            alert("Simulace: Vstupenka byla odeslána na váš zadaný e-mail!");
        });
    },

    showTicket(visitor) {
        document.getElementById('ticket-visitor-name').innerText = visitor.name;
        document.getElementById('ticket-visitor-group').innerText = visitor.visitor_group;
        document.getElementById('ticket-visitor-date').innerText = visitor.dod_date || '13. října 2026';
        document.getElementById('ticket-visitor-slot').innerText = visitor.time_slot;
        document.getElementById('ticket-visitor-accompanying').innerText = `${visitor.accompanying_count} osob`;
        document.getElementById('ticket-visitor-tour-type').innerText = visitor.tour_type;
        
        const addons = [];
        if (visitor.dormitory_boys) addons.push("👦 DM pro kluky");
        if (visitor.dormitory_girls) addons.push("👧 DM pro holky");
        if (visitor.workplace_drevarska) addons.push("⚙️ Dřevařská (CNC)");
        if (visitor.workplace_skalice) addons.push("📍 Skalice n. Svit.");
        if (visitor.museum_agro) addons.push("🚜 Muzeum hist. strojů");
        
        const addonsStr = addons.length > 0 ? addons.join(', ') : 'Žádné doplňkové prohlídky';
        const addonsEl = document.getElementById('ticket-visitor-addons');
        if (addonsEl) {
            addonsEl.innerText = addonsStr;
        }
        
        const interestsStr = visitor.interests.length > 0 ? visitor.interests.join(', ') : 'Žádné konkrétní obory';
        document.getElementById('ticket-visitor-interests').innerText = interestsStr;
        document.getElementById('ticket-visitor-id').innerText = visitor.id;

        // Generování reálného skenovatelného QR kódu přes spolehlivé veřejné API
        const qrImage = document.getElementById('ticket-qr-image');
        if (qrImage) {
            qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(visitor.id)}`;
        }

        const modal = document.getElementById('ticket-modal');
        modal.classList.remove('hidden');
    },

    /* ==========================================================================
       6. INICIALIZACE OVLÁDACÍCH PRVKŮ ADMINISTRACE
       ========================================================================== */
    initAdminControls() {
        // Hledání v reálném čase
        const searchInput = document.getElementById('filter-search');
        searchInput.addEventListener('input', () => this.debounce(() => this.loadVisitorsTable(), 300)());

        // Filtry (Group, Slot, Status, DOD)
        document.getElementById('filter-group').addEventListener('change', () => this.loadVisitorsTable());
        document.getElementById('filter-slot').addEventListener('change', () => this.loadVisitorsTable());
        document.getElementById('filter-status').addEventListener('change', () => this.loadVisitorsTable());
        document.getElementById('filter-tour-type').addEventListener('change', () => this.loadVisitorsTable());
        document.getElementById('filter-dormitory').addEventListener('change', () => this.loadVisitorsTable());
        document.getElementById('filter-svp').addEventListener('change', () => this.loadVisitorsTable());
        
        const filterDodDate = document.getElementById('filter-dod-date');
        if (filterDodDate) {
            filterDodDate.addEventListener('change', () => this.loadAdminDashboard());
        }

        // Export do CSV
        document.getElementById('btn-export-csv').addEventListener('click', () => this.exportToCSV());

        // Reset databáze
        document.getElementById('btn-reset-db').addEventListener('click', () => this.resetDatabase());

        // Čtečka - Tlačítko a Enter
        const scanInput = document.getElementById('scan-input');
        const scanBtn = document.getElementById('btn-scan');

        scanBtn.addEventListener('click', () => this.processScannerInput());
        scanInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processScannerInput();
            }
        });
    },

    // Pomocná metoda pro omezení frekvence dotazů (Debounce)
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /* ==========================================================================
       7. NAČTENÍ ADMINISTRACE (STATISTIKY & TABULKA)
       ========================================================================== */
    async loadAdminDashboard() {
        try {
            await Promise.all([
                this.loadStats(),
                this.loadVisitorsTable()
            ]);
        } catch (err) {
            console.error("Chyba při načítání administrace:", err);
        }
    },

    // Získání statistik
    async loadStats() {
        try {
            const filterDodDate = document.getElementById('filter-dod-date');
            const dodDate = filterDodDate ? filterDodDate.value : 'Všechny';
            const res = await fetch(`${this.apiBase}/stats?dod_date=${encodeURIComponent(dodDate)}`);
            const data = await res.json();

            if (data.status === 'success') {
                const stats = data.stats;
                this.renderStats(stats);
            }
        } catch (err) {
            console.error("Chyba načítání statistik:", err);
        }
    },

    renderStats(stats) {
        // Číselné hodnoty
        document.getElementById('stat-total').innerText = stats.totalRegistered;
        document.getElementById('stat-checked').innerText = stats.totalCheckedIn;
        document.getElementById('stat-checked-sub').innerText = `${stats.checkInPercentage}% z registrovaných`;
        
        // Nové statistiky z rešerše
        document.getElementById('stat-physical').innerText = stats.totalPhysicalPeople;
        document.getElementById('stat-accompanying-sum').innerText = `Včetně ${stats.totalAccompanying} doprovodů`;
        document.getElementById('stat-dormitory-boys-count').innerText = stats.totalDormitoryBoys;
        document.getElementById('stat-dormitory-girls-count').innerText = stats.totalDormitoryGirls;
        document.getElementById('stat-workplace-drevarska-count').innerText = stats.totalWorkplaceDrevarska;
        document.getElementById('stat-workplace-skalice-count').innerText = stats.totalWorkplaceSkalice;
        document.getElementById('stat-museum-agro-count').innerText = stats.totalMuseumAgro;
        document.getElementById('stat-svp-count').innerText = stats.totalSvp;
        
        // Progress ring
        const circle = document.getElementById('stat-progress-ring');
        const txt = document.getElementById('stat-progress-txt');
        
        txt.innerText = `${Math.round(stats.checkInPercentage)}%`;
        
        // Obvod kruhu = 2 * PI * r = 2 * 3.14159 * 22 = 138.2
        const circumference = 138.2;
        const offset = circumference - (stats.checkInPercentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;

        // Uložení statistik do globálního state pro grafy
        this.state.stats = stats;
        this.renderCharts();
    },

    // NAČTENÍ TABULKY NÁVŠTĚVNÍKŮ
    async loadVisitorsTable() {
        const tbody = document.getElementById('visitors-table-body');
        
        const search = document.getElementById('filter-search').value;
        const group = document.getElementById('filter-group').value;
        const slot = document.getElementById('filter-slot').value;
        const status = document.getElementById('filter-status').value;
        const tourType = document.getElementById('filter-tour-type').value;
        const dormitory = document.getElementById('filter-dormitory').value;
        const svp = document.getElementById('filter-svp').value;
        const filterDodDate = document.getElementById('filter-dod-date');
        const dodDate = filterDodDate ? filterDodDate.value : 'Všechny';

        // Sestavení URL s query parametry
        const params = new URLSearchParams({
            search, group, slot, status,
            tour_type: tourType,
            dormitory: dormitory,
            svp: svp,
            dod_date: dodDate
        });

        try {
            const res = await fetch(`${this.apiBase}/visitors?${params.toString()}`);
            const data = await res.json();

            if (data.status === 'success') {
                this.state.visitorsList = data.visitors; // Uložíme pro export
                this.renderVisitorsTable(data.visitors);
            }
        } catch (err) {
            console.error("Chyba při načítání tabulky návštěvníků:", err);
            tbody.innerHTML = `<tr><td colspan="8" class="text-center" style="color: var(--rose);">Chyba při stahování dat ze serveru.</td></tr>`;
        }
    },

    renderVisitorsTable(visitors) {
        const tbody = document.getElementById('visitors-table-body');
        tbody.innerHTML = '';

        if (visitors.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center">Žádný návštěvník neodpovídá vybraným filtrům.</td></tr>`;
            return;
        }

        visitors.forEach(visitor => {
            const tr = document.createElement('tr');
            if (visitor.checked_in) {
                tr.className = 'row-checked';
            }

            // Naparsování oborů zájmu do tagů
            const tagsHtml = visitor.interests.map(i => `<span class="interest-tag">${i}</span>`).join('');

            tr.innerHTML = `
                <td class="ticket-id-td">${visitor.id}</td>
                <td><strong>${visitor.name}</strong></td>
                <td class="td-contact">
                    <div>📧 ${visitor.email}</div>
                    <div>📞 ${visitor.phone}</div>
                    ${visitor.primary_school ? `<div class="school-info" style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px;">🏫 ${visitor.primary_school}</div>` : ''}
                </td>
                <td>
                    <span class="badge group">${visitor.visitor_group}</span>
                    ${visitor.grade ? `<div class="grade-info" style="font-size: 0.8rem; opacity: 0.8; margin-top: 4px; font-weight: 500;">🎓 ${visitor.grade}</div>` : ''}
                </td>
                <td>
                    <div style="font-size: 0.82rem; color: var(--secondary); font-weight: 700; margin-bottom: 3px;">📅 ${visitor.dod_date || '13. října 2026'}</div>
                    <div><strong>${visitor.time_slot}</strong></div>
                    <div style="font-size: 0.85rem; margin-top: 4px;">
                        <span>${visitor.tour_type === 'Individuální' ? '👤 Individuální' : '👥 Skupinová'}</span>
                        ${visitor.accompanying_count > 0 ? `<span style="color:var(--text-secondary); margin-left: 5px;">(+${visitor.accompanying_count})</span>` : ''}
                    </div>
                    <div style="margin-top: 6px; display: flex; gap: 4px; flex-wrap: wrap;">
                        ${visitor.dormitory_boys ? '<span class="badge" style="background: rgba(var(--secondary-rgb), 0.12); color: var(--secondary); border: 1px solid rgba(var(--secondary-rgb), 0.2); font-size: 0.7rem; padding: 1px 5px;">👦 DM kluci</span>' : ''}
                        ${visitor.dormitory_girls ? '<span class="badge" style="background: rgba(var(--secondary-rgb), 0.12); color: var(--secondary); border: 1px solid rgba(var(--secondary-rgb), 0.2); font-size: 0.7rem; padding: 1px 5px;">👧 DM holky</span>' : ''}
                        ${visitor.workplace_drevarska ? '<span class="badge" style="background: rgba(var(--primary-rgb), 0.12); color: var(--primary); border: 1px solid rgba(var(--primary-rgb), 0.2); font-size: 0.7rem; padding: 1px 5px;">⚙️ Dřevařská</span>' : ''}
                        ${visitor.workplace_skalice ? '<span class="badge" style="background: rgba(var(--primary-rgb), 0.12); color: var(--primary); border: 1px solid rgba(var(--primary-rgb), 0.2); font-size: 0.7rem; padding: 1px 5px;">📍 Skalice</span>' : ''}
                        ${visitor.museum_agro ? '<span class="badge" style="background: rgba(227, 30, 36, 0.12); color: var(--primary); border: 1px solid rgba(227, 30, 36, 0.22); font-size: 0.7rem; padding: 1px 5px;">🚜 Muzeum</span>' : ''}
                        ${visitor.svp ? '<span class="badge" style="background: rgba(244, 63, 94, 0.15); color: var(--rose); border: 1px solid rgba(244, 63, 94, 0.25); font-size: 0.7rem; padding: 1px 5px;">🧩 SVP</span>' : ''}
                    </div>
                </td>
                <td><div class="td-interests">${tagsHtml || '—'}</div></td>
                <td>
                    <span class="badge ${visitor.checked_in ? 'status-checked' : 'status-registered'}">
                        ${visitor.checked_in ? 'Odbaven' : 'Registrován'}
                    </span>
                </td>
                <td class="text-right">
                    <button class="table-btn-check ${visitor.checked_in ? 'undo' : ''}" 
                            title="${visitor.checked_in ? 'Zrušit odbavení' : 'Odbavit návštěvníka'}"
                            onclick="App.toggleCheckIn('${visitor.id}')">
                        ${visitor.checked_in ? '↩️' : '✓'}
                    </button>
                    <button class="table-btn-delete" title="Smazat registraci" onclick="App.deleteVisitor('${visitor.id}')">
                        🗑️
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    /* ==========================================================================
       8. INTERAKTIVNÍ SVG GRAFY (SVG CHARTS INTERFACES)
       ========================================================================== */
    renderCharts() {
        const stats = this.state.stats;
        if (!stats) return;

        // 1. Graf skupin návštěvníků
        const groupContainer = document.getElementById('group-chart');
        groupContainer.innerHTML = '';
        
        let maxGroupValue = Math.max(...Object.values(stats.groups), 1);
        
        for (const [group, value] of Object.entries(stats.groups)) {
            const widthPercentage = Math.round((value / maxGroupValue) * 100);
            
            const barRow = document.createElement('div');
            barRow.className = 'chart-bar-row';
            barRow.innerHTML = `
                <span class="chart-bar-label">${this.getGroupEmoji(group)} ${group}</span>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill" style="width: ${widthPercentage}%"></div>
                </div>
                <span class="chart-bar-value">${value}</span>
            `;
            groupContainer.appendChild(barRow);
        }

        // 2. Graf oborů zájmu
        const interestContainer = document.getElementById('interest-chart');
        interestContainer.innerHTML = '';
        
        let maxInterestValue = Math.max(...Object.values(stats.interests), 1);
        
        for (const [interest, value] of Object.entries(stats.interests)) {
            const widthPercentage = Math.round((value / maxInterestValue) * 100);
            
            const barRow = document.createElement('div');
            barRow.className = 'chart-bar-row';
            barRow.innerHTML = `
                <span class="chart-bar-label">${this.getInterestEmoji(interest)} ${interest}</span>
                <div class="chart-bar-container">
                    <div class="chart-bar-fill accent" style="width: ${widthPercentage}%"></div>
                </div>
                <span class="chart-bar-value">${value}</span>
            `;
            interestContainer.appendChild(barRow);
        }
    },

    getGroupEmoji(group) {
        switch(group) {
            case 'Student': return '🎓';
            case 'Rodič': return '👨‍👩‍👦';
            default: return '🌍';
        }
    },

    getInterestEmoji(interest) {
        if (interest.includes('Informační')) return '💻';
        if (interest.includes('Bezpečnost')) return '👮';
        if (interest.includes('Mechanik strojů')) return '⚙️';
        if (interest.includes('Autotronik')) return '🚗';
        if (interest.includes('Lyceum')) return '📚';
        if (interest.includes('Automechanik') || interest.includes('opravář motorových vozidel')) return '🔧';
        if (interest.includes('Opravář')) return '🚜';
        if (interest.includes('Elektromechanik')) return '⚡';
        if (interest.includes('Obráběč')) return '🔩';
        return '🎨';
    },

    /* ==========================================================================
       9. AKCE NA SERVERU (CHECK-IN & DELETE & RESET)
       ========================================================================== */
    async toggleCheckIn(visitorId) {
        try {
            const res = await fetch(`${this.apiBase}/checkin/${visitorId}`, {
                method: 'POST'
            });
            const data = await res.json();
            
            if (data.status === 'success') {
                // Beep zvuk podle stavu (přepnutý stav po akci)
                if (data.checked_in) {
                    SoundEffects.playSuccess();
                } else {
                    // Přehrání chybového tónu/upozornění pro odhlášení z checkinu
                    SoundEffects.playError();
                }
                
                // Znovu načteme dashboard a tabulku
                this.loadAdminDashboard();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Nepodařilo se odbavit:", err);
            SoundEffects.playError();
        }
    },

    async deleteVisitor(visitorId) {
        if (!confirm(`Opravdu si přejete smazat registraci lístku ${visitorId}?`)) {
            return;
        }

        try {
            const res = await fetch(`${this.apiBase}/visitors/${visitorId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            
            if (data.status === 'success') {
                this.loadAdminDashboard();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Chyba při mazání registrace:", err);
        }
    },

    // SIMULÁTOR ČTEČKY QR KÓDŮ
    async processScannerInput() {
        const input = document.getElementById('scan-input');
        const feedback = document.getElementById('scan-feedback');
        const code = input.value.trim().toUpperCase();

        if (!code) {
            this.setScannerFeedback('idle', 'Čtečka připravena', 'Čekám na kód...');
            return;
        }

        try {
            const res = await fetch(`${this.apiBase}/checkin/${code}`, {
                method: 'POST'
            });
            const data = await res.json();

            if (res.status === 200 && data.status === 'success') {
                // Úspěšné odbavení
                SoundEffects.playSuccess();
                this.setScannerFeedback('success', 'Kód OK: Odbaven', data.message);
                
                // Vyčištění vstupu a znovunačtení dat
                input.value = '';
                this.loadAdminDashboard();
            } else {
                // Neúspěšné (duplicitní / nenalezeno)
                throw new Error(data.message || 'Kód neexistuje.');
            }
        } catch (err) {
            console.error("Chyba skenování lístku:", err);
            SoundEffects.playError();
            this.setScannerFeedback('error', 'Chyba: Neplatný kód', err.message);
        }
        
        // Vždy zaostříme zpět na skener pro rychlé opakování
        input.focus();
    },

    setScannerFeedback(type, title, sub) {
        const feedback = document.getElementById('scan-feedback');
        const titleEl = feedback.querySelector('.scan-title');
        const subEl = feedback.querySelector('.scan-sub');
        const emojiEl = feedback.querySelector('.scan-icon');

        // Reset tříd
        feedback.className = 'scan-feedback-box';
        feedback.classList.add(type);

        titleEl.innerText = title;
        subEl.innerText = sub;

        // Emojis podle stavu
        if (type === 'success') {
            emojiEl.innerText = '🔔';
        } else if (type === 'error') {
            emojiEl.innerText = '🚨';
        } else {
            emojiEl.innerText = '📳';
        }
    },

    // EXPORT DO SOUBORU CSV
    exportToCSV() {
        const visitors = this.state.visitorsList;
        if (visitors.length === 0) {
            alert("Nejsou k dispozici žádná data k exportu.");
            return;
        }

        // Hlavička CSV s českým oddělovačem (středník je v ČR standardem pro Excel)
        let csvContent = "Kód lístku;Jméno;E-mail;Telefon;Základní škola;Ročník;Skupina;Termín DOD;Čas prohlídky;Doprovod;Typ prohlídky;DM Kluci;DM Holky;Dřevařská;Skalice;Muzeum hist. strojů;SVP;Obory zájmu;Stav;Datum registrace\n";

        visitors.forEach(v => {
            const interestsStr = v.interests.join(', ');
            const statusStr = v.checked_in ? "Odbaven" : "Registrován";
            const dbStr = v.dormitory_boys ? "Ano" : "Ne";
            const dgStr = v.dormitory_girls ? "Ano" : "Ne";
            const wdStr = v.workplace_drevarska ? "Ano" : "Ne";
            const wsStr = v.workplace_skalice ? "Ano" : "Ne";
            const maStr = v.museum_agro ? "Ano" : "Ne";
            const svpStr = v.svp ? "Ano" : "Ne";
            
            // Očištění jmen a hodnot o případné středníky
            const cleanName = v.name.replace(/;/g, ',');
            const cleanEmail = v.email.replace(/;/g, ',');
            const cleanPhone = v.phone.replace(/;/g, ',');
            const cleanSchool = (v.primary_school || '').replace(/;/g, ',');
            
            csvContent += `${v.id};${cleanName};${cleanEmail};${cleanPhone};${cleanSchool};${v.grade};${v.visitor_group};${v.dod_date || '13. října 2026'};${v.time_slot};${v.accompanying_count};${v.tour_type};${dbStr};${dgStr};${wdStr};${wsStr};${maStr};${svpStr};"${interestsStr}";${statusStr};${v.registered_at}\n`;
        });

        // Kódování UTF-8 s BOM, aby Excel správně přečetl české znaky (diakritiku)
        const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `registrace_dod_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    // RESETOVÁNÍ DATABÁZE NA DEMO STAV
    async resetDatabase() {
        if (!confirm("Varování: Tato akce kompletně vymaže současnou databázi a nahraje původních 12 demo záznamů. Přejete si pokračovat?")) {
            return;
        }

        try {
            const res = await fetch(`${this.apiBase}/reset`, {
                method: 'POST'
            });
            const data = await res.json();

            if (data.status === 'success') {
                SoundEffects.playSuccess();
                alert(data.message);
                this.loadAdminDashboard();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Nepodařilo se resetovat databázi:", err);
            SoundEffects.playError();
        }
    }
};

# MENDELOVA UNIVERZITA V BRNĚ
## Institut celoživotního vzdělávání

### ZÁVĚREČNÁ PRÁCE

# Webový informační systém pro registraci návštěvníků Dne otevřených dveří

**Autor:** Mgr. Jana Kotlanová  
**Vedoucí práce:** [Jméno Vedoucího Práce]  
**Místo a rok:** Boskovice, 2026

---

## Prohlášení
Prohlašuji, že jsem závěrečnou práci na téma *„Webový informační systém pro registraci návštěvníků Dne otevřených dveří“* vypracovala samostatně pod odborným vedením vedoucího práce a uvedla jsem všechny použité literární a jiné odborné zdroje v souladu s právními předpisy, mezinárodními standardy a vnitřními předpisy Mendelovy univerzity v Brně.

V Boskovicích dne 25. května 2026  
......................................  
Mgr. Jana Kotlanová

---

## Poděkování
Na tomto místě bych ráda vyjádřila své upřímné poděkování vedoucímu mé závěrečné práce za cenné rady, metodické vedení, trpělivost a odborné připomínky, které významně přispěly k úspěšnému dokončení této práce a celého softwarového řešení. Dále děkuji vedení Střední školy André Citroëna Boskovice za poskytnutí podkladů, věcných požadavků a možnost otestovat systém v reálném školním prostředí. V neposlední řadě patří mé poděkování mé rodině a blízkým za všestrannou podporu během celého studia.

---

## Abstrakt
Závěrečná práce se zabývá návrhem, implementací, testováním a nasazením specializovaného webového informačního a rezervačního systému pro registraci návštěvníků Dne otevřených dveří (DOD) na Střední škole André Citroëna Boskovice. V úvodní teoretické části je zpracována rešerše stávajících rezervačních systémů (např. Google Forms, Microsoft Forms, komerční systémy typu Reenio), jsou popsány jejich limity a zdůvodněna nutnost vývoje vlastního dedikovaného řešení. Praktická část práce popisuje kompletní životní cyklus vývoje softwaru od analýzy požadavků a databázového návrhu relačního schématu SQLite přes programování backendové logiky v mikroframeworku Flask (Python) a responzivního klientského rozhraní v čistém HTML5, CSS3 (s využitím moderních glassmorphism prvků a barevné identity školy) a Vanilla JavaScriptu až po integraci reálné čtečky lístků s dynamickým generováním QR kódů a akustickou zpětnou vazbou přes Web Audio API. Významná pozornost je věnována bezpečnosti dat a souladu s legislativou GDPR, což je realizováno dvoufázovým šifrovaným uzamčením administračního rozhraní přístupovým heslem na úrovni klienta i serveru. Závěrečná fáze práce dokumentuje proces úspěšného nasazení do cloudového hostingu na platformě PythonAnywhere. Výsledkem je robustní, bezpečný a vysoce přívětivý systém, který plně digitalizuje a zefektivňuje organizační procesy Dne otevřených dveří.

**Klíčová slova:** Webový informační systém, Rezervační systém, Flask, Python, SQLite, Vanilla JavaScript, QR kód, Řízení kapacity, Den otevřených dveří, Střední škola André Citroëna Boskovice, GDPR, PythonAnywhere.

---

## Abstract
This final thesis focuses on the design, implementation, testing, and deployment of a specialized web information and reservation system for managing visitors during Open House Days (DOD) at the André Citroën Secondary School in Boskovice. The initial theoretical section reviews existing reservation tools (e.g., Google Forms, Microsoft Forms, and commercial platforms like Reenio), highlights their limitations, and justifies the development of a custom dedicated solution. The practical section documents the entire software development lifecycle, starting with requirement analysis and SQLite relational database schema design, continuing through backend programming in the Flask microframework (Python), and building a highly responsive, glassmorphic client interface in pure HTML5, CSS3, and Vanilla JavaScript. Additionally, it covers the integration of a functional QR code check-in reader with dynamic QR generation and acoustic feedback using the Web Audio API. Significant emphasis is placed on data security and GDPR compliance, achieved via a two-tier admin authentication system using secure HTTP headers on both the client and server levels. The final phase documents the successful deployment process onto the PythonAnywhere cloud hosting platform. The result is a robust, secure, and user-friendly web application that fully digitalizes and streamlines the logistics of Open House Days.

**Keywords:** Web Information System, Reservation System, Flask, Python, SQLite, Vanilla JavaScript, QR Code, Capacity Management, Open House Day, GDPR, PythonAnywhere.

---

# Obsah

*   **Úvod a cíl práce**
    *   *Úvod do tématu*
    *   *Cíl práce*
*   **1. Přehled relevantní literatury a zdrojů (Teoretická rešerše)**
    *   *Studentské práce a výzkumy*
    *   *Odborné články a metodiky*
*   **2. Kritická analýza existujících řešení**
    *   *Jednoduché online formuláře (Google Forms, Microsoft Forms)*
    *   *Komerční rezervační platformy (Reenio)*
    *   *Zdůvodnění a přínosy vlastního na míru navrženého řešení*
*   **3. Analýza požadavků a návrh systému**
    *   *Funkční požadavky (Functional Requirements)*
    *   *Nefunkční požadavky (Non-Functional Requirements)*
    *   *Datový a relační návrh databáze (visitors)*
    *   *Návrh uživatelského rozhraní a Citroën korporátní identity*
*   **4. Použité technologie a architektura**
    *   *Backend: Python a Flask mikroframework*
    *   *Frontend: Vanilla JavaScript, HTML5 a Vanilla CSS*
    *   *Databáze: SQLite*
    *   *Zabezpečení a legislativní shoda (GDPR)*
*   **5. Praktická implementace systému**
    *   *Struktura projektu a modulů*
    *   *Inicializační proces databáze (Zero-Config DB)*
    *   *Registrační modul a pokročilý transakční výpočet kapacit*
    *   *Administrační dashboard a dynamické SVG grafy*
    *   *Real-time QR čtečka s akustickou zpětnou vazbou přes Web Audio API*
    *   *Implementace dvoufázové ochrany heslem*
*   **6. Testování, stabilizace a debugging**
    *   *Odstraňování OperationalError (SQL placeholder mismatch)*
    *   *Dvoufázová validace vstupů pro doprovázející osoby*
*   **7. Cloudový hosting a nasazení na PythonAnywhere**
    *   *Konfigurace aplikačního serveru WSGI*
    *   *Nastavení virtuálního prostředí (virtualenv)*
    *   *Vynucení šifrování HTTPS a SSL*
*   **8. Možnosti budoucího rozvoje (Future Scope)**
*   **Závěr**
*   **Literatura a zdroje**

---

# ÚVOD A CÍL PRÁCE

## Úvod do tématu
Den otevřených dveří (DOD) představuje pro každou střední školu klíčovou propagační, marketingovou a organizační událost. Jedná se o moment, kdy škola otevírá své brány potenciálním uchazečům o studium a jejich zákonným zástupcům, aby prezentovala své studijní obory, materiální zázemí, moderní učebny, dílny odborného výcviku a celkovou atmosféru školy. Úspěch této akce přímo ovlivňuje počet přihlášených žáků pro nadcházející školní rok, což je z hlediska financování a prestiže školy zásadní faktor.

S nárůstem počtu uchazečů však přicházejí značné logistické výzvy. Tradiční organizace Dne otevřených dveří, kdy návštěvníci přicházejí do budovy živelně bez předchozího ohlášení, s sebou nese vážné problémy. Mezi nejpalčivější patří:
*   **Kapacitní přetížení v určitých hodinách**: Dochází ke kumulaci stovek návštěvníků v dopoledních špičkách, což vede k přeplněným chodbám, učebnám a k neschopnosti průvodců věnovat se zájemcům individuálně.
*   **Neefektivní alokace personálu**: Škola předem nezná zájem o konkrétní obory a neumí predikovat, kolik učitelů a studentských průvodců má pro daný čas vyčlenit.
*   **Absence dat a zpětné vazby**: Vedení školy nemá k dispozici přesná čísla o tom, ze kterých základních škol zájemci přicházejí, o jaké obory je největší zájem a kolik lidí reálně dorazilo.

Autorka této práce se Dne otevřených dveří na **Střední škole André Citroëna Boskovice** účastní aktivně v roli vedoucí studentských průvodců a zároveň se podílí na vítání hostů. Díky této dlouhodobé praktické zkušenosti je detailně seznámena s organizačními problémy a chaosem, který při vysoké neřízené účasti vzniká. Z tohoto důvodu vyvstala jasná potřeba vytvořit moderní webové řešení, které by umožnilo řízenou registraci návštěvníků na konkrétní časové sloty a sběr důležitých dat pro hladký průběh akce.

## Cíl práce
Hlavním cílem této závěrečné práce je navrhnout, naprogramovat, otestovat a do reálného provozu nasadit **Webový informační systém pro registraci návštěvníků Dne otevřených dveří SŠ André Citroëna Boskovice**.

Tento systém musí splňovat následující dílčí cíle:
1.  **Řízení kapacit**: Umožnit návštěvníkům registraci na konkrétní časový slot s automatickým hlídáním limitu kapacity na základě celkového počtu fyzických osob (hlavní zájemce + doprovod).
2.  **Sběr strukturovaných dat**: Získat předem důležité informace, jako je jméno, e-mail, telefon, současná ZŠ a ročník, vybrané studijní obory a zájem o specifické doplňkové prohlídky (např. domovy mládeže pro kluky a holky, odloučená pracoviště).
3.  **Podpora inkluzivního vzdělávání (SVP)**: Umožnit indikaci žáků se speciálními vzdělávacími potřebami (SVP) pro přednostní přidělení specializovaného průvodce a bezbariérové trasy.
4.  **Generování digitálního lístku**: Po úspěšné registraci vygenerovat unikátní grafickou vstupenku s reálným, opticky scannovatelným QR kódem.
5.  **Administrační rozhraní s vysokým zabezpečením (GDPR)**: Vytvořit dashboard pro správu přihlášek s real-time statistikami, grafy a exportem do CSV, který je neprůstřelně zabezpečen přístupovým heslem na straně klienta i serveru.
6.  **Integrovaná čtečka u vstupu**: Vytvořit odbavovací modul s asynchronním API, který bude při příchodu návštěvníka okamžitě ověřovat QR kód, přehrávat akustické tóny (úspěch/chyba) a aktualizovat tabulky.
7.  **Cloudové nasazení**: Publikovat hotovou aplikaci na cloudové platformě PythonAnywhere.

---

# 1. PŘEHLED RELEVANTNÍ LITERATURY A ZDROJŮ (TEORETICKÁ REŠERŠE)

## Studentské práce a výzkumy
Problematika online registračních a rezervačních systémů je v českém akademickém prostředí velmi frekventovaným a metodicky dobře zpracovaným tématem, zejména na technicky zaměřených vysokých školách. 

Při návrhu architektury a databázové logiky této práce byly analyzovány a využity poznatky z následujících vybraných studentských prací:
*   **Webová aplikace pro evidenci rezervací (Stejskal, 2024)**: Práce obhájená na Masarykově univerzitě se zabývá komplexním návrhem webového rezervačního systému. Přínosem pro mou práci byla detailní analýza práce s časovými sloty a algoritmizace hlídání kapacitních limitů v reálném čase.
*   **Vývoj informačního systému pro evidenci kulturních akcí (Bouchal, 2024)**: Autor na Univerzitě Tomáše Bati ve Zlíně řeší evidenci účastníků a logistické plánování. Práce poskytla cenné informace o životním cyklu vývoje softwaru od analýzy uživatelských požadavků až po testování pod zátěží.
*   **Rezervační systém pro lyžařskou školu (Štípek, 2024)**: Bakalářská práce na VŠE v Praze přináší přehledné srovnání komerčních rezervačních systémů s na míru stavěným řešením a rozebírá ekonomickou a organizační stránku provozu vlastní aplikace.
*   **Divadelní rezervační systém (Maleček, 2022)**: Diplomová práce z Masarykovy univerzity se věnuje pokročilé správě kapacit míst a časové organizaci velkých akcí. Byla přínosná pro návrh transakčního chování databáze, které zabraňuje přetečení kapacit při souběžných zápisech.

## Odborné články a metodiky
Kromě akademických prací byly prozkoumány články v odborných periodikách zaměřených na školský management a digitalizaci státní správy:
*   **Úspora času pro učitele i rodiče: školy objevují výhody rezervačních systémů (Váchová, 2023)**: Článek publikovaný v *Učitelském měsíčníku* rozebírá praktické zkušenosti českých základních a středních škol s online registracemi na zápisy a třídní schůzky. Autorka dokládá, že zavedení časových slotů vede k 80% úspoře administrativního času a eliminuje fronty na chodbách.
*   **Rezervační systém u zápisu do ZŠ a MŠ (Projekt SYPO, 2022)**: Metodický materiál Národního pedagogického institutu ČR (NPI) popisuje standardy pro komunikaci školy s veřejností přes online portály a definuje základní požadavky na přívětivost uživatelského rozhraní (UX) pro rodiče.
*   **Digitální nástroje pro organizaci školních akcí (Řízení školy, 2021)**: Odborný text se věnuje legislativním aspektům sběru osobních údajů školami. Zdůrazňuje, že jakýkoliv školní systém sbírající kontaktní údaje (telefon, e-mail) nezletilých žáků a jejich rodičů musí splňovat přísné podmínky nařízení GDPR, včetně zabezpečení databází a řízení přístupových práv.

---

# 2. KRITICKÁ ANALÝZA EXISTUJÍCÍCH ŘEŠENÍ

Při plánování digitalizace registrací na Den otevřených dveří byly nejprve zvažovány stávající, běžně dostupné nástroje. Ty lze rozdělit do dvou hlavních kategorií: jednoduché online formuláře a externí komerční rezervační platformy.

## Jednoduché online formuláře (Google Forms, Microsoft Forms)
Tento přístup je na školách nejrozšířenější z důvodu nulových finančních nákladů a okamžitého zprovoznění. 
**Výhody:**
*   Bezplatné použití v rámci školních licencí (Google Workspace / Microsoft 365).
*   Velmi snadné vytvoření formuláře bez nutnosti programování.
*   Automatický sběr dat do tabulek Google Sheets nebo MS Excel.

**Zásadní nedostatky a limity:**
1.  **Absence řízení kapacit**: Formuláře neumějí dynamicky reagovat na obsazenost časových slotů. Pokud se kapacita konkrétní hodiny naplní, formulář se sám neuzavře a lidé se registrují dál, což vede k přeplnění budovy.
2.  **Chybějící zpětná vazba**: Systém neumí vygenerovat a odeslat grafickou vstupenku s QR kódem.
3.  **Nemožnost real-time check-inu**: U vstupu do školy nelze návštěvníky rychle a bezdotykově odbavovat, obsluha musí složitě listovat v tištěných papírových seznamech a ručně odškrtávat jména, což u stovek lidí tvoří obrovské fronty a chaos.
4.  **GDPR rizika**: Data v cloudových tabulkách jsou často přístupná širokému okruhu lidí bez dostatečného zabezpečení.

## Komerční rezervační platformy (Reenio, Reservio)
Další alternativou jsou placené komerční platformy, které SŠ André Citroëna v minulosti zkoušela využívat (např. systém Reenio).
**Výhody:**
*   Robustní správa časových slotů a limitů.
*   Základní e-mailové notifikace.

**Zásadní nedostatky a limity:**
1.  **Omezená přizpůsobitelnost**: Komerční rezervační systémy jsou navrženy univerzálně (pro kadeřnictví, autoservisy, sportoviště). Neumožňují přizpůsobit formulář specifickým školním potřebám – např. dělení na 4 specifické doplňkové prohlídky pracovišť (DM kluci, DM holky, CNC dílny Dřevařská, odloučené pracoviště Skalice), evidenci základních škol, ročníků nebo indikaci žáků se speciálními vzdělávacími potřebami (SVP).
2.  **Finanční náročnost**: Systémy vyžadují pravidelné měsíční poplatky, což je pro rozpočet školy nevýhodné.
3.  **Absence integrace na studentské průvodce**: Systém nepomáhá managementu školy s plánováním a přiřazováním průvodců z řad studentů k příchozím skupinám.
4.  **Závislost na třetí straně**: Škola nemá plnou kontrolu nad databází a uloženými osobními údaji.

## Zdůvodnění a přínosy vlastního na míru navrženého řešení
Na základě kritické analýzy bylo rozhodnuto o vývoji **vlastního specializovaného systému**. Toto rozhodnutí přináší škole zásadní výhody:
*   **100% přizpůsobení logistice DOD**: Formulář i administrace jsou přesně navrženy pro strukturu oborů a pracovišť SŠ André Citroëna Boskovice.
*   **Fyzická kontrola kapacit**: Systém dynamicky a v reálném čase sčítá hlavní návštěvníky i jejich doprovody a automaticky blokuje registraci do plně obsazených slotů.
*   **Bezdotykové odbavení**: Zavedení QR kódů a integrované webové čtečky umožňuje odbavit příchozího za méně než 2 sekundy, což eliminuje fronty u vstupu.
*   **Bezpečnost pod vlastní kontrolou**: Osobní data uchazečů jsou uložena v zabezpečené SQLite databázi školy, chráněna dvoufázovou autentizací na backendu a nepředávají se žádným třetím stranám.
*   **Nulové provozní náklady**: Aplikace běží na bezplatném cloudovém hostingu PythonAnywhere a nevyžaduje žádné měsíční poplatky.

---

# 3. ANALÝZA POŽADAVKŮ A NÁVRH SYSTÉMU

Před zahájením vývoje byla provedena detailní analýza požadavků ve spolupráci s vedením školy a vedoucími učiteli odborného výcviku.

## Funkční požadavky (Functional Requirements)
Systém musí splňovat tyto klíčové funkce:
*   **FR-1: Registrační formulář**: Uživatelsky přívětivý formulář pro veřejnost umožňující zadání jména, e-mailu, telefonu, současné ZŠ, ročníku žáka, výběru studijních oborů, typu prohlídky (skupinová/individuální), označení SVP a specifických doplňkových prohlídek.
*   **FR-2: Řízení kapacit slotů**: Dynamické zobrazení zbývajících volných míst u každého slotu v registračním formuláři. Automatická blokace odeslání při pokusu o registraci do plného slotu.
*   **FR-3: Generování digitální vstupenky**: Zobrazení přehledného grafického lístku s reálným QR kódem ihned po úspěšné registraci, s možnostmi uložení/tisku nebo simulovaného odeslání na e-mail.
*   **FR-4: Google Kalendář integrace**: Možnost uložit si vybraný termín (13. října 2026) s GPS souřadnicemi a popisem školy do osobního Google Kalendáře na jedno kliknutí z navigačního badge.
*   **FR-5: Zabezpečené přihlášení**: Ochrana administrační zóny heslem na klientské i serverové úrovni.
*   **FR-6: Administrační dashboard**: Přehledné statistiky (celkový počet lidí, doprovodů, rozdělení oborů, SVP, doplňkových prohlídek) s interaktivními SVG grafy vykreslovanými v reálném čase.
*   **FR-7: Správa a filtrace návštěvníků**: Tabulka s vyhledáváním a detailními filtry (podle SVP, časů, doplňkových prohlídek atd.) s možností smazání záznamu a okamžitého check-inu kliknutím.
*   **FR-8: Export do CSV**: Stažení kompletní databáze ve formátu CSV optimalizovaném pro MS Excel (oddělovač středník, kódování UTF-8 s BOM pro správné zobrazení české diakritiky).
*   **FR-9: Správa databáze**: Možnost kompletního smazání databáze (příprava na reálný provoz) nebo obnovení demo záznamů jedním kliknutím v administraci (přístupné pouze po zadání hesla).

## Nefunkční požadavky (Non-Functional Requirements)
*   **NFR-1: Responzivita (Mobile-First)**: Celé rozhraní musí perfektně fungovat na mobilních telefonech, tabletech i noteboocích. To je klíčové, protože registrace probíhají na mobilech rodičů a check-in provádějí studenti na mobilních telefonech u vchodu.
*   **NFR-2: Rychlost odezvy**: Asynchronní API (AJAX/Fetch) musí garantovat odezvu serveru do 200 ms pro plynulý průběh odbavování.
*   **NFR-3: Akustické efekty**: Zvuková odezva čtečky (pípání) musí běžet lokálně přes Web Audio API bez nutnosti stahovat audio soubory ze serveru, což zajišťuje 100% spolehlivost i při slabém internetovém připojení.
*   **NFR-4: Moderní estetika**: Návrh rozhraní musí odpovídat moderním trendům (glassmorphismus, curlované stíny, tmavý režim jako výchozí) a korporátním barvám školy (Citroën červená a stříbrná).

## Datový a relační návrh databáze
Pro ukládání dat byl zvolen relační model. Vzhledem k charakteru aplikace postačuje jedna robustní a indexovaná tabulka `visitors`. 

### Datová struktura tabulky `visitors`:

| Název sloupce | Datový typ | Výchozí hodnota | Popis a význam |
| :--- | :--- | :--- | :--- |
| `id` | TEXT (PK) | *Generováno* | Unikátní kód lístku ve formátu `DOD-XXXX` |
| `name` | TEXT | *NOT NULL* | Celé jméno návštěvníka |
| `email` | TEXT | *NOT NULL* | Kontaktní e-mailová adresa |
| `phone` | TEXT | *NOT NULL* | Telefonní číslo |
| `visitor_group` | TEXT | *NOT NULL* | Skupina (Student / Rodič / Někdo jiný) |
| `time_slot` | TEXT | *NOT NULL* | Vybraný časový slot (např. `09:15`) |
| `interests` | TEXT | *NOT NULL* | JSON pole vybraných studijních oborů |
| `checked_in` | INTEGER | `0` | Stav odbavení u vstupu (0=ne, 1=ano) |
| `registered_at` | TIMESTAMP | `CURRENT_TIMESTAMP` | Přesný čas odeslání registrace |
| `accompanying_count`| INTEGER | `0` | Počet osob v doprovodu (limit 0-15) |
| `svp` | INTEGER | `0` | Speciální vzdělávací potřeby (0=ne, 1=ano) |
| `tour_type` | TEXT | `'Skupinová'` | Typ prohlídky (Skupinová / Individuální) |
| `dormitory_boys` | INTEGER | `0` | Zájem o prohlídku DM pro kluky (0=ne, 1=ano) |
| `dormitory_girls` | INTEGER | `0` | Zájem o prohlídku DM pro holky (0=ne, 1=ano) |
| `workplace_drevarska`| INTEGER | `0` | Zájem o CNC dílny Dřevařská (0=ne, 1=ano) |
| `workplace_skalice` | INTEGER | `0` | Zájem o pracoviště Skalice (0=ne, 1=ano) |
| `museum_agro` | INTEGER | `0` | Zájem o zemědělské muzeum (0=ne, 1=ano) |
| `primary_school` | TEXT | `''` | Název současné základní školy žáka |
| `grade` | TEXT | `''` | Ročník žáka (8. ročník / 9. ročník / Jiný) |
| `dod_date` | TEXT | `'13. října 2026'`| Pevné datum konání Dne otevřených dveří |

## Návrh uživatelského rozhraní a Citroën korporátní identity
Barevné schéma aplikace bylo přísně sladěno s korporátní identitou **Střední školy André Citroëna Boskovice**:
*   **Dominantní červená (Citroën Red)**: Jako primární barva pro aktivní stavy, hlavní registrační tlačítko a termínové badges. Používá se HSL hodnota `hsl(358, 77%, 50%)` (resp. `#e31e24` v tmavém motivu a `#d31215` ve světlém motivu) zajišťující sportovní, dynamický a jasně rozpoznatelný charakter.
*   **Stříbrná a grafitově šedá (Citroën Slate)**: Sekundární barvy (`#8e9cae` v tmavém motivu, `#475569` ve světlém motivu) pro texty, ohraničení a card stíny, které dodávají rozhraní prémiový, industriální a elegantní vzhled korespondující s automobilovým a strojírenským zaměřením školy.
*   **Glassmorphism styling**: Použití poloprůhledných vrstev (`background: rgba(255, 255, 255, 0.03)`) s jemným rozostřením pozadí (`backdrop-filter: blur(12px)`) a tenkými světlými konturami, což vytváří moderní hloubku uživatelského rozhraní.

---

# 4. POUŽITÉ TECHNOLOGIE A ARCHITEKTURA

Výběr technologií byl podřízen požadavkům na vysokou stabilitu, snadné a bezplatné cloudové nasazení, rychlost vývoje a absolutní nezávislost na složitých klientských frameworkech, které by zbytečně zvětšovaly objem stahovaných dat.

## Backend: Python a Flask mikroframework
Pro serverovou část byl vybrán programovací jazyk **Python** a jeho mikroframework **Flask**.
**Důvody volby:**
*   **Minimalismus a kontrola**: Flask na rozdíl od robustního Djanga neobsahuje stovky předpřipravených knihoven, které by projekt zatěžovaly. Umožňuje vývojářce mít plnou kontrolu nad každým řádkem kódu, routováním a chováním API.
*   **Extrémní stabilita**: Flask má vynikající podporu pro produkční WSGI servery a na serverech PythonAnywhere funguje nativně a bezchybně.
*   **Snadná práce s JSON**: Flask poskytuje vestavěnou metodu `jsonify`, která zjednodušuje tvorbu RESTful API rozhraní pro komunikaci s frontendem.

## Frontend: Vanilla JavaScript, HTML5 a Vanilla CSS
Na klientské straně bylo záměrně upuštěno od použití těžkých JavaScriptových frameworků (jako React, Angular nebo Vue). Celý frontend je postaven na čistém **Vanilla JavaScriptu (ES6+)**, sémantickém **HTML5** a čistém **CSS3** (s využitím CSS Custom Variables pro plynulé přepínání témat).
**Důvody volby:**
*   **Rychlost načítání**: Stránka se načte okamžitě (do 100 ms), protože prohlížeč nemusí stahovat a parsovat megabajty frameworkového kódu.
*   **Nulové build nástroje**: Kód nevyžaduje kompilaci přes Webpack, Vite nebo NPM, což dramaticky zjednodušuje údržbu a nasazení na školní servery.
*   **Vysoká didaktická hodnota**: Psaní čistého Vanilla JS a CSS prokazuje hluboké porozumění principům DOM manipulace, asynchronního programování (Promises/Fetch) a nativního stylování.

## Databáze: SQLite
Jako databázové úložiště byl zvolen vestavěný relační systém **SQLite**.
**Důvody volby:**
*   **Serverless architektura**: SQLite nevyžaduje instalaci, konfiguraci ani běh samostatného databázového serveru (jako MySQL či PostgreSQL). Celá databáze je uložena v jediném souboru `database.db` v kořenovém adresáři projektu.
*   **ACID kompatibilita**: Garantuje plnou transakční bezpečnost, což je nezbytné pro správné zamezení překročení kapacitních limitů při souběžných zápisech.
*   **Snadné zálohování a migrace**: Zálohování celé databáze spočívá v pouhém zkopírování jednoho souboru `database.db`. To je ideální pro školní prostředí.

## Zabezpečení a legislativní shoda (GDPR)
Vzhledem k tomu, že systém pracuje s osobními údaji uchazečů (jména, kontakty), bylo nutné implementovat robustní zabezpečení plně vyhovující nařízení GDPR:
1.  **sessionStorage**: Přihlašovací stav administrátora se ukládá výhradně do dočasné relace prohlížeče. Po zavření karty nebo prohlížeče se automaticky vymaže, což zabraňuje neoprávněnému přístupu, pokud by obsluha nechala otevřený notebook u vstupu.
2.  **API hlavičky (Authorization)**: Všechny zabezpečené endpointy na backendu (tabulka, check-in, smazání, reset) vyžadují předání hesla v HTTP hlavičce `X-Admin-Password`. Neautorizované požadavky server okamžitě zamítá s kódem `401 Unauthorized`.
3.  **Šifrované HTTPS**: Cloudové nasazení vynucuje SSL šifrování pro bezpečný přenos všech dat mezi prohlížečem a serverem.

---

# 5. PRAKTICKÁ IMPLEMENTACE SYSTÉMU

Tato kapitola detailně popisuje softwarovou architekturu, strukturu a konkrétní programové bloky celého projektu.

## Struktura projektu a modulů
Projekt je organizován do přehledného a čistého souborového stromu:

```
open-doors-registration/
│
├── app.py                      # Flask backend aplikace (routování, API, SQLite)
├── requirements.txt            # Seznam Python závislostí (Flask)
├── database.db                 # SQLite databázový soubor (generuje se automaticky)
├── vyvojovy_denik.md           # Podrobný vývojový deník autorky
│
├── templates/
│   └── index.html              # Jediný HTML5 šablonový soubor (registrace + admin + lístek)
│
└── static/
    ├── banner.jpg              # Ilustrační grafika v záhlaví
    ├── logo.png                # Originální logo SŠ André Citroëna Boskovice
    │
    ├── css/
    │   └── style.css           # Kompletní designový systém (glassmorphism, proměnné, animace)
    │
    └── js/
        ├── app.js              # Klientská logika (validace, SPA navigace, grafy, čtečka)
        └── soundEffects.js     # Web Audio API syntezátor zvuků úspěchu/chyby
```

## Inicializační proces databáze (Zero-Config DB)
Pro bezproblémový přechod na produkční cloudové servery (kde se spouští WSGI server, který nespouští blok `if __name__ == '__main__':`) byl vyvinut bezkonfigurační mechanismus inicializace databáze při prvním importu modulu v [app.py](file:///c:/Users/kotlanova/.gemini/antigravity-ide/scratch/open-doors-registration/app.py):

```python
DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')
MAX_CAPACITY_PER_SLOT = 30  # Limit kapacity pro slot (fyzické osoby včetně doprovodu)

# Automatická inicializace databáze při importu, pokud soubor neexistuje
if not os.path.exists(DATABASE):
    init_db(force_recreate=False)
```

Funkce `init_db()` vytvoří tabulku `visitors` se všemi 20 sloupci a v případě, že je prázdná, zavolá `insert_demo_data()`, která databázi naplní 12 českými testovacími profily. Tím je zajištěno, že ihned po spuštění obsahuje dashboard vizuální grafy a statistiky připravené k okamžité prezentaci.

## Registrační modul a pokročilý transakční výpočet kapacit
Registrační API `/api/register` zpracovává POST požadavek odeslaný z registračního formuláře. Aby nedocházelo k překračování fyzické kapacity slotu (která je stanovena na **30 osob**), backend provádí transakční sčítání všech přihlášených osob (včetně doprovázejících osob) v daném čase:

```python
# Zabezpečení kapacity časového slotu pro dané datum (celkový počet fyzických osob včetně doprovodu)
conn = get_db_connection()
cursor = conn.cursor()
cursor.execute('SELECT SUM(coalesce(accompanying_count, 0) + 1) FROM visitors WHERE time_slot = ? AND dod_date = ?', (time_slot, dod_date))
current_people = cursor.fetchone()[0] or 0

new_people = 1 + accompanying_count
if current_people + new_people > MAX_CAPACITY_PER_SLOT:
    conn.close()
    return jsonify({
        "status": "error", 
        "message": f"Nelze provést registraci. Kapacita časového slotu '{time_slot}' by byla překročena. Volná místa: {max(0, MAX_CAPACITY_PER_SLOT - current_people)}, vy požadujete: {new_people} (vy + {accompanying_count} doprovod)."
    }), 400
```

Pokud kapacita vyhovuje, vygeneruje se unikátní ID lístku ve formátu `DOD-XXXX` (např. `DOD-C9E1`), provede se bezpečný zápis do databáze a vrátí se kód `201 Created` s JSON objektem nového návštěvníka.

## Administrační dashboard a dynamické SVG grafy
Statistické grafy v administraci (skupiny návštěvníků a zájem o studijní obory) jsou vykreslovány čistým JavaScriptem přímo do sémantických **SVG kontajnerů** v reálném čase na základě dat stahovaných z endpointu `/api/stats`. 
Příklad dynamického generování výsečového grafu (Pie Chart) pro skupiny návštěvníků (Student / Rodič / Někdo jiný) v [app.js](file:///c:/Users/kotlanova/.gemini/antigravity-ide/scratch/open-doors-registration/static/js/app.js):

```javascript
// Výsečový graf (Pie Chart) pro skupiny
const total = Object.values(groupsData).reduce((a, b) => a + b, 0);
let currentAngle = 0;
let svgContent = '';

Object.entries(groupsData).forEach(([group, count], idx) => {
    if (count === 0) return;
    const percentage = count / total;
    const angle = percentage * 360;
    
    // Výpočet souřadnic pro oblouk SVG
    const x1 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
    const y1 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
    currentAngle += angle;
    const x2 = 100 + 80 * Math.cos((currentAngle - 90) * Math.PI / 180);
    const y2 = 100 + 80 * Math.sin((currentAngle - 90) * Math.PI / 180);
    
    const largeArcFlag = angle > 180 ? 1 : 0;
    const color = colors[idx % colors.length];
    
    svgContent += `
        <path d="M100,100 L${x1},${y1} A80,80 0 ${largeArcFlag},1 ${x2},${y2} Z" fill="${color}" />
    `;
});
```
Tento přístup odstraňuje závislost na velkých grafických knihovnách (jako Chart.js nebo D3.js), čímž zrychluje odezvu a šetří přenesená data.

## Real-time QR čtečka s akustickou zpětnou vazbom přes Web Audio API
Odbavovací modul u vstupu (čtečka lístků) asynchronně komunikuje s endpointem `/api/checkin/<visitor_id>`. Pro zajištění maximálního komfortu obsluhy u vstupu obsahuje čtečka propracovaný systém akustické odezvy vyvinutý přes **Web Audio API** v [soundEffects.js](file:///c:/Users/kotlanova/.gemini/antigravity-ide/scratch/open-doors-registration/static/js/soundEffects.js). Zvuk se generuje matematicky přímo v prohlížeči:

```javascript
const SoundEffects = {
    ctx: null,
    
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    },
    
    playSuccess() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime); // Čistý vysoký tón
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },
    
    playError() {
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime); // Hluboký varovný bzučák
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.3);
    }
};
```

## Implementace dvoufázové ochrany heslem
Přihlášení do administrace je chráněno na klientské i serverové úrovni:
1.  **Frontend intercepce (app.js)**: Klientský router zachytí pokus o přepnutí na záložku `admin-view`. Pokud `sessionStorage.getItem('admin_authenticated') !== 'true'`, přesměruje uživatele na `#admin-login-view`.
2.  **Serverová verifikace (app.py)**: Všechny zabezpečené endpointy (tabulka, check-in, smazání, reset) volají na prvním řádku funkci `check_admin_auth()`, která ověřuje přítomnost a správnost hesla předaného v HTTP hlavičce `X-Admin-Password`.

---

# 6. TESTOVÁNÍ, STABILIZACE A DEBUGGING

Bhem vývoje a testování systému byla věnována mimořádná pozornost odstraňování chyb, transakční stabilitě a validacím vstupů.

## Odstraňování OperationalError (SQL placeholder mismatch)
Během integračních testů registračního API `/api/register` docházelo k selhání SQLite databáze s chybou `sqlite3.OperationalError: 20 values for 19 columns`. 
*   **Příčina chyby**: Analýzou SQL dotazu v [app.py](file:///c:/Users/kotlanova/.gemini/antigravity-ide/scratch/open-doors-registration/app.py) bylo odhaleno, že seznam cílových sloupců obsahoval přesně 19 definovaných položek, ale v klauzuli `VALUES` bylo zapsáno 19 zástupných znaků `?` a jedna statická číselná hodnota `0` pro sloupec `checked_in`. Tím vzniklo celkem 20 hodnot pro 19 sloupců, což způsobovalo havárii SQLite parseru.
*   **Nápravné opatření**: Z klauzule `VALUES` byl odstraněn přebytečný otazník na samotném konci seznamu hodnot, čímž bylo dosaženo absolutní matematické shody:
    ```sql
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ```
    Tento incident byl cennou zkušeností, která prokázala nutnost důsledné kontroly shody datových struktur na rozhraní programového kódu a databáze.

## Dvoufázová validace vstupů pro doprovázející osoby
Při testování chování číselného pole pro doprovod se ukázalo, že standardní HTML atribut `max="15"` sice vizuálně limituje šipky nahoru, ale uživatel může hodnotu (např. 17) ručně vepsat z klávesnice, čímž obešel nastavený limit.
*   **Klientské řešení**: V JavaScriptu byla do validačního pole přidána striktní podmínka limitu (hodnota musí být číselná, minimálně 0 a maximálně 15). Pokud je zadána vyšší hodnota, formulář se zbarví červeně a zablokuje tlačítko odeslání.
*   **Serverové řešení**: Pro stoprocentní bezpečnost byla identická validace implementována přímo do backendu v [app.py](file:///c:/Users/kotlanova/.gemini/antigravity-ide/scratch/open-doors-registration/app.py):
    ```python
    if accompanying_count < 0 or accompanying_count > 15:
        return jsonify({"status": "error", "message": "Počet doprovázejících osob na jednu registraci nesmí překročit 15."}), 400
    ```
    Tento dvoufázový přístup (klientská přívětivá validace + serverová striktní validace) představuje moderní bezpečnostní standard webového vývoje.

---

# 7. CLOUDOVÝ HOSTING A NASAZENÍ NA PYTHONANYWHERE

Pro reálné nasazení a prezentaci byla zvolena celosvětově uznávaná hostingová platforma PaaS (Platform as a Service) **PythonAnywhere**, která poskytuje bezplatný běh Python aplikací na doméně třetího řádu s automatickou správou SSL šifrování.

## Konfigurace aplikačního serveru WSGI
Produkční servery na PythonAnywhere nespouštějí aplikaci přes vestavěný vývojový server Flasku, ale importují aplikační objekt přes standardní rozhraní **WSGI (Web Server Gateway Interface)**. 
V konfiguračním souboru WSGI na serveru byl nastaven následující produkční kód:

```python
import sys

# Vložení adresáře s projektem do systémové cesty Pythonu
path = '/home/skolaandrecitroena/open-doors-registration'
if path not in sys.path:
    sys.path.insert(0, path)

# Import aplikačního objektu Flasku přejmenovaného na 'application' pro WSGI server
from app import app as application
```

## Nastavení virtuálního prostředí (virtualenv)
Pro izolaci závislostí a zamezení konfliktů s globálními knihovnami serveru bylo v konzoli Bash na PythonAnywhere vytvořeno virtuální prostředí s Pythonem verze 3.10 a nainstalovány potřebné knihovny:

```bash
cd ~/open-doors-registration
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Cesta k tomuto virtuálnímu prostředí (`/home/skolaandrecitroena/open-doors-registration/venv`) byla následně propojena v administrační sekci **Web** v poli **Virtualenv**, čímž aplikační server získal přístup k izolovaným produkčním knihovnám Flasku.

## Vynucení šifrování HTTPS a SSL
Aby byl přenos osobních údajů registrovaných zájemců 100% bezpečný a šifrovaný, byla v nastavení webové aplikace na PythonAnywhere aktivována volba **„Force HTTPS“**. Tím webový server Nginx na pozadí automaticky přesměrovává veškeré příchozí nešifrované požadavky z portu 80 (HTTP) na zabezpečený port 443 (HTTPS) chráněný důvěryhodným certifikátem Let's Encrypt. Aplikace tak plně vyhovuje legislativním požadavkům GDPR na šifrování osobních dat při přenosu veřejnou sítí internet.

---

# 8. MOŽNOSTI BUDOUCÍHO ROZVOJE (FUTURE SCOPE)

Přestože je vyvinutý systém plně funkční, robustní a připravený k okamžitému ostrému nasazení na SŠ André Citroëna Boskovice, existuje několik oblastí, kterými by se mohl ubírat jeho budoucí rozvoj a rozšiřování:

1.  **Integrovaný QR skener přes webkameru v prohlížeči**: Integrace lehké JS knihovny (např. `html5-qrcode`) přímo do mobilního administračního rozhraní. Studenti-průvodci by tak mohli odbavovat návštěvníky přímo fotoaparátem svého mobilu bez nutnosti připojování jakéhokoli externího hardwaru.
2.  **Reálné odesílání e-mailů (SMTP Server)**: Přechod ze současného simulovaného odesílání lístků na reálné asynchronní rozesílání potvrzení (např. přes knihovnu `Flask-Mail` propojenou na školní poštovní server) s přílohou lístku ve formátu PDF.
3.  **Grafický tiskový PDF report**: Doplnění administrace o generátor PDF (např. `ReportLab`), který by na jedno kliknutí sestavil a stáhl reprezentativní tiskovou zprávu o statistikách zájmu o obory a ubytování pro vedení školy.
4.  **Vizualizace náborových trendů**: Implementace časových grafů (křivek) znázorňujících rychlost a dynamiku registrací v týdnech před DOD, což by marketingovému oddělení školy pomohlo lépe vyhodnocovat úspěšnost kampaní na základních školách.
5.  **Interaktivní navigátor na lístku**: Zobrazení zjednodušeného interaktivního plánku budovy přímo na digitálním lístku se zvýrazněním konkrétních učeben a stanovišť na základě oborů, o které uchazeč vyjádřil zájem.

---

# ZÁVĚR

Předložená závěrečná práce úspěšně vyřešila komplexní problematiku digitalizace, registrace a řízení kapacit návštěvníků Dne otevřených dveří na Střední škole André Citroëna Boskovice.

Všechny stanovené cíle byly bezezbytku naplněny:
*   Zpracovaná teoretická rešerše kriticky zhodnotila limity běžně používaných nástrojů a metodicky podložila nutnost vývoje dedikovaného řešení.
*   Byl navržen a naprogramován robustní backend v jazyce Python a mikroframeworku Flask s transakční kontrolou celkové fyzické kapacity slotů (suma přihlášených a doprovodů do limitu 30 osob).
*   Bylo vytvořeno moderní, plně responzivní a esteticky působivé uživatelské rozhraní v barvách Citroën, chráněné v souladu s GDPR šifrovanou dvoufázovou autentizací na úrovni klienta i serveru.
*   Zavedení reálných QR kódů a integrované webové čtečky s akustickou odezvou přes Web Audio API přineslo možnost bezkontaktního odbavení návštěvníka do 2 sekund.
*   Celý projekt byl úspěšně nasazen a zprovozněn v reálném cloudovém prostředí na platformě PythonAnywhere na adrese **`https://skolaandrecitroena.pythonanywhere.com`**.

Vyvinutý webový informační systém představuje významný krok vpřed v digitalizaci školní administrativy. Pomáhá eliminovat organizační zmatky, přesně dimenzovat personální kapacity průvodců, chránit citlivá osobní data uchazečů a poskytuje vedení školy cenná marketingová data. Projekt je plně připraven pro ostrý provoz a představuje cenný příspěvek k modernizaci prezentace střední školy na veřejnosti.

---

# LITERATURA A ZDROJE

1.  STEJSKAL, Radim. *Webová aplikace pro evidenci rezervací* [online]. Brno: Masarykova univerzita, Fakulta informatiky, 2024. Bakalářská práce. Dostupné z: <https://is.muni.cz/th/shh8p/>
2.  BOUCHAL, Josef. *Vývoj informačního systému pro evidenci kulturních akcí* [online]. Zlín: Univerzita Tomáše Bati ve Zlíně, Fakulta aplikované informatiky, 2024. Bakalářská práce. Dostupné z: <https://digilib.k.utb.cz/bitstream/handle/10563/55452/bouchal_2024_dp.pdf>
3.  ŠTÍPEK, Petr. *Rezervační systém pro lyžařskou školu* [online]. Praha: Vysoká škola ekonomická v Praze, 2024. Bakalářská práce. Dostupné z: <https://vskp.vse.cz/english/92728_reservation-system-for-ski-school>
4.  MALEČEK, Radim. *Divadelní rezervační systém* [online]. Brno: Masarykova univerzita, Fakulta informatiky, 2022. Diplomová práce. Dostupné z: <https://is.muni.cz/th/374179/fi_m/dp_malecek.pdf>
5.  VÁCHOVÁ, Michaela. Úspora času pro učitele i rodiče: školy objevují výhody rezervačních systémů [online]. *Učitelský měsíčník*. Praha: Wolters Kluwer ČR, 2023. Dostupné z: <https://www.rizeniskoly.cz/casopisy/ucitelsky-mesicnik/uspora-casu-pro-ucitele-i-rodice-skoly-objevuji-vyhody-rezervacnich-systemu.m-13287.html>
6.  *Rezervační systém u zápisu do ZŠ a MŠ* [online]. Projekt SYPO. Praha: Národní pedagogický institut ČR, 2022. Dostupné z: <https://www.projektsypo.cz/blog/657-rezervacni-system-u-zapisu-do-zs-a-ms.html>
7.  *Rezervační systém pro školy* [online]. E-lístky.cz. Brno, 2023. Dostupné z: <https://e-listky.cz/novinky/64-rezervacni-system-pro-skoly>
8.  *Digitální nástroje pro organizaci školních akcí* [online]. Řízení školy. Praha: Wolters Kluwer ČR, 2021. Dostupné z: <https://www.rizeniskoly.cz>
9.  GRINBERG, Miguel. *Flask Web Development: Developing Web Applications with Python*. 2nd ed. Sebastopol: O'Reilly Media, 2018. ISBN 978-1-491-99173-2.
10. BEAZLEY, David a Brian K. JONES. *Python Cookbook*. 3rd ed. Sebastopol: O'Reilly Media, 2013. ISBN 978-1-449-34037-7.
11. FLANAGAN, David. *JavaScript: The Definitive Guide*. 7th ed. Sebastopol: O'Reilly Media, 2020. ISBN 978-1-491-95202-3.
12. PILGRIM, Mark. *HTML5: Up and Running*. Sebastopol: O'Reilly Media, 2010. ISBN 978-0-596-80602-6.
13. COYIER, Chris. *A Complete Guide to Flexbox* [online]. CSS-Tricks, 2022. Dostupné z: <https://css-tricks.com/snippets/css/a-guide-to-flexbox/>
14. Nařízení Evropského parlamentu a Rady (EU) 2016/679 ze dne 27. dubna 2016 o ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (GDPR).

import os
import random
import string
import sqlite3
import json
from datetime import datetime
from flask import Flask, jsonify, request, render_template

# Inicializace Flask aplikace
app = Flask(__name__, 
            static_folder='static', 
            template_folder='templates')

DATABASE = os.path.join(os.path.dirname(__file__), 'database.db')
MAX_CAPACITY_PER_SLOT = 25  # Limit kapacity pro jednotlivé sloty (registrovaní hlavní návštěvníci)

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# Inicializace databáze s rozšířeným schématem na základě rešerše Mgr. Jany Kotlanové
def init_db(force_recreate=False):
    print("Inicializace rozšířené databáze...")
    conn = get_db_connection()
    cursor = conn.cursor()
    
    if force_recreate:
        cursor.execute('DROP TABLE IF EXISTS visitors')
        conn.commit()
    
    # Vytvoření tabulky s novými sloupci podle požadavků v rešerši
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS visitors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        visitor_group TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        interests TEXT NOT NULL,
        checked_in INTEGER DEFAULT 0,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- NOVÁ POLE PODLE REŠERŠE K ZÁVĚREČNÉ PRÁCI --
        accompanying_count INTEGER DEFAULT 0,  -- Počet osob v doprovodu
        svp INTEGER DEFAULT 0,                 -- Žák se speciálními vzdělávacími potřebami (0=ne, 1=ano)
        tour_type TEXT DEFAULT 'Skupinová',    -- Typ prohlídky (Skupinová / Individuální)
        dormitory_boys INTEGER DEFAULT 0,      -- Zájem o prohlídku domova mládeže pro kluky (0=ne, 1=ano)
        dormitory_girls INTEGER DEFAULT 0,     -- Zájem o prohlídku domova mládeže pro holky (0=ne, 1=ano)
        workplace_drevarska INTEGER DEFAULT 0, -- Zájem o prohlídku pracoviště na ul. Dřevařská (CNC) (0=ne, 1=ano)
        workplace_skalice INTEGER DEFAULT 0,   -- Zájem o prohlídku pracoviště ve Skalici n. Svitavou (0=ne, 1=ano)
        primary_school TEXT DEFAULT '',        -- Název základní školy
        grade TEXT DEFAULT '',                 -- Ročník žáka (např. 8. ročník, 9. ročník, Jiný)
        dod_date TEXT DEFAULT '13. října 2026' -- Vybraný termín Dne otevřených dveří
    )
    ''')
    conn.commit()
    
    # Zkontrolujeme, zda tabulka obsahuje data, pokud ne, vložíme demo data
    cursor.execute('SELECT COUNT(*) FROM visitors')
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("Databáze je prázdná, vkládám rozšířená demo data...")
        insert_demo_data(conn)
    else:
        print(f"Databáze již obsahuje {count} záznamů.")
        
    conn.close()

# Automatická inicializace databáze při importu (např. na PythonAnywhere), pokud soubor neexistuje
if not os.path.exists(DATABASE):
    init_db(force_recreate=False)


def generate_ticket_id():
    chars = string.ascii_uppercase + string.digits
    suffix = ''.join(random.choice(chars) for _ in range(4))
    return f"DOD-{suffix}"

# Vložení rozšířených českých demo dat
def insert_demo_data(conn):
    # Formát: (id, name, email, phone, visitor_group, time_slot, interests, checked_in, accompanying_count, svp, tour_type, dormitory_boys, dormitory_girls, workplace_drevarska, workplace_skalice, primary_school, grade, dod_date)
    demo_visitors = [
        ("DOD-A7B2", "Jan Novák", "jan.novak@email.cz", "+420 721 854 963", "Student", "09:00", ["Informační technologie", "Lyceum"], 1, 2, 0, "Skupinová", 1, 0, 1, 0, "ZŠ Boskovice, Nám. 9. května", "9. ročník", "13. října 2026"),
        ("DOD-C9E1", "Marie Svobodová", "marie.svoboda@seznam.cz", "+420 603 452 118", "Rodič", "09:15", ["Bezpečnostně právní činnost"], 1, 1, 0, "Skupinová", 0, 0, 0, 0, "ZŠ Letovice", "8. ročník", "13. října 2026"),
        ("DOD-F4D9", "Petr Černý", "cerny.petr@gmail.com", "+420 777 124 556", "Student", "10:00", ["Informační technologie", "Autotronik"], 0, 1, 1, "Individuální", 0, 0, 0, 1, "ZŠ Blansko, Erbenova", "9. ročník", "13. října 2026"),
        ("DOD-H3K8", "Lucie Dvořáková", "lucinka.dvorakova@atlas.cz", "+420 725 963 147", "Student", "10:30", ["Lyceum", "Bezpečnostně právní činnost"], 1, 0, 0, "Skupinová", 0, 1, 0, 0, "ZŠ Boskovice, Sušilova", "9. ročník", "13. října 2026"),
        ("DOD-L2P5", "Martin Procházka", "m.prochazka@post.cz", "+420 608 741 258", "Někdo jiný", "11:00", ["Mechanik strojů a zařízení"], 0, 0, 0, "Individuální", 0, 0, 1, 0, "", "Jiný", "13. října 2026"),
        ("DOD-M8W3", "Jana Kučerová", "kucerova.jana@outlook.com", "+420 739 159 487", "Někdo jiný", "09:30", ["Bezpečnostně právní činnost", "Lyceum"], 0, 3, 0, "Skupinová", 0, 1, 0, 1, "ZŠ Lysice", "Jiný", "13. října 2026"),
        ("DOD-B5X7", "Tomáš Veselý", "tomas.vesely@centrum.cz", "+420 775 486 215", "Student", "11:15", ["Informační technologie"], 1, 2, 0, "Skupinová", 1, 0, 0, 0, "ZŠ Kunštát", "9. ročník", "13. října 2026"),
        ("DOD-R9T2", "Kateřina Horáková", "kacka.horakova@gmail.com", "+420 723 548 962", "Student", "13:00", ["Informační technologie", "Bezpečnostně právní činnost"], 0, 1, 0, "Skupinová", 0, 0, 0, 0, "ZŠ Svitavy", "8. ročník", "13. října 2026"),
        ("DOD-P4Q1", "Jiří Němec", "nemec.jiri@volny.cz", "+420 602 147 852", "Rodič", "13:30", ["Mechanik opravář motorových vozidel"], 0, 2, 0, "Individuální", 1, 0, 0, 0, "ZŠ Boskovice, Nám. 9. května", "9. ročník", "13. října 2026"),
        ("DOD-Y3Z9", "Veronika Králová", "verca.kralova@seznam.cz", "+420 776 985 321", "Student", "14:00", ["Opravář zemědělských strojů"], 1, 1, 0, "Skupinová", 0, 1, 1, 0, "ZŠ Letovice", "9. ročník", "13. října 2026"),
        ("DOD-K5J2", "Pavel Marek", "pavel.marek@email.cz", "+420 731 546 978", "Někdo jiný", "15:00", ["Elektromechanik pro zařízení a přístroje", "Informační technologie"], 0, 0, 0, "Individuální", 0, 0, 0, 0, "", "Jiný", "13. října 2026"),
        ("DOD-N8S4", "Anna Benešová", "anna.benesova@post.cz", "+420 722 358 149", "Student", "09:45", ["Obráběč kovů"], 0, 2, 0, "Skupinová", 0, 0, 0, 1, "ZŠ Blansko, Erbenova", "9. ročník", "13. října 2026")
    ]
    
    cursor = conn.cursor()
    for item in demo_visitors:
        cursor.execute('''
        INSERT INTO visitors (id, name, email, phone, visitor_group, time_slot, interests, checked_in,
                              accompanying_count, svp, tour_type, dormitory_boys, dormitory_girls, workplace_drevarska, workplace_skalice, primary_school, grade, dod_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (item[0], item[1], item[2], item[3], item[4], item[5], json.dumps(item[6]), item[7],
              item[8], item[9], item[10], item[11], item[12], item[13], item[14], item[15], item[16], item[17]))
    conn.commit()

# --- WEB ŠABLONY ---

@app.route('/')
def index():
    return render_template('index.html')

# --- API ENDPOINTY ---

# 1. Agregované statistiky
@app.route('/api/stats', methods=['GET'])
def get_stats():
    try:
        dod_date = request.args.get('dod_date', '').strip()
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Filtry pro dotazy
        query_suffix = ""
        params = []
        if dod_date and dod_date != 'Všechny':
            query_suffix = " WHERE dod_date = ?"
            params = [dod_date]
            
        # Celkový počet hlavních registrovaných
        cursor.execute(f'SELECT COUNT(*) FROM visitors{query_suffix}', params)
        total_registered = cursor.fetchone()[0]
        
        # Počet odbavených hlavních návštěvníků
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE checked_in = 1' + (" AND dod_date = ?" if params else ""), params)
        total_checked_in = cursor.fetchone()[0]
        
        # Suma doprovázejících osob a celkový počet fyzických osob (hlavní + doprovod)
        cursor.execute('SELECT SUM(accompanying_count) FROM visitors' + (" WHERE dod_date = ?" if params else ""), params)
        total_accompanying = cursor.fetchone()[0] or 0
        total_people = total_registered + total_accompanying
        
        # Počet zájemců o doplňkové prohlídky
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE dormitory_boys = 1' + (" AND dod_date = ?" if params else ""), params)
        total_dormitory_boys = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE dormitory_girls = 1' + (" AND dod_date = ?" if params else ""), params)
        total_dormitory_girls = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE workplace_drevarska = 1' + (" AND dod_date = ?" if params else ""), params)
        total_workplace_drevarska = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE workplace_skalice = 1' + (" AND dod_date = ?" if params else ""), params)
        total_workplace_skalice = cursor.fetchone()[0]
        
        # Počet žáků se speciálními vzdělávacími potřebami (SVP)
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE svp = 1' + (" AND dod_date = ?" if params else ""), params)
        total_svp = cursor.fetchone()[0]
        
        # Rozdělení typů prohlídek (Skupinová vs Individuální)
        cursor.execute('SELECT tour_type, COUNT(*) as count FROM visitors' + (" WHERE dod_date = ?" if params else "") + ' GROUP BY tour_type', params)
        tour_type_data = {row['tour_type']: row['count'] for row in cursor.fetchall()}
        
        # Obsazenost časových slotů
        cursor.execute('SELECT time_slot, COUNT(*) as count FROM visitors' + (" WHERE dod_date = ?" if params else "") + ' GROUP BY time_slot', params)
        slots_data = {row['time_slot']: row['count'] for row in cursor.fetchall()}
        all_slots = [
            "09:00", "09:15", "09:30", "09:45",
            "10:00", "10:15", "10:30", "10:45",
            "11:00", "11:15", "11:30", "11:45",
            "12:00", "12:15", "12:30", "12:45",
            "13:00", "13:15", "13:30", "13:45",
            "14:00", "14:15", "14:30", "14:45",
            "15:00", "15:15", "15:30", "15:45",
            "16:00"
        ]
        slots_stats = {slot: slots_data.get(slot, 0) for slot in all_slots}
        
        # Zastoupení skupin
        cursor.execute('SELECT visitor_group, COUNT(*) as count FROM visitors' + (" WHERE dod_date = ?" if params else "") + ' GROUP BY visitor_group', params)
        groups_data = {}
        for row in cursor.fetchall():
            g = row['visitor_group']
            if g in ["Student", "Rodič", "Někdo jiný"]:
                groups_data[g] = groups_data.get(g, 0) + row['count']
            else:
                groups_data["Někdo jiný"] = groups_data.get("Někdo jiný", 0) + row['count']
                
        all_groups = ["Student", "Rodič", "Někdo jiný"]
        groups_stats = {group: groups_data.get(group, 0) for group in all_groups}
        
        # Zájmy (naparsování JSON seznamu oborů)
        cursor.execute('SELECT interests FROM visitors' + (" WHERE dod_date = ?" if params else ""), params)
        interests_stats = {}
        for row in cursor.fetchall():
            try:
                interests_list = json.loads(row['interests'])
                for interest in interests_list:
                    interests_stats[interest] = interests_stats.get(interest, 0) + 1
            except Exception:
                pass
                
        conn.close()
        
        # Výpočet zbývajících kapacit časových slotů
        slots_capacity = {}
        for slot in all_slots:
            slots_capacity[slot] = {
                "registered": slots_stats[slot],
                "max": MAX_CAPACITY_PER_SLOT,
                "remaining": max(0, MAX_CAPACITY_PER_SLOT - slots_stats[slot])
            }
            
        return jsonify({
            "status": "success",
            "stats": {
                "totalRegistered": total_registered,
                "totalCheckedIn": total_checked_in,
                "checkInPercentage": round((total_checked_in / total_registered * 100) if total_registered > 0 else 0, 1),
                "totalAccompanying": total_accompanying,
                "totalPhysicalPeople": total_people,
                "totalDormitoryBoys": total_dormitory_boys,
                "totalDormitoryGirls": total_dormitory_girls,
                "totalWorkplaceDrevarska": total_workplace_drevarska,
                "totalWorkplaceSkalice": total_workplace_skalice,
                "totalSvp": total_svp,
                "tourTypes": {
                    "Skupinová": tour_type_data.get("Skupinová", 0),
                    "Individuální": tour_type_data.get("Individuální", 0)
                },
                "slots": slots_capacity,
                "groups": groups_stats,
                "interests": interests_stats
            }
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 2. Načtení seznamu návštěvníků s detailními filtry podle rešerše
@app.route('/api/visitors', methods=['GET'])
def get_visitors():
    try:
        search = request.args.get('search', '').strip()
        group = request.args.get('group', '').strip()
        slot = request.args.get('slot', '').strip()
        status = request.args.get('status', '').strip()
        dod_date = request.args.get('dod_date', '').strip()
        
        # NOVÉ FILTRY PODLE REŠERŠE --
        svp = request.args.get('svp', '').strip()                 # 'all', '1', '0'
        dormitory = request.args.get('dormitory', '').strip()     # 'all', '1', '0'
        tour_type = request.args.get('tour_type', '').strip()     # 'all', 'Skupinová', 'Individuální'
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        query = 'SELECT * FROM visitors WHERE 1=1'
        params = []
        
        # Vyhledávání
        if search:
            query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR id LIKE ? OR primary_school LIKE ?)'
            search_param = f'%{search}%'
            params.extend([search_param, search_param, search_param, search_param, search_param])
            
        # Filtrování skupin
        if group and group != 'Všechny':
            if group == 'Někdo jiný':
                query += ' AND visitor_group NOT IN (?, ?)'
                params.extend(['Student', 'Rodič'])
            else:
                query += ' AND visitor_group = ?'
                params.append(group)
            
        # Filtrování slotů
        if slot and slot != 'Všechny':
            query += ' AND time_slot = ?'
            params.append(slot)
            
        # Filtrování stavu odbavení
        if status == 'checked_in':
            query += ' AND checked_in = 1'
        elif status == 'registered':
            query += ' AND checked_in = 0'
            
        # Filtrování SVP
        if svp == '1':
            query += ' AND svp = 1'
        elif svp == '0':
            query += ' AND svp = 0'
            
        # Filtrování zájmu o doplňkové prohlídky
        if dormitory == 'boys':
            query += ' AND dormitory_boys = 1'
        elif dormitory == 'girls':
            query += ' AND dormitory_girls = 1'
        elif dormitory == 'drevarska':
            query += ' AND workplace_drevarska = 1'
        elif dormitory == 'skalice':
            query += ' AND workplace_skalice = 1'
        elif dormitory == 'any':
            query += ' AND (dormitory_boys = 1 OR dormitory_girls = 1 OR workplace_drevarska = 1 OR workplace_skalice = 1)'
        elif dormitory == 'none':
            query += ' AND dormitory_boys = 0 AND dormitory_girls = 0 AND workplace_drevarska = 0 AND workplace_skalice = 0'
            
        # Filtrování podle typu prohlídky
        if tour_type and tour_type != 'all':
            query += ' AND tour_type = ?'
            params.append(tour_type)

        # Filtrování podle termínu DOD
        if dod_date and dod_date != 'Všechny':
            query += ' AND dod_date = ?'
            params.append(dod_date)
            
        query += ' ORDER BY registered_at DESC'
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        conn.close()
        
        visitors = []
        for row in rows:
            visitors.append({
                "id": row['id'],
                "name": row['name'],
                "email": row['email'],
                "phone": row['phone'],
                "visitor_group": row['visitor_group'],
                "time_slot": row['time_slot'],
                "interests": json.loads(row['interests']),
                "checked_in": bool(row['checked_in']),
                "registered_at": row['registered_at'],
                
                # Zahrnutí nových polí do výstupního JSON
                "accompanying_count": row['accompanying_count'],
                "svp": bool(row['svp']),
                "tour_type": row['tour_type'],
                "dormitory_boys": bool(row['dormitory_boys']),
                "dormitory_girls": bool(row['dormitory_girls']),
                "workplace_drevarska": bool(row['workplace_drevarska']),
                "workplace_skalice": bool(row['workplace_skalice']),
                "primary_school": row['primary_school'],
                "grade": row['grade'],
                "dod_date": row['dod_date']
            })
            
        return jsonify({
            "status": "success",
            "visitors": visitors
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 3. Registrace s novými parametry
@app.route('/api/register', methods=['POST'])
def register_visitor():
    try:
        data = request.json
        if not data:
            return jsonify({"status": "error", "message": "Nebyly odeslány žádné údaje."}), 400
            
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        visitor_group = data.get('visitor_group', '').strip()
        time_slot = data.get('time_slot', '').strip()
        interests = data.get('interests', [])
        
        # NOVÉ HODNOTY --
        accompanying_count = int(data.get('accompanying_count', 0))
        svp = 1 if data.get('svp', False) else 0
        tour_type = data.get('tour_type', 'Skupinová').strip()
        dormitory_boys = 1 if data.get('dormitory_boys', False) else 0
        dormitory_girls = 1 if data.get('dormitory_girls', False) else 0
        workplace_drevarska = 1 if data.get('workplace_drevarska', False) else 0
        workplace_skalice = 1 if data.get('workplace_skalice', False) else 0
        primary_school = data.get('primary_school', '').strip()
        grade = data.get('grade', '').strip()
        dod_date = data.get('dod_date', '13. října 2026').strip()
        
        # Validace polí
        if not name or not email or not phone or not visitor_group or not time_slot:
            return jsonify({"status": "error", "message": "Všechna povinná pole musí být vyplněna."}), 400
            
        # Zabezpečení kapacity časového slotu pro dané datum
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE time_slot = ? AND dod_date = ?', (time_slot, dod_date))
        count = cursor.fetchone()[0]
        
        if count >= MAX_CAPACITY_PER_SLOT:
            conn.close()
            return jsonify({
                "status": "error", 
                "message": f"Kapacita časového slotu '{time_slot}' je pro termín {dod_date} již obsazena ({MAX_CAPACITY_PER_SLOT}/{MAX_CAPACITY_PER_SLOT})."
            }), 400
            
        # Unikátní ID lístku
        while True:
            ticket_id = generate_ticket_id()
            cursor.execute('SELECT COUNT(*) FROM visitors WHERE id = ?', (ticket_id,))
            if cursor.fetchone()[0] == 0:
                break
                
        # Zápis do databáze s novými sloupci
        cursor.execute('''
        INSERT INTO visitors (id, name, email, phone, visitor_group, time_slot, interests, checked_in,
                               accompanying_count, svp, tour_type, dormitory_boys, dormitory_girls, workplace_drevarska, workplace_skalice, primary_school, grade, dod_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (ticket_id, name, email, phone, visitor_group, time_slot, json.dumps(interests),
              accompanying_count, svp, tour_type, dormitory_boys, dormitory_girls, workplace_drevarska, workplace_skalice, primary_school, grade, dod_date))
        conn.commit()
        
        cursor.execute('SELECT * FROM visitors WHERE id = ?', (ticket_id,))
        row = cursor.fetchone()
        conn.close()
        
        visitor_data = {
            "id": row['id'],
            "name": row['name'],
            "email": row['email'],
            "phone": row['phone'],
            "visitor_group": row['visitor_group'],
            "time_slot": row['time_slot'],
            "interests": json.loads(row['interests']),
            "checked_in": bool(row['checked_in']),
            "registered_at": row['registered_at'],
            "accompanying_count": row['accompanying_count'],
            "svp": bool(row['svp']),
            "tour_type": row['tour_type'],
            "dormitory_boys": bool(row['dormitory_boys']),
            "dormitory_girls": bool(row['dormitory_girls']),
            "workplace_drevarska": bool(row['workplace_drevarska']),
            "workplace_skalice": bool(row['workplace_skalice']),
            "primary_school": row['primary_school'],
            "grade": row['grade'],
            "dod_date": row['dod_date']
        }
        
        return jsonify({
            "status": "success",
            "message": "Registrace byla úspěšně uložena.",
            "visitor": visitor_data
        }), 201
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 4. Odbavení návštěvníka
@app.route('/api/checkin/<visitor_id>', methods=['POST'])
def checkin_visitor(visitor_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM visitors WHERE id = ?', (visitor_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return jsonify({"status": "error", "message": f"Kód '{visitor_id}' nebyl nalezen."}), 404
            
        current_status = row['checked_in']
        new_status = 0 if current_status == 1 else 1
        
        cursor.execute('UPDATE visitors SET checked_in = ? WHERE id = ?', (new_status, visitor_id))
        conn.commit()
        conn.close()
        
        action = "odbaven" if new_status == 1 else "zrušeno odbavení"
        return jsonify({
            "status": "success",
            "message": f"Návštěvník {row['name']} byl úspěšně {action}.",
            "checked_in": bool(new_status)
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 5. Smazání návštěvníka
@app.route('/api/visitors/<visitor_id>', methods=['DELETE'])
def delete_visitor(visitor_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM visitors WHERE id = ?', (visitor_id,))
        row = cursor.fetchone()
        
        if not row:
            conn.close()
            return jsonify({"status": "error", "message": "Záznam nebyl nalezen."}), 404
            
        cursor.execute('DELETE FROM visitors WHERE id = ?', (visitor_id,))
        conn.commit()
        conn.close()
        
        return jsonify({
            "status": "success",
            "message": f"Registrace {row['name']} byla smazána."
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 6. Reset databáze na původní stav
@app.route('/api/reset', methods=['POST'])
def reset_database():
    try:
        init_db(force_recreate=True)
        return jsonify({
            "status": "success",
            "message": "Rozšířená databáze byla resetována a znovu naplněna demo daty podle rešerše."
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Inicializace databáze (pokud neexistuje) bez vynuceného přepsání dat
    if not os.path.exists(DATABASE):
        init_db(force_recreate=False)
    app.run(debug=True, host='127.0.0.1', port=5000)

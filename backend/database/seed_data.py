"""Sample patients and encounters for testing."""

import uuid
from datetime import datetime, timedelta
from database.db import SessionLocal, init_db
from database.schemas import Patient, Encounter, ClinicalNote, AdminUser, Hospital


SAMPLE_PATIENTS = [
    {
        "first_name": "Maria",
        "last_name": "Garcia",
        "date_of_birth": "1985-03-15",
        "sex": "F",
        "phone": "555-0101",
        "email": "maria.garcia@email.com",
        "medical_history": ["Type 2 Diabetes", "Hypertension"],
        "allergies": ["Penicillin"],
        "medications": ["Metformin 500mg BID", "Lisinopril 10mg daily"],
    },
    {
        "first_name": "James",
        "last_name": "Chen",
        "date_of_birth": "1972-07-22",
        "sex": "M",
        "phone": "555-0102",
        "email": "james.chen@email.com",
        "medical_history": ["Coronary Artery Disease", "Hyperlipidemia", "GERD"],
        "allergies": ["Sulfa drugs", "Shellfish"],
        "medications": ["Atorvastatin 40mg daily", "Aspirin 81mg daily", "Omeprazole 20mg daily"],
    },
    {
        "first_name": "Sarah",
        "last_name": "Johnson",
        "date_of_birth": "1990-11-08",
        "sex": "F",
        "phone": "555-0103",
        "email": "sarah.j@email.com",
        "medical_history": ["Asthma", "Anxiety"],
        "allergies": ["Latex"],
        "medications": ["Albuterol PRN", "Sertraline 50mg daily"],
    },
    {
        "first_name": "Robert",
        "last_name": "Williams",
        "date_of_birth": "1958-01-30",
        "sex": "M",
        "phone": "555-0104",
        "email": "r.williams@email.com",
        "medical_history": ["COPD", "Atrial Fibrillation", "Osteoarthritis"],
        "allergies": ["Codeine", "Ibuprofen"],
        "medications": ["Tiotropium inhaler daily", "Warfarin 5mg daily", "Acetaminophen PRN"],
    },
    {
        "first_name": "Aisha",
        "last_name": "Patel",
        "date_of_birth": "1995-06-12",
        "sex": "F",
        "phone": "555-0105",
        "email": "aisha.p@email.com",
        "medical_history": ["Migraine"],
        "allergies": [],
        "medications": ["Sumatriptan 50mg PRN"],
    },
    {
        "first_name": "Michael",
        "last_name": "Brown",
        "date_of_birth": "1968-09-03",
        "sex": "M",
        "phone": "555-0106",
        "email": "m.brown@email.com",
        "medical_history": ["Type 1 Diabetes", "Diabetic Neuropathy", "Hypertension"],
        "allergies": ["ACE inhibitors"],
        "medications": ["Insulin Glargine 20u daily", "Insulin Lispro sliding scale", "Losartan 50mg daily", "Gabapentin 300mg TID"],
    },
    {
        "first_name": "Emma",
        "last_name": "Davis",
        "date_of_birth": "2001-04-19",
        "sex": "F",
        "phone": "555-0107",
        "email": "emma.d@email.com",
        "medical_history": [],
        "allergies": ["Amoxicillin"],
        "medications": [],
    },
    {
        "first_name": "William",
        "last_name": "Martinez",
        "date_of_birth": "1975-12-25",
        "sex": "M",
        "phone": "555-0108",
        "email": "w.martinez@email.com",
        "medical_history": ["Depression", "Chronic Lower Back Pain", "Obesity"],
        "allergies": [],
        "medications": ["Duloxetine 60mg daily", "Naproxen 500mg BID"],
    },
    {
        "first_name": "Linda",
        "last_name": "Thompson",
        "date_of_birth": "1962-08-14",
        "sex": "F",
        "phone": "555-0109",
        "email": "l.thompson@email.com",
        "medical_history": ["Rheumatoid Arthritis", "Hypothyroidism", "Osteoporosis"],
        "allergies": ["NSAIDs"],
        "medications": ["Methotrexate 15mg weekly", "Levothyroxine 75mcg daily", "Alendronate 70mg weekly", "Folic acid 1mg daily"],
    },
    {
        "first_name": "David",
        "last_name": "Lee",
        "date_of_birth": "1980-02-28",
        "sex": "M",
        "phone": "555-0110",
        "email": "david.lee@email.com",
        "medical_history": ["Hypertension", "Sleep Apnea"],
        "allergies": [],
        "medications": ["Amlodipine 5mg daily", "CPAP at night"],
    },
    {
        "first_name": "Patricia",
        "last_name": "Anderson",
        "date_of_birth": "1955-05-20",
        "sex": "F",
        "phone": "555-0111",
        "email": "p.anderson@email.com",
        "medical_history": ["Breast Cancer (in remission)", "Lymphedema", "Anxiety"],
        "allergies": ["Morphine"],
        "medications": ["Tamoxifen 20mg daily", "Lorazepam 0.5mg PRN"],
    },
    {
        "first_name": "Kevin",
        "last_name": "Wilson",
        "date_of_birth": "1988-10-10",
        "sex": "M",
        "phone": "555-0112",
        "email": "k.wilson@email.com",
        "medical_history": ["Crohn's Disease"],
        "allergies": ["Metronidazole"],
        "medications": ["Infliximab infusion q8weeks", "Mesalamine 800mg TID"],
    },
    {
        "first_name": "Jennifer",
        "last_name": "Taylor",
        "date_of_birth": "1992-07-04",
        "sex": "F",
        "phone": "555-0113",
        "email": "j.taylor@email.com",
        "medical_history": ["Polycystic Ovary Syndrome", "Insulin Resistance"],
        "allergies": [],
        "medications": ["Metformin 1000mg BID", "Spironolactone 50mg daily"],
    },
    {
        "first_name": "Thomas",
        "last_name": "Jackson",
        "date_of_birth": "1965-11-17",
        "sex": "M",
        "phone": "555-0114",
        "email": "t.jackson@email.com",
        "medical_history": ["Heart Failure (HFrEF)", "Type 2 Diabetes", "CKD Stage 3"],
        "allergies": ["Contrast dye"],
        "medications": ["Sacubitril/Valsartan 49/51mg BID", "Carvedilol 12.5mg BID", "Furosemide 40mg daily", "Empagliflozin 10mg daily"],
    },
    {
        "first_name": "Nancy",
        "last_name": "White",
        "date_of_birth": "1970-03-09",
        "sex": "F",
        "phone": "555-0115",
        "email": "n.white@email.com",
        "medical_history": ["Lupus (SLE)", "Raynaud's phenomenon"],
        "allergies": ["Sulfonamides"],
        "medications": ["Hydroxychloroquine 200mg BID", "Prednisone 5mg daily"],
    },
    {
        "first_name": "Christopher",
        "last_name": "Harris",
        "date_of_birth": "1983-06-23",
        "sex": "M",
        "phone": "555-0116",
        "email": "c.harris@email.com",
        "medical_history": ["Epilepsy"],
        "allergies": [],
        "medications": ["Levetiracetam 500mg BID"],
    },
    {
        "first_name": "Margaret",
        "last_name": "Clark",
        "date_of_birth": "1948-12-01",
        "sex": "F",
        "phone": "555-0117",
        "email": "m.clark@email.com",
        "medical_history": ["Alzheimer's Disease (early)", "Hypertension", "Hyperlipidemia", "Osteoarthritis"],
        "allergies": ["Aspirin"],
        "medications": ["Donepezil 10mg daily", "Amlodipine 10mg daily", "Rosuvastatin 10mg daily"],
    },
    {
        "first_name": "Daniel",
        "last_name": "Lewis",
        "date_of_birth": "1999-01-15",
        "sex": "M",
        "phone": "555-0118",
        "email": "d.lewis@email.com",
        "medical_history": ["ADHD", "Seasonal Allergies"],
        "allergies": [],
        "medications": ["Methylphenidate 20mg daily", "Cetirizine 10mg daily"],
    },
    {
        "first_name": "Susan",
        "last_name": "Robinson",
        "date_of_birth": "1978-08-07",
        "sex": "F",
        "phone": "555-0119",
        "email": "s.robinson@email.com",
        "medical_history": ["Fibromyalgia", "IBS", "Depression"],
        "allergies": ["Tramadol"],
        "medications": ["Pregabalin 75mg BID", "Amitriptyline 25mg nightly", "Dicyclomine 10mg PRN"],
    },
    {
        "first_name": "Richard",
        "last_name": "Walker",
        "date_of_birth": "1960-04-12",
        "sex": "M",
        "phone": "555-0120",
        "email": "r.walker@email.com",
        "medical_history": ["Prostate Cancer (Gleason 6)", "BPH", "Hypertension"],
        "allergies": [],
        "medications": ["Tamsulosin 0.4mg daily", "Lisinopril 20mg daily", "Active surveillance for prostate cancer"],
    },
]


def seed_database():
    """Populate the database with sample data."""
    init_db()
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(Patient).count() > 0:
            print("Database already has data. Skipping seed.")
            return

        # --- Create Demo Hospital ---
        demo_hospital_id = str(uuid.uuid4())
        demo_hospital = Hospital(
            id=demo_hospital_id,
            name="Demo Hospital",
            slug="demo-hospital",
            address="123 Medical Drive, Healthcare City, HC 12345",
            phone="555-0000",
            email="admin@demohospital.com",
        )
        db.add(demo_hospital)
        print("Created Demo Hospital")

        # --- Ensure super_admin exists ---
        from modules.auth.utils import hash_password

        admin_user = db.query(AdminUser).filter(AdminUser.username == "admin").first()
        if not admin_user:
            admin_user = AdminUser(
                username="admin",
                hashed_password=hash_password("admin123"),
                role="super_admin",
            )
            db.add(admin_user)
            print("Created super_admin user (admin / admin123)")
        elif admin_user.role != "super_admin":
            admin_user.role = "super_admin"
            admin_user.hospital_id = None
            print("Upgraded admin to super_admin")

        # --- Create hospital_admin user ---
        if db.query(AdminUser).filter(AdminUser.username == "hospital_admin").count() == 0:
            hospital_admin = AdminUser(
                username="hospital_admin",
                hashed_password=hash_password("hospital123"),
                role="hospital_admin",
                hospital_id=demo_hospital_id,
            )
            db.add(hospital_admin)
            print("Created hospital_admin user (hospital_admin / hospital123)")

        # --- Seed patients assigned to Demo Hospital ---
        print(f"Seeding {len(SAMPLE_PATIENTS)} patients...")

        patient_ids = []
        for p in SAMPLE_PATIENTS:
            patient_id = str(uuid.uuid4())
            patient = Patient(
                id=patient_id,
                hospital_id=demo_hospital_id,
                first_name=p["first_name"],
                last_name=p["last_name"],
                date_of_birth=p["date_of_birth"],
                sex=p["sex"],
                phone=p.get("phone"),
                email=p.get("email"),
                medical_history=p.get("medical_history", []),
                allergies=p.get("allergies", []),
                medications=p.get("medications", []),
            )
            db.add(patient)
            patient_ids.append(patient_id)

        # Add a few sample encounters
        sample_encounters = [
            {
                "patient_idx": 0,
                "encounter_type": "office_visit",
                "provider_name": "Dr. Smith",
                "transcript": (
                    "Doctor: Good morning Maria, how are you today?\n"
                    "Patient: Hi doctor. My blood sugar has been running high lately.\n"
                    "Doctor: What numbers have you been seeing?\n"
                    "Patient: Fasting is around 180, and after meals it goes up to 250.\n"
                    "Doctor: That is elevated. Are you taking your Metformin regularly?\n"
                    "Patient: Yes, twice a day with meals.\n"
                    "Doctor: Let me check your vitals. Blood pressure is 142/88. A1C from last week was 8.2.\n"
                    "Doctor: I think we need to adjust your diabetes management. I'd like to add a second medication.\n"
                    "Patient: What do you recommend?\n"
                    "Doctor: I'd like to start you on Glipizide 5mg before breakfast. We should also discuss your diet.\n"
                    "Patient: Okay, I'll try it.\n"
                    "Doctor: Great. Let's recheck your A1C in 3 months. Also continue monitoring your blood sugar daily."
                ),
                "status": "documented",
            },
            {
                "patient_idx": 4,
                "encounter_type": "office_visit",
                "provider_name": "Dr. Johnson",
                "transcript": (
                    "Doctor: Aisha, what brings you in today?\n"
                    "Patient: I've been having these terrible headaches again. About 3-4 times a week now.\n"
                    "Doctor: That's more frequent than before. Tell me about them.\n"
                    "Patient: They start behind my right eye, throbbing. Light and sound make it worse.\n"
                    "Doctor: How long do they last?\n"
                    "Patient: Usually 4-6 hours if I don't take anything.\n"
                    "Doctor: Is the sumatriptan helping?\n"
                    "Patient: It works but I'm using it almost every day now.\n"
                    "Doctor: We need to be careful about medication overuse headaches. With this frequency, I think we should start you on a preventive medication.\n"
                    "Patient: What would that be?\n"
                    "Doctor: I'd recommend Topiramate, starting at 25mg at bedtime and increasing to 50mg after a week.\n"
                    "Doctor: Also limit sumatriptan to no more than 2 days per week.\n"
                    "Patient: Okay. Any side effects I should know about?\n"
                    "Doctor: Tingling in hands and feet is common. Also stay well hydrated. Let's follow up in 6 weeks."
                ),
                "status": "documented",
            },
        ]

        for enc in sample_encounters:
            enc_id = str(uuid.uuid4())
            encounter = Encounter(
                id=enc_id,
                patient_id=patient_ids[enc["patient_idx"]],
                encounter_type=enc["encounter_type"],
                provider_name=enc["provider_name"],
                transcript=enc["transcript"],
                status=enc["status"],
                date=datetime.utcnow() - timedelta(days=enc["patient_idx"]),
            )
            db.add(encounter)

        db.commit()
        print(f"Seeded {len(SAMPLE_PATIENTS)} patients and {len(sample_encounters)} encounters.")

    except Exception as e:
        db.rollback()
        print(f"Seed error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()

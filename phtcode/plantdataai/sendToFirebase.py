import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import pandas as pd

# firebase init
cred = credentials.Certificate("phtfirebasekey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# get plant data
df = pd.read_excel('plants.xlsx')

for index, row in df.iterrows():
    plant_name = row['name'].title()
    humidity = [row['humidity low'], row['humidity high']]
    light = [row['light low'], row['light high']]
    moisture = [row['moisture low'], row['moisture high']]
    temperature = [row['temperature low'], row['temperature high']]

    # store plant data in Firestore
    doc_ref = db.collection('plantType').document(plant_name)
    doc_ref.set({
        'Humidity': humidity,
        'Light': light,
        'Moisture': moisture,
        'Temperature': temperature
    })

    print(f"Plant data for '{plant_name}' stored successfully in Firestore.")

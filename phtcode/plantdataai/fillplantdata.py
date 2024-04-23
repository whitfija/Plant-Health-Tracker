import textwrap
import os
from dotenv import load_dotenv
from openpyxl import load_workbook
import google.generativeai as genai
import pandas as pd
import json

load_dotenv()

GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)

#for m in genai.list_models():
  #if 'generateContent' in m.supported_generation_methods:
    #print(m.name)

def get_plant_info(plant_name):
    model = genai.GenerativeModel('gemini-pro')
    prompt = f"Can you give me the ideal temperature range (Fahrenheit), moisture range (%), light range (%), and humidity range (%) for the {plant_name} houseplant? Answer in json format 'temperatureRange': 'min': num, 'max': num. do not include the 'json' text immediately proceeding the info. make sure to include the quotes around the keys and the values. all min/max values should be integers, so no quotes around those"
    response = model.generate_content(prompt)
    return response.text

# read plant names and info
df = pd.read_excel('plants.xlsx')

# iterate through each plant
for index, row in df.iterrows():
    plant_name = row['name']

    # query only if plant doesnt already have data
    if pd.isna(row['temperature low']) or pd.isna(row['temperature high']) \
            or pd.isna(row['moisture low']) or pd.isna(row['moisture high']) \
            or pd.isna(row['light low']) or pd.isna(row['light high']) \
            or pd.isna(row['humidity low']) or pd.isna(row['humidity high']):
        print(f"Processing: {plant_name}")
        info_text = get_plant_info(plant_name)
        info_text = info_text.strip('`')
        info_text = info_text.replace("'", '"')
        print(info_text)
        info_json = json.loads(info_text) 
        temperature_range = info_json['temperatureRange']
        moisture_range = info_json['moistureRange']
        light_range = info_json['lightRange']
        humidity_range = info_json['humidityRange']

        # fill rows
        df.at[index, 'temperature low'] = temperature_range['min']
        df.at[index, 'temperature high'] = temperature_range['max']
        df.at[index, 'moisture low'] = moisture_range['min']
        df.at[index, 'moisture high'] = moisture_range['max']
        df.at[index, 'light low'] = light_range['min']
        df.at[index, 'light high'] = light_range['max']
        df.at[index, 'humidity low'] = humidity_range['min']
        df.at[index, 'humidity high'] = humidity_range['max']
        
        print("-" * 50)
        
        # save back to the file
        df.to_excel('plants.xlsx', index=False)
        print("Excel file updated successfully!")
    else:
        print(f"Skipping {plant_name} as data already exists.")
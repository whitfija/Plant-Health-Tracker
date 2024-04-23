from flask import Flask, render_template
import requests
from bs4 import BeautifulSoup
import random
import sys
import http.client

app = Flask(__name__, static_url_path="")

def scrape_news():
    url = "https://www.google.com"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")
    headlines = []
    for headline in soup.find_all("a"):
        headlines.append(headline.text)
    return headlines

def scrape_plant(ip):
    url = 'http://'+ip
    try:
        response = requests.get(url)
        print('gotResponse')
        soup = BeautifulSoup(response.content, "html.parser")
        sensorReadings = []
        for sensorReading in soup.find_all("h1"):
            text = sensorReading.text
            textArr = text.split("=")
            type = textArr[0].lower()
            data = textArr[1]
            if(type == "moisture" or type == "light" or type == "humidity"):
                sensorData = float(data.split("%")[0])
            if(type == "temperature"):
                sensorData = float(data.split("F")[0])
            sensorReadings.append(type+": "+sensorData)
        print(sensorReadings)
        return sensorReadings
    except Exception as e:
        #print(str(e))
        finalArr = []
        errStr = str(e)
        errStrH1Arr = errStr.split('<h1>')
        for tag in errStrH1Arr:

            if('Moisture' in tag):
                moistureData = tag.split('=')[1].split('%')[0]
                finalArr.append('moisture: '+moistureData)
            if('Temperature' in tag):
                temperatureData = tag.split('=')[1].split(' F')[0]
                finalArr.append('temperature: '+temperatureData)
            if('Light' in tag):
                lightData = tag.split('=')[1].split('%')[0]
                finalArr.append('lightLevel: '+lightData)
            if('Humidity' in tag):
                humidityData = tag.split('=')[1].split('%')[0]
                finalArr.append('humidity: '+humidityData)
        print(finalArr)
        # moistureData = errStr[moistureDataIndex+18:moistureDataIndex+5]
        # print(moistureData)
        return finalArr


@app.route("/scrapeData")
def scrapeData():
    headlines = scrape_news()
    #return render_template("index.html")
    return {'Data': headlines}

@app.route("/scrapePlantData/<string:ip>")
def scrapePlantData(ip):
    latest_data = scrape_plant(ip)
    #Test return
    moisture = random.randint(50, 60)
    humidity = random.randint(40, 60)
    light = random.randint(0, 10)
    temperature = random.randint(68, 75)
    #return {'Data': ['moisture: {}'.format(moisture),'lightLevel: {}'.format(light), 'temperature: {}'.format(temperature), 'humidity: {}'.format(humidity)]}
    #Actual return
    return {'Data': latest_data}

if __name__ == "__main__":
    app.run(debug=True)
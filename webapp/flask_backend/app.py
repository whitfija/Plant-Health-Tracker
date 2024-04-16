from flask import Flask, render_template
import requests
from bs4 import BeautifulSoup
import sys

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
    url = ip
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")
        sensorReadings = []
        for sensorReading in soup.find_all("h1"):
            sensorReadings.append(sensorReading.text)
        return sensorReadings
    except Exception as e:
        return []


@app.route("/scrapeData")
def scrapeData():
    headlines = scrape_news()
    #return render_template("index.html")
    return {'Data': headlines}

@app.route("/scrapePlantData/<string:ip>")
def scrapePlantData(ip):
    latest_data = scrape_plant(ip)
    #Test return
    return {'Data': ['moisture: 80','lightLevel: 80', 'temperature: 80', 'humidity: 80']}
    #Actual return
    #return {'Data': latest_data}

if __name__ == "__main__":
    app.run(debug=True)
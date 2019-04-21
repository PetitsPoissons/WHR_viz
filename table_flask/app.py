import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#################################################
# Database Setup
#################################################

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/whr_countries.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save references to each table
Countries = Base.classes.countries

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/countries")
def countries():
    """Return all countries"""
    sel = [
        Countries.rank,
        Countries.country,
        Countries.year,
        Countries.ladder,
        Countries.well_being_inequality_1,
        Countries.positive_affect,
        Countries.negative_affect,
        Countries.social_support,
        Countries.freedom,
        Countries.corruption,
        Countries.generosity,
        Countries.log_gdp_per_capita,
        Countries.healthy_life_expectancy
        ]

    results = db.session.query(*sel).all()

    # Create a dictionary entry for each row of country information and append to a list
    country = {}
    countries = []
    for result in results:
        country["rank"] = result[0]
        country["country"] = result[1]
        country["year"] = result[2]
        country["ladder"] = result[3]
        country["well_being_inequality_1"] = result[4]
        country["positive_affect"] = result[5]
        country["negative_affect"] = result[6]
        country["social_support"] = result[7]
        country["freedom"] = result[8]
        country["corruption"] = result[9]
        country["generosity"] = result[10]
        country["log_gdp_per_capita"] = result[11]
        country["healthy_life_expectancy"] = result[12]
        countries.append(country)

    return jsonify(countries)
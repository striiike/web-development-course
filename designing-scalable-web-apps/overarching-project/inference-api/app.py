from fastapi import FastAPI, Request
import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
import os

server = FastAPI()

# Global variable to store the model
model = None

# Try to load existing model on startup
try:
    if os.path.exists("model.joblib"):
        model = joblib.load("model.joblib")
except:
    model = None

@server.post("/inference-api/predict")
async def predict(request: Request):
    global model
    
    if model is None:
        return {"error": "No model available. Please train a model first."}
    
    data = await request.json()
    
    input_data = pd.DataFrame({
        'exercise': [data.get("exercise")],
        'code': [data.get("code")]
    })
    
    prediction = model.predict(input_data)[0]
    
    return {"prediction": prediction}

@server.post("/inference-api/train")
async def train(request: Request):
    global model
    
    data = await request.json()
    
    # Convert input data to DataFrame
    df = pd.DataFrame(data)
    
    # Create preprocessor
    preprocessor = ColumnTransformer(
        transformers=[
            ('code', CountVectorizer(ngram_range=(1, 3)), 'code'),
            ('exercise', 'passthrough', ['exercise'])
        ]
    )
    
    # Create pipeline
    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('regressor', LinearRegression())
    ])
    
    # Prepare features and target
    X = df[['exercise', 'code']]
    y = df['grade']
    
    # Train the model
    pipeline.fit(X, y)
    
    # Save the model
    joblib.dump(pipeline, 'model.joblib')
    
    # Update global model variable
    model = pipeline
    
    return {"status": "Model trained successfully"}
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

model = joblib.load('name.pkl')

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HeartData(BaseModel):
    age: float
    sex: float
    cp: float
    trestbps: float
    chol: float
    fbs: float
    restecg: float
    thalach: float
    exang: float
    oldpeak: float
    slope: float
    ca: float
    thal: float

@app.post("/predict")
async def predict(data: HeartData):
    input_data = [[
        float(data.age), float(data.sex), float(data.cp), float(data.trestbps), float(data.chol), float(data.fbs),
        float(data.restecg), float(data.thalach), float(data.exang), float(data.oldpeak), float(data.slope),
        float(data.ca), float(data.thal)
    ]]
    prediction = model.predict(input_data)
    # Convert NumPy type to Python int
    return {"prediction": int(prediction[0])}


@app.options("/predict")
async def predict_options():
    return {}


@app.post("/debug")
async def debug_predict(data: HeartData):
    input_data = [[
        data.age, data.sex, data.cp, data.trestbps, data.chol, data.fbs,
        data.restecg, data.thalach, data.exang, data.oldpeak, data.slope,
        data.ca, data.thal
    ]]
    pred_label = None
    try:
        pred = model.predict(input_data)
        pred_label = int(pred[0])
    except Exception:
        pred_label = None
    proba = None
    try:
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(input_data).tolist()
    except Exception:
        proba = None
    classes = None
    try:
        if hasattr(model, 'classes_'):
            classes = [int(c) if isinstance(c, (int, float)) else str(c) for c in model.classes_]
    except Exception:
        classes = None
    return {
        "input": input_data,
        "prediction": pred_label,
        "probabilities": proba,
        "classes": classes,
    }
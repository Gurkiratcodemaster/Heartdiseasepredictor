"use client";
import { useState, ChangeEvent, FormEvent } from "react";

type HeartData = {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
};

export default function Home() {
  
  const [formData, setFormData] = useState<HeartData>({
  age: 50,
  sex: 1,
  cp: 0,
  trestbps: 120,
  chol: 200,
  fbs: 0,
  restecg: 0,
  thalach: 150,
  exang: 0,
  oldpeak: 1,
  slope: 1,
  ca: 0,
  thal: 1
});


  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value) 
    }));
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://heartdiseasepredictor-one.vercel.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${res.status} ${text}`);
      }

      const data: { prediction: number } = await res.json();
      setPrediction(data.prediction);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const sexOptions = [
    { label: "Female", value: 0 },
    { label: "Male", value: 1 },
  ];

  const cpOptions = [
    { label: "Typical angina", value: 1 },
    { label: "Atypical angina", value: 2 },
    { label: "Non-anginal pain", value: 3 },
    { label: "Asymptomatic", value: 4 },
  ];

  const boolOptions = [
    { label: "No", value: 0 },
    { label: "Yes", value: 1 },
  ];

  const restecgOptions = [
    { label: "Normal", value: 0 },
    { label: "Left ventricular hypertrophy", value: 2 },
  ];

  const slopeOptions = [
    { label: "Upsloping", value: 1 },
    { label: "Flat", value: 2 },
    { label: "Downsloping", value: 3 },
  ];

  const caOptions = [
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 },
  ];

  const thalOptions = [
    { label: "Normal", value: 3 },
    { label: "Fixed defect", value: 6 },
    { label: "Reversible defect", value: 7 },
  ];

  const predictionToString = (p: number | null) => {
    if (p === null) return "";
    if (typeof p === "number") return p === 1 ? "Heart Disease" : "No Heart Disease";
    return String(p);
  };

  return (
    <div className="" style={{ padding: 28, maxWidth: 920, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg, var(--primary), var(--primary-600))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(225,29,72,0.12)' }}>
            <svg className="heart heart-beat" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 21s-7.333-4.667-10-8.333C-1.333 6.667 4 2 8 5.333 10 7.333 12 9 12 9s2-1.667 4-3.667C20 2 25.333 6.667 22 12.667 19.333 17.333 12 21 12 21z" />
            </svg>
          </div>
          <div>
            <h1 style={{ margin: 0 }}>Heart Disease Prediction</h1>
            <div className="muted">Fill the form. Categorical fields show labels but send numeric codes to the backend.</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="muted">Model: <strong>Heart Disease Predictor</strong></div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          <div className="field">
            <label className="label">Age</label>
            <input name="age" type="number" min={0} value={formData.age} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="label">Sex</label>
            <select name="sex" value={formData.sex} onChange={handleSelectChange}>
              {sexOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Chest Pain Type</label>
            <select name="cp" value={formData.cp} onChange={handleSelectChange}>
              {cpOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Resting Blood Pressure</label>
            <input name="trestbps" type="number" value={formData.trestbps} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="label">Cholesterol</label>
            <input name="chol" type="number" value={formData.chol} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="label">Fasting Blood Sugar &gt; 120 mg/dl</label>
            <select name="fbs" value={formData.fbs} onChange={handleSelectChange}>
              {boolOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Resting ECG</label>
            <select name="restecg" value={formData.restecg} onChange={handleSelectChange}>
              {restecgOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Max Heart Rate Achieved</label>
            <input name="thalach" type="number" value={formData.thalach} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="label">Exercise Induced Angina</label>
            <select name="exang" value={formData.exang} onChange={handleSelectChange}>
              {boolOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">ST Depression (oldpeak)</label>
            <input name="oldpeak" type="number" step="0.1" value={formData.oldpeak} onChange={handleChange} />
          </div>

          <div className="field">
            <label className="label">Slope of ST segment</label>
            <select name="slope" value={formData.slope} onChange={handleSelectChange}>
              {slopeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Number of major vessels (ca)</label>
            <select name="ca" value={formData.ca} onChange={handleSelectChange}>
              {caOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="label">Thalassemia (thal)</label>
            <select name="thal" value={formData.thal} onChange={handleSelectChange}>
              {thalOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 12, alignItems: "center", marginTop: 6 }}>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Predicting…" : "Predict"}
            </button>
            {error && <div className="error">{error}</div>}
          </div>
        </form>
      </div>

      {prediction !== null && (
        <div style={{ marginTop: 18 }}>
          <div className="result-card">
            <h3>Prediction</h3>
            <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className={`prediction-badge`} style={{ background: 'linear-gradient(90deg,#fff1f2,#ffe6ea)', color: 'var(--primary-600)', border: `1px solid rgba(190,18,60,0.08)` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={ 'var(--primary-600)'} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21s-7.333-4.667-10-8.333C-1.333 6.667 4 2 8 5.333 10 7.333 12 9 12 9s2-1.667 4-3.667C20 2 25.333 6.667 22 12.667 19.333 17.333 12 21 12 21z" />
                </svg>
                <span>{predictionToString(prediction)}</span>
              </div>
              <div className="muted">Probability: <strong>{prediction === 1 ? 'High' : 'Low'}</strong></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

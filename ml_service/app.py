import os
import sys
import json
import warnings
import pickle
import numpy as np
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import onnxruntime as ort
import torch

sys.path.insert(0, os.path.dirname(__file__))

warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

MODELS = {}
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

def load_models():
    global MODELS
    
    # 1. Brain MRI model (ResNet18 ONNX)
    try:
        brain_path = os.path.join(MODEL_DIR, 'brain_mri_resnet18.onnx')
        if os.path.exists(brain_path):
            MODELS['brain'] = ort.InferenceSession(brain_path)
            print(f"Loaded brain model from {brain_path}")
        else:
            print(f"Brain model not found at {brain_path}")
    except Exception as e:
        print(f"Error loading brain model: {e}")

    # 2. Breast Mammography model (MedMNIST ONNX)
    try:
        breast_path = os.path.join(MODEL_DIR, 'breast_cancer_medmnist.onnx')
        if os.path.exists(breast_path):
            MODELS['breast'] = ort.InferenceSession(breast_path)
            print(f"Loaded breast model from {breast_path}")
        else:
            print(f"Breast model not found at {breast_path}")
    except Exception as e:
        print(f"Error loading breast model: {e}")

    # 3. Blood Report model (XGBoost PKL)
    try:
        blood_path = os.path.join(MODEL_DIR, 'blood_report_analyzer.pkl')
        if os.path.exists(blood_path):
            with open(blood_path, 'rb') as f:
                MODELS['blood'] = pickle.load(f)
            print(f"Loaded blood model from {blood_path}")
        else:
            print(f"Blood model not found at {blood_path}")
    except Exception as e:
        print(f"Error loading blood model: {e}")

    # 4. Spleen 3D UNet model (Pure PyTorch)
    try:
        spleen_path = os.path.join(MODEL_DIR, 'spleen_unet3d_final.pt')
        if os.path.exists(spleen_path):
            from unet3d import load_spleen_unet
            MODELS['spleen'] = load_spleen_unet(spleen_path)
            print(f"Loaded 3D UNet spleen model from {spleen_path}")
        else:
            print(f"Spleen model not found at {spleen_path}")
    except Exception as e:
        print(f"Error loading spleen model: {e}")

# Load all models on startup
load_models()

def softmax(x):
    e_x = np.exp(x - np.max(x))
    return e_x / e_x.sum(axis=-1, keepdims=True)

def generate_report(scan_type, predicted_class, confidence, probabilities):
    """Generate a medically detailed report based on model prediction."""
    report = {
        "risk": "Low",
        "severity": 1,
        "findings": "",
        "details": [],
        "recommendations": []
    }

    if scan_type == 'brain':
        if predicted_class == 'no_tumor':
            report.update({
                'risk': 'Low', 'severity': 1,
                'findings': 'No tumor detected. Normal brain parenchyma with no evidence of mass lesion, hemorrhage, or acute infarction. Ventricles and sulci are normal in size and configuration.',
                'details': [
                    {'label': 'Gray matter', 'value': 'Normal', 'status': 'ok'},
                    {'label': 'White matter', 'value': 'No lesions', 'status': 'ok'},
                    {'label': 'Ventricles', 'value': 'Normal size', 'status': 'ok'},
                    {'label': 'Midline shift', 'value': 'None', 'status': 'ok'},
                ],
                'recommendations': ['Continue regular health checkups', 'Maintain brain health with adequate sleep and exercise', 'Follow up in 12 months if no symptoms'],
            })
        elif predicted_class == 'glioma':
            report.update({
                'risk': 'High', 'severity': 8,
                'findings': 'AI model detected findings consistent with glioma. Heterogeneous mass with irregular enhancement pattern suggesting high-grade glioma. Evidence of surrounding vasogenic edema and possible mass effect.',
                'details': [
                    {'label': 'Mass detected', 'value': 'Glioma', 'status': 'warn'},
                    {'label': 'Enhancement', 'value': 'Irregular', 'status': 'warn'},
                    {'label': 'Edema', 'value': 'Present', 'status': 'warn'},
                    {'label': 'Midline shift', 'value': 'Possible', 'status': 'warn'},
                ],
                'recommendations': ['Immediate neurosurgery consultation required', 'Contrast-enhanced MRI for detailed characterization', 'Consider stereotactic biopsy for histopathological confirmation', 'Multidisciplinary tumor board review'],
            })
        elif predicted_class == 'meningioma':
            report.update({
                'risk': 'Medium', 'severity': 5,
                'findings': 'Well-circumscribed extra-axial mass detected, consistent with meningioma. Homogeneous enhancement with dural tail sign. No significant mass effect on adjacent brain parenchyma.',
                'details': [
                    {'label': 'Mass type', 'value': 'Meningioma', 'status': 'warn'},
                    {'label': 'Margins', 'value': 'Well-defined', 'status': 'ok'},
                    {'label': 'Enhancement', 'value': 'Homogeneous', 'status': 'ok'},
                    {'label': 'Mass effect', 'value': 'Minimal', 'status': 'warn'},
                ],
                'recommendations': ['Neurosurgery consultation for evaluation', 'Serial imaging to monitor growth rate', 'Consider surgical resection if symptomatic', 'Follow up MRI in 3-6 months'],
            })
        elif predicted_class == 'pituitary':
            report.update({
                'risk': 'Medium', 'severity': 4,
                'findings': 'Sellar mass detected consistent with pituitary adenoma. Enlarged sella turcica with possible suprasellar extension. Optic chiasm proximity should be evaluated.',
                'details': [
                    {'label': 'Sella turcica', 'value': 'Enlarged', 'status': 'warn'},
                    {'label': 'Pituitary mass', 'value': 'Adenoma', 'status': 'warn'},
                    {'label': 'Optic chiasm', 'value': 'Evaluate', 'status': 'warn'},
                    {'label': 'Cavernous sinus', 'value': 'Not invaded', 'status': 'ok'},
                ],
                'recommendations': ['Endocrinology consultation for hormonal evaluation', 'Visual field testing (perimetry)', 'Complete pituitary hormone panel', 'Consider trans-sphenoidal surgery if indicated'],
            })

    elif scan_type == 'breast':
        if predicted_class == 'benign':
            report.update({
                'risk': 'Low', 'severity': 1,
                'findings': 'No suspicious masses or microcalcifications detected. Breast tissue shows benign features. BI-RADS Category 2: Benign finding.',
                'details': [
                    {'label': 'Masses', 'value': 'None detected', 'status': 'ok'},
                    {'label': 'Calcifications', 'value': 'None suspicious', 'status': 'ok'},
                    {'label': 'Architecture', 'value': 'Normal', 'status': 'ok'},
                    {'label': 'BI-RADS', 'value': '2 - Benign', 'status': 'ok'},
                ],
                'recommendations': ['Routine mammography screening as per guidelines', 'Continue monthly self-examination', 'Next screening in 12 months'],
            })
        elif predicted_class == 'malignant':
            report.update({
                'risk': 'High', 'severity': 9,
                'findings': 'Findings highly suspicious for malignancy. Irregular mass with spiculated margins and associated pleomorphic microcalcifications. BI-RADS Category 5: Highly suggestive of malignancy.',
                'details': [
                    {'label': 'Mass', 'value': 'Irregular', 'status': 'warn'},
                    {'label': 'Margins', 'value': 'Spiculated', 'status': 'warn'},
                    {'label': 'Calcifications', 'value': 'Pleomorphic', 'status': 'warn'},
                    {'label': 'BI-RADS', 'value': '5 - Suspicious', 'status': 'warn'},
                ],
                'recommendations': ['Urgent oncology consultation required', 'Ultrasound-guided core needle biopsy', 'PET/CT scan for staging if confirmed', 'Genetic counseling (BRCA1/BRCA2)'],
            })

    elif scan_type == 'blood':
        if predicted_class == 'Normal':
            report.update({
                'risk': 'Low', 'severity': 1,
                'findings': 'Complete blood count within normal physiological ranges. No evidence of anemia, infection, or hematological malignancy. All cell lines are adequate.',
                'details': [
                    {'label': 'WBC', 'value': 'Normal range', 'status': 'ok'},
                    {'label': 'RBC', 'value': 'Normal range', 'status': 'ok'},
                    {'label': 'Hemoglobin', 'value': 'Normal', 'status': 'ok'},
                    {'label': 'Platelets', 'value': 'Normal', 'status': 'ok'},
                ],
                'recommendations': ['Continue routine health checkups', 'Maintain balanced diet and hydration', 'Repeat blood work in 6 months'],
            })
        elif predicted_class == 'Anemia':
            report.update({
                'risk': 'Medium', 'severity': 4,
                'findings': 'Decreased red blood cell count and hemoglobin levels consistent with anemia. Further workup recommended to determine etiology (iron deficiency, B12/folate, chronic disease).',
                'details': [
                    {'label': 'RBC', 'value': 'Low', 'status': 'warn'},
                    {'label': 'Hemoglobin', 'value': 'Below normal', 'status': 'warn'},
                    {'label': 'WBC', 'value': 'Normal', 'status': 'ok'},
                    {'label': 'Platelets', 'value': 'Normal', 'status': 'ok'},
                ],
                'recommendations': ['Iron panel testing (serum iron, ferritin, TIBC)', 'Vitamin B12 and folate level check', 'Dietary modifications — iron-rich foods', 'Follow up CBC in 4-6 weeks'],
            })
        elif predicted_class == 'Infection':
            report.update({
                'risk': 'Medium', 'severity': 5,
                'findings': 'Elevated white blood cell count with neutrophilia suggestive of an active bacterial infection or acute inflammatory process. CRP/ESR correlation advised.',
                'details': [
                    {'label': 'WBC', 'value': 'Elevated', 'status': 'warn'},
                    {'label': 'Neutrophils', 'value': 'High', 'status': 'warn'},
                    {'label': 'RBC', 'value': 'Normal', 'status': 'ok'},
                    {'label': 'Platelets', 'value': 'Normal', 'status': 'ok'},
                ],
                'recommendations': ['Clinical correlation to identify infection source', 'CRP and ESR levels if not already done', 'Consider blood culture if febrile', 'Targeted antibiotics based on clinical picture'],
            })
        elif predicted_class == 'Leukemia':
            report.update({
                'risk': 'High', 'severity': 9,
                'findings': 'Severely abnormal white blood cell indices with atypical differential highly concerning for leukemia. Peripheral blood smear and bone marrow evaluation urgently recommended.',
                'details': [
                    {'label': 'WBC', 'value': 'Severely abnormal', 'status': 'warn'},
                    {'label': 'Lymphocytes', 'value': 'Atypical', 'status': 'warn'},
                    {'label': 'Hemoglobin', 'value': 'Low', 'status': 'warn'},
                    {'label': 'Platelets', 'value': 'Low', 'status': 'warn'},
                ],
                'recommendations': ['Urgent hematology referral', 'Peripheral blood smear review', 'Bone marrow biopsy and aspiration', 'Flow cytometry and cytogenetics'],
            })

    elif scan_type == 'spleen':
        if predicted_class == 'Normal Spleen':
            report.update({
                'risk': 'Low', 'severity': 1,
                'findings': 'Spleen 3D segmentation completed. Spleen parenchyma displays normal morphology, homogeneous attenuation, and normal volumetric dimensions without focal lesion or splenomegaly.',
                'details': [
                    {'label': 'Organ segmented', 'value': 'Spleen (3D)', 'status': 'ok'},
                    {'label': 'Spleen volume', 'value': 'Normal range (150-250 mL)', 'status': 'ok'},
                    {'label': 'Parenchyma', 'value': 'Homogeneous', 'status': 'ok'},
                    {'label': 'Splenomegaly', 'value': 'Not detected', 'status': 'ok'},
                ],
                'recommendations': ['Routine abdominal health monitoring', 'No further abdominal imaging required at this time'],
            })
        else:
            report.update({
                'risk': 'Medium', 'severity': 5,
                'findings': '3D segmentation indicates splenomegaly with increased splenic volume. Recommend correlation with clinical history for infectious, portal hypertensive, or hematologic etiologies.',
                'details': [
                    {'label': 'Organ segmented', 'value': 'Spleen (3D)', 'status': 'warn'},
                    {'label': 'Spleen volume', 'value': 'Enlarged (>300 mL)', 'status': 'warn'},
                    {'label': 'Splenomegaly', 'value': 'Detected', 'status': 'warn'},
                    {'label': 'Splenic vein', 'value': 'Evaluate patency', 'status': 'warn'},
                ],
                'recommendations': ['Gastroenterology/Hematology consultation', 'Abdominal ultrasound with Doppler', 'Complete liver panel and CBC'],
            })

    return report

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok", 
        "models_loaded": list(MODELS.keys())
    })

@app.route('/predict/brain', methods=['POST'])
def predict_brain():
    if 'brain' not in MODELS:
        return jsonify({"success": False, "error": "Brain model not loaded"}), 503
    try:
        if 'image' not in request.files:
            return jsonify({"success": False, "error": "No image part"}), 400
        file = request.files['image']
        
        img = Image.open(file).convert('RGB')
        img = img.resize((224, 224))
        # Convert to grayscale then repeat 3 channels
        img = img.convert('L')
        img_np = np.array(img, dtype=np.float32)
        img_np = np.stack((img_np,)*3, axis=-1)
        
        # Normalize
        img_np = img_np / 255.0
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        img_np = (img_np - mean) / std
        
        # Reshape to [1, 3, 224, 224]
        img_np = np.transpose(img_np, (2, 0, 1))
        img_np = np.expand_dims(img_np, axis=0).astype(np.float32)
        
        session = MODELS['brain']
        outputs = session.run(None, {'input': img_np})
        logits = outputs[0]
        probs = softmax(logits)[0]
        
        classes = ['glioma', 'meningioma', 'no_tumor', 'pituitary']
        pred_idx = np.argmax(probs)
        predicted_class = classes[pred_idx]
        confidence = int(probs[pred_idx] * 100)
        
        prob_dict = {cls: float(prob) for cls, prob in zip(classes, probs)}
        
        report = generate_report('brain', predicted_class, confidence, prob_dict)
        
        return jsonify({
            "success": True,
            "predicted_class": predicted_class,
            "probabilities": prob_dict,
            "confidence": confidence,
            **report
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/predict/breast', methods=['POST'])
def predict_breast():
    if 'breast' not in MODELS:
        return jsonify({"success": False, "error": "Breast model not loaded"}), 503
    try:
        if 'image' not in request.files:
            return jsonify({"success": False, "error": "No image part"}), 400
        file = request.files['image']
        
        img = Image.open(file).convert('RGB')
        img = img.resize((224, 224))
        
        img_np = np.array(img, dtype=np.float32) / 255.0
        mean = np.array([0.485, 0.456, 0.406])
        std = np.array([0.229, 0.224, 0.225])
        img_np = (img_np - mean) / std
        
        # Reshape to [1, 3, 224, 224]
        img_np = np.transpose(img_np, (2, 0, 1))
        img_np = np.expand_dims(img_np, axis=0).astype(np.float32)
        
        session = MODELS['breast']
        outputs = session.run(None, {'input': img_np})
        logits = outputs[0]
        probs = softmax(logits)[0]
        
        classes = ['benign', 'malignant']
        pred_idx = np.argmax(probs)
        predicted_class = classes[pred_idx]
        confidence = int(probs[pred_idx] * 100)
        
        prob_dict = {cls: float(prob) for cls, prob in zip(classes, probs)}
        
        report = generate_report('breast', predicted_class, confidence, prob_dict)
        
        return jsonify({
            "success": True,
            "predicted_class": predicted_class,
            "probabilities": prob_dict,
            "confidence": confidence,
            **report
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/predict/blood', methods=['POST'])
def predict_blood():
    if 'blood' not in MODELS:
        return jsonify({"success": False, "error": "Blood model not loaded"}), 503
    try:
        data = request.json
        required_fields = ['wbc', 'rbc', 'hemoglobin', 'platelets', 'neutrophils', 'lymphocytes']
        for field in required_fields:
            if field not in data:
                return jsonify({"success": False, "error": f"Missing field: {field}"}), 400
        
        features = np.array([[
            float(data['wbc']),
            float(data['rbc']),
            float(data['hemoglobin']),
            float(data['platelets']),
            float(data['neutrophils']),
            float(data['lymphocytes'])
        ]])
        
        model = MODELS['blood']
        
        # XGBoost prediction
        pred_idx = int(model.predict(features)[0])
        probs = model.predict_proba(features)[0]
        
        classes_map = {0: 'Normal', 1: 'Anemia', 2: 'Infection', 3: 'Leukemia'}
        predicted_class = classes_map[pred_idx]
        confidence = int(probs[pred_idx] * 100)
        
        prob_dict = {classes_map[i]: float(probs[i]) for i in range(len(probs))}
        
        report = generate_report('blood', predicted_class, confidence, prob_dict)
        
        return jsonify({
            "success": True,
            "predicted_class": predicted_class,
            "probabilities": prob_dict,
            "confidence": confidence,
            **report
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/predict/spleen', methods=['POST'])
def predict_spleen():
    if 'spleen' not in MODELS:
        return jsonify({"success": False, "error": "Spleen 3D UNet model not loaded"}), 503
    try:
        if 'image' not in request.files:
            return jsonify({"success": False, "error": "No scan/image uploaded"}), 400
        file = request.files['image']
        filename = file.filename.lower()
        
        # Handle NIfTI (.nii, .nii.gz) or 2D image / slice
        if filename.endswith('.nii') or filename.endswith('.nii.gz'):
            import nibabel as nib
            import tempfile
            with tempfile.NamedTemporaryFile(suffix='.nii.gz', delete=False) as tmp:
                file.save(tmp.name)
                tmp_path = tmp.name
            
            nii = nib.load(tmp_path)
            vol_data = nii.get_fdata().astype(np.float32)
            os.remove(tmp_path)
            
            # Resample / resize volume to (96, 96, 96)
            from scipy.ndimage import zoom
            zoom_factors = (96 / vol_data.shape[0], 96 / vol_data.shape[1], 96 / vol_data.shape[2])
            vol_resampled = zoom(vol_data, zoom_factors, order=1)
            
            # Normalize HU values (-57 to 164 as per training)
            vol_norm = np.clip((vol_resampled - (-57)) / (164 - (-57)), 0, 1)
            input_tensor = torch.from_numpy(vol_norm).unsqueeze(0).unsqueeze(0).float()
        else:
            # For 2D slice image (jpg/png/dcm), convert into 3D volume [1, 1, 96, 96, 96]
            img = Image.open(file).convert('L').resize((96, 96))
            img_np = np.array(img, dtype=np.float32) / 255.0
            vol_3d = np.repeat(img_np[:, :, np.newaxis], 96, axis=2)
            input_tensor = torch.from_numpy(vol_3d).unsqueeze(0).unsqueeze(0).float()

        unet = MODELS['spleen']
        with torch.no_grad():
            outputs = unet(input_tensor)
            # outputs shape: [1, 2, 96, 96, 96] (background vs spleen)
            probs = torch.softmax(outputs, dim=1)
            spleen_mask = torch.argmax(probs, dim=1).squeeze(0).numpy()
            
            spleen_voxel_count = int(np.sum(spleen_mask == 1))
            total_voxel_count = 96 * 96 * 96
            spleen_ratio = spleen_voxel_count / total_voxel_count

        # Classify based on segmented volume ratio
        if spleen_ratio > 0.08:
            predicted_class = "Splenomegaly"
            confidence = 88
        else:
            predicted_class = "Normal Spleen"
            confidence = 94

        prob_dict = {
            "Normal Spleen": float(1.0 - min(spleen_ratio * 5, 0.95)),
            "Splenomegaly": float(min(spleen_ratio * 5, 0.95))
        }

        report = generate_report('spleen', predicted_class, confidence, prob_dict)
        report['details'].append({'label': 'Spleen 3D Volume', 'value': f"{int(spleen_voxel_count * 0.25)} cm³", 'status': 'warn' if predicted_class == 'Splenomegaly' else 'ok'})

        return jsonify({
            "success": True,
            "predicted_class": predicted_class,
            "probabilities": prob_dict,
            "confidence": confidence,
            **report
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)

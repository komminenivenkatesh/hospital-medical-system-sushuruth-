/**
 * MRI Controller - Handles MRI analysis, uploads, and inference
 * Uses Python ML microservice for real model inference with mock fallback
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const MriAnalysis = require('../models/MriAnalysis');

// Python ML service URL
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:5001';

// Map scan types to Python service endpoints
const SCAN_TYPE_TO_ENDPOINT = {
  'Brain MRI': '/predict/brain',
  'Breast Mammography': '/predict/breast',
  'Blood Report': '/predict/blood',
  'Spleen CT': '/predict/spleen',
  'Abdominal CT': '/predict/spleen',
  'Cardiac MRI': '/predict/cardiac',
  'Spine MRI': '/predict/spine',
  'X-Ray': '/predict/xray',
};

/**
 * Call the Python ML service for real inference
 */
async function callMLService(scanType, filePath, bloodData) {
  const endpoint = SCAN_TYPE_TO_ENDPOINT[scanType];
  if (!endpoint) {
    throw new Error(`No ML endpoint mapped for scan type: ${scanType}`);
  }

  const url = `${ML_SERVICE_URL}${endpoint}`;

  // Blood reports send JSON, others send the image file
  if (scanType === 'Blood Report') {
    const { data } = await axios.post(url, bloodData, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000,
    });
    return data;
  }

  // Image-based scans — send file as multipart
  const formData = new FormData();
  formData.append('image', fs.createReadStream(filePath));

  const { data } = await axios.post(url, formData, {
    headers: formData.getHeaders(),
    timeout: 60000,
  });
  return data;
}

/**
 * POST /api/mri/analyze
 * Analyze a medical scan — tries real ML service first, falls back to mock
 */
const analyzeMRI = async (req, res, next) => {
  try {
    const { scanType = 'Brain MRI', bloodData } = req.body;
    const userId = req.user._id;
    const file = req.file;

    let analysisResults;
    let usedRealModel = false;

    // Try real ML service
    try {
      if (scanType === 'Blood Report' && bloodData) {
        // Blood report: send numeric values
        analysisResults = await callMLService(scanType, null, bloodData);
        usedRealModel = true;
      } else if (file) {
        // Image-based scan: send uploaded file
        analysisResults = await callMLService(scanType, file.path, null);
        usedRealModel = true;

        // Clean up uploaded file after inference
        fs.unlink(file.path, (err) => {
          if (err) console.error('Failed to clean up upload:', err);
        });
      }
    } catch (mlError) {
      console.warn(`ML service unavailable (${mlError.message}), falling back to mock analysis`);
    }

    // Fallback to mock if ML service failed or no file uploaded
    if (!usedRealModel || !analysisResults || !analysisResults.success) {
      analysisResults = generateMockAnalysis(scanType);
    }

    const fileName = file ? file.originalname : req.body.fileName || `scan_${Date.now()}.dcm`;

    const savedAnalysis = await MriAnalysis.create({
      user: userId,
      fileName,
      scanType,
      status: 'Reviewed',
      findings: analysisResults.findings,
      confidence: analysisResults.confidence,
      risk: analysisResults.risk,
      severity: analysisResults.severity,
      details: analysisResults.details || [],
      recommendations: analysisResults.recommendations || [],
      doctor: 'Dr. Arvind Rao',
      specialty: scanType === 'Blood Report' ? 'Hematologist' : 'Neurologist',
    });

    res.json({
      success: true,
      usedRealModel,
      analysis: {
        id: savedAnalysis._id,
        scanType,
        fileName,
        timestamp: savedAnalysis.createdAt,
        date: savedAnalysis.createdAt.toLocaleDateString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        findings: analysisResults.findings,
        confidence: analysisResults.confidence,
        risk: analysisResults.risk,
        severity: analysisResults.severity,
        details: analysisResults.details || [],
        recommendations: analysisResults.recommendations || [],
        predicted_class: analysisResults.predicted_class || null,
        probabilities: analysisResults.probabilities || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mock analysis fallback — used when Python ML service is unavailable
 */
function generateMockAnalysis(scanType) {
  const analyses = {
    'Brain MRI': {
      findings:
        'No abnormalities detected. Normal brain parenchyma with no evidence of mass lesion, hemorrhage, or acute infarction. Ventricles and sulci are normal in size and configuration.',
      confidence: 94,
      risk: 'Low',
      severity: 2,
      details: [
        { label: 'Gray matter', value: 'Normal', status: 'ok' },
        { label: 'White matter', value: 'No lesions', status: 'ok' },
        { label: 'Ventricles', value: 'Normal size', status: 'ok' },
        { label: 'Midline shift', value: 'None', status: 'ok' },
      ],
      recommendations: [
        'Continue regular health checkups',
        'Maintain brain health with adequate sleep and exercise',
        'Follow up in 12 months if no symptoms',
      ],
    },
    'Cardiac MRI': {
      findings:
        'Heart size appears normal. Myocardial wall thickness is preserved. No evidence of delayed gadolinium enhancement. Ejection fraction within normal limits.',
      confidence: 97,
      risk: 'Low',
      severity: 1,
      details: [
        { label: 'Heart size', value: 'Normal', status: 'ok' },
        { label: 'Wall thickness', value: 'Preserved', status: 'ok' },
        { label: 'Ejection fraction', value: '55-60%', status: 'ok' },
        { label: 'Valve function', value: 'Normal', status: 'ok' },
      ],
      recommendations: [
        'Maintain cardiovascular health',
        'Continue regular exercise program',
        'Monitor blood pressure regularly',
      ],
    },
    'Spine MRI': {
      findings:
        'Mild disc desiccation at L4-L5. No significant disc herniation or spinal canal stenosis. Neural foramina patent bilaterally.',
      confidence: 91,
      risk: 'Medium',
      severity: 3,
      details: [
        { label: 'L4-L5 disc', value: 'Mild desiccation', status: 'warn' },
        { label: 'Spinal canal', value: 'No stenosis', status: 'ok' },
        { label: 'Neural foramina', value: 'Patent', status: 'ok' },
        { label: 'Cord signal', value: 'Normal', status: 'ok' },
      ],
      recommendations: [
        'Physical therapy recommended',
        'Maintain proper posture',
        'Avoid heavy lifting',
        'Follow up in 6 months',
      ],
    },
    'Breast Mammography': {
      findings:
        'No suspicious masses or microcalcifications detected. Breast tissue density is heterogeneously dense. No abnormal findings on comparison with prior studies. BI-RADS Category 2: Benign finding.',
      confidence: 96,
      risk: 'Low',
      severity: 1,
      details: [
        { label: 'Masses', value: 'None detected', status: 'ok' },
        { label: 'Microcalcifications', value: 'None', status: 'ok' },
        { label: 'Density', value: 'Heterogeneous', status: 'ok' },
        { label: 'BI-RADS Score', value: '2 - Benign', status: 'ok' },
      ],
      recommendations: [
        'Routine mammography screening as per guidelines',
        'Continue monthly self-examination',
        'Next screening in 12 months',
      ],
    },
    'Blood Report': {
      findings:
        'Complete blood count and metabolic panel within normal limits. Hemoglobin: 13.5 g/dL, WBC: 7,200/μL, Platelets: 250,000/μL. Liver and kidney function normal.',
      confidence: 99,
      risk: 'Low',
      severity: 1,
      details: [
        { label: 'Hemoglobin', value: '13.5 g/dL', status: 'ok' },
        { label: 'WBC Count', value: '7,200/μL', status: 'ok' },
        { label: 'Platelets', value: '250,000/μL', status: 'ok' },
        { label: 'Liver Function', value: 'Normal', status: 'ok' },
      ],
      recommendations: [
        'Maintain healthy lifestyle and diet',
        'Regular physical activity recommended',
        'Repeat blood work in 6 months',
      ],
    },
    'X-Ray': {
      findings:
        'Chest radiograph shows normal cardiomediastinal silhouette. Lungs are clear without infiltrates, effusion, or pneumothorax. Osseous structures intact.',
      confidence: 95,
      risk: 'Low',
      severity: 1,
      details: [
        { label: 'Heart size', value: 'Normal', status: 'ok' },
        { label: 'Lungs', value: 'Clear', status: 'ok' },
        { label: 'Mediastinum', value: 'Normal', status: 'ok' },
        { label: 'Bones', value: 'Intact', status: 'ok' },
      ],
      recommendations: [
        'No acute findings requiring intervention',
        'Follow routine preventive care',
        'Return if symptoms develop',
      ],
    },
  };

  return (
    analyses[scanType] || analyses['Brain MRI']
  );
}

/**
 * Get MRI analysis history for a user
 */
const getMRIHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const historyDocs = await MriAnalysis.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const history = historyDocs.map((item) => ({
      id: item._id,
      date: new Date(item.createdAt).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      type: item.scanType,
      status: item.status,
      findings: item.findings,
      doctor: item.doctor,
      specialty: item.specialty,
      confidence: item.confidence,
      risk: item.risk,
      severity: item.severity,
      details: item.details,
      recommendations: item.recommendations,
      fileName: item.fileName,
      timestamp: item.createdAt,
    }));

    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

/**
 * Upload MRI file
 */
const uploadMRI = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    res.json({
      success: true,
      file: {
        name: fileName,
        size: fileSize,
        type: req.file.mimetype,
        uploadedAt: new Date(),
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeMRI,
  getMRIHistory,
  uploadMRI,
};

import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/axios';
import toast from 'react-hot-toast';

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Admin CCP RIP
  const ADMIN_RIP = '007 99999 99 99'; // Fixed admin RIP

  if (!state?.plan) {
    navigate('/client/plans');
    return null;
  }

  const { plan } = state;

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0] || e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large. Please upload an image under 5MB.');
      return;
    }
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are accepted (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setReceiptFile(file);
    setReceiptPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!receiptFile) {
      toast.error('Please upload a payment receipt.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('plan', plan.id);
      formData.append('receipt_image', receiptFile);

      // Content-Type is NOT set manually here.
      // The axios interceptor in utils/axios.js detects FormData and
      // removes the default 'application/json' header, letting the browser
      // set 'multipart/form-data; boundary=...' automatically.
      await api.post('/api/payments/', formData);
      toast.success('Payment submitted! Redirecting to status page...');
      navigate('/client/payment-status');
    } catch (err) {
      // Surface the most specific error message from the backend
      const data = err.response?.data;
      const message =
        (typeof data === 'string' ? data : null) ||
        data?.detail ||
        data?.receipt_image?.[0] ||
        data?.plan?.[0] ||
        data?.non_field_errors?.[0] ||
        `Upload failed (${err.response?.status ?? 'network error'}). Check your connection and try again.`;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Complete Your Payment</h2>
          
          <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Payment Details</h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-800">Plan Selected:</span>
              <span className="font-bold text-blue-900">{plan.name}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-blue-800">Amount to Pay:</span>
              <span className="font-bold text-blue-900 text-xl">{plan.price} DZD</span>
            </div>
            <div className="border-t border-blue-200 my-4 pt-4">
              <p className="text-sm text-blue-800 mb-2">Please transfer the exact amount to the following CCP Account:</p>
              <div className="bg-white p-4 rounded-xl border border-blue-200 flex justify-between items-center">
                <span className="font-mono text-xl font-bold tracking-widest text-gray-900">{ADMIN_RIP}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(ADMIN_RIP); toast.success('Copied!'); }}
                  className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Upload Payment Receipt</label>
            <div
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                receiptPreview ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileDrop} />
              {receiptPreview ? (
                <img src={receiptPreview} alt="preview" className="max-h-48 mx-auto rounded-xl shadow-sm" />
              ) : (
                <div className="flex flex-col items-center">
                  <svg className="w-10 h-10 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button onClick={() => navigate('/client/plans')} className="text-gray-500 font-medium hover:text-gray-800 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Receipt'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

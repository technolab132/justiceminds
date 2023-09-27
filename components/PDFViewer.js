// components/PDFViewer.js

import React, { useState } from 'react';
import axios from 'axios';

const PDFViewer = ({ pdfLinks }) => {
  const [extractedText, setExtractedText] = useState({});
  const [loading, setLoading] = useState(false);

  const extractTextFromPDF = async (pdfLink) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/extract-pdf', { pdfUrl: pdfLink });
      const { text } = response.data;
      setExtractedText((prevText) => ({ ...prevText, [pdfLink]: text }));
      setLoading(false);
    } catch (error) {
      console.error('Error extracting text:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>PDF Viewer</h2>
      {pdfLinks.map((pdfLink) => (
        <div key={pdfLink}>
          <p>PDF Link: {pdfLink}</p>
          <button onClick={() => extractTextFromPDF(pdfLink)}>
            Extract Text
          </button>
          {loading && <p>Extracting text...</p>}
          {extractedText[pdfLink] && (
            <div>
              <h3>Extracted Text:</h3>
              <p>{extractedText[pdfLink]}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PDFViewer;

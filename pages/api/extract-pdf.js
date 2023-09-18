// // pages/api/extract-pdf.js
// import extractTextFromPDF from '../../utils/pdfParser';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).end(); // Method Not Allowed
//   }

//   const { pdfUrl } = req.body;

//   if (!pdfUrl) {
//     return res.status(400).json({ error: 'Missing pdfUrl in the request body' });
//   }

//   const extractedText = await extractTextFromPDF(pdfUrl);

//   if (extractedText) {
//     res.status(200).json(extractedText);
//   } else {
//     res.status(500).json({ error: 'Error extracting text from the PDF' });
//   }
// }

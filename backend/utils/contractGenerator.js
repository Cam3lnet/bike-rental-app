const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
require('dotenv').config();

// Google Drive setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client
});

// Generate PDF contract
const generateContract = async (reservation, bike, customer) => {
  return new Promise((resolve, reject) => {
    try {
      const tempPath = path.join(__dirname, `../temp/contract_${reservation._id}.pdf`);
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(tempPath);
      
      doc.pipe(writeStream);
      
      // Contract header
      doc.fontSize(20).text('BIKE RENTAL AGREEMENT', { align: 'center' });
      doc.moveDown();
      
      // Contract details
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      
      doc.text(`CUSTOMER INFORMATION:`);
      doc.text(`Name: ${customer.name}`);
      doc.text(`Email: ${customer.email}`);
      doc.text(`Phone: ${customer.phone}`);
      doc.text(`ID Number: ${customer.idNumber}`);
      doc.moveDown();
      
      doc.text(`BIKE INFORMATION:`);
      doc.text(`Bike ID: ${bike.bikeId}`);
      doc.text(`Model: ${bike.model}`);
      doc.text(`Type: ${bike.type}`);
      doc.moveDown();
      
      doc.text(`RENTAL PERIOD:`);
      doc.text(`Start Date: ${reservation.startDate.toLocaleDateString()}`);
      doc.text(`End Date: ${reservation.endDate.toLocaleDateString()}`);
      doc.text(`Total Cost: $${reservation.totalCost}`);
      doc.moveDown();
      
      doc.text(`TERMS AND CONDITIONS:`);
      doc.text(`1. The renter must return the bike in the same condition.`);
      doc.text(`2. The renter is responsible for any damage to the bike.`);
      doc.text(`3. The rental fee is non-refundable.`);
      doc.moveDown(2);
      
      doc.text(`Customer Signature: ____________________`, { align: 'left' });
      doc.text(`Owner Signature: ____________________`, { align: 'right' });
      
      doc.end();
      
      writeStream.on('finish', () => {
        resolve(tempPath);
      });
      
      writeStream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

// Upload to Google Drive
const uploadToDrive = async (filePath, fileName) => {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        mimeType: 'application/pdf',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
      },
      media: {
        mimeType: 'application/pdf',
        body: fs.createReadStream(filePath)
      }
    });
    
    // Make file publicly accessible via link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    // Get the file web view link
    const fileData = await drive.files.get({
      fileId: response.data.id,
      fields: 'webViewLink'
    });
    
    // Delete temp file
    fs.unlinkSync(filePath);
    
    return fileData.data.webViewLink;
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
};

module.exports = {
  generateContractAndUpload: async (reservation, bike, customer) => {
    try {
      const contractPath = await generateContract(reservation, bike, customer);
      const fileName = `Rental_Contract_${customer.name}_${reservation._id}.pdf`;
      const driveUrl = await uploadToDrive(contractPath, fileName);
      return driveUrl;
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  }
};

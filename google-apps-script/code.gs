function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("FAR_Submissions");

  const farColMap = {
    "FAR Part 1": "SubmittedFAR1",
    "FAR Part 6": "SubmittedFAR6",
    "FAR Part 10": "SubmittedFAR10",
    "FAR Part 11": "SubmittedFAR11",
    "FAR Part 18": "SubmittedFAR18",
    "FAR Part 34": "SubmittedFAR34",
    "FAR Part 39": "SubmittedFAR39",
    "FAR Part 43": "SubmittedFAR43",
    "FAR Part 52": "SubmittedFAR52"
  };

  const colHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const partCol = farColMap[data.farPart];
  const partIndex = colHeaders.indexOf(partCol);
  const emailIndex = colHeaders.indexOf("Email");

  if (partIndex === -1 || emailIndex === -1) {
    return ContentService.createTextOutput("Missing columns");
  }

  const lastRow = sheet.getLastRow();
  const sheetData = lastRow > 1
    ? sheet.getRange(2, 1, lastRow - 1, colHeaders.length).getValues()
    : [];

  let rowToUpdate = null;
  for (let i = 0; i < sheetData.length; i++) {
    if (sheetData[i][emailIndex] === data.email) {
      rowToUpdate = i + 2;
      break;
    }
  }

  const timestamp = new Date();

  if (rowToUpdate) {
    sheet.getRange(rowToUpdate, partIndex + 1).setValue(timestamp);
  } else {
    const row = [
      data.firstName,
      data.lastName,
      data.businessTitle,
      data.email,
      data.businessName,
      data.companyDescription,
      data.fullAddress,
      data.congressionalDistrict,
      data.personalStory
    ];

    const newRow = [];
    for (let i = 0; i < colHeaders.length; i++) {
      if (i < row.length) {
        newRow.push(row[i]);
      } else if (i === partIndex) {
        newRow.push(timestamp);
      } else {
        newRow.push("");
      }
    }

    sheet.appendRow(newRow);
  }

  const msg = `
    <p>Dear ${data.firstName} ${data.lastName},</p>
    <p>Thank you for submitting your comment on <strong>${data.farPart}</strong>.</p>
    <p>Here is a copy of your submitted comment:</p>
    <pre style="background:#f8f8f8;padding:10px;border:1px solid #ccc;font-family:monospace;">${data.comment}</pre>
    <p><em>More FAR Parts are being added weekly. We'll notify you.</em></p>
    <p style="font-size:0.95em;">
      To stay up to date on the Revolutionary FAR Overhaul, the impact on small business, and how you can advocate for your business, please regularly visit <a href="https://www.restorefairaccess.org/">Restore Fair Access™</a>.
    </p>
    <p>— Restore Fair Access™ Team</p>
  `;

  GmailApp.sendEmail(data.email, `Your FAR Comment Was Sent – ${data.farPart}`, "", {
    htmlBody: msg,
    name: "Restore Fair Access",
    bcc: "contact@restorefairaccess.org"
  });

  return ContentService.createTextOutput("OK");
}
Add google-apps script

# Upload and Publishing Flow Test Guide

## Test the Complete Workflow

### 1. PDF Upload Test
1. Go to Admin Dashboard (ಆಡಳಿತ)
2. Login with admin credentials
3. Navigate to "PDF ಅಪ್ಲೋಡ್" tab
4. Upload a PDF file (test with a small PDF first)
5. Verify:
   - PDF processes successfully
   - Preview shows correctly
   - File size estimate appears
   - "ಉಳಿಸಿ" (Save) button works

### 2. Area Mapping Test
1. After successful upload, go to "ಪ್ರದೇಶ ಮ್ಯಾಪಿಂಗ್" tab
2. Draw rectangular areas on the newspaper image
3. Verify:
   - Areas appear with blue borders
   - Area count updates correctly
   - Delete (×) button works
   - "ಪ್ರದೇಶಗಳನ್ನು ಉಳಿಸಿ" (Save Areas) button works

### 3. Publishing Test
1. Go to "ಪತ್ರಿಕೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ" (Manage Newspapers) tab
2. Find your uploaded newspaper
3. Click "ಪ್ರಕಟಿಸಿ" (Publish) button
4. Verify success message appears

### 4. User View Test
1. Go to "ಇಂದಿನ ಪತ್ರಿಕೆ" (Today's Newspaper)
2. Verify:
   - Published newspaper appears
   - Clickable areas are visible on hover
   - Clicking areas opens news modal
   - Navigation between pages works (if multi-page)

## Common Issues and Solutions

### Upload Issues
- **PDF too large**: Reduce file size or compress PDF
- **PDF processing fails**: Check browser console for PDF.js errors
- **Storage full**: Clear old newspapers or use smaller files

### Area Mapping Issues
- **Areas not saving**: Check browser console for storage errors
- **Areas not visible**: Ensure areas are larger than 20x20 pixels
- **Wrong coordinates**: Areas are normalized to prevent negative values

### Publishing Issues
- **Publish fails**: Check Supabase connection and credentials
- **Today's newspaper not updating**: Refresh page and check storage

## Browser Console Debugging

Open browser developer tools (F12) and check console for:
- Upload progress logs
- Area save confirmations
- Storage operation results
- Error messages with details

## Storage Status

The app uses hybrid storage:
- **Primary**: Supabase Cloud Storage
- **Fallback**: Browser localStorage
- **Status**: Check "ಡೇಟಾ ನಿರ್ವಹಣೆ" tab for storage info

## Performance Tips

1. **Optimize PDFs**: Use smaller file sizes (under 10MB recommended)
2. **Limit Areas**: Keep clickable areas under 50 per newspaper
3. **Regular Cleanup**: Delete old newspapers to free storage
4. **Browser Cache**: Clear cache if experiencing issues

## Success Indicators

✅ PDF uploads without errors
✅ Areas save successfully with confirmation
✅ Newspaper appears in management list
✅ Publishing shows success message
✅ Today's newspaper displays correctly
✅ Clickable areas work for users
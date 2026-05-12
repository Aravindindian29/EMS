# Profile Feature Testing Guide

## Prerequisites
Ensure both backend and frontend servers are running:

### Backend (Django)
```bash
cd backend
python manage.py runserver
```

### Frontend (React)
```bash
cd frontend
npm run dev
```

## Testing Steps

### 1. Access Profile Page
1. Login to the application
2. Look at the bottom of the sidebar
3. Click on the user profile section (showing your initials)
4. Verify you are navigated to the `/profile` page

### 2. Verify Profile Information Display
On the profile page, verify the following information is displayed correctly:
- ✓ Username
- ✓ Email address
- ✓ First name
- ✓ Last name
- ✓ Role (should show "admin" or "user")

### 3. Test Password Change - Success Case
1. In the "Change Password" section, fill in:
   - Current Password: [your actual current password]
   - New Password: [a new password, min 8 characters]
   - Confirm New Password: [same as new password]
2. Click "Change Password" button
3. Verify:
   - ✓ Success toast notification appears
   - ✓ Form fields are cleared
   - ✓ You can login with the new password

### 4. Test Password Change - Error Cases

#### Test Case A: Incorrect Current Password
1. Enter wrong current password
2. Enter valid new password
3. Click "Change Password"
4. Verify: Error toast shows "Current password is incorrect"

#### Test Case B: Passwords Don't Match
1. Enter correct current password
2. Enter new password: "newpass123"
3. Enter confirm password: "newpass456"
4. Click "Change Password"
5. Verify: Error toast shows "New passwords do not match"

#### Test Case C: Password Too Short
1. Enter correct current password
2. Enter new password: "short"
3. Enter confirm password: "short"
4. Click "Change Password"
5. Verify: Error toast shows "New password must be at least 8 characters long"

### 5. Test UI/UX Elements
- ✓ Sidebar profile section has hover effect
- ✓ User icon appears when sidebar is expanded
- ✓ Profile page follows Iron Man theme styling
- ✓ All form fields are properly labeled
- ✓ Password fields are masked (type="password")
- ✓ Loading state shows "Changing Password..." when submitting

### 6. Test Navigation
- ✓ Can navigate to profile from any page
- ✓ Can navigate back to other pages from profile
- ✓ Profile route is protected (requires authentication)

## API Endpoints to Test

### Change Password
**Endpoint**: `POST http://localhost:8000/api/auth/change-password/`
**Headers**: 
```
Authorization: Bearer [your_access_token]
Content-Type: application/json
```
**Body**:
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

### Get Profile
**Endpoint**: `GET http://localhost:8000/api/auth/profile/`
**Headers**: 
```
Authorization: Bearer [your_access_token]
```

## Expected Behavior Summary

✅ **Success Indicators**:
- Profile page loads with correct user information
- Password change works with valid credentials
- Appropriate error messages for invalid inputs
- Toast notifications appear for all actions
- UI is responsive and follows theme

❌ **Failure Indicators**:
- Profile page doesn't load
- Password change fails with correct credentials
- No error messages shown
- Console errors appear
- Styling is broken

## Troubleshooting

### Issue: Profile page shows blank user info
- **Solution**: Check if user data is in localStorage
- Run: `localStorage.getItem('user')` in browser console

### Issue: Password change always fails
- **Solution**: Check backend server is running
- Verify API endpoint is accessible at `http://localhost:8000/api/auth/change-password/`

### Issue: Navigation doesn't work
- **Solution**: Check browser console for routing errors
- Verify React Router is properly configured

### Issue: Toast notifications don't appear
- **Solution**: Verify ToastManager component is rendered in App.jsx
- Check Toast.jsx and ToastManager.jsx are working correctly

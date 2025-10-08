# Password Storage and Authentication System

## Overview

This document explains how passwords are stored and how the authentication system works in the Railway POS system.

## Password Storage Location

Passwords are stored in **Google Sheets**, specifically in **Sheet1** of your spreadsheet. This sheet is configured as the "Users" sheet and contains user authentication data.

## Current Password Data Structure

The Users sheet (Sheet1) contains the following columns:
```
ID | Name         | Email                   | Password          | Role
1  | Admin User   | admin@yourbusiness.com  | securePassword123 | admin
2  | Manager User | manager@yourbusiness.com| managerPass456    | manager
3  | Cashier User | cashier@yourbusiness.com| cashierPass789    | cashier
```

## Access Credentials

### Admin User
- **Email**: admin@yourbusiness.com
- **Password**: securePassword123
- **Role**: admin (full access to all features)

### Manager User
- **Email**: manager@yourbusiness.com
- **Password**: managerPass456
- **Role**: manager (access to most features except administrative settings)

### Cashier User
- **Email**: cashier@yourbusiness.com
- **Password**: cashierPass789
- **Role**: cashier (limited access, primarily for sales operations)

## How Authentication Works

1. **Login Process**:
   - When a user enters their email and password on the login page, the system sends a request to fetch data from Sheet1
   - The system compares the entered credentials with the data stored in the Google Sheet
   - If a match is found, the user is authenticated and granted access based on their role

2. **Data Flow**:
   ```
   Login Page → AuthContext → Google Sheets API → Sheet1 → Credential Verification → User Session
   ```

3. **Session Management**:
   - After successful authentication, user data is stored in the browser's localStorage
   - This allows users to remain logged in during their session
   - Logging out removes the user data from localStorage

## Security Considerations

### Current Implementation
- Passwords are stored in plain text in Google Sheets
- Authentication is performed by comparing plain text values
- User sessions are maintained in browser localStorage

### Important Security Notes
1. **Plain Text Storage**: Passwords are currently stored as plain text in Google Sheets, which is not secure for production use
2. **No Encryption**: There is no encryption of passwords either in transit or at rest
3. **Session Security**: Browser localStorage is not the most secure method for session management

### Recommended Security Improvements
1. **Password Hashing**: Implement password hashing (e.g., bcrypt) before storing in Google Sheets
2. **HTTPS**: Ensure all communications use HTTPS
3. **Session Management**: Implement proper session tokens with expiration
4. **Rate Limiting**: Add rate limiting to prevent brute force attacks
5. **Two-Factor Authentication**: Consider implementing 2FA for additional security

## Managing User Accounts

### Adding New Users
To add new users, you can directly edit the Sheet1 in your Google Spreadsheet by adding new rows with the required information:
```
[ID] | [Name] | [Email] | [Password] | [Role]
```

### Modifying Existing Users
To change user information (including passwords), edit the corresponding row in Sheet1.

### Removing Users
To remove users, delete the corresponding row from Sheet1.

## API Endpoint

The authentication system communicates with your Google Sheets through the following API endpoint:
```
https://google-sheets-rest-api-production.up.railway.app/api/v1/sheets/Sheet1
```

## Troubleshooting

### Authentication Issues
1. **Invalid Credentials Error**: 
   - Verify that the email and password match exactly with the data in Sheet1
   - Check for extra spaces or characters
   - Ensure Sheet1 contains the correct user data structure

2. **Cannot Access Sheet1**:
   - Verify that the Google Sheets API is properly configured
   - Check that the service account has access to your spreadsheet
   - Ensure the spreadsheet ID is correctly configured in the backend

3. **Session Issues**:
   - Clear browser cache and localStorage if experiencing login problems
   - Try logging in with an incognito/private browser window

## Best Practices

1. **Regular Password Updates**: Change passwords periodically for security
2. **Strong Passwords**: Use complex passwords with a mix of characters
3. **Limited Access**: Only grant admin access to trusted personnel
4. **Backup**: Regularly backup your Google Spreadsheet
5. **Monitoring**: Monitor login attempts for suspicious activity

## For Developers

### Authentication Flow Code
The authentication logic is implemented in `src/contexts/AuthContext.tsx`:

```typescript
const login = async (email: string, password: string) => {
  try {
    // Fetch user data from Google Sheets
    const response = await getSheetData('Sheet1');
    
    if (response && response.data && response.data.values) {
      const users = response.data.values;
      
      // Skip the header row (index 0) and check each user
      for (let i = 1; i < users.length; i++) {
        const [id, name, userEmail, userPassword, role] = users[i];
        
        if (userEmail === email && userPassword === password) {
          // Authentication successful
          const userData: User = {
            id,
            name,
            email: userEmail,
            role: role as 'admin' | 'manager' | 'cashier'
          };
          
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('pos_user', JSON.stringify(userData));
          return;
        }
      }
      
      // If we get here, no matching user was found
      throw new Error('Invalid credentials');
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
};
```

## Conclusion

The Railway POS system uses Google Sheets as its authentication database, storing user credentials in Sheet1. While this provides a simple and accessible solution, it's important to implement additional security measures for production use, particularly password hashing and secure session management.
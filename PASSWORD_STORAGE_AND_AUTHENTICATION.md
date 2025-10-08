# Password Storage and Authentication System

## Overview

This document explains how passwords are stored and how the authentication system works in the Railway POS system.

## Password Storage Location

Passwords are stored in **Google Sheets**, specifically in **Sheet1** of your spreadsheet. This sheet is configured as the "Users" sheet and contains user authentication data.

## Current Password Data Structure

The Users sheet (Sheet1) contains the following columns:
```
ID | Name         | Email                   | Password          | Role
1  | John Smith   | admin@businessproject.co.tz  | securePassword123 | admin
2  | Sarah Johnson| manager@businessproject.co.tz| managerPass456    | manager
3  | Mike Wilson  | cashier@businessproject.co.tz| cashierPass789    | cashier
```

## Access Credentials

### Admin User
- **Email**: admin@businessproject.co.tz
- **Password**: securePassword123
- **Role**: admin (full access to all features)
- **Description**: Business owner with complete system access

### Manager User
- **Email**: manager@businessproject.co.tz
- **Password**: managerPass456
- **Role**: manager (access to most features except administrative settings)
- **Description**: Operations manager with access to reports and product management

### Cashier User
- **Email**: cashier@businessproject.co.tz
- **Password**: cashierPass789
- **Role**: cashier (limited access, primarily for sales operations)
- **Description**: Front-line staff with access to POS functions only

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
6. **Audit Logging**: Log all authentication attempts for security monitoring
7. **Password Complexity**: Enforce strong password policies
8. **Regular Password Updates**: Implement password expiration policies

## Managing User Accounts

### Adding New Users
To add new users, you can directly edit the Sheet1 in your Google Spreadsheet by adding new rows with the required information:
```
[ID] | [Name] | [Email] | [Password] | [Role]
4 | New User | newuser@businessproject.co.tz | newUserPass123 | cashier
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

1. **Regular Password Updates**: Change passwords periodically for security (recommended every 90 days)
2. **Strong Passwords**: Use complex passwords with a mix of characters, numbers, and symbols (minimum 12 characters)
3. **Limited Access**: Only grant admin access to trusted personnel
4. **Backup**: Regularly backup your Google Spreadsheet
5. **Monitoring**: Monitor login attempts for suspicious activity
6. **Role-Based Access**: Assign users the minimum role necessary for their job functions
7. **Multi-Factor Authentication**: Implement additional authentication factors where possible
8. **Security Training**: Train staff on security best practices

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

### Security Enhancement Recommendations

For production deployment, consider implementing these security enhancements:

1. **Password Hashing Implementation**:
```typescript
// Example using bcrypt (server-side)
import bcrypt from 'bcrypt';

// Hash password before storing
const saltRounds = 12;
const hashedPassword = await bcrypt.hash(plainTextPassword, saltRounds);

// Compare passwords during login
const isValid = await bcrypt.compare(enteredPassword, storedHashedPassword);
```

2. **JWT Token Implementation**:
```typescript
// Generate JWT token on successful login
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);
```

3. **Rate Limiting Implementation**:
```typescript
// Implement rate limiting to prevent brute force attacks
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
```

## Business Context

This authentication system is designed for small to medium-sized retail businesses in Tanzania that need a simple yet effective point-of-sale system. The system currently supports:

- **Multiple User Roles**: Admin, Manager, and Cashier with appropriate access levels
- **Tanzanian Business Context**: Using Tanzanian Shillings (TSh) and local business practices
- **Scalable Architecture**: Can accommodate growing businesses with multiple locations
- **Integration Ready**: Designed to work with existing Google Sheets-based inventory systems

## Future Enhancements

Planned improvements for future versions:

1. **OAuth Integration**: Support for Google, Microsoft, and other authentication providers
2. **Biometric Authentication**: Fingerprint or facial recognition for high-security environments
3. **Role-Based Permissions**: More granular access control within each role
4. **Audit Trail**: Comprehensive logging of all user activities
5. **Password Policies**: Automated enforcement of password complexity and expiration
6. **Single Sign-On (SSO)**: Integration with enterprise identity providers
7. **Multi-Tenant Support**: Support for businesses with multiple locations or franchises

## Conclusion

The Railway POS system uses Google Sheets as its authentication database, storing user credentials in Sheet1. While this provides a simple and accessible solution, it's important to implement additional security measures for production use, particularly password hashing and secure session management. The system is designed with Tanzanian businesses in mind and can be easily customized to meet specific organizational needs.
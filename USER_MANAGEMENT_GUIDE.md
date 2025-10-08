# User Management Guide for Railway POS System

## Overview

This guide provides instructions for managing user accounts in the Railway POS system. User accounts are stored in Google Sheets (Sheet1) and can be managed directly through the spreadsheet.

## User Roles and Permissions

### Administrator (admin)
**Permissions**:
- Full access to all system features
- User management (add, edit, delete users)
- System configuration
- Financial reports and analytics
- Product and inventory management
- Settings modification

**Typical Users**:
- Business owners
- General managers
- IT administrators

### Manager (manager)
**Permissions**:
- Sales operations
- Product management
- Generate reports
- View financial data
- Manage cashier accounts

**Typical Users**:
- Operations managers
- Department heads
- Assistant managers

### Cashier (cashier)
**Permissions**:
- Process sales transactions
- Print receipts
- View current inventory levels
- Basic customer management

**Typical Users**:
- Cashiers
- Sales representatives
- Front desk staff

## Adding New Users

### Step 1: Access Google Sheets
1. Open your Google Sheets spreadsheet
2. Navigate to Sheet1 (Users sheet)
3. Ensure you're on the correct spreadsheet used by your POS system

### Step 2: Add User Information
Add a new row with the following information:

| Column | Information | Example |
|--------|-------------|---------|
| ID | Unique numeric ID | 4 |
| Name | Full name of user | James Mwangi |
| Email | Business email address | jmwangi@businessproject.co.tz |
| Password | Secure password | Mw@ng1P@ss2025 |
| Role | User role (admin/manager/cashier) | cashier |

### Step 3: Password Security Best Practices
When creating passwords, ensure they:
- Are at least 12 characters long
- Include uppercase and lowercase letters
- Contain numbers and special characters
- Are unique and not reused from other systems
- Are changed every 90 days

### Example User Creation
```
ID: 4
Name: James Mwangi
Email: jmwangi@businessproject.co.tz
Password: Mw@ng1P@ss2025
Role: cashier
```

## Modifying Existing Users

### Changing User Information
1. Locate the user's row in Sheet1
2. Edit the appropriate cell:
   - To change name: Edit the Name column
   - To change email: Edit the Email column
   - To change role: Edit the Role column
   - To change password: Edit the Password column

### Role Changes
When changing user roles, consider:
- Whether the user needs training on new permissions
- Updating the user on their new responsibilities
- Notifying other team members of the change

## Removing Users

### Process for User Removal
1. Locate the user's row in Sheet1
2. Delete the entire row
3. Confirm the user can no longer access the system
4. Reassign any pending responsibilities

### Security Considerations
- Immediately remove access for terminated employees
- Collect company property (IDs, keys, devices)
- Notify relevant team members
- Update access logs

## Security Best Practices

### Password Management
1. **Regular Updates**: Require password changes every 90 days
2. **Complexity Requirements**: Enforce strong password policies
3. **Unique Passwords**: Ensure each user has a unique password
4. **No Sharing**: Prohibit password sharing between users

### Access Control
1. **Principle of Least Privilege**: Grant minimum required access
2. **Regular Audits**: Review user access quarterly
3. **Role-Based Access**: Assign permissions based on job function
4. **Temporary Access**: Provide temporary access for contractors

### Monitoring
1. **Login Activity**: Monitor login times and frequency
2. **Failed Attempts**: Track and investigate failed login attempts
3. **Permission Changes**: Log all changes to user permissions
4. **Access Reviews**: Regular review of active user accounts

## Troubleshooting Common Issues

### Login Problems
1. **Incorrect Credentials**:
   - Verify email and password match exactly
   - Check for extra spaces or characters
   - Ensure Caps Lock is off

2. **Account Locked**:
   - Check if the user row exists in Sheet1
   - Verify the role is correctly spelled
   - Confirm the user account hasn't been deleted

3. **Connection Issues**:
   - Check internet connectivity
   - Verify the backend API is accessible
   - Ensure the spreadsheet ID is correct

### Permission Issues
1. **Insufficient Access**:
   - Verify the user's role in Sheet1
   - Check if the role has the required permissions
   - Confirm the user has logged out and back in

2. **Role Not Recognized**:
   - Ensure the role is spelled correctly (admin/manager/cashier)
   - Check for extra spaces or characters
   - Verify the role is supported by the system

## Business-Specific Considerations

### Tanzanian Business Context
- Use local email domains (e.g., @businessproject.co.tz)
- Consider local naming conventions
- Account for Swahili language users
- Follow local data protection regulations

### Multi-Location Businesses
- Create location-specific user groups
- Assign managers to specific locations
- Track sales by location through user accounts
- Implement location-based reporting

### Seasonal Staff
- Create temporary accounts for seasonal workers
- Set expiration dates for temporary access
- Provide basic training on POS operations
- Remove access promptly at end of season

## Reporting and Analytics

### User Activity Reports
- Track login frequency and times
- Monitor sales transactions by user
- Identify high-performing cashiers
- Detect unusual activity patterns

### Security Reports
- Failed login attempts
- Password change history
- Permission modification logs
- Account creation/deletion records

## Integration with Other Systems

### Google Workspace
- Sync with Google Workspace for single sign-on
- Use Google Groups for role management
- Implement Google's security features

### Payroll Systems
- Export user data for payroll processing
- Track hours worked through POS activity
- Generate productivity reports

## Compliance and Legal

### Data Protection
- Store user data securely
- Comply with local privacy regulations
- Implement data retention policies
- Provide data access upon request

### Audit Requirements
- Maintain detailed access logs
- Document all user management activities
- Regular security audits
- Compliance reporting

## Contact Support

For issues with user management:
- Email: support@businessproject.co.tz
- Phone: +255 XXX XXX XXX
- Hours: Monday-Friday, 8:00 AM - 6:00 PM EAT

## Appendix: Emergency Procedures

### Lost Administrator Access
1. Contact system support immediately
2. Provide business verification documentation
3. Request temporary admin access restoration
4. Create new admin account once access is restored

### Security Breach Response
1. Immediately change all user passwords
2. Review access logs for unauthorized activity
3. Notify affected parties
4. Implement additional security measures
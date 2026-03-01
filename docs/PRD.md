# Product Requirements Document (PRD)
## Admin Jewel Portal

**Version:** 1.0  
**Last Updated:** January 22, 2026  
**Product Owner:** DataGold Analytics Team

---

## 1. Executive Summary

### 1.1 Product Vision
Admin Jewel Portal is a comprehensive jewelry store management system designed to track customer interactions, manage sales consultants, analyze customer behavior patterns, and provide actionable insights for jewelry retail operations. The system leverages face recognition technology, session tracking, and family clustering to deliver personalized customer experiences and optimize sales performance.

### 1.2 Target Users
- **Store Managers**: Monitor overall store performance, manage staff, and analyze customer trends
- **Sales Administrators**: Track salesperson performance, allocate customers, and generate reports
- **Business Analysts**: Access detailed analytics, customer insights, and performance metrics

### 1.3 Key Objectives
- Streamline customer identification and tracking using face recognition
- Optimize salesperson-customer allocation and interaction management
- Provide real-time analytics on store traffic, customer behavior, and sales performance
- Enable family-based customer relationship management
- Generate comprehensive performance reports for decision-making

---

## 2. Core Features

### 2.1 Dashboard & Analytics

#### 2.1.1 Overview Metrics
**Priority:** High  
**User Story:** As a store manager, I want to see key performance indicators at a glance to understand daily operations.

**Features:**
- **Total Customers**: Display total unique customers with daily/weekly trends
- **Estimated Sales**: Calculate revenue based on completed sessions
- **Average Time per Customer**: Track engagement duration
- **Attendance Percentage**: Monitor customer service coverage

#### 2.1.2 Visualization Charts
- **Daily Customer Visits**: Line chart showing customer traffic over time
- **Sales Consultant Performance**: Bar chart comparing salesperson metrics
- **Floor-wise Visitor Distribution**: Pie chart showing traffic by zone
- **Daily Peak Activity Analysis**: Heatmap showing hourly activity by floor

**Data Sources:**
- Real-time customer detection from `ml_detections` table
- Session data from `sessions` and `session_details` tables
- Event tracking from `events` table

---

### 2.2 Customer Management

#### 2.2.1 Customer Tracking
**Priority:** High  
**User Story:** As a sales administrator, I want to view all customer interactions to understand shopping patterns.

**Features:**
- **Customer Identification**: Display customers by unique ID (short_id)
- **Visit History**: Track first seen, last seen, and total visits
- **Current Status**: Show if customer is currently in-store and location
- **Photo Recognition**: Display customer photos from face detection system

#### 2.2.2 Session Details View
**Priority:** High  
**User Story:** As a manager, I want to see detailed session information for each customer visit.

**Display Information:**
- **Salesperson Assignment**: Who served the customer
- **Jewels Shown**: List of items presented during session
- **Jewels Sold**: Items purchased (highlighted with badges)
- **Session Notes**: Comments and observations from salesperson
- **Timestamp**: Date and time of interaction

#### 2.2.3 Family Clustering
**Priority:** Medium  
**User Story:** As a sales team, I want to identify family relationships to provide coordinated service.

**Features:**
- **Family Head Identification**: Mark primary family member
- **Member Relationships**: Track family connections (spouse, parent, child, etc.)
- **Consolidated View**: Modal showing all family members with their individual histories
- **Family-level Analytics**: Aggregate purchase patterns and preferences

**Implementation:**
- Customers linked via `family_id` in `customers` table
- Family details stored in `family_clusters` table
- UI displays "Family Head" badge for primary members
- Click-through to detailed family modal

#### 2.2.4 Search & Filtering
- **Search by Customer ID**: Quick lookup functionality
- **Visit Frequency Filters**: New (1 visit), Regular (2-5 visits), VIP (5+ visits)
- **Floor/Zone Filters**: Filter by current location

---

### 2.3 Salesperson Management (Touch Section)

#### 2.3.1 Salesperson Directory
**Priority:** High  
**User Story:** As an administrator, I want to manage all sales consultants and their assignments.

**Features:**
- **Profile Management**: Name, role, photo, zone assignment, status
- **Status Tracking**: Active, On Leave, Inactive
- **Zone Assignment**: First Floor, Second Floor
- **Role Types**: Salesman, Manager, Admin
- **Authentication**: Username and password management

#### 2.3.2 Performance Tracking
**Priority:** High  
**User Story:** As a manager, I want to see each salesperson's customer interactions and sales.

**Displayed Metrics:**
- **Customers Attended**: Count of unique customers served
- **Jewels Shown**: Total items presented
- **Jewels Sold**: Items successfully sold
- **Sales Revenue**: Total monetary value
- **Session History**: Detailed log of all customer interactions

#### 2.3.3 Floating Customer Allocation
**Priority:** Medium  
**User Story:** As a manager, I want to allocate unassigned customers to available salespersons.

**Features:**
- **Floating Customer List**: Display customers not yet assigned to a salesperson
- **Customer Details**: ID, entry time, current zone
- **Allocation Interface**: Select salesperson from dropdown
- **Status Tracking**: Show "Assigned" status after allocation
- **Real-time Updates**: Immediate UI feedback on assignment

**Mock Data Structure:**
```javascript
{
  id: 'FC-1001',
  name: 'Visitor 1001',
  time: '10:45 AM',
  zone: 'Entrance'
}
```

#### 2.3.4 CRUD Operations
- **Add Salesperson**: Create new user with photo upload
- **Edit Salesperson**: Update profile, zone, status, password
- **Delete Salesperson**: Remove user (with confirmation)
- **Search**: Filter by name or ID

---

### 2.4 Reports & Export

#### 2.4.1 Report Generation
**Priority:** High  
**User Story:** As a manager, I want to generate professional reports for performance reviews.

**Report Types:**
- **Individual Executive Report**: Detailed salesperson performance analysis
- **Team Performance Report**: Consolidated team overview

**Report Sections:**
1. **Consultant Profile**: Photo, name, role, zone, status
2. **Performance Highlights**: Key metrics in visual cards
3. **Detailed Analysis**: Metrics vs. targets with evaluations
4. **Customer Interaction Logs**: Session-by-session breakdown
5. **Managerial Notes**: Editable feedback section

#### 2.4.2 Export Formats
**Priority:** Medium  
**User Story:** As an administrator, I want to export data in multiple formats for analysis.

**Supported Formats:**
- **PDF**: Print-ready professional reports with branding
- **CSV**: Comma-separated values for spreadsheet analysis
- **Excel**: XML-based Excel format with formatting

**Export Capabilities:**
- Individual salesperson reports
- Full team reports
- Custom date ranges
- Filtered datasets

#### 2.4.3 Report Customization
- **Editable Fields**: Name, role, zone, sales figures
- **Managerial Notes**: Free-text feedback area
- **Live Preview**: Real-time preview before export
- **Professional Styling**: DataGold branded templates

---

### 2.5 Authentication & Security

#### 2.5.1 User Authentication
**Priority:** High  
**User Story:** As a user, I want secure access to the system.

**Features:**
- **Login System**: Username and password authentication
- **Role-based Access**: Different permissions for admin, manager, salesman
- **Session Management**: Persistent login with localStorage
- **Active Status Check**: Verify user account is active

**Security Notes:**
> [!WARNING]
> Current implementation stores passwords in plaintext. Production deployment requires bcrypt hashing and JWT token implementation.

#### 2.5.2 User Roles
- **Admin**: Full system access, user management, all reports
- **Manager**: View all data, manage salespersons, generate reports
- **Salesman**: View assigned customers, update session details

---

### 2.6 Settings & Integrations

#### 2.6.1 System Settings
**Priority:** Low  
**User Story:** As an administrator, I want to configure system preferences.

**Planned Features:**
- Store configuration
- Zone/floor management
- Business hours settings
- Notification preferences

#### 2.6.2 Third-party Integrations
**Priority:** Low  
**User Story:** As a business owner, I want to integrate with other systems.

**Planned Integrations:**
- POS systems
- CRM platforms
- Email marketing tools
- Analytics platforms

---

## 3. User Flows

### 3.1 Daily Manager Workflow
1. **Login** → Enter credentials → Access dashboard
2. **Review Metrics** → Check daily KPIs → Identify trends
3. **Monitor Activity** → View heatmap → Allocate resources
4. **Check Salesperson Performance** → Review bar chart → Identify top performers
5. **Manage Floating Customers** → Allocate to salespersons → Track assignments

### 3.2 Customer Session Tracking
1. **Customer Enters Store** → Face detection → Record entry
2. **Salesperson Assignment** → Manual or automatic allocation
3. **Session Creation** → Start interaction → Show jewels
4. **Session Details** → Record items shown → Add comments
5. **Session Completion** → Mark items sold → End session
6. **Data Aggregation** → Update customer history → Update salesperson metrics

### 3.3 Report Generation Workflow
1. **Navigate to Reports** → Select salesperson or team
2. **Review Data** → View performance metrics
3. **Edit Report** → Customize fields → Add managerial notes
4. **Export** → Choose format (PDF/CSV/Excel)
5. **Print/Share** → Generate final document

---

## 4. Data Requirements

### 4.1 Customer Data
- **Identification**: short_id, face_embedding_id, photo
- **Visit Tracking**: first_seen, last_seen, total_visits
- **Location**: current_floor, is_in_store
- **Relationships**: family_id, family_relationship

### 4.2 Session Data
- **Participants**: salesperson_id, customer_id
- **Timing**: start_time, end_time
- **Status**: active, completed, abandoned
- **Details**: jewel_id, action (shown/sold), comments

### 4.3 Salesperson Data
- **Profile**: username, full_name, photo, role
- **Assignment**: zone (floor), status
- **Authentication**: password_hash, is_active
- **Performance**: Calculated from sessions

### 4.4 Analytics Data
- **ML Detections**: Face detection events by floor and time
- **Events**: Camera-based customer tracking
- **Heatmap**: Hourly activity by zone

---

## 5. Non-Functional Requirements

### 5.1 Performance
- **Page Load**: Dashboard loads within 2 seconds
- **API Response**: Backend responds within 500ms for standard queries
- **Real-time Updates**: Customer status updates within 5 seconds

### 5.2 Scalability
- Support for 100+ concurrent users
- Handle 1000+ customer records
- Process 500+ daily sessions

### 5.3 Usability
- **Responsive Design**: Works on desktop (primary), tablet, mobile
- **Intuitive Navigation**: Sidebar navigation with clear labels
- **Visual Feedback**: Loading states, success/error messages
- **Accessibility**: Keyboard navigation, screen reader support

### 5.4 Reliability
- **Uptime**: 99.5% availability during business hours
- **Data Integrity**: ACID-compliant database transactions
- **Backup**: Daily automated backups

---

## 6. Success Metrics

### 6.1 Business Metrics
- **Customer Tracking Accuracy**: 95%+ correct identification
- **Session Completion Rate**: 80%+ sessions with complete data
- **Salesperson Utilization**: 85%+ active time
- **Report Generation**: 100+ reports per month

### 6.2 User Adoption
- **Daily Active Users**: 10+ users per day
- **Feature Usage**: 70%+ of features used weekly
- **User Satisfaction**: 4.0+ rating (out of 5)

### 6.3 Technical Metrics
- **API Uptime**: 99.5%
- **Error Rate**: <1% of requests
- **Database Query Performance**: <200ms average

---

## 7. Future Enhancements

### 7.1 Phase 2 Features
- **AI-powered Recommendations**: Suggest jewels based on customer history
- **Predictive Analytics**: Forecast customer purchase likelihood
- **Mobile App**: Native iOS/Android apps for salespersons
- **WhatsApp Integration**: Send session summaries to customers

### 7.2 Phase 3 Features
- **Inventory Management**: Track jewel stock levels
- **Appointment Scheduling**: Book customer visits
- **Loyalty Program**: Points and rewards system
- **Multi-store Support**: Manage multiple locations

---

## 8. Constraints & Assumptions

### 8.1 Technical Constraints
- PostgreSQL database (remote server at 10.100.21.222)
- React + Vite frontend
- FastAPI Python backend
- Face recognition system (external dependency)

### 8.2 Business Constraints
- Single store operation (current scope)
- Manual customer-salesperson allocation
- Plaintext password storage (temporary)

### 8.3 Assumptions
- Customers consent to face recognition
- Salespersons have basic computer literacy
- Reliable network connectivity in store
- Face detection system is operational

---

## 9. Glossary

| Term | Definition |
|------|------------|
| **Touch Section** | Salesperson management module |
| **Floating Customer** | Customer not yet assigned to a salesperson |
| **Family Head** | Primary member of a family cluster |
| **Session** | Single customer-salesperson interaction |
| **Zone/Floor** | Physical store location (First Floor, Second Floor) |
| **Short ID** | Unique customer identifier |
| **Jewel** | Individual jewelry item |
| **ML Detection** | Machine learning-based face detection event |

---

**Document Status:** ✅ Complete  
**Next Review:** March 2026

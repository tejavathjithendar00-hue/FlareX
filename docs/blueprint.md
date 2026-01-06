# **App Name**: FireResponse

## Core Features:

- User Registration: Allow fire station users to register with name, mobile number, email, vehicle number, and a document URL for verification. Email app password can be obtained by the admin to allow new registrants
- Admin Approval Workflow: Notify the admin (via forestnodeflarex@gmail.com) upon user registration. Provide an interface for the admin to approve or reject user applications. Approved/rejected users receive email notifications and a one-time password/username. Initial admin credentials: username 'admin', password 'FlareX@BBJMSV'.
- Password Management: Implement password creation with a 'show password' checkbox. Require users to change their password immediately after the first login.
- Fire Detection Alert: Display a prominent 'ALERT: FIRE DETECTED' popup on the website upon fire detection by a sender node. Send email notifications if the website is closed.
- Real-time Data Visualization: Display continuously updating data (every 2 seconds) upon user login, showing temperature over time and presented as a dynamic, expandable graph.
- Historical Data Access: Allow users to access and view historical fire data, displayed in hourly graphs for previous days.
- Dynamic Theme Transition: Apply a fire theme using generative AI in response to detected fires, transitioning in 2 seconds without page refresh, then reverting to a normal theme when the alert clears. A tool will make use of available environmental data and reason when a 'false alarm' style error has occurred, and filter such instances to limit alerts.

## Style Guidelines:

- Primary color: Deep red (#C70039), embodying urgency and the core of the fire theme.
- Background color: Light gray (#EEEEEE), providing a calm, neutral backdrop in normal mode. 
- Accent color: Yellow-orange (#FFC300), highlights crucial information and calls to action.
- Body and headline font: 'Inter', sans-serif font. Clean and readable, ensuring clarity in critical situations
- Use universally recognizable icons to represent different data points and actions.
- Design a responsive layout ensuring accessibility and clear data presentation on various devices.
- Implement smooth transitions between the normal and fire themes, enhancing user experience without causing unnecessary alarm.
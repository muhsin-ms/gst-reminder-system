# GST Client Follow-up Management System

A professional web application designed to help GST offices track clients, manage daily follow-ups, and send reminders efficiently.

## Features

### Core Functionality
- **Client Management**: Add, edit, and delete GST clients with detailed information
- **Smart Dashboard**: Real-time overview of total clients, due today, due in 3 days, and overdue clients
- **Today's Follow-ups**: Automated daily task list showing clients needing immediate attention
- **Status Tracking**: Track client status (Pending, Reminded, Completed)
- **WhatsApp Integration**: Send pre-filled WhatsApp messages directly to clients
- **Custom Messages**: Multiple message templates and custom message options
- **Bilingual Support**: Toggle between English and Malayalam languages
- **Search & Filter**: Advanced search and status filtering capabilities

### Technical Features
- Modern SaaS-style UI with Tailwind CSS
- Responsive design for all devices
- Real-time data updates
- JSON file storage (no database required)
- RESTful API architecture
- Professional animations and transitions

## Quick Start

### Prerequisites
- Node.js installed on your system
- Modern web browser

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Access the Application**
   Open your browser and navigate to: `http://localhost:3000`

### For Development
```bash
npm run dev
```

## Usage Guide

### 1. Adding Clients
- Click "Add New Client" button
- Fill in client details:
  - Name
  - Phone Number
  - Service Type (GST Filing, Registration, Consultation)
  - Due Date
  - Notes (optional)
- Click "Save Client"

### 2. Dashboard Overview
- **Total Clients**: All clients in the system
- **Due Today**: Clients with GST filing due today
- **Due in 3 Days**: Clients with upcoming deadlines
- **Overdue**: Clients who missed their deadlines

### 3. Today's Follow-ups
- Automatically shows clients needing attention
- Color-coded urgency (Red for overdue, Yellow for today)
- Quick action buttons for sending reminders and marking complete

### 4. WhatsApp Integration
- Click the WhatsApp button next to any client
- Choose from message templates:
  - Default GST Reminder
  - Urgent Reminder
  - Custom Message
- Message automatically opens in WhatsApp with pre-filled text

### 5. Status Management
- **Pending**: New clients awaiting action
- **Reminded**: Clients who have been contacted
- **Completed**: Clients who have filed their GST

### 6. Language Support
- Click the language toggle in the header
- Switch between English and Malayalam
- All interface elements update automatically

## API Endpoints

### Client Management
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Dashboard & Follow-ups
- `GET /api/dashboard` - Get dashboard statistics
- `GET /api/followups` - Get today's follow-ups

## Data Storage

The system uses JSON files for data storage:
- `data/clients.json` - All client data
- Automatic backup and recovery
- No database setup required

## Message Templates

### English Templates
- **Default**: "Hi {name}, your GST filing is due on {date}. Please complete it."
- **Urgent**: "URGENT: Hi {name}, your GST filing is due TOMORROW ({date}). Please complete it immediately to avoid penalties."

### Malayalam Templates
- **Default**: "Hi {name}, ningalude GST filing date {date} aanu. Dayavayi complete cheyyuka."
- **Urgent**: "URGENT: Hi {name}, ningalude GST filing date nale ({date}) aanu. Penalty avoid cheyyan dayavayi thudanguka."

## File Structure

```
gst-reminder-tool/
|-- server.js                 # Express server and API routes
|-- package.json             # Dependencies and scripts
|-- public/
|   |-- index.html          # Main application interface
|   |-- app.js              # Frontend JavaScript
|-- data/
|   |-- clients.json        # Client data storage
|-- README.md               # This file
```

## Technologies Used

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **fs-extra**: File system operations
- **CORS**: Cross-origin resource sharing

### Frontend
- **HTML5**: Structure
- **Tailwind CSS**: Styling
- **Vanilla JavaScript**: Functionality
- **Font Awesome**: Icons

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- Data stored locally in JSON files
- No external API dependencies
- WhatsApp integration uses official wa.me links
- All client data stays on your local system

## Troubleshooting

### Common Issues

1. **Server won't start**
   - Check if Node.js is installed
   - Verify port 3000 is not in use
   - Run `npm install` to ensure dependencies

2. **Data not saving**
   - Check file permissions in `data/` directory
   - Ensure server has write access

3. **WhatsApp not opening**
   - Verify phone number format (no spaces, only digits)
   - Check internet connection
   - Ensure WhatsApp is installed on device

## Support

For issues or feature requests, please check the console logs for error messages and ensure all dependencies are properly installed.

## License

MIT License - Feel free to use and modify for your GST practice.

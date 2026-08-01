# CareClarity – Elderly Health Reminder System (Backend)

This repository contains the backend services for the CareClarity application. It is responsible for scheduling medicine reminders, triggering automated voice calls using the Twilio Voice API, sending SMS notifications for missed reminders, and managing patient medication data stored in Firebase Firestore.

> **Note:** The Flutter mobile application (frontend) is maintained in a separate repository.

---

## Features

- Automated medicine reminder scheduling
- Voice call reminders using Twilio Voice API
- SMS notifications for missed calls
- Real-time Firestore database integration
- Cloud Scheduler executes reminder checks every minute
- Call status tracking using Twilio Status Callback
- Secure cloud-based backend architecture

---

## Tech Stack

- Node.js
- JavaScript
- Firebase Cloud Functions
- Firebase Cloud Scheduler
- Firebase Firestore
- Twilio Voice API
- Twilio SMS API
- Git & GitHub

---

## Project Structure

```
backend/
├── functions/
│   ├── index.js
│   ├── package.json
│   └── node_modules/
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
└── .firebaserc
```

---

## How It Works

1. Patient medication details are stored in Firebase Firestore.
2. Firebase Cloud Scheduler triggers a Cloud Function every minute.
3. The function checks for medicines scheduled at the current time.
4. Twilio Voice API places an automated reminder call to the patient.
5. Twilio sends the call status to the callback function.
6. If the call is missed, busy, or unanswered, an SMS reminder is sent automatically.
7. The reminder is marked as completed to prevent duplicate calls.

---

## API & Services Used

- Firebase Cloud Functions
- Firebase Cloud Scheduler
- Firebase Firestore
- Twilio Voice API
- Twilio SMS API

---

## Frontend Repository

The Flutter mobile application is available in a separate repository.

🔗 **Frontend Repository:** *(Add your frontend repository link here.)*

Example:

```
https://github.com/your-username/CareClarity-Frontend
```

---

## Future Enhancements

- Support for multiple reminder schedules
- Multi-language voice reminders
- Emergency contact notifications
- Voice message customization
- Medication adherence analytics
- Admin dashboard for monitoring reminders

---
## Author

**Bhindu Bai Y**
Final Year Computer Science Engineering Student
---

## License

This project is developed for educational and research purposes.

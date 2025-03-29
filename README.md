# Slot Booking Application

The **Slot Booking Application** is a Node.js-based application that allows employees to book one-hour slots for sports or recreational activities in their office. The application supports OTP-based authentication and integrates with AWS services like DynamoDB and SNS. It can also be tested locally using NoSQL Workbench and Postman.

---

## Features

- **OTP-Based Authentication**: Employees authenticate using a unique employee code and receive an OTP via SMS.
- **Slot Booking**: Employees can book one-hour slots between 10 AM and 7 PM.
- **AWS Integration**: Uses DynamoDB for data storage and SNS for sending OTPs.
- **Local Testing**: Supports local testing with NoSQL Workbench and Postman.

---

## Prerequisites

1. **Node.js**: Install [Node.js](https://nodejs.org/) (v14 or later recommended).
2. **AWS CLI**: Install and configure the [AWS CLI](https://aws.amazon.com/cli/).
3. **NoSQL Workbench**: Install [NoSQL Workbench](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/workbench.html) for local DynamoDB testing.
4. **Postman**: Install [Postman](https://www.postman.com/) for API testing.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/slot-booking-application.git
   cd slot-booking-application

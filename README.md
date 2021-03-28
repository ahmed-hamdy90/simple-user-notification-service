
## Simple User Notification Sender Service

#### Explain for Service:
This Service used for send a notification to specific users,
user can receive two types for notifications: SMS and mobile push notification.
There notification groups which include some specific users, we can send notifications to users under this group once

Scenarios:
   - when call API to send notification for specific user, service search for user, save given notification into DB with ReadyToSend State
     then try to send this notification if success will update notification into DB to Sent State otherwise
     will update notification into DB to Fail State.
   
   - when call API to send notification for specific group, service search for group, extract users under it,
     then save given notification into DB with ReadyToSend State for every user and try to send this notification
     if success will update notification into DB to Sent State otherwise will update notification into DB to Fail State.
     
   - when call API to Retry send fail notifications into DB(can make this request by cronjob)
     to try to handle this fail notification and re-send them again for users,
     every notification has maximum tries number for re-send it again is 3 times. 

#### Used Technologies:
 - NodeJS
 - MongoDB
 - Socket.io
 - Docker
 - Docker-compose

#### Restful API Routes
  - Send Notification to specific user => http://localhost:3000/api/notify/user/{userId}
     - Routes Parameters: 
        - userId => user's id which want to send notification to it
     - Method: POST
     - Request JSON Body:
```
{
	"type": 2, // notification's type => 1: for SMS notidication, 2: push notification
	"title": "", // notification's title
	"message": ""  // notification's message
}
```
- Send Notification to users under specific group => http://localhost:3000/api/notify/group/{groupId}
    - Routes Parameters:
        - groupId => user's id which want to send notification to it
    - Method: POST
    - Request JSON Body:
```
{
  "type": 2, // notification's type => 1: for SMS notidication, 2: push notification
  "title": "", // notification's title
  "message": ""  // notification's message
}
```

- Re-try send fail notifications => http://localhost:3000/api/trySendNotifications
    - Method: POST
    - Request JSON Body:
```
{
  "type": 2 // notification's type => 1: for SMS notidication, 2: push notification
}
```

#### Service Folder Structure
  - api => folder include nodeJS Restful API
  - push-notification-server => folder include nodeJS server use socket.io as push notification service

#### How to run Service
  - Build docker images and run all services
```shell
docker-compose build && docker-compose up
```

  - Before use Service must run Database Seeder to add some Dummy data for Testing
```shell
docker exec -it nodeapp bash
node dbSeeder.js
```

### TODO:
  - Apply Unit tests on available services classes
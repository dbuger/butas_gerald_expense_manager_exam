# EXPENSE MANAGER EXAM

## Project Structure
| Directory Name | Framework | Version| Requirements |
| ------ | ------ | ------ | ------ |
| client | VueJs| 3.0.0 | latest node
|service_provider| Laravel | ^7.29 | php7.4 or higher

### Default accounts

| username/email address | password | role |
| ------ | ------ | ---- |
| juan@expensemanager.com | password | Administrator |
| leo@expensemanager.com | password | User |

## Getting started

### Create database:
- Make sure you have MySql or MariaDb installed on your PC or Laptop.
- Create database: 
    - For example: `expense_manager_db`
    - Recommended Collation: `utf8mb4_unicode_ci`

### Configuring the service_provider: 
1. Open `service_provider` directory in the terminal
2. Install dependencies by running the command
```sh
composer install
```
3. Create new .env file. You may copy the .env.example file then rename it to .env
4. Open .env file on your IDE or text editor e.g(Notepad, Notepad++, etc.) and update the following lines.
```sh
DB_DATABASE=[YourDatabaseNameHere]
DB_USERNAME=[YourDatabaseUser]
DB_PASSWORD=[YourDatabasePassword or LeaveBlankIfNone]
```
For example...
```sh
DB_DATABASE=expense_manager_db
DB_USERNAME=root
DB_PASSWORD=
```
5. Generate application key. On the terminal, run the command
```sh
php artisan key:generate
```
It will update the .env file APP_KEY. example: `APP_KEY=base64:NpclYJIHucv/bA0tNSlR2cCcpo1JUo3a5VFxOdZ45zQ=`
6. Re-cache the application.  On the terminal, run the command
```sh
php artisan config:cache
```
7. Migrate tables to the database.
```sh
php artisan migrate
```
8. Install laravel-passport.
```sh
php artisan passport:install
```
After executing the command it will Generate Encryption keys. For example:
```sh
Encryption keys generated successfully.
Personal access client created successfully.
Client ID: 1
Client secret: DSzQYjBJN3RQSKBWdv2xqb1Oot8FesZoTI02GZEg
Password grant client created successfully.
Client ID: 2
Client secret: LJh639UYjoUB7MDrOnvxeW47qH5hc0mNrsJz17RZ
```
Copy Password Grant and store it on a file. this will be use later for the client configuration.  
```sh 
Password grant client created successfully.
Client ID: 2
Client secret: LJh639UYjoUB7MDrOnvxeW47qH5hc0mNrsJz17RZ
``` 
>Note: Do not use the value from the README file.
> 
>The `Client secret: LJh639UYjoUB7MDrOnvxeW47qH5hc0mNrsJz17RZ` is unique it will have different value in your case.

9. Seed default data to the database.
```sh
php artisan db:seed --class=DemoSeed
```

### Configuring the client: 
1. Open `client` directory in the terminal
2. Install dependencies by running the command
```sh
npm install
```
3. Open .env file found inside the client directory on your IDE or text editor e.g(Notepad, Notepad++, etc.)
```sh
VUE_APP_API_HOST=http://127.0.0.1:8000/
VUE_APP_GRANT_TYPE=password
VUE_APP_CLIENT_ID=2
VUE_APP_CLIENT_SECRET=1dMryosPU1eAVhE4D0dmeGbKWRxXyoZdRaoa8uSr
```
Here we can set the `VUE_APP_CLIENT_SECRET` value using the `Client secret: LJh639UYjoUB7MDrOnvxeW47qH5hc0mNrsJz17RZ` generated from the passport install.

For Example:

```sh
VUE_APP_API_HOST=http://127.0.0.1:8000/
VUE_APP_GRANT_TYPE=password
VUE_APP_CLIENT_ID=2
VUE_APP_CLIENT_SECRET=LJh639UYjoUB7MDrOnvxeW47qH5hc0mNrsJz17RZ
```

You can also set the `VUE_APP_API_HOST` if the `service_provider` is served on different IP Address or Port. 


## Running the projects

1. Run the `service_provider` first. Open the directory in a terminal and execute command

```sh
php artisan serve
```

It will display a message like this:
```shell
Laravel development server started: http://127.0.0.1:8000
```
Make sure to check the IP and Port where the server is served:

>If the IP and Port are not equal to `http://127.0.0.1:8000` like for example: `http://127.0.0.1:9000`
>
>Copy that address and change the `VUE_APP_API_HOST` of `.env` file inside the `client` directory
>
>Example`VUE_APP_API_HOST=http://127.0.0.1:9000/`

2. Run the `client` next. Open the directory in a terminal and execute command

```sh
npm run dev:serve
```

Expected to display a message like this:

```sh
App running at:
- Local:   http://localhost:8081/
- Network: http://192.168.1.11:8081/

Issues checking in progress...
No issues found.
```


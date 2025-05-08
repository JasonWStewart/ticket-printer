# Automating Updates from Git Repository on Startup

To ensure that your machine automatically updates the Ticket Printer application from the Git repository on startup, follow these steps:

## 1. Prerequisites

Ensure the following are installed and configured on your machine:

- **Git**: To pull updates from the repository.
- **Node.js and npm**: To install dependencies for the server and client.
- **pm2**: To manage the server process.
- **Chromium**: To run the client in kiosk mode.

## 2. Create an Update Script

Create a shell script to automate the update process. This script will:

1. Pull the latest changes from the Git repository.
2. Install any new dependencies for both the server and client.
3. Build the client application.
4. Restart the server using pm2.

### Example Script

Save the following script as `update_and_start.sh` in the root of your project directory:

```bash
#!/bin/bash

# Navigate to the project directory
cd /path/to/ticket-printer || exit

# Pull the latest changes from the Git repository
echo "Pulling latest changes from Git repository..."
git reset --hard HEAD
git pull origin main || exit

# Install server dependencies
echo "Installing server dependencies..."
cd server || exit
npm install || exit

# Install client dependencies and build the client
echo "Installing client dependencies and building client..."
cd ../client || exit
npm install || exit
npm run build || exit

# Restart the server using pm2
echo "Restarting server with pm2..."
cd ../server || exit
pm2 restart app || pm2 start src/app.js --name "ticket-printer-server"

# Start the client in Chromium kiosk mode
echo "Starting client in Chromium kiosk mode..."
chromium-browser --kiosk --app=http://localhost:3000 || exit

# Done
echo "Update and startup process completed."
```

### Make the Script Executable

Run the following command to make the script executable:

```bash
chmod +x /path/to/ticket-printer/update_and_start.sh
```

## 3. Configure the Script to Run on Startup

### Using systemd

1. Create a new systemd service file:

   ```bash
   sudo nano /etc/systemd/system/ticket-printer.service
   ```

2. Add the following content to the file:

   ```ini
   [Unit]
   Description=Ticket Printer Auto-Update and Startup
   After=network.target

   [Service]
   ExecStart=/path/to/ticket-printer/update_and_start.sh
   Restart=always
   User=your-username
   Environment=DISPLAY=:0

   [Install]
   WantedBy=multi-user.target
   ```

3. Enable and start the service:

   ```bash
   sudo systemctl enable ticket-printer.service
   sudo systemctl start ticket-printer.service
   ```

### Using crontab (Alternative)

1. Open the crontab editor:

   ```bash
   crontab -e
   ```

2. Add the following line to run the script at startup:

   ```bash
   @reboot /path/to/ticket-printer/update_and_start.sh
   ```

3. Save and exit the editor.

## 4. Testing

Reboot the machine to ensure the script runs correctly on startup. Verify that:

- The latest changes are pulled from the Git repository.
- Dependencies are installed.
- The client and server are running as expected.

# AWS Deployment Guide

This guide provides step-by-step instructions to deploy your Dockerized MERN application on a free-tier eligible AWS EC2 instance.

## 1. Setup an AWS EC2 Instance
1. Log in to your AWS Console.
2. Navigate to **EC2** and click **Launch Instance**.
3. **Name:** Give your instance a name (e.g., `MERN-App-Server`).
4. **AMI:** Choose **Ubuntu Server 22.04 LTS**.
5. **Instance Type:** Choose `t2.micro` (or `t3.micro`, depending on which one is marked "Free-tier eligible" in your region).
6. **Key Pair:** Create a new key pair or select an existing one (Save the `.pem` file). If you choose "Proceed without a key pair", that's fine—you can use the AWS Console to connect.
7. **Network Settings (Security Group):** 
   - Check **Allow SSH traffic from Anywhere**
   - Check **Allow HTTP traffic from the internet** (Port 80)
   - To add the `6001` rule: Click the **Edit** button in the top right of the "Network settings" section. Scroll down to "Inbound security group rules", click **Add security group rule**, and set it to **Custom TCP** with Port **6001** and Source **Anywhere-IPv4** (or `0.0.0.0/0`).
8. Click **Launch Instance**.

## 2. Connect to Your EC2 Instance

**Option A: Using EC2 Instance Connect (No Key Pair Needed)**
If you chose "Proceed without a key pair", go to your AWS EC2 Console, select your instance, click the **Connect** button at the top, and choose **EC2 Instance Connect**. This will open a terminal directly in your browser.

**Option B: Using SSH (If you downloaded a `.pem` key pair)**
Open your terminal (on Mac/Linux) or PowerShell/PuTTY (on Windows) and SSH into your instance:
```bash
# Set appropriate permissions for the key pair (Mac/Linux only)
chmod 400 your-key-pair.pem

# SSH into the server
ssh -i "your-key-pair.pem" ubuntu@<YOUR-EC2-PUBLIC-IP>
```

## 3. Install Docker and Docker Compose on EC2
Once you have successfully connected to the server using Step 2, you will have a terminal window open (it should say something like `ubuntu@ip-172-31...:~$`). 

Copy and paste the following commands **into that same terminal window** to install Docker:
```bash
sudo apt update -y
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to the docker group so you don't need 'sudo' every time
sudo usermod -aG docker $USER

# Log out and log back in (or run this command to apply new group membership)
newgrp docker
```

## 4. Transfer Your Code to the EC2 Server
You must get your source code onto the server. You can either:
A. **Upload via Git**: (Highly Recommended) Run `git clone <your-repo-url>` directly on the EC2 instance terminal.
B. **Secure Copy (SCP)**: (Only if you have a `.pem` key pair) From your local machine, run:
```bash
scp -i "your-key-pair.pem" -r ./Flight-Booking-APP--MERN-Stack ubuntu@<YOUR-EC2-PUBLIC-IP>:/home/ubuntu/
```

## 5. Configure Environment Variables
Inside your project folder on the EC2 server, create or edit the `.env` file:
```bash
cd /home/ubuntu/Flight-Booking-APP--MERN-Stack

# Create the .env file using example
cp .env.example .env

# Edit the file using nano
nano .env
```
Update `REACT_APP_API_URL` to your EC2 public IP. It should look like this:
```env
PORT=6001
MONGO_URI=mongodb://db:27017/FlightBookingMERN
REACT_APP_API_URL=http://<YOUR-EC2-PUBLIC-IP>:6001
```
Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

## 6. Build and Run the App!
Run Docker Compose in detached mode (`-d` allows it to run in the background):
```bash
docker-compose up --build -d
```
Docker will now download the MongoDB image, compile your React App, bundle your Node.js server, and put everything behind Nginx. 

### Verify it's running
You can check if containers are running using:
```bash
docker ps
```
Your app should now be live! Go to your browser and visit:
**`http://<YOUR-EC2-PUBLIC-IP>`**

## To Update the App in the Future
If you make code changes and push them:
```bash
git pull origin main
docker-compose up --build -d
```

#!/bin/bash

# ToolkitAI - EC2 Deployment Script
# This script sets up Docker and deploys the FastAPI backend on EC2

set -e  # Exit on error

echo "🚀 Starting ToolkitAI Backend Deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.shgot
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker already installed"
fi

# Install Docker Compose
echo "🐳 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose already installed"
fi

# Install Git (if not already installed)
echo "📦 Installing Git..."
if ! command -v git &> /dev/null; then
    sudo apt-get install -y git
    echo "✅ Git installed successfully"
else
    echo "✅ Git already installed"
fi

# Clone or pull repository
echo "📥 Setting up repository..."
if [ -d "toolkitai.io" ]; then
    echo "Repository exists, pulling latest changes..."
    cd toolkitai.io/backend
    git pull
else
    echo "Please clone your repository manually and run this script from the backend directory"
    exit 1
fi

# Create necessary directories
mkdir -p nginx/ssl

# Build and start containers
echo "🏗️  Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    docker-compose ps
else
    echo "❌ Services failed to start. Checking logs..."
    docker-compose logs
    exit 1
fi

# Display access information
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)
echo ""
echo "🎉 Deployment Complete!"
echo "================================"
echo "FastAPI Backend: http://$PUBLIC_IP"
echo "Health Check: http://$PUBLIC_IP/"
echo "BG Removal API: http://$PUBLIC_IP/api/bg-removal"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop: docker-compose down"
echo "To restart: docker-compose restart"
echo "================================"

# Setup auto-start on reboot
echo "⚙️  Setting up auto-start on reboot..."
(crontab -l 2>/dev/null; echo "@reboot cd $(pwd) && /usr/local/bin/docker-compose up -d") | crontab -
echo "✅ Auto-start configured"

echo ""
echo "🔒 Security Recommendations:"
echo "1. Configure AWS Security Group to allow port 80 and 443"
echo "2. Add SSL certificate for HTTPS (use Let's Encrypt)"
echo "3. Update CORS origins in main.py to your frontend domain"
echo "4. Set up monitoring and alerting"


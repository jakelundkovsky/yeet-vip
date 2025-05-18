#!/bin/bash

# Function to wait for database to be ready
wait_for_db() {
    echo "⏳ Waiting for database to be ready..."
    while ! docker-compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do
        echo "Database is not ready yet... waiting"
        sleep 2
    done
    echo "✅ Database is ready!"
}

# Function to wait for backend to be ready
wait_for_backend() {
    echo "⏳ Waiting for backend to be ready..."
    while ! curl -s http://localhost:3001/health > /dev/null 2>&1; do
        echo "Backend is not ready yet... waiting"
        sleep 2
    done
    echo "✅ Backend is ready!"
}

case "$1" in
  "up")
    docker-compose up -d
    echo "🚀 All services are starting..."
    echo "📱 Frontend will be available at: http://localhost:3000"
    echo "🔌 Backend API will be available at: http://localhost:3001"
    ;;
    
  "down")
    docker-compose down
    echo "🛑 All services stopped"
    ;;
    
  "logs")
    if [ "$2" ]; then
      docker-compose logs -f "$2"
    else
      docker-compose logs -f
    fi
    ;;
    
  "restart")
    if [ "$2" ]; then
      docker-compose restart "$2"
      echo "🔄 Restarted $2 service"
    else
      docker-compose restart
      echo "🔄 Restarted all services"
    fi
    ;;

  "clean")
    echo "🧹 Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down --remove-orphans
    
    # Remove project-specific containers if any still exist
    containers=$(docker ps -a | grep "yeet_vip" | awk '{print $1}')
    if [ ! -z "$containers" ]; then
      echo "Removing stray containers..."
      docker rm -f $containers
    fi
    
    # Remove project-specific images
    images=$(docker images | grep "yeet-vip" | awk '{print $3}')
    if [ ! -z "$images" ]; then
      echo "Removing project images..."
      docker rmi -f $images
    fi
    
    # Remove project-specific volumes
    volumes=$(docker volume ls | grep "yeet-vip" | awk '{print $2}')
    if [ ! -z "$volumes" ]; then
      echo "Removing project volumes..."
      docker volume rm -f $volumes
    fi
    
    # Remove any dangling images and volumes
    echo "Cleaning up dangling resources..."
    docker system prune -f
    
    echo "✨ Cleanup complete! You can now start fresh with './run.sh setup'"
    ;;

  "dev")
    echo "🛠️  Installing dependencies for local development..."
    cd frontend && npm install && cd ..
    cd backend && npm install && cd ..
    echo "✅ Dependencies installed! Your IDE should be happy now."
    ;;
    
  "setup")
    # First run clean to ensure no conflicts
    $0 clean
    
    # Install local dependencies for development
    $0 dev
    
    # Start all services
    docker-compose up -d
    
    # Wait for services to be ready
    wait_for_db
    wait_for_backend
    
    echo "Running migrations..."
    docker-compose exec backend npm run migration:run
    
    echo "Seeding database..."
    docker-compose exec backend npm run db:seed
    
    echo "✅ Setup complete! Services are running..."
    echo "📱 Frontend: http://localhost:3000"
    echo "🔌 Backend API: http://localhost:3001"
    ;;
    
  *)
    echo "Usage: ./run.sh [command]"
    echo "Commands:"
    echo "  up        - Start all services"
    echo "  down      - Stop all services"
    echo "  logs      - View logs (optionally specify service name)"
    echo "  restart   - Restart services (optionally specify service name)"
    echo "  clean     - Remove all Docker resources for this project"
    echo "  dev       - Install dependencies locally for development"
    echo "  setup     - First-time setup (runs migrations and seeds)"
    ;;
esac 
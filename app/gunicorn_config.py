# gunicorn_config.py

bind = "0.0.0.0:8000"
module = "Site_IOT.wsgi:application"

workers = 4  # Adjust based on your server's resources
worker_connections = 1000
threads = 2

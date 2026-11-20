import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

host = os.getenv("DB_HOST", "localhost")
port = int(os.getenv("DB_PORT", 3306))
user = os.getenv("DB_USER", "root")
password = os.getenv("DB_PASSWORD", "")

try:
    conn = mysql.connector.connect(
        host=host,
        port=port,
        user=user,
        password=password,
    )
    if conn.is_connected():
        cursor = conn.cursor()
        cursor.execute("SELECT VERSION();")
        version = cursor.fetchone()
        print("SUCCESS: MySQL is running!")
        print("MySQL Version:", version[0])
        cursor.close()
        conn.close()
except mysql.connector.Error as err:
    print("FAILED: Could not connect to MySQL.")
    print("Error:", err)
from flask import Blueprint, request, jsonify
import mysql.connector
from db import get_db_connection
from middleware.auth_middleware import token_required

task_bp = Blueprint("tasks", __name__, url_prefix="/api/tasks")


@task_bp.route("", methods=["GET"])
@token_required
def list_tasks(current_user_id):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT id, title, description, status, created_at FROM tasks WHERE user_id = %s ORDER BY id DESC",
            (current_user_id,),
        )
        tasks = cursor.fetchall()
        return jsonify({"tasks": tasks}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@task_bp.route("", methods=["POST"])
@token_required
def create_task(current_user_id):
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    status = data.get("status", "Pending")

    if not title:
        return jsonify({"message": "Task title is required"}), 400
    if status not in ("Pending", "Completed"):
        status = "Pending"

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO tasks (user_id, title, description, status) VALUES (%s, %s, %s, %s)",
            (current_user_id, title, description, status),
        )
        conn.commit()
        return jsonify({"message": "Task created", "id": cursor.lastrowid}), 201
    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@task_bp.route("/<int:task_id>", methods=["PUT"])
@token_required
def update_task(current_user_id, task_id):
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    status = data.get("status", "Pending")

    if not title:
        return jsonify({"message": "Task title is required"}), 400
    if status not in ("Pending", "Completed"):
        return jsonify({"message": "Invalid status"}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE tasks
            SET title = %s, description = %s, status = %s
            WHERE id = %s AND user_id = %s
            """,
            (title, description, status, task_id, current_user_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Task not found"}), 404
        return jsonify({"message": "Task updated"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@task_bp.route("/<int:task_id>", methods=["DELETE"])
@token_required
def delete_task(current_user_id, task_id):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "DELETE FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, current_user_id),
        )
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({"message": "Task not found"}), 404
        return jsonify({"message": "Task deleted"}), 200
    except mysql.connector.Error as err:
        return jsonify({"message": f"Database error: {err}"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
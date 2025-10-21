from flask import Blueprint, request, jsonify
from flask_cors import CORS
from api.models import db, Persona, Ahorro, Emisiones 
from flask_bcrypt import Bcrypt
api = Blueprint('api', __name__)
CORS(api)


@api.route('/')
def menu():
    return jsonify({"message": "Bienvenido al API"})

@api.route('/signup', methods=['POST'])
def signup():
    from app import bcrypt 
    
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Verificar si el usuario ya existe
    existing_user = Persona.query.get(username)
    if existing_user:
        return jsonify({"error": "El nombre de usuario ya está en uso"}), 400

    # Encriptar contraseña
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Crear nuevo usuario
    usuario = Persona(username=username, email=email, password=hashed_password)

    try:
        db.session.add(usuario)
        db.session.commit()
        return jsonify({
            "message": "Usuario registrado exitosamente",
            "user": {
                "username": username,
                "email": email
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al registrar usuario: {str(e)}"}), 500
    

@api.route('/borrar_cuenta', methods=['DELETE'])
def borrar_cuenta():
    from app import bcrypt  # Importar bcrypt desde app
    
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = Persona.query.get(username)

    if not user:
        return jsonify({"error": "No existe el nombre de usuario"}), 404

    # Verificar contraseña con bcrypt
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Contraseña incorrecta"}), 401

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({
            "message": "Usuario eliminado correctamente",
            "user": username
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error al borrar usuario: {str(e)}"}), 500
    
@api.route('/login', methods=['POST'])
def login():
    from app import bcrypt
    from flask_jwt_extended import create_access_token
    data = request.get_json()
    username = data.get("username")
    password_try = data.get("password")
    user = Persona.query.get(username)
    if not user:
        return jsonify({"error":"usuario no encontrado"}), 404
    if not bcrypt.check_password_hash(user.password, password_try):
        return jsonify({"error":"contraseña incorrecta"}), 400
    
    token = create_access_token(identity=username)
    return jsonify({"user":username, "token":token}), 200


from flask import Blueprint, request, jsonify
from flask_cors import CORS
from api.models import db, Persona, Ahorro, Emisiones 
from flask_bcrypt import Bcrypt
from flask_jwt_extended import jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
CORS(api)


@api.route('/verificar_jwt',methods=["GET"])
@jwt_required()
def verificar_jwt():
    try:
        username = get_jwt_identity()
        usuario = Persona.query.get(username)
        if not usuario:
            return jsonify({"error": "El token no es valido"}), 404
        else:
            return jsonify({"exito":"el token es válido", "username" : username}), 200
    except Exception as e:
        return jsonify({"error": f"Error al verificar token: {str(e)}"}), 500



@api.route('/')
def menu():
    return jsonify({"message": "Bienvenido al API"})

@api.route('/signup', methods=['POST',"GET"])
def signup():
    if request.method == "POST":
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
    elif request.method == "GET":
        personas = Persona.query.all()
        lista = [persona.serialize() for persona in personas]
        return jsonify(lista), 200
    

@api.route('/borrar_cuenta', methods=['DELETE'])
@jwt_required()
def borrar_cuenta():
    from app import bcrypt  # Importar bcrypt desde app
    from flask_jwt_extended import get_jwt_identity
    
    username = get_jwt_identity()
   

    user = Persona.query.get(username)

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

@api.route("/login_google", methods=["POST"])
def auth_google():
    from google.oauth2 import id_token
    from google.auth.transport import requests
    import os
    from flask_jwt_extended import create_access_token
    token = request.json.get("token")

    CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

    try:
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)

        email_google = idinfo["email"]

    
        user = Persona.query.filter_by(email=email_google).first()

        if not user:
            return jsonify({"error":"No existe el usuario"}), 404

        token = create_access_token(identity=user.username)
        return jsonify({"token": token}), 200
    except Exception as e:
        return jsonify({"error": f"Error al inicar sesion con google: {str(e)}"}), 400




@api.route('/emisiones', methods=["POST","PUT","GET"])
@jwt_required()
def emisiones():
    from flask_jwt_extended import get_jwt_identity
    username = get_jwt_identity()
    if request.method=="GET":
        emisiones = Emisiones.query.filter_by(username_persona=username).all()
        lista = [emision.serialize() for emision in emisiones]
        return jsonify(lista), 200
    
    data = request.get_json()
    fecha = data.get("fecha")
    litros_combustible = data.get("litros_combustible")
    kwh_consumidos = data.get("kwh_consumidos")
    tipo_vehiculo = data.get("tipo_vehiculo")
    energia_renovable = data.get("energia_renovable")
    tipo_calefaccion = data.get("tipo_calefaccion")

    

    if request.method == "POST":
        emisiones = Emisiones(
        username_persona=username,
        litros_combustible=litros_combustible,
        kwh_consumidos=kwh_consumidos,
        tipo_vehiculo=tipo_vehiculo,
        energia_renovable=energia_renovable,
        tipo_calefaccion=tipo_calefaccion,
        fecha=fecha)
        try:
            db.session.add(emisiones)
            db.session.commit()

            return jsonify({
                "message": "Emisión añadida correctamente",
                "emision": emisiones.serialize()
            }), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error al anyadir emisiones: {str(e)}"}), 500
    elif request.method == "PUT":
        try:
            existing_emision = Emisiones.query.filter_by(username_persona=username, fecha=fecha).first()
            if not existing_emision:
                return jsonify({"error": "No se encontró la emisión para actualizar"}), 404

            existing_emision.litros_combustible = litros_combustible
            existing_emision.kwh_consumidos = kwh_consumidos
            existing_emision.tipo_vehiculo = tipo_vehiculo
            existing_emision.energia_renovable = energia_renovable
            existing_emision.tipo_calefaccion = tipo_calefaccion

            db.session.commit()

            return jsonify({
                "message": "Emisión actualizada correctamente",
                "emision": existing_emision.serialize()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error al actualizar emisiones: {str(e)}"}), 500


@api.route('/verificar_fecha',methods=["GET"])
@jwt_required()
def verficar_fecha():
    from datetime import datetime
    from flask_jwt_extended import get_jwt_identity
    try:
        username = get_jwt_identity()
        fecha_actual = datetime.now().strftime("%Y/%m")
        emisiones = Emisiones.query.filter_by(username_persona=username,fecha=fecha_actual).first()
        if emisiones:
            return jsonify({"message":"Dashboard"}),200
        else:
            return jsonify({"message":"Formulario"}),200
    except Exception as e:
        return jsonify({"error":f"Error al verificar la fecha: {str(e)}"}), 500
    



@api.route('/ahorros', methods=["POST", "PUT", "GET"])
@jwt_required()
def ahorros():
    from flask_jwt_extended import get_jwt_identity
    user = get_jwt_identity()
    if request.method == "GET":
        try:
            ahorros = Ahorro.query.filter_by(username_persona=user).all()
            lista = [ahorro.serialize() for ahorro in ahorros]
            return jsonify(lista), 200
        except Exception as e:
            return jsonify({"error": f"Error al obtener ahorros: {str(e)}"}), 500
        
    data = request.get_json()
    ingresos = float(data.get("ingresos"))
    gastos = float(data.get("gastos"))
    fecha = data.get("fecha")
    if request.method == "POST":
        ahorro = Ahorro(
            username_persona = user,
            ingresos = ingresos,
            gastos = gastos,
            fecha = fecha
        )
        try:
            db.session.add(ahorro)
            db.session.commit()
            return jsonify({"message":"Ahorro añadido correctamente"}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error al añadir ahorro: {str(e)}"}), 500
    elif request.method == "PUT":
        try:
            existing_ahorro = Ahorro.query.filter_by(username_persona=user, fecha=fecha).first()
            if not existing_ahorro:
                return jsonify({"error": "No se encontró el ahorro para actualizar"}), 404


            #En caso de querer actualizar se pasaría por parametro la cantidad a sumar o restar (valores positivos o negativos)
            # ingresos = 0 o gastos = 0 en caso de que no se desee actualizar una de estas columnas
            existing_ahorro.ingresos += ingresos
            existing_ahorro.gastos += gastos

            db.session.commit()

            return jsonify({
                "message": "Ahorro actualizado correctamente",
                "ahorro": existing_ahorro.serialize()
            }), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": f"Error al actualizar ahorros: {str(e)}"}), 500




@api.route('/reset_db', methods=["DELETE"])
def reset_db():
    db.session.query(Emisiones).delete()
    db.session.query(Persona).delete()
    db.session.query(Ahorro).delete()
    db.session.commit()
    return jsonify({"msg": "Datos borrados correctamente"}), 200


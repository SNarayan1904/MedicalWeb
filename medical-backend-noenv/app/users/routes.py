from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import User

users_bp = Blueprint('users', __name__, url_prefix='/users')

@users_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    if not user:
        return jsonify({'msg': 'user not found'}), 404
    return jsonify({'user': user.to_dict()})

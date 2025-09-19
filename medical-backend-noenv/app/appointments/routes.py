from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import Appointment, User
from ..extensions import db
from datetime import datetime

appt_bp = Blueprint('appointments', __name__, url_prefix='/appointments')

@appt_bp.route('', methods=['GET'])
@jwt_required()
def list_appointments():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    if user.role == 'patient':
        appts = Appointment.query.filter_by(patient_id=user.id).all()
    else:
        appts = Appointment.query.all()
    return jsonify([a.to_dict() for a in appts])

@appt_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    data = request.get_json() or {}
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    doctor_name = data.get('doctor_name')
    date_time_str = data.get('date_time')
    notes = data.get('notes')
    if not doctor_name or not date_time_str:
        return jsonify({'msg': 'doctor_name and date_time required'}), 400
    try:
        date_time = datetime.fromisoformat(date_time_str)
    except Exception:
        return jsonify({'msg': 'date_time must be ISO format like 2025-09-16T10:30:00'}), 400
    appt = Appointment(patient_id=user.id, doctor_name=doctor_name, date_time=date_time, notes=notes)
    db.session.add(appt)
    db.session.commit()
    return jsonify(appt.to_dict()), 201

@appt_bp.route('/<int:appt_id>', methods=['DELETE'])
@jwt_required()
def delete_appointment(appt_id):
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    appt = Appointment.query.get(appt_id)
    if not appt:
        return jsonify({'msg': 'not found'}), 404
    if appt.patient_id != user.id and user.role != 'admin':
        return jsonify({'msg': 'forbidden'}), 403
    db.session.delete(appt)
    db.session.commit()
    return jsonify({'msg': 'deleted'})

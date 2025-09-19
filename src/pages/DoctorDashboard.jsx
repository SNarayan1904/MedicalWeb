import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateDoctorAvailability } from "../features/doctors/doctorSlice";
import { updateAppointmentStatus } from "../features/appointments/appointmentSlice";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";
import {
  Calendar,
  Clock,
  Search,
  User,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react";
import {
  getTimeSlots,
  getDaysOfWeek,
  formatTime,
  formatDate,
} from "../utils/mockData";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { doctors } = useSelector((state) => state.doctors);
  const { appointments } = useSelector((state) => state.appointments);
  const { patients } = useSelector((state) => state.patients);

  const [activeTab, setActiveTab] = useState("appointments");
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [searchPatientId, setSearchPatientId] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);
  const [availabilityForm, setAvailabilityForm] = useState({});

  // Find current doctor
  const currentDoctor = doctors.find((doc) => doc.email === user?.email);
  const doctorAppointments = appointments.filter(
    (apt) => apt.doctorId === currentDoctor?.id
  );

  // Filter appointments by status
  const todayAppointments = doctorAppointments.filter(
    (apt) =>
      apt.date === new Date().toISOString().split("T")[0] &&
      apt.status === "scheduled"
  );
  const upcomingAppointments = doctorAppointments.filter(
    (apt) => new Date(apt.date) > new Date() && apt.status === "scheduled"
  );
  const completedAppointments = doctorAppointments.filter(
    (apt) => apt.status === "completed"
  );

  const handleSearchPatient = () => {
    const patient = patients.find(
      (p) => p.id === searchPatientId.toUpperCase()
    );
    setSearchedPatient(patient);
  };

  const handleCompleteAppointment = (appointmentId) => {
    const notes = prompt("Add any notes for this appointment:");
    dispatch(
      updateAppointmentStatus({
        appointmentId,
        status: "completed",
        notes: notes || "",
      })
    );
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      dispatch(
        updateAppointmentStatus({
          appointmentId,
          status: "cancelled",
        })
      );
    }
  };

  const initializeAvailabilityForm = () => {
    const form = {};
    getDaysOfWeek().forEach((day) => {
      const dayAvailability = currentDoctor?.availability?.find(
        (avail) => avail.day === day
      );
      form[day] = dayAvailability?.slots || [];
    });
    setAvailabilityForm(form);
    setShowAvailabilityModal(true);
  };

  const handleAvailabilityChange = (day, timeSlot, isSelected) => {
    setAvailabilityForm((prev) => ({
      ...prev,
      [day]: isSelected
        ? [...(prev[day] || []), timeSlot].sort()
        : (prev[day] || []).filter((slot) => slot !== timeSlot),
    }));
  };

  const saveAvailability = () => {
    const availability = Object.entries(availabilityForm)
      .filter(([day, slots]) => slots.length > 0)
      .map(([day, slots]) => ({ day, slots }));

    dispatch(
      updateDoctorAvailability({
        doctorId: currentDoctor.id,
        availability,
      })
    );
    setShowAvailabilityModal(false);
  };

  const tabs = [
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "patients", label: "Patient Search", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back, {currentDoctor?.name}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg mb-4">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {todayAppointments.length}
            </h3>
            <p className="text-sm text-gray-600">Today's Appointments</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 rounded-lg mb-4">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {upcomingAppointments.length}
            </h3>
            <p className="text-sm text-gray-600">Upcoming</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-50 rounded-lg mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {completedAppointments.length}
            </h3>
            <p className="text-sm text-gray-600">Completed</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-lg mb-4">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {currentDoctor?.availability?.reduce(
                (total, day) => total + day.slots.length,
                0
              ) || 0}
            </h3>
            <p className="text-sm text-gray-600">Available Slots</p>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-medical-500 text-medical-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === "appointments" && (
          <div className="space-y-6">
            <Card
              title="Today's Appointments"
              subtitle={`${todayAppointments.length} appointments scheduled`}
            >
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments for today</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatTime(appointment.time)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.reason}
                          </p>
                          <p className="text-xs text-gray-500">
                            Patient ID: {appointment.patientId}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleCompleteAppointment(appointment.id)
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mark Complete"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleCancelAppointment(appointment.id)
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card
              title="Upcoming Appointments"
              subtitle={`${upcomingAppointments.length} appointments scheduled`}
            >
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {upcomingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {appointment.patientName}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)} at{" "}
                            {formatTime(appointment.time)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.reason}
                          </p>
                          <p className="text-xs text-gray-500">
                            Patient ID: {appointment.patientId}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Scheduled
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === "availability" && (
          <Card
            title="Manage Availability"
            subtitle="Set your available time slots"
          >
            <div className="space-y-4">
              <button
                onClick={initializeAvailabilityForm}
                className="btn btn-primary"
              >
                Update Availability Schedule
              </button>

              {currentDoctor?.availability &&
                currentDoctor.availability.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Current Schedule
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentDoctor.availability.map((daySchedule) => (
                        <div key={daySchedule.day} className="space-y-2">
                          <h5 className="font-medium text-gray-800">
                            {daySchedule.day}
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {daySchedule.slots.map((slot) => (
                              <span
                                key={slot}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {formatTime(slot)}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </Card>
        )}

        {activeTab === "patients" && (
          <Card
            title="Patient Search"
            subtitle="Search patient by ID to view history"
          >
            <div className="space-y-4">
              <div className="flex space-x-4">
                <FormInput
                  label=""
                  name="patientId"
                  value={searchPatientId}
                  onChange={(e) => setSearchPatientId(e.target.value)}
                  placeholder="Enter Patient ID (e.g., PAT001)"
                />
                <button
                  onClick={handleSearchPatient}
                  className="btn btn-primary whitespace-nowrap"
                >
                  Search Patient
                </button>
              </div>

              {searchedPatient && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {searchedPatient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Patient ID: {searchedPatient.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Contact Information
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Email:</strong> {searchedPatient.email}
                        </p>
                        <p>
                          <strong>Phone:</strong> {searchedPatient.phone}
                        </p>
                        <p>
                          <strong>DOB:</strong>{" "}
                          {formatDate(searchedPatient.dateOfBirth)}
                        </p>
                        <p>
                          <strong>Address:</strong> {searchedPatient.address}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Emergency Contact
                      </h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <strong>Name:</strong>{" "}
                          {searchedPatient.emergencyContact.name}
                        </p>
                        <p>
                          <strong>Phone:</strong>{" "}
                          {searchedPatient.emergencyContact.phone}
                        </p>
                        <p>
                          <strong>Relation:</strong>{" "}
                          {searchedPatient.emergencyContact.relation}
                        </p>
                      </div>
                    </div>
                  </div>

                  {searchedPatient.medicalHistory &&
                    searchedPatient.medicalHistory.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Medical History
                        </h4>
                        <div className="space-y-3">
                          {searchedPatient.medicalHistory.map(
                            (record, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {record.diagnosis}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {record.notes}
                                    </p>
                                  </div>
                                  <div className="text-right text-sm text-gray-500">
                                    <p>{formatDate(record.date)}</p>
                                    <p>by {record.doctor}</p>
                                  </div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {searchPatientId && !searchedPatient && (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No patient found with ID: {searchPatientId}</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>

      <Modal
        isOpen={showAvailabilityModal}
        onClose={() => setShowAvailabilityModal(false)}
        title="Set Availability Schedule"
        size="xl"
      >
        <div className="space-y-6">
          {getDaysOfWeek().map((day) => (
            <div key={day} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{day}</h4>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {getTimeSlots().map((timeSlot) => (
                  <label
                    key={timeSlot}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(availabilityForm[day] || []).includes(timeSlot)}
                      onChange={(e) =>
                        handleAvailabilityChange(
                          day,
                          timeSlot,
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                    />
                    <span className="text-sm text-gray-700">
                      {formatTime(timeSlot)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={() => setShowAvailabilityModal(false)}
              className="flex-1 btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={saveAvailability}
              className="flex-1 btn btn-primary"
            >
              Save Availability
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
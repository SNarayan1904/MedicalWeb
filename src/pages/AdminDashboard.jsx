import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  approveDoctorRequest,
  rejectDoctorRequest,
} from "../features/doctors/doctorSlice";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Modal from "../components/Modal";
import FormInput from "../components/FormInput";
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Copy,
} from "lucide-react";
import { generateDoctorId } from "../utils/mockData";
import { formatDate } from "../utils/mockData";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { doctors, pendingRequests } = useSelector((state) => state.doctors);
  const { appointments } = useSelector((state) => state.appointments);
  const { patients } = useSelector((state) => state.patients);

  const [showCreateDoctorModal, setShowCreateDoctorModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [doctorCredentials, setDoctorCredentials] = useState({
    email: "",
    password: "",
  });

  // Stats calculation
  const stats = [
    {
      title: "Total Doctors",
      value: doctors.length,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Requests",
      value: pendingRequests.length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Appointments",
      value: appointments.length,
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password + Math.floor(Math.random() * 100);
  };

  const handleApproveRequest = (request) => {
    console.log("=== DEBUG: Approve button clicked ===");
    console.log("Request object:", request);

    if (!request) {
      console.error("Request is null or undefined");
      alert("Error: Request data is missing");
      return;
    }

    try {
      setSelectedRequest(request);
      console.log("Selected request set:", request);

      // Generate credentials
      const email = request.email;
      const password = generatePassword();
      console.log("Generated credentials:", { email, password });

      setDoctorCredentials({ email, password });
      console.log("Credentials set in state");

      setShowCreateDoctorModal(true);
      console.log("Modal should be visible now");
    } catch (error) {
      console.error("Error in handleApproveRequest:", error);
      alert("Error occurred: " + error.message);
    }
  };

  const confirmApproval = () => {
  if (!selectedRequest) {
    console.error('No selected request found')
    return
  }

  console.log('Confirming approval for:', selectedRequest)

  const newDoctor = {
    id: generateDoctorId(),
    name: selectedRequest.name,
    email: selectedRequest.email,
    specialty: selectedRequest.specialty,
    phone: selectedRequest.phone,
    licenseNumber: selectedRequest.licenseNumber,
    hospitalAffiliation: selectedRequest.hospitalAffiliation,
    experience: selectedRequest.experience,
    qualifications: selectedRequest.qualifications,
    clinicAddress: selectedRequest.clinicAddress,
    availability: [],
    credentials: {
      email: doctorCredentials.email,
      password: doctorCredentials.password
    }
  }

  console.log('Dispatching approval:', { requestId: selectedRequest.id, doctor: newDoctor })

  dispatch(approveDoctorRequest({
    requestId: selectedRequest.id,
    doctor: newDoctor
  }))
  
  // Close modal and reset state
  setShowCreateDoctorModal(false)
  setSelectedRequest(null)
  setDoctorCredentials({ email: '', password: '' })

  // Force restore scrolling
  document.body.style.overflow = 'unset'

  // Show detailed success message
  const credentialsMessage = `Doctor ${selectedRequest.name} has been approved successfully!

LOGIN CREDENTIALS:
Email: ${doctorCredentials.email}
Password: ${doctorCredentials.password}

Please share these credentials with the doctor.
The doctor can now login at the Doctor Login page.`

  alert(credentialsMessage)
  
  // Also log to console for easy copying
  console.log('=== DOCTOR LOGIN CREDENTIALS ===')
  console.log('Email:', doctorCredentials.email)
  console.log('Password:', doctorCredentials.password)
  console.log('===============================')
};

  const handleRejectRequest = (requestId) => {
    if (
      window.confirm("Are you sure you want to reject this doctor request?")
    ) {
      dispatch(rejectDoctorRequest(requestId));
      alert("Doctor request has been rejected.");
    }
  };

  const copyCredentials = async () => {
    const credentials = `Email: ${doctorCredentials.email}\nPassword: ${doctorCredentials.password}`;

    try {
      await navigator.clipboard.writeText(credentials);
      alert("Credentials copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy credentials:", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = credentials;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      alert("Credentials copied to clipboard!");
    }
  };

  const closeModal = () => {
    setShowCreateDoctorModal(false);
    setSelectedRequest(null);
    setDoctorCredentials({ email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage doctors, patients, and system operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 ${stat.bgColor} rounded-lg mb-4`}
              >
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Doctor Requests */}
          <Card
            title="Doctor Signup Requests"
            subtitle={`${pendingRequests.length} pending requests`}
          >
            {pendingRequests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No pending doctor requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {request.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {request.specialty}
                        </p>
                        <p className="text-sm text-gray-600">{request.email}</p>
                        <p className="text-sm text-gray-600">{request.phone}</p>
                        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <span>License: {request.licenseNumber}</span>
                          <span>Experience: {request.experience}</span>
                          <span>Hospital: {request.hospitalAffiliation}</span>
                          <span>Qualifications: {request.qualifications}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Submitted: {formatDate(request.submittedAt)}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleApproveRequest(request)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
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

          {/* Approved Doctors */}
          <Card
            title="Approved Doctors"
            subtitle={`${doctors.length} active doctors`}
          >
            {doctors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No doctors approved yet</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {doctor.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {doctor.specialty}
                        </p>
                        <p className="text-sm text-gray-600">{doctor.email}</p>
                        <p className="text-sm text-gray-600">{doctor.phone}</p>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            ID: {doctor.id}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Availability Slots:{" "}
                          {doctor.availability?.reduce(
                            (total, day) => total + day.slots.length,
                            0
                          ) || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-6">
          <Card title="Recent System Activity">
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">
                  Dr. Sarah Johnson updated availability schedule
                </span>
                <span className="text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">
                  New patient registration: John Smith
                </span>
                <span className="text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">
                  Doctor signup request from Dr. Emily Davis
                </span>
                <span className="text-gray-400">1 day ago</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Doctor Modal */}
      <Modal
        isOpen={showCreateDoctorModal}
        onClose={closeModal}
        title="Approve Doctor Application"
        size="md"
      >
        <div className="space-y-6">
          {selectedRequest && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-3">
                  Doctor Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-800">
                      <strong>Name:</strong> {selectedRequest.name}
                    </p>
                    <p className="text-blue-800">
                      <strong>Specialty:</strong> {selectedRequest.specialty}
                    </p>
                    <p className="text-blue-800">
                      <strong>Phone:</strong> {selectedRequest.phone}
                    </p>
                    <p className="text-blue-800">
                      <strong>Experience:</strong> {selectedRequest.experience}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-800">
                      <strong>License:</strong> {selectedRequest.licenseNumber}
                    </p>
                    <p className="text-blue-800">
                      <strong>Hospital:</strong>{" "}
                      {selectedRequest.hospitalAffiliation}
                    </p>
                    <p className="text-blue-800">
                      <strong>Qualifications:</strong>{" "}
                      {selectedRequest.qualifications}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-3 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Generated Login Credentials
                </h4>
                <div className="space-y-3">
                  <FormInput
                    label="Email"
                    name="email"
                    value={doctorCredentials.email}
                    onChange={(e) =>
                      setDoctorCredentials((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={false}
                  />
                  <FormInput
                    label="Password"
                    name="password"
                    value={doctorCredentials.password}
                    disabled={true}
                  />
                  <button
                    onClick={copyCredentials}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Credentials</span>
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={closeModal}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmApproval}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Approve Doctor
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, Phone, Upload } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fatherName: "",
    motherName: "",
    contactNumber: "",
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [collegeIdCard, setCollegeIdCard] = useState(null);
  const [idCardPreview, setIdCardPreview] = useState(null);
  
  const navigate = useNavigate();
  const { signup, error, isLoading } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdCardChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCollegeIdCard(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate GDGU email
    if (!formData.email.endsWith('@gdgu.org')) {
      alert('Please use your GDGU email address (@gdgu.org)');
      return;
    }

    // Validate all fields
    if (!formData.email || !formData.password || !formData.fatherName || 
        !formData.motherName || !formData.contactNumber || !photo || !collegeIdCard) {
      alert('All fields are required');
      return;
    }

    // Validate contact number
    if (!/^[0-9]{10}$/.test(formData.contactNumber)) {
      alert('Contact number must be 10 digits');
      return;
    }

    try {
      await signup(
        formData.email,
        formData.password,
        formData.fatherName,
        formData.motherName,
        formData.contactNumber,
        photoPreview, // Base64 encoded
        idCardPreview  // Base64 encoded
      );
      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-2xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
    >
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          GDGU Student Registration
        </h2>

        <form onSubmit={handleSignUp} className='space-y-4'>
          <Input
            icon={Mail}
            type='email'
            name='email'
            placeholder='GDGU Email (@gdgu.org)'
            value={formData.email}
            onChange={handleInputChange}
          />
          
          <Input
            icon={Lock}
            type='password'
            name='password'
            placeholder='Password'
            value={formData.password}
            onChange={handleInputChange}
          />
          <PasswordStrengthMeter password={formData.password} />

          <Input
            icon={User}
            type='text'
            name='fatherName'
            placeholder="Father's Name"
            value={formData.fatherName}
            onChange={handleInputChange}
          />

          <Input
            icon={User}
            type='text'
            name='motherName'
            placeholder="Mother's Name"
            value={formData.motherName}
            onChange={handleInputChange}
          />

          <Input
            icon={Phone}
            type='tel'
            name='contactNumber'
            placeholder='Contact Number (10 digits)'
            value={formData.contactNumber}
            onChange={handleInputChange}
            maxLength={10}
          />

          {/* Photo Upload */}
          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-gray-300 text-sm'>
              <Upload className='w-4 h-4' />
              Upload Photo
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handlePhotoChange}
              className='w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none'
            />
            {photoPreview && (
              <img src={photoPreview} alt='Preview' className='w-32 h-32 object-cover rounded-lg mt-2' />
            )}
          </div>

          {/* College ID Card Upload */}
          <div className='space-y-2'>
            <label className='flex items-center gap-2 text-gray-300 text-sm'>
              <Upload className='w-4 h-4' />
              Upload College ID Card
            </label>
            <input
              type='file'
              accept='image/*'
              onChange={handleIdCardChange}
              className='w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none'
            />
            {idCardPreview && (
              <img src={idCardPreview} alt='ID Preview' className='w-full h-48 object-cover rounded-lg mt-2' />
            )}
          </div>

          {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}

          <motion.button
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
            focus:ring-offset-gray-900 transition duration-200'
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Register"}
          </motion.button>
        </form>
      </div>
      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Already have an account?{" "}
          <Link to={"/login"} className='text-green-400 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
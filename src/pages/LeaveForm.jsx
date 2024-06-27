import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';

const LeaveForm = () => {
  const [formData, setFormData] = useState({
    nature: '',
    period: '',
    fromDate: '',
    toDate: '',
    prefixSuffix: false,
    grounds: '',
    address: '',
    responsibilities: '',
    extraWorkDate: [],
    clCoAvailed: '',
    remark: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  return (
    <div className="flex flex-col w-[100vw] gap-5 items-center justify-center min-h-screen bg-gray-100">
      <Navbar/>
      <div className='w-[100vw] flex justify-end'>
      <div className="bg-white p-8 rounded shadow-md w-[80vw] border-md">
        <h2 className="text-2xl font-bold mb-6">Leave/Vacation Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Nature of Leave</label>
            <input
              type="text"
              name="nature"
              value={formData.nature}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Period of Leave</label>
            <input
              type="text"
              name="period"
              value={formData.period}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">From Date</label>
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">To Date</label>
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4 flex gap-5">
            <label className="block text-gray-700">Prefix/Suffix Sundays and Holidays</label>
            <div>
            <input
              type="checkbox"
              name="prefixSuffix"
              checked={formData.prefixSuffix}
              onChange={handleChange}
              className="mt-2 flex"
            />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Grounds for Leave</label>
            <textarea
              name="grounds"
              value={formData.grounds}
              onChange={handleChange}
              className="w-full h-[30vh] mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Address During Leave</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Other Responsibilities</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              className="w-full mt-2 p-2 border h-[20vh] border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date of Extra Work for Compensatory Off</label>
            <input
              type="text"
              name="extraWorkDate"
              value={formData.extraWorkDate}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Till Date CL/CO Availed</label>
            <input
              type="text"
              name="clCoAvailed"
              value={formData.clCoAvailed}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Remarks (if any)</label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default LeaveForm;

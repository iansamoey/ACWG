"use client";

import React, { useState } from "react";

interface ProfileData {
  email: string;
  password: string;
  contactInfo: string;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData>({
    email: "",
    password: "",
    contactInfo: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const updateProfile = async () => {
    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the profile");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile Management</h2>
      <div className="space-y-4">
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          value={profile.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="text"
          name="contactInfo"
          value={profile.contactInfo}
          onChange={handleChange}
          placeholder="Contact Information"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          onClick={updateProfile}
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;

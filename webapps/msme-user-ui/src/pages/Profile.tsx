import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const Profile: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
        const user_id = localStorage.getItem("user_id")
      const response = await fetch(
        `${import.meta.env.VITE_USER_SERVICE}/get-profile/${user_id}`
      ); // Replace with your actual API URL
      const profileData = await response.json();
      console.log(profileData)
      setData(profileData);
    };

    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-96 shadow-xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <p><strong>Name:</strong> {data.name}</p>
          <p><strong>Email:</strong> {data.email}</p>
          <p><strong>Mobile:</strong> {data.mobile}</p>
          <p><strong>Date of Birth:</strong> {new Date(data.dob).toLocaleDateString()}</p>
          <p><strong>Address:</strong> {data.address.replace("&#10;", " ")}</p>
          <p><strong>PAN:</strong> {data.pan}</p>
          <p><strong>CKYC Compliance:</strong> {data.ckycCompliance}</p>
          <p><strong>Nominee:</strong> {data.nominee}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;

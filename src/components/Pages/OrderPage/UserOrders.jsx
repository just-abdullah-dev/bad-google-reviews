import Link from "next/link";
import React from "react";

const UserOrders = () => {
  // Dummy data for the table
  const data = [
    {
      dateTime: "2024-09-12 12:30 PM",
      reviews: 5,
      mapLink: "https://goo.gl/maps/sample1",
      status: "Pending",
      totalCost: "200",
    },
    {
      dateTime: "2024-09-13 10:00 AM",
      reviews: 8,
      mapLink: "https://goo.gl/maps/sample2",
      status: "Completed",
      totalCost: "350",
    },
    {
      dateTime: "2024-09-14 3:00 PM",
      reviews: 3,
      mapLink: "https://goo.gl/maps/sample3",
      status: "In Progress",
      totalCost: "150",
    },
    {
      dateTime: "2024-09-15 9:45 AM",
      reviews: 12,
      mapLink: "https://goo.gl/maps/sample4",
      status: "Pending",
      totalCost: "500",
    },
    {
      dateTime: "2024-09-16 5:20 PM",
      reviews: 7,
      mapLink: "https://goo.gl/maps/sample5",
      status: "Completed",
      totalCost: "400",
    },
    {
      dateTime: "2024-09-12 12:30 PM",
      reviews: 5,
      mapLink: "https://goo.gl/maps/sample1",
      status: "Pending",
      totalCost: "200",
    },
    {
      dateTime: "2024-09-13 10:00 AM",
      reviews: 8,
      mapLink: "https://goo.gl/maps/sample2",
      status: "Completed",
      totalCost: "350",
    },
    {
      dateTime: "2024-09-14 3:00 PM",
      reviews: 3,
      mapLink: "https://goo.gl/maps/sample3",
      status: "In Progress",
      totalCost: "150",
    },
    {
      dateTime: "2024-09-15 9:45 AM",
      reviews: 12,
      mapLink: "https://goo.gl/maps/sample4",
      status: "Pending",
      totalCost: "500",
    },
    {
      dateTime: "2024-09-16 5:20 PM",
      reviews: 7,
      mapLink: "https://goo.gl/maps/sample5",
      status: "Completed",
      totalCost: "400",
    },
    
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="bg-gray-100 text-left border-b border-gray-400">
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Date and Time
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                No of Reviews
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Google Map Links
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Status
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Total Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-gray-300 hover:bg-opacity-45 duration-300"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {item.dateTime}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {item.reviews}
                </td>
                <td className="py-3 px-4 text-blue-500 text-sm">
                  <Link
                    href={item.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Google Map Link
                  </Link>
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {item.status}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  € {item.totalCost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;

import React, { useState } from "react";

const AdminOrders = () => {
  // Array of possible statuses
  const statuses = [
    "inprogress",
    "unfulfilled",
    "fulfilled",
    "partially fulfilled",
    "submitted to google",
  ];

  // Dummy data for the table
  const data = [
    {
      orderId: "ORD001",
      dateTime: "2024-09-12 12:30 PM",
      noOfReviews: 5,
      reviewLinks: "lorem ipsum 123 ", 
      mapLink: "https://goo.gl/maps/sample1",
      currentStatus: "inprogress",
      totalCost: 200,
      finalCost: null,
    },
    {
      orderId: "ORD002",
      dateTime: "2024-09-13 10:00 AM",
      noOfReviews: 8,
      reviewLinks: "lorem ipsum 123 ", 
      mapLink: "https://goo.gl/maps/sample2",
      currentStatus: "submitted to google",
      totalCost: 350,
      finalCost: 350,
    },
    {
      orderId: "ORD003",
      dateTime: "2024-09-14 3:00 PM",
      noOfReviews: 3,
      reviewLinks: "lorem ipsum 123 ", 
      mapLink: "https://goo.gl/maps/sample3",
      currentStatus: "partially fulfilled",
      totalCost: 150,
      finalCost: null,
    },
    {
      orderId: "ORD001",
      dateTime: "2024-09-12 12:30 PM",
      noOfReviews: 5,
      reviewLinks: "lorem ipsum 123 ", 
      mapLink: "https://goo.gl/maps/sample1",
      currentStatus: "inprogress",
      totalCost: 200,
      finalCost: null,
    },
    {
      orderId: "ORD002",
      dateTime: "2024-09-13 10:00 AM",
      noOfReviews: 8,
      reviewLinks: "lorem ipsum 123 ", 
      mapLink: "https://goo.gl/maps/sample2",
      currentStatus: "submitted to google",
      totalCost: 350,
      finalCost: 350,
    },
    {
      orderId: "ORD003",
      dateTime: "2024-09-14 3:00 PM",
      noOfReviews: 3,
      reviewLinks: "lorem ipsum 123 ", 
      mapLink: "https://goo.gl/maps/sample3",
      currentStatus: "partially fulfilled",
      totalCost: 150,
      finalCost: null,
    },
  ];

  const [orders, setOrders] = useState(data);

  const handleStatusChange = (index, newStatus) => {
    const updatedOrders = [...orders];
    updatedOrders[index].currentStatus = newStatus;

    // If partially fulfilled, prompt for number of reviews fulfilled
    if (newStatus === "partially fulfilled") {
      const fulfilledReviews = prompt("Enter the number of reviews fulfilled:");
      if (fulfilledReviews) {
        const finalCost = fulfilledReviews * 25; // €25 per review
        updatedOrders[index].finalCost = finalCost;
      }
    } else if (newStatus === "fulfilled") {
      // If fully fulfilled, set final cost equal to total cost
      updatedOrders[index].finalCost = updatedOrders[index].totalCost;
    } else {
      updatedOrders[index].finalCost = null;
    }

    setOrders(updatedOrders);
  };

  const handleDeleteReviews = (order) => {
    if (order.noOfReviews <= 2) {
      alert(`Deleting all reviews for order ${order.orderId}`);
      // Logic to delete the reviews
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr className="bg-gray-100 text-left border-b border-gray-400">
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Date/Time
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Order ID
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                No of Reviews
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Google Map Link
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Review Links
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Delete Reviews
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Progress (Status)
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Total Cost
              </th>
              <th className="py-3 px-4 font-semibold text-sm text-gray-700">
                Final Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={index}
                className="border-b border-gray-300 hover:bg-gray-300 hover:bg-opacity-45 duration-300"
              >
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.dateTime}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.orderId}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.noOfReviews}
                </td>
                <td className="py-3 px-4 text-blue-500 text-sm">
                  <a
                    href={order.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Google Map Link
                  </a>
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.reviewLinks}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.noOfReviews <= 2 && (
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteReviews(order)}
                    >
                      Delete All Reviews
                    </button>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  <select
                    value={order.currentStatus}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className="bg-gray-200 border rounded px-2 py-1"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  € {order.totalCost}
                </td>
                <td className="py-3 px-4 text-gray-800 text-sm">
                  {order.finalCost !== null ? `€ ${order.finalCost}` : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;

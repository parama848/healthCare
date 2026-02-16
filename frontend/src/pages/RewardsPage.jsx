import React from "react";
import {
  FaGift,
  FaTrophy,
  FaHeartbeat,
  FaFileMedical,
  FaPills,
  FaShieldAlt
} from "react-icons/fa";

const RewardsPage = () => {

  // Demo Data (Connect backend later)
  const points = 1250;
  const lifetime = 2450;
  const redeemed = 1200;
  const nextMilestone = 1500;
  const progress = (points / nextMilestone) * 100;

  const earnTasks = [
    {
      title: "Complete Health Checkup",
      desc: "Schedule and complete annual checkup",
      points: 150
    },
    {
      title: "Upload Lab Report",
      desc: "Add a new report to your Health Vault",
      points: 50
    },
    {
      title: "7-Day Medication Streak",
      desc: "Log medicine for 7 consecutive days",
      points: 75
    },
    {
      title: "Vaccination Record",
      desc: "Add vaccination certificate",
      points: 100
    }
  ];

  const rewards = [
    {
      title: "20% Lab Test Discount",
      points: 300
    },
    {
      title: "Free Consultation",
      points: 500
    },
    {
      title: "₹100 Pharmacy Credit",
      points: 200
    },
    {
      title: "Insurance Premium Discount",
      points: 1000
    }
  ];

  const activities = [
    { text: "Completed Annual Health Checkup", pts: "+100" },
    { text: "Uploaded Lab Report", pts: "+50" },
    { text: "Medication 30-Day Streak", pts: "+25" },
    { text: "Redeemed Lab Discount", pts: "-200" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-6xl mx-auto">

        {/* PAGE HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <FaGift className="text-yellow-500 text-xl" />
          <div>
            <h1 className="text-xl font-semibold">
              DigiMed Rewards
            </h1>
            <p className="text-sm text-gray-500">
              Earn points for healthy habits, redeem benefits
            </p>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          {/* BALANCE CARD */}
          <div className="md:col-span-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm">Your Balance</p>
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
                🔥 12 day streak
              </span>
            </div>

            <h2 className="text-4xl font-bold mb-1">
              {points.toLocaleString()}
            </h2>
            <p className="text-sm mb-6">DigiMed Points</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white/20 p-3 rounded-xl">
                <p>Lifetime Earned</p>
                <h3 className="font-semibold mt-1">
                  {lifetime.toLocaleString()}
                </h3>
              </div>

              <div className="bg-white/20 p-3 rounded-xl">
                <p>Total Redeemed</p>
                <h3 className="font-semibold mt-1">
                  {redeemed.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>

          {/* MILESTONE CARD */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <div className="flex items-center gap-2 mb-3">
              <FaTrophy className="text-yellow-500" />
              <p className="text-sm text-gray-500">
                Next Milestone
              </p>
            </div>

            <h3 className="font-semibold mb-3">
              Health Champion
            </h3>

            <div className="text-xs flex justify-between mb-1">
              <span>{points} pts</span>
              <span>{nextMilestone} pts</span>
            </div>

            <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
              <div
                className="bg-teal-600 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-xs text-orange-500">
              {nextMilestone - points} points to unlock!
            </p>
          </div>
        </div>

        {/* EARN POINTS */}
        <div className="bg-white rounded-2xl p-6 shadow mb-8">
          <h2 className="font-semibold mb-4">
            Earn Points
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {earnTasks.map((task, index) => (
              <div
                key={index}
                className="flex justify-between items-center border p-4 rounded-xl"
              >
                <div>
                  <h3 className="text-sm font-medium">
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {task.desc}
                  </p>
                </div>

                <span className="text-green-600 font-semibold text-sm">
                  +{task.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* REDEEM REWARDS */}
        <div className="bg-white rounded-2xl p-6 shadow mb-8">
          <h2 className="font-semibold mb-4">
            Redeem Rewards
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="border rounded-xl p-4 hover:shadow-md transition"
              >
                <h3 className="text-sm font-medium mb-2">
                  {reward.title}
                </h3>

                <p className="text-xs text-gray-500 mb-3">
                  {reward.points} pts
                </p>

                <button className="w-full bg-teal-600 text-white py-2 rounded-lg text-sm">
                  Redeem Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">
            Recent Activity
          </h2>

          {activities.map((act, index) => (
            <div
              key={index}
              className="flex justify-between py-3 border-b last:border-none"
            >
              <p className="text-sm">{act.text}</p>
              <span
                className={`text-sm font-semibold ${
                  act.pts.startsWith("+")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {act.pts}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RewardsPage;
